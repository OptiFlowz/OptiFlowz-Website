"use client";

import { ArrowSVG } from "../constants";

declare global {
  interface Window {
    optiflowzSendMessage?: (message: string) => void;
  }
}

export default function BookACallButton() {
  function bookACall() {
    const message = "I'd like to schedule a call";

    const openButton = document.getElementById("optiflowz-chat-open");

    if (!openButton) {
      console.error("Chat open dugme nije pronađeno.");
      return;
    }

    openButton.click();

    setTimeout(() => {
      if (typeof window.optiflowzSendMessage === "function") {
        window.optiflowzSendMessage(message);
      } else {
        console.error("optiflowzSendMessage nije dostupan na window objektu.");
      }
    }, 300);
  }

  return (
    <button
      className="button white noLineHover max-[520px]:w-full! max-[520px]:justify-center"
      onClick={bookACall}
    >
      Schedule a call {ArrowSVG}
    </button>
  );
}