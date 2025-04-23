/**
 * TypeScript wrapper for JSConfetti
 */

interface JSConfettiConfig {
  canvas?: HTMLCanvasElement;
}

interface ConfettiOptions {
  confettiRadius?: number;
  confettiNumber?: number;
  confettiesNumber?: number;
  confettiColors?: string[];
  emojis?: string[];
  emojies?: string[];
  emojiSize?: number;
}

interface JSConfettiInstance {
  addConfetti(options?: ConfettiOptions): Promise<void>;
  clearCanvas(): void;
  destroyCanvas(): void;
}

// @ts-ignore - Import the original JS file
import JSConfettiOriginal from './confetti.js';

/**
 * JSConfetti wrapper class
 */
export default class JSConfetti {
  private instance: JSConfettiInstance;

  constructor(config: JSConfettiConfig = {}) {
    // @ts-ignore - Create an instance of the original JSConfetti
    this.instance = new JSConfettiOriginal(config);
  }

  addConfetti(options: ConfettiOptions = {}): Promise<void> {
    return this.instance.addConfetti(options);
  }

  clearCanvas(): void {
    this.instance.clearCanvas();
  }

  destroyCanvas(): void {
    this.instance.destroyCanvas();
  }
}
