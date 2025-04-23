import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface WaveformProps {
  audioData?: Float32Array;
  variant: "user" | "ai" | "listening" | "idle";
  className?: string;
}

export const Waveform = ({
  audioData,
  variant,
  className = "",
}: WaveformProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        canvas.width = entry.contentRect.width;
        canvas.height = entry.contentRect.height;
        draw();
      }
    });
    resizeObserver.observe(canvas);

    const draw = () => {
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      const time = Date.now() / 1000;

      switch (variant) {
        case "user":
          const userScale = 1 + Math.sin(time * 5) * 0.15;
          ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
          ctx.beginPath();
          ctx.arc(
            width / 2,
            height / 2,
            Math.min(width, height) * 0.1 * userScale,
            0,
            Math.PI * 2,
          );
          ctx.fill();

          if (audioData) {
            const barWidth = 2;
            const barGap = 1;
            const maxBars = Math.floor(width / (barWidth + barGap));
            const step = Math.floor(audioData.length / maxBars);
            ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
            for (let i = 0; i < maxBars; i++) {
              const dataIndex = i * step;
              const value = Math.abs(audioData[dataIndex] ?? 0);
              const barHeight = Math.min(value * height * 2, height * 0.6);
              const x = i * (barWidth + barGap);
              const y = (height - barHeight) / 2;
              ctx.fillRect(x, y, barWidth, barHeight);
            }
          }
          break;

        case "ai":
          const aiAmplitude = height * 0.2;
          const aiFrequency = 5 / width;

          ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          for (let x = 0; x < width; x++) {
            const y =
              height / 2 +
              Math.sin(x * aiFrequency + time * 3) *
                aiAmplitude *
                Math.exp(
                  -Math.pow(x - width / 2, 2) / (2 * Math.pow(width / 4, 2)),
                );
            if (x === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }
          ctx.stroke();
          break;

        case "listening":
          const listenScale = 1 + Math.sin(time * 3) * 0.2;
          ctx.fillStyle = "rgba(59, 130, 246, 0.7)";
          ctx.beginPath();
          ctx.arc(
            width / 2,
            height / 2,
            Math.min(width, height) * 0.15 * listenScale,
            0,
            Math.PI * 2,
          );
          ctx.fill();
          break;

        case "idle":
        default:
          break;
      }
    };

    draw();

    let animationFrameId: number;
    const animate = () => {
      if (variant === "user" || variant === "ai" || variant === "listening") {
        draw();
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    if (variant === "user" || variant === "ai" || variant === "listening") {
      animate();
    }

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, [audioData, variant]);

  return (
    <motion.canvas ref={canvasRef} className={`h-full w-full ${className}`} />
  );
};
