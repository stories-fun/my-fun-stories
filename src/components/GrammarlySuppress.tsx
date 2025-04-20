"use client";

import { useEffect } from "react";

export default function GrammarlySuppress() {
  useEffect(() => {
    // Function to remove Grammarly attributes
    const removeGrammarlyAttributes = () => {
      try {
        // Remove attributes from html and body elements
        const elementsToClean = [document.documentElement, document.body];

        elementsToClean.forEach((el) => {
          if (el) {
            el.removeAttribute("data-new-gr-c-s-check-loaded");
            el.removeAttribute("data-gr-ext-installed");
          }
        });

        // Find all elements that might have Grammarly attributes
        const grammarlyElements = document.querySelectorAll(
          "[data-gr-ext-installed], [data-new-gr-c-s-check-loaded]",
        );

        grammarlyElements.forEach((el) => {
          el.removeAttribute("data-new-gr-c-s-check-loaded");
          el.removeAttribute("data-gr-ext-installed");
        });
      } catch (error) {
        // Silently fail if there's an error
        console.error("Error cleaning Grammarly attributes:", error);
      }
    };

    // Run once on mount
    removeGrammarlyAttributes();

    // Set up a small delay to catch any late-added attributes
    const timeoutId = setTimeout(removeGrammarlyAttributes, 100);

    // Clean up
    return () => clearTimeout(timeoutId);
  }, []);

  // This component doesn't render anything
  return null;
}
