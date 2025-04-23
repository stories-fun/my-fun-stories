"use client";

import NavBar from "../_components/NavBar";
import { useState, useRef, useEffect } from "react";
import { VoiceRecorder } from "~/components/VoiceRecorder";
import { Mic, MicOff, Loader2, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useWallet } from "@jup-ag/wallet-adapter";
import { toast } from "react-hot-toast";

export default function VoiceLLMPage() {
  const [showInstructions, setShowInstructions] = useState(false);
  const { connected } = useWallet();

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
              Voice to Story
            </h1>
            <p className="mt-2 text-gray-600">
              Record your voice and transform it into a captivating story
            </p>
          </div>
          <button
            onClick={() => setShowInstructions(!showInstructions)}
            className="rounded-full bg-gray-100 p-2 text-gray-700 hover:bg-gray-200"
            aria-label="Instructions"
          >
            <Info className="h-5 w-5" />
          </button>
        </div>

        <AnimatePresence>
          {showInstructions && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden rounded-lg bg-purple-50 p-4 text-sm text-purple-900"
            >
              <h3 className="mb-2 font-bold">How to use Voice to Story:</h3>
              <ol className="ml-5 list-decimal space-y-1">
                <li>Connect your wallet to get started</li>
                <li>
                  Click the microphone button to start recording your voice
                </li>
                <li>Speak clearly into your microphone</li>
                <li>
                  Recording will automatically stop after silence is detected
                </li>
                <li>AI will process your voice and generate a story</li>
                <li>You can edit the transcript and submit the final story</li>
              </ol>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="rounded-xl bg-white p-6 shadow-md">
          {!connected ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="mb-4 rounded-full bg-purple-100 p-4">
                <Mic className="h-8 w-8 text-purple-600" />
              </div>
              <h2 className="mb-2 text-xl font-semibold text-gray-900">
                Connect Your Wallet
              </h2>
              <p className="mb-6 max-w-md text-gray-600">
                Please connect your wallet to start creating voice stories
              </p>
              <div className="flex justify-center">
                {/* The wallet button is already in the NavBar */}
              </div>
            </div>
          ) : (
            <div className="flex flex-col">
              <VoiceRecorder />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
