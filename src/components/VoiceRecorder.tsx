"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Loader2, X, Ban } from "lucide-react";
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
      if (
        audioContextRef.current &&
        audioContextRef.current.state !== "closed"
      ) {
        await audioContextRef.current.close();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });
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
          const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
          try {
            await handleAudioSubmission(audioBlob);
          } catch (error) {
            console.error("Error handling audio submission:", error);
            toast.error("Failed to process audio");
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

      mediaRecorder.onerror = (event) => {
        console.error("MediaRecorder error:", event);
        toast.error("Recording error occurred.");
        if (animationFrameRef.current)
          cancelAnimationFrame(animationFrameRef.current);
        if (
          audioContextRef.current &&
          audioContextRef.current.state !== "closed"
        ) {
          void audioContextRef.current.close().catch((error) => {
            console.error("Error closing audio context:", error);
          });
        }
        stream.getTracks().forEach((track) => track.stop());
        setIsRecording(false);
        setIsProcessing(false);
        setAudioData(undefined);
        mediaRecorderRef.current = null;
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
      const formData = new FormData();
      formData.append("audio", audioBlob);
      formData.append("userId", publicKey.toString());

      if (conversationId) {
        formData.append("conversationId", conversationId);
      }

      const response = await fetch("/api/voice-to-text", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = (await response.json()) as { error?: string };
        throw new Error(errorData.error ?? "Failed to process audio");
      }

      const data = (await response.json()) as AIResponseData;

      if (data.conversationId) {
        setConversationId(data.conversationId);
      }

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
        void startRecording().catch((error) => {
          console.error("Error starting recording:", error);
          toast.error("Failed to start recording");
        });
      };

      audio.onerror = (e) => {
        console.error("Error playing AI audio:", e);
        toast.error("Failed to play AI response.");
        setIsProcessing(false);
        setIsAiSpeaking(false);
        setAudioData(undefined);
        audioRef.current = null;
      };

      try {
        await audio.play();
        toast.success("AI response playing!");
      } catch (error) {
        console.error("Error playing audio:", error);
        toast.error("Failed to play audio response");
        setIsProcessing(false);
        setIsAiSpeaking(false);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("Error processing audio:", errorMessage);
      toast.error(errorMessage);
      setIsProcessing(false);
      setIsAiSpeaking(false);
      setAudioData(undefined);
    }
  };

  const endConversation = async () => {
    console.log("Ending conversation");
    try {
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
        mediaRecorderRef.current.onstop = async () => {
          console.log("MediaRecorder stopped during endConversation");
          mediaRecorderRef.current?.stream
            .getTracks()
            .forEach((track) => track.stop());
          if (
            audioContextRef.current &&
            audioContextRef.current.state !== "closed"
          ) {
            try {
              await audioContextRef.current.close();
            } catch (error) {
              console.error("Error closing context on end:", error);
            }
            audioContextRef.current = null;
            analyserRef.current = null;
          }
          mediaRecorderRef.current = null;
        };
        mediaRecorderRef.current.stop();
      } else if (
        audioContextRef.current &&
        audioContextRef.current.state !== "closed"
      ) {
        try {
          await audioContextRef.current.close();
        } catch (error) {
          console.error("Error closing context on end (no recorder):", error);
        }
        audioContextRef.current = null;
        analyserRef.current = null;
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
      setConversationId(null);
      setAudioData(undefined);
      chunksRef.current = [];
      toast.success("Conversation ended");
    } catch (error) {
      console.error("Error ending conversation:", error);
      toast.error("Failed to end conversation properly");
    }
  };

  const handleButtonClick = () => {
    if (isRecording) {
      void stopRecording();
    } else if (!isProcessing && !isAiSpeaking) {
      void startRecording().catch((error) => {
        console.error("Error starting recording:", error);
        toast.error("Failed to start recording");
      });
    }
  };

  const getWaveformVariant = (): "user" | "ai" | "idle" => {
    if (isRecording && audioData) return "user";
    if (isAiSpeaking) return "ai";
    return "idle";
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
    <div className="fixed bottom-4 right-4 z-[999] flex items-center gap-2">
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
        <AnimatePresence>
          {isHovered && conversationId && !isProcessing && !isAiSpeaking && (
            <motion.button
              key="end-button"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              onClick={endConversation}
              className="absolute right-full z-10 mr-2 flex h-12 w-12 items-center justify-center rounded-full bg-red-500 text-white shadow-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              aria-label="End Conversation"
            >
              <X className="h-6 w-6" />
            </motion.button>
          )}
        </AnimatePresence>

        <motion.button
          key="main-button"
          layout
          onClick={handleButtonClick}
          disabled={isProcessing || showBanIcon}
          className={`relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full text-white shadow-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            isRecording || (conversationId && !isAiSpeaking && !isProcessing)
              ? "bg-red-500 hover:bg-red-600 focus:ring-red-500"
              : isAiSpeaking
                ? "bg-blue-500 hover:bg-blue-600 focus:ring-blue-500"
                : showBanIcon
                  ? "bg-red-500 hover:bg-red-600 focus:ring-red-500"
                  : "bg-blue-500 hover:bg-blue-600 focus:ring-blue-500"
          } ${isProcessing ? "cursor-wait" : ""}`}
          aria-label={
            isRecording
              ? "Stop Recording"
              : conversationId
                ? "Start Speaking / End Conversation (Hover)"
                : "Start Recording"
          }
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
              {showMicOn && !showLoader && !showBanIcon && !showDefaultEnd && (
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
    </div>
  );
};
