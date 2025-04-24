/**
 * JSConfetti library type definitions
 */

declare var JSConfetti: JSConfettiConstructor;

interface JSConfettiConstructor {
  new(config?: JSConfettiConfig): JSConfettiInstance;
}

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
  /**
   * Add confetti to the canvas
   */
  addConfetti(options?: ConfettiOptions): Promise<void>;
  
  /**
   * Clear all confetti from the canvas
   */
  clearCanvas(): void;
  
  /**
   * Remove the canvas from the DOM
   */
  destroyCanvas(): void;
}

export = JSConfetti;
export as namespace JSConfetti;
