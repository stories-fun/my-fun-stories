"use client";
import { useRef, useEffect, useCallback } from "react";
import { useTTSStore } from "~/store/useTTSStore";

function base64ToUint8Array(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

const splitTextIntoChunks = (text: string, chunkSize = 3000) => {
  const chunks: string[] = [];
  let currentChunk = "";

  const sentenceRegex = /(?<!\w\.\w\.)(?<=\.|\?|\!|\。|\n)\s+(?=[A-Z])/g;

  let sentences = text.split(sentenceRegex);

  if (sentences.length <= 1) {
    sentences = text.split(/[.!?。\n]+\s*/);
  }

  sentences = sentences.filter((sentence) => sentence.trim().length > 0);

  for (const sentence of sentences) {
    const trimmedSentence = sentence.trim();
    if (trimmedSentence.length === 0) continue;

    const sentenceWithPunctuation = /[.!?。]$/.test(trimmedSentence)
      ? trimmedSentence + " "
      : trimmedSentence + ". ";

    if ((currentChunk + sentenceWithPunctuation).length <= chunkSize) {
      currentChunk += sentenceWithPunctuation;
    } else {
      if (currentChunk.length > 0) {
        chunks.push(currentChunk.trim());
        currentChunk = "";
      }

      if (sentenceWithPunctuation.length > chunkSize) {
        const subParts = sentenceWithPunctuation.split(
          /,|;|\(|\)|\[|\]|\{|\}|\:|\-/,
        );

        let subChunk = "";
        for (const part of subParts) {
          const trimmedPart = part.trim();
          if (trimmedPart.length === 0) continue;

          const partWithComma = trimmedPart + ", ";

          if ((subChunk + partWithComma).length <= chunkSize) {
            subChunk += partWithComma;
          } else {
            if (subChunk.length > 0) {
              chunks.push(subChunk.trim());
              subChunk = "";
            }

            if (partWithComma.length > chunkSize) {
              let start = 0;
              while (start < partWithComma.length) {
                const end = Math.min(start + chunkSize, partWithComma.length);
                const lastSpaceIndex = partWithComma.lastIndexOf(" ", end);

                const chunkEnd = lastSpaceIndex > start ? lastSpaceIndex : end;
                chunks.push(partWithComma.slice(start, chunkEnd).trim());
                start = chunkEnd;
              }
            } else {
              subChunk = partWithComma;
            }
          }
        }

        if (subChunk.length > 0) {
          chunks.push(subChunk.trim());
        }
      } else {
        currentChunk = sentenceWithPunctuation;
      }
    }
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk.trim());
  }

  return chunks.filter((chunk) => chunk.length > 0);
};

const TTSButton = ({ text }: { text: string }) => {
  const {
    isLoading,
    setIsLoading,
    currentChunkIndex,
    setCurrentChunkIndex,
    totalChunks,
    setTotalChunks,
    isPlaying,
    setIsPlaying,
    playbackProgress,
    setPlaybackProgress,
    error,
    setError,
    audioQueue,
    setAudioQueue,
  } = useTTSStore();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const generationId = useRef(Date.now().toString());
  const retryCountRef = useRef<Record<number, number>>({});
  const maxRetries = 3;
  const processingRef = useRef(false);
  const playbackQueueRef = useRef<string[]>([]);
  const isPlayingRef = useRef(false);

  const setPlayingState = useCallback(
    (playing: boolean) => {
      setIsPlaying(playing);
      isPlayingRef.current = playing;
    },
    [setIsPlaying],
  );

  const processTextChunks = async (chunks: string[]) => {
    if (processingRef.current) return;
    processingRef.current = true;

    setIsLoading(true);
    setError(null);
    setTotalChunks(chunks.length);
    retryCountRef.current = {};

    try {
      const audioUrls: string[] = [];
      for (let i = 0; i < chunks.length; i++) {
        if (!isPlayingRef.current) {
          processingRef.current = false;
          setIsLoading(false);
          return;
        }

        setCurrentChunkIndex(i + 1);
        try {
          if (i > 0) {
            await new Promise((resolve) => setTimeout(resolve, 1500));
          }

          const humeApiKey = process.env.HUME_API_KEY!;

          if (!chunks[i]) {
            console.error(`Chunk ${i} is undefined or empty`);
            continue;
          }

          const sanitizedText = chunks[i]!.replace(
            /[\u00AD\u200B-\u200D\uFEFF]/g,
            "",
          )
            .replace(/[^\x20-\x7E\s.,?!;:'"()\[\]{}]/g, "")
            .trim();

          if (!sanitizedText) {
            console.warn(`Skipping empty chunk ${i}`);
            continue;
          }

          const response = await fetch("https://api.hume.ai/v0/tts", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Hume-Api-Key": humeApiKey,
            },
            body: JSON.stringify({
              utterances: [
                {
                  text: sanitizedText,
                  description: "A calm and expressive voice for storytelling",
                },
              ],
              context:
                i > 0 && generationId.current
                  ? { generation_id: generationId.current }
                  : undefined,
            }),
          });

          if (!response.ok) {
            if (response.status === 429) {
              const waitTime = 5000;
              setError(
                `Rate limit exceeded. Waiting 5 seconds before retrying...`,
              );
              await new Promise((resolve) => setTimeout(resolve, waitTime));
              i--;
              continue;
            }

            let errorMessage = "Failed to generate audio chunk";
            try {
              const errorData: { message?: string } =
                (await response.json()) as { message?: string };
              if (
                errorData &&
                typeof errorData === "object" &&
                "message" in errorData
              ) {
                errorMessage = errorData.message ?? errorMessage;
              }
            } catch {
              errorMessage = `${response.status}: ${response.statusText}`;
            }

            throw new Error(errorMessage);
          }

          const data: {
            generations?: Array<{
              generation_id?: string;
              audio?: string;
            }>;
          } = (await response.json()) as {
            generations?: Array<{
              generation_id?: string;
              audio?: string;
            }>;
          };

          if (data?.generations?.[0]?.generation_id) {
            generationId.current = data.generations[0].generation_id;
          }

          if (!data?.generations?.[0]?.audio) {
            throw new Error("No audio data received from API");
          }

          const audioData = data.generations[0].audio;
          const audioBytes = base64ToUint8Array(audioData);
          const blob = new Blob([audioBytes], { type: "audio/mpeg" });
          const url = URL.createObjectURL(blob);
          audioUrls.push(url);

          if (i === 0) {
            playbackQueueRef.current = audioUrls;
            playAudioQueue(audioUrls);
          }
        } catch (err) {
          console.error(`Error processing chunk ${i + 1}:`, err);

          const errorMessage =
            err instanceof Error
              ? err.message
              : "Unknown error occurred during audio processing";
          setError(`Error processing audio: ${errorMessage}`);

          const retryCount = retryCountRef.current[i] ?? 0;
          if (retryCount < maxRetries) {
            retryCountRef.current[i] = retryCount + 1;
            i--;
            const waitTime = 1000 * Math.pow(2, retryCount);
            await new Promise((resolve) => setTimeout(resolve, waitTime));
          } else {
            console.warn(
              `Skipping chunk ${i + 1} after ${maxRetries} failed attempts`,
            );
            setError(
              `Skipped part of text after multiple failed attempts. Continuing...`,
            );
          }
        }
      }

      setAudioQueue(audioUrls);
    } catch (err) {
      console.error("Error in processTextChunks:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError(`Error processing audio: ${errorMessage}`);
      cleanupUrls(audioQueue);
    } finally {
      processingRef.current = false;
      setIsLoading(false);
    }
  };

  const cleanupUrls = (urls: string[]) => {
    urls.forEach((url) => {
      try {
        URL.revokeObjectURL(url);
      } catch (e) {
        console.error("Error revoking URL:", e);
      }
    });
  };

  const playAudioQueue = (urls: string[], index = 0) => {
    if (index >= urls.length) {
      cleanupPlayback();
      return;
    }

    const audio = new Audio(urls[index]);
    audioRef.current = audio;

    const updateProgress = () => {
      if (!audio) return;

      try {
        const progress =
          ((index + audio.currentTime / (audio.duration || 1)) /
            (urls.length || 1)) *
          100;
        setPlaybackProgress(Math.min(progress, 100));
      } catch (e) {
        console.error("Error updating progress:", e);
      }
    };

    audio.addEventListener("timeupdate", updateProgress);

    audio
      .play()
      .then(() => {
        setPlayingState(true);
        setCurrentChunkIndex(index + 1);
      })
      .catch((err) => {
        console.error("Playback error:", err);

        setTimeout(() => {
          if (audioRef.current === audio) {
            audio.play().catch(() => {
              moveToNextChunk(urls, index, audio, updateProgress);
            });
          }
        }, 1000);
      });

    audio.addEventListener("ended", () => {
      moveToNextChunk(urls, index, audio, updateProgress);
    });

    audio.addEventListener("error", () => {
      console.error("Audio playback error on chunk", index + 1);
      moveToNextChunk(urls, index, audio, updateProgress);
    });
  };

  const moveToNextChunk = (
    urls: string[],
    currentIndex: number,
    audio: HTMLAudioElement,
    updateFn: () => void,
  ) => {
    try {
      const url = urls[currentIndex];
      if (url) {
        URL.revokeObjectURL(url);
      }
    } catch (e) {
      console.error("Error revoking URL:", e);
    }

    audio.removeEventListener("timeupdate", updateFn);

    setTimeout(() => {
      if (isPlayingRef.current) {
        playAudioQueue(urls, currentIndex + 1);
      }
    }, 300);
  };

  const cleanupPlayback = useCallback(() => {
    if (audioRef.current) {
      try {
        audioRef.current.pause();
        audioRef.current = null;
      } catch (e) {
        console.error("Error pausing audio:", e);
      }
    }

    cleanupUrls(audioQueue);
    setAudioQueue([]);
    setPlayingState(false);
    setPlaybackProgress(0);
    setCurrentChunkIndex(0);
    generationId.current = Date.now().toString();
    retryCountRef.current = {};
    playbackQueueRef.current = [];
  }, [
    audioQueue,
    setAudioQueue,
    setCurrentChunkIndex,
    setPlaybackProgress,
    setPlayingState,
  ]);

  const handlePlayPause = async () => {
    if (!text) {
      setError("No text content available for narration");
      return;
    }

    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play().catch((error: Error) => {
          setError(`Playback error: ${error.message}`);
        });
        setPlayingState(true);
      } else {
        audioRef.current.pause();
        setPlayingState(false);
      }
      return;
    }

    const cleanText = text
      .replace(/[\u00AD\u200B-\u200D\uFEFF]/g, "")
      .replace(/\s+/g, " ")
      .trim();

    if (!cleanText) {
      setError("No text content available for narration");
      return;
    }

    const chunks = splitTextIntoChunks(cleanText);
    if (chunks.length === 0) {
      setError("Unable to process text for narration");
      return;
    }

    setPlayingState(true);
    setIsLoading(true);
    try {
      await processTextChunks(chunks);
    } catch (err) {
      console.error("Error in handlePlayPause:", err);
      setError(
        `Failed to process audio: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
      setPlayingState(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      cleanupPlayback();
    };
  }, [cleanupPlayback]);

  return (
    <div className="mb-4">
      <div className="mb-2 flex items-center gap-2">
        <button
          onClick={handlePlayPause}
          disabled={isLoading}
          className="flex items-center space-x-2 rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600 disabled:opacity-50"
          aria-label={
            isLoading ? "Generating" : isPlaying ? "Pause" : "Generate TTS"
          }
        >
          {isLoading ? (
            <>
              <svg
                className="h-5 w-5 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>
                Generating Text to Speech
                {currentChunkIndex > 0
                  ? ` (${currentChunkIndex}/${totalChunks})`
                  : "..."}
              </span>
            </>
          ) : (
            <>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                {isPlaying ? (
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                ) : (
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                    clipRule="evenodd"
                  />
                )}
              </svg>
              <span>Generate TTS</span>
            </>
          )}
        </button>
        {(isPlaying || isLoading) && (
          <button
            onClick={cleanupPlayback}
            className="rounded bg-red-500 px-3 py-2 text-white hover:bg-red-600"
          >
            Stop
          </button>
        )}
      </div>

      {error && (
        <div className="mt-2 rounded bg-red-100 p-2 text-sm text-red-700">
          <strong>Error:</strong> {error}{" "}
          {totalChunks > 1 && `(Part ${currentChunkIndex} of ${totalChunks})`}
        </div>
      )}

      {totalChunks > 0 && isPlaying && (
        <div className="mt-2">
          <div className="h-2 rounded bg-gray-200">
            <div
              className="h-full rounded bg-blue-500 transition-all duration-300"
              style={{ width: `${playbackProgress}%` }}
            />
          </div>
          <div className="mt-1 text-sm text-gray-600">
            {audioQueue.length > 0
              ? `Playing part ${currentChunkIndex} of ${totalChunks}`
              : `Ready to play ${totalChunks} parts`}
          </div>
        </div>
      )}
    </div>
  );
};

export default TTSButton;
