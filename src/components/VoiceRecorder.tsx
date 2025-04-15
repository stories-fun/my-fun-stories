"use client";

import { useState, useRef, useEffect } from "react";
import {
  Mic,
  MicOff,
  Loader2,
  X,
  Ban,
  Save,
  Send,
  Pencil,
  Check,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { Waveform } from "./Waveform";
import { useWallet } from "@jup-ag/wallet-adapter";
import { motion, AnimatePresence } from "framer-motion";

interface AIResponseData {
  transcription: string;
  aiResponse: string;
  audioResponse: string;
  conversationId?: string;
}

export const VoiceRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [audioData, setAudioData] = useState<Float32Array>();
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [showWalletWarning, setShowWalletWarning] = useState(false);
  const [showBanIcon, setShowBanIcon] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState<string>("");
  const [transcriptHistory, setTranscriptHistory] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [finalStoryReady, setFinalStoryReady] = useState(false);
  const [showContinuePrompt, setShowContinuePrompt] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const animationFrameRef = useRef<number>();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const silenceTimeoutRef = useRef<NodeJS.Timeout>();
  const warningTimeoutRef = useRef<NodeJS.Timeout>();
  const banTimeoutRef = useRef<NodeJS.Timeout>();
  const { publicKey, connected } = useWallet();

  useEffect(() => {
    if (conversationId || isEditing) {
      setShowTranscript(true);
    }
  }, [conversationId, isEditing]);

  // Reset state when component unmounts
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
      if (banTimeoutRef.current) {
        clearTimeout(banTimeoutRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state === "recording"
      ) {
        mediaRecorderRef.current.stop();
      }
      if (
        audioContextRef.current &&
        audioContextRef.current.state !== "closed"
      ) {
        void audioContextRef.current.close().catch((error) => {
          console.error("Error closing audio context:", error);
        });
      }
    };
  }, []);

  const updateWaveform = () => {
    if (
      !analyserRef.current ||
      !audioContextRef.current ||
      audioContextRef.current.state === "closed"
    ) {
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
      return;
    }

    const dataArray = new Float32Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getFloatTimeDomainData(dataArray);
    setAudioData(new Float32Array(dataArray));

    if (isRecording) {
      const isSilent = dataArray.every((value) => Math.abs(value) < 0.01);
      if (isSilent) {
        if (!silenceTimeoutRef.current) {
          silenceTimeoutRef.current = setTimeout(() => {
            console.log("Silence detected, stopping recording.");
            void stopRecording();
          }, 1500);
        }
      } else if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
        silenceTimeoutRef.current = undefined;
      }
    }

    animationFrameRef.current = requestAnimationFrame(updateWaveform);
  };

  // Clean up any ongoing processes before starting a new recording
  const cleanupBeforeRecording = async () => {
    // Stop any ongoing operations
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.onplay = null;
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
      audioRef.current = null;
    }

    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      const recorder = mediaRecorderRef.current;
      recorder.stop();
      return new Promise<void>((resolve) => {
        const originalOnStop = recorder.onstop;
        recorder.onstop = (event) => {
          if (originalOnStop) {
            originalOnStop.call(recorder, event);
          }
          resolve();
        };
      });
    }

    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      try {
        await audioContextRef.current.close();
        audioContextRef.current = null;
        analyserRef.current = null;
      } catch (error) {
        console.error("Error closing audio context:", error);
      }
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = undefined;
    }

    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = undefined;
    }

    setIsRecording(false);
    setIsAiSpeaking(false);
    setIsProcessing(false);
    chunksRef.current = [];
  };

  // Show transcript panel when recording starts or AI responds
  useEffect(() => {
    if (isRecording || isAiSpeaking || conversationId) {
      setShowTranscript(true);
    }
  }, [isRecording, isAiSpeaking, conversationId]);

  const startRecording = async () => {
    if (isProcessing) {
      toast.error("Please wait for the current response to finish");
      return;
    }

    if (!connected || !publicKey) {
      setShowWalletWarning(true);
      setShowBanIcon(true);

      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
      warningTimeoutRef.current = setTimeout(() => {
        setShowWalletWarning(false);
      }, 3000);

      if (banTimeoutRef.current) {
        clearTimeout(banTimeoutRef.current);
      }
      banTimeoutRef.current = setTimeout(() => {
        setShowBanIcon(false);
      }, 3000);

      toast.error("Please connect your wallet first");
      return;
    }

    try {
      // Clean up before starting a new recording session
      await cleanupBeforeRecording();

      // Always show transcript when recording
      setShowTranscript(true);
      setIsEditing(false); // Exit edit mode when recording starts

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;

      // Specify mime type explicitly, and ensure browser support
      const options: MediaRecorderOptions = {
        mimeType: MediaRecorder.isTypeSupported("audio/mp3")
          ? "audio/mp3"
          : "audio/webm",
      };

      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        console.log("MediaRecorder stopped");
        if (!mediaRecorderRef.current) return;

        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = undefined;
        }
        if (
          audioContextRef.current &&
          audioContextRef.current.state !== "closed"
        ) {
          try {
            await audioContextRef.current.close();
            audioContextRef.current = null;
            analyserRef.current = null;
          } catch (error) {
            console.error("Error closing audio context:", error);
          }
        }

        stream.getTracks().forEach((track) => track.stop());

        if (chunksRef.current.length > 0) {
          // Create blob with explicitly defined type that OpenAI supports
          const audioBlob = new Blob(chunksRef.current, { type: "audio/mp3" });
          try {
            await handleAudioSubmission(audioBlob);
          } catch (error) {
            console.error("Error handling audio submission:", error);
            toast.error("Failed to process audio");
            setIsProcessing(false);
            setIsRecording(false);
            setAudioData(undefined);
            setShowTranscript(true);
          }
        } else {
          setIsProcessing(false);
          setIsRecording(false);
          setAudioData(undefined);
          setShowTranscript(true);
        }

        mediaRecorderRef.current = null;
        chunksRef.current = [];
      };

      mediaRecorder.onerror = (event) => {
        console.error("MediaRecorder error:", event);
        toast.error("Recording error occurred.");
        stream.getTracks().forEach((track) => track.stop());
        setIsRecording(false);
        setIsProcessing(false);
        setAudioData(undefined);
        mediaRecorderRef.current = null;
        setShowTranscript(true);
      };

      mediaRecorder.start(100);
      setIsRecording(true);
      setAudioData(new Float32Array(analyser.frequencyBinCount));
      updateWaveform();
      toast.success("Recording started");
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast.error("Could not access microphone. Please check permissions.");
      setIsRecording(false);
      setIsProcessing(false);
      setShowTranscript(true);
    }
  };

  const stopRecording = () => {
    console.log("Stopping recording manually or via silence...");
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = undefined;
    }

    if (mediaRecorderRef.current && isRecording) {
      if (mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.onstop = async () => {
          console.log("MediaRecorder stopped (manual/silence)");
          if (!mediaRecorderRef.current) return;

          if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = undefined;
          }
          if (
            audioContextRef.current &&
            audioContextRef.current.state !== "closed"
          ) {
            mediaRecorderRef.current?.stream
              .getTracks()
              .forEach((track) => track.stop());
            try {
              await audioContextRef.current.close();
            } catch (error) {
              console.error("Error closing audio context:", error);
            }
            audioContextRef.current = null;
            analyserRef.current = null;
          }

          if (chunksRef.current.length > 0) {
            const audioBlob = new Blob(chunksRef.current, {
              type: "audio/webm",
            });
            setIsProcessing(true);
            setIsRecording(false);
            setAudioData(undefined);
            try {
              await handleAudioSubmission(audioBlob);
            } catch (error) {
              console.error("Error handling audio submission:", error);
              setIsProcessing(false);
              setIsRecording(false);
              setAudioData(undefined);
            }
          } else {
            setIsProcessing(false);
            setIsRecording(false);
            setAudioData(undefined);
          }

          mediaRecorderRef.current = null;
          chunksRef.current = [];
        };
        mediaRecorderRef.current.stop();
        toast.success("Recording stopped, processing...");
      } else {
        setIsRecording(false);
        setAudioData(undefined);
      }
    } else {
      console.log(
        "Stop recording called but no active recorder or not recording.",
      );
      setIsRecording(false);
      setAudioData(undefined);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = undefined;
      }
      if (
        audioContextRef.current &&
        audioContextRef.current.state !== "closed"
      ) {
        void audioContextRef.current.close().catch((error) => {
          console.error("Error closing audio context:", error);
        });
        audioContextRef.current = null;
        analyserRef.current = null;
      }
    }
  };

  const handleAudioSubmission = async (audioBlob: Blob) => {
    if (!publicKey) {
      toast.error("Wallet not connected. Please connect your wallet first.");
      setIsProcessing(false);
      return;
    }

    try {
      // Convert blob to mp3 format that OpenAI accepts
      // First, create a file with the correct extension
      const fileName = "recording.mp3";
      const audioFile = new File([audioBlob], fileName, {
        type: "audio/mp3",
      });

      const formData = new FormData();
      formData.append("audio", audioFile);
      formData.append("userId", publicKey.toString());

      if (conversationId) {
        formData.append("conversationId", conversationId);
      }

      // Add logging to debug
      console.log("Submitting audio file:", audioFile.type, audioFile.size);

      setIsProcessing(true);

      const response = await fetch("/api/voice-to-text", {
        method: "POST",
        body: formData,
      });

      // If there's a server error, try to get detailed error message
      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || `Server error: ${response.status}`,
          );
        } else {
          const textError = await response.text();
          throw new Error(textError || `Server error: ${response.status}`);
        }
      }

      const data = (await response.json()) as AIResponseData;

      if (data.conversationId) {
        setConversationId(data.conversationId);
      }

      // Update transcript with the new transcription
      setLiveTranscript((prev) => {
        const newTranscript = prev
          ? `${prev}\n${data.transcription}`
          : data.transcription;
        return newTranscript;
      });

      setTranscriptHistory((prev) => [...prev, data.transcription]);

      // Make sure transcript is visible
      setShowTranscript(true);

      const audio = new Audio(`data:audio/mp3;base64,${data.audioResponse}`);
      audioRef.current = audio;

      audio.onplay = () => {
        console.log("AI audio started playing");
        setIsProcessing(false);
        setIsAiSpeaking(true);
        setAudioData(new Float32Array(1024));
      };

      audio.onended = () => {
        console.log("AI audio ended");
        setIsAiSpeaking(false);
        setAudioData(undefined);
        audioRef.current = null;

        // Show "Continue" button instead of auto-starting recording
        setShowContinuePrompt(true);
      };

      audio.onerror = (e) => {
        console.error("Error playing AI audio:", e);
        toast.error("Failed to play AI response.");
        setIsProcessing(false);
        setIsAiSpeaking(false);
        setAudioData(undefined);
        audioRef.current = null;
        setShowTranscript(true);
        setShowContinuePrompt(true);
      };

      try {
        await audio.play();
        toast.success("AI response playing!");
      } catch (error) {
        console.error("Error playing audio:", error);
        toast.error("Failed to play audio response");
        setIsProcessing(false);
        setIsAiSpeaking(false);
        setShowTranscript(true);
        setShowContinuePrompt(true);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("Error processing audio:", errorMessage);
      toast.error(errorMessage);
      setIsProcessing(false);
      setIsAiSpeaking(false);
      setAudioData(undefined);
      // Show transcript panel so user can see what they have so far
      setShowTranscript(true);
      setShowContinuePrompt(true);
    }
  };

  // Function to handle the main button click with improved behavior
  const handleButtonClick = () => {
    if (isRecording) {
      // Stop recording if currently recording
      void stopRecording();
    } else if (isAiSpeaking) {
      // Stop AI from speaking if it's currently speaking
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.onplay = null;
        audioRef.current.onended = null;
        audioRef.current.onerror = null;
        audioRef.current = null;
        setIsAiSpeaking(false);
        setAudioData(undefined);
        setShowContinuePrompt(true);
        toast.success("Audio playback stopped");
      }
    } else if (isProcessing) {
      // Do nothing if processing - button should be disabled
      return;
    } else {
      // Start recording if not recording, not playing, and not processing
      void startRecording().catch((error) => {
        console.error("Error starting recording:", error);
        toast.error("Failed to start recording");
      });
    }
  };

  // Improved end conversation function for the cancel button
  const endConversation = async () => {
    console.log("Ending conversation completely");
    try {
      // Clean up all resources
      await cleanupBeforeRecording();

      // Reset all state to initial values
      setShowTranscript(false);
      setIsEditing(false);
      setShowContinuePrompt(false);

      // Clear conversation state and data
      setConversationId(null);

      // Keep the transcript for editing but clearly indicate conversation has ended
      if (liveTranscript.trim()) {
        setIsEditing(true);
        setShowTranscript(true);
        toast.success(
          "Voice session ended. You can now edit your story before submitting.",
        );
      } else {
        // If no transcript, just reset everything
        setLiveTranscript("");
        setTranscriptHistory([]);
        toast.success("Voice session ended.");
      }
    } catch (error) {
      console.error("Error ending conversation:", error);
      toast.error("Failed to end conversation properly");
    }
  };

  // Get current button content and state
  const getButtonLabel = (): string => {
    if (isRecording) return "Stop Recording";
    if (isAiSpeaking) return "Stop AI Response";
    if (isProcessing) return "Processing...";
    if (conversationId) return "Continue Recording";
    return "Start Recording";
  };

  // Get current button color based on state
  const getButtonClass = (): string => {
    if (isRecording) return "bg-red-500 hover:bg-red-600 focus:ring-red-500";
    if (isAiSpeaking)
      return "bg-blue-500 hover:bg-blue-600 focus:ring-blue-500";
    if (showBanIcon) return "bg-red-500 hover:bg-red-600 focus:ring-red-500";
    return "bg-blue-500 hover:bg-blue-600 focus:ring-blue-500";
  };

  const getWaveformVariant = (): "user" | "ai" | "idle" => {
    if (isRecording && audioData) return "user";
    if (isAiSpeaking) return "ai";
    return "idle";
  };

  const handleTranscriptChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setLiveTranscript(e.target.value);
  };

  const saveTranscript = () => {
    setIsEditing(false);
    toast.success("Your story has been saved for editing");
  };

  const submitFinalStory = async () => {
    if (!liveTranscript.trim()) {
      toast.error("Cannot submit an empty story");
      return;
    }

    if (!publicKey) {
      toast.error("Wallet not connected. Please connect your wallet first.");
      return;
    }

    try {
      setIsProcessing(true);

      // Call the API to save the story
      const response = await fetch("/api/submit-story", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: publicKey.toString(),
          content: liveTranscript,
          title: "My Voice Story", // You could add a title input field as well
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit story");
      }

      const result = await response.json();

      setFinalStoryReady(true);
      setShowTranscript(false);
      setIsProcessing(false);
      toast.success("Your story has been submitted successfully!");

      // Reset state
      setLiveTranscript("");
      setTranscriptHistory([]);
      setIsEditing(false);
      setConversationId(null);
    } catch (error) {
      console.error("Error submitting story:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to submit your story",
      );
      setIsProcessing(false);
    }
  };

  // Toggle edit mode function
  const toggleEditMode = () => {
    if (isEditing) {
      saveTranscript();
    } else {
      setIsEditing(true);
    }
    // Always show transcript when editing
    setShowTranscript(true);
  };

  // Function to continue the conversation
  const continueConversation = () => {
    setShowContinuePrompt(false);
    void startRecording().catch((error) => {
      console.error("Error starting recording:", error);
      toast.error("Failed to start recording");
    });
  };

  const resumeRecording = () => {
    setIsEditing(false);
    setShowContinuePrompt(false);
    void startRecording().catch((error) => {
      console.error("Error resuming recording:", error);
      toast.error("Failed to resume recording");
    });
  };

  const waveformVariant = getWaveformVariant();
  const showWaveform = waveformVariant === "user" || waveformVariant === "ai";
  const showLoader = isProcessing;
  const showMicOn =
    !isRecording &&
    !isProcessing &&
    !isAiSpeaking &&
    !showBanIcon &&
    !conversationId;
  const showMicOff = isRecording && !isProcessing;
  const showDefaultEnd =
    conversationId &&
    !isRecording &&
    !isProcessing &&
    !isAiSpeaking &&
    !isHovered;

  return (
    <>
      {showTranscript && (
        <div className="fixed bottom-20 right-4 z-[998] flex w-80 flex-col gap-3 rounded-lg bg-white p-4 shadow-lg md:w-96">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold">
              {isEditing
                ? "Edit Your Story"
                : isRecording
                  ? "Recording... (Live Transcription)"
                  : isAiSpeaking
                    ? "AI is Responding..."
                    : "Your Story (Live Transcription)"}
            </h3>
            <div className="flex gap-2">
              {!isRecording && !isAiSpeaking && !isProcessing && (
                <button
                  onClick={toggleEditMode}
                  className={`rounded-full p-1 ${
                    isEditing
                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  title={isEditing ? "Save edits" : "Edit transcript"}
                >
                  {isEditing ? (
                    <Save className="h-4 w-4" />
                  ) : (
                    <Pencil className="h-4 w-4" />
                  )}
                </button>
              )}
              {isEditing && (
                <button
                  onClick={submitFinalStory}
                  className="rounded-full bg-purple-100 p-1 text-purple-700 hover:bg-purple-200"
                  title="Submit final story"
                  disabled={isProcessing}
                >
                  <Send className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={() => setShowTranscript(false)}
                className="rounded-full bg-gray-100 p-1 text-gray-700 hover:bg-gray-200"
                title="Minimize"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {isEditing ? (
            <textarea
              value={liveTranscript}
              onChange={handleTranscriptChange}
              className="h-40 w-full resize-none rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Edit your story here..."
              disabled={isProcessing}
            />
          ) : (
            <div className="h-40 w-full overflow-auto rounded border border-gray-200 bg-gray-50 p-2">
              {liveTranscript ? (
                <div className="whitespace-pre-wrap">{liveTranscript}</div>
              ) : (
                <div className="text-gray-400">
                  Your transcription will appear here as you speak...
                </div>
              )}
            </div>
          )}

          {showContinuePrompt &&
            !isEditing &&
            !isRecording &&
            !isAiSpeaking &&
            !isProcessing && (
              <button
                onClick={continueConversation}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-md bg-blue-500 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Mic className="h-4 w-4" /> Continue Recording
              </button>
            )}

          {isEditing && (
            <div className="text-xs text-gray-500">
              <p>
                Edit your story, then click the save icon or submit when ready.
              </p>
            </div>
          )}

          {(isRecording || isAiSpeaking) && (
            <div className="mt-2 flex items-center justify-center text-sm text-gray-600">
              {isRecording ? (
                <div className="flex items-center text-red-500">
                  <span className="mr-2 flex h-2 w-2">
                    <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
                  </span>
                  Recording in progress...
                </div>
              ) : (
                <div className="flex items-center text-blue-500">
                  <span className="mr-2 flex h-2 w-2">
                    <span className="absolute inline-flex h-2 w-2 animate-pulse rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
                  </span>
                  AI is responding...
                </div>
              )}
            </div>
          )}

          {isProcessing && (
            <div className="mt-2 flex items-center justify-center text-sm text-gray-500">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span>Processing...</span>
            </div>
          )}

          {!isEditing &&
            !isRecording &&
            !isAiSpeaking &&
            !isProcessing &&
            !showContinuePrompt &&
            conversationId && (
              <div className="mt-2 flex justify-between">
                <button
                  onClick={toggleEditMode}
                  className="flex items-center gap-1 rounded-md bg-gray-100 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-200"
                >
                  <Pencil className="h-3 w-3" /> Edit
                </button>
                <button
                  onClick={continueConversation}
                  className="flex items-center gap-1 rounded-md bg-blue-100 px-3 py-1.5 text-xs text-blue-700 hover:bg-blue-200"
                >
                  <Mic className="h-3 w-3" /> Continue
                </button>
                <button
                  onClick={submitFinalStory}
                  className="flex items-center gap-1 rounded-md bg-purple-100 px-3 py-1.5 text-xs text-purple-700 hover:bg-purple-200"
                >
                  <Send className="h-3 w-3" /> Submit
                </button>
              </div>
            )}
        </div>
      )}

      {finalStoryReady && (
        <div className="fixed bottom-20 right-4 z-[998] w-80 rounded-lg bg-green-50 p-4 shadow-lg md:w-96">
          <div className="flex items-center gap-2 text-green-700">
            <Check className="h-5 w-5" />
            <p className="font-medium">
              Your story has been submitted successfully!
            </p>
          </div>
          <button
            onClick={() => setFinalStoryReady(false)}
            className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="fixed bottom-4 right-4 z-[999] flex items-center gap-2">
        {!showTranscript && conversationId && liveTranscript && (
          <motion.button
            onClick={() => setShowTranscript(true)}
            className="flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-md hover:bg-gray-50"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            <span>View Transcript</span>
          </motion.button>
        )}

        <AnimatePresence>
          {showWalletWarning && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-16 right-0 mb-2 rounded-lg bg-yellow-100 p-3 text-sm text-yellow-800 shadow-lg"
            >
              Please connect your wallet to start a voice conversation
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className="relative flex items-center"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <motion.button
            key="main-button"
            layout
            onClick={handleButtonClick}
            disabled={isProcessing && !isAiSpeaking}
            className={`relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full text-white shadow-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${getButtonClass()} ${isProcessing && !isAiSpeaking ? "cursor-wait opacity-80" : ""}`}
            aria-label={getButtonLabel()}
          >
            <AnimatePresence>
              {showWaveform && (
                <motion.div
                  key="waveform"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.1 }}
                  className="absolute inset-0 z-0"
                >
                  <Waveform
                    audioData={audioData}
                    variant={waveformVariant}
                    className="h-full w-full"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative z-10 flex h-6 w-6 items-center justify-center">
              <AnimatePresence mode="wait">
                {showLoader && (
                  <motion.div
                    key="loader"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </motion.div>
                )}
                {showMicOff && !showLoader && (
                  <motion.div
                    key="mic-off"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <MicOff className="h-6 w-6" />
                  </motion.div>
                )}
                {showBanIcon && !showLoader && (
                  <motion.div
                    key="ban"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Ban className="h-6 w-6" />
                  </motion.div>
                )}
                {showDefaultEnd && !showLoader && !showBanIcon && (
                  <motion.div
                    key="end-idle"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <X className="h-6 w-6" />
                  </motion.div>
                )}
                {showMicOn &&
                  !showLoader &&
                  !showBanIcon &&
                  !showDefaultEnd && (
                    <motion.div
                      key="mic-on"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Mic className="h-6 w-6" />
                    </motion.div>
                  )}
                {!showLoader &&
                  !showMicOff &&
                  !showBanIcon &&
                  !showDefaultEnd &&
                  !showMicOn && (
                    <motion.div key="placeholder" exit={{ opacity: 0 }} />
                  )}
              </AnimatePresence>
            </div>
          </motion.button>
        </motion.div>

        {/* Cancel button - always visible when conversation is active */}
        {conversationId && (
          <motion.button
            onClick={endConversation}
            className="ml-2 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 shadow-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-300"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            title="Cancel voice session"
            disabled={isProcessing && !isAiSpeaking}
          >
            <X className="h-6 w-6" />
          </motion.button>
        )}
      </div>
    </>
  );
};
