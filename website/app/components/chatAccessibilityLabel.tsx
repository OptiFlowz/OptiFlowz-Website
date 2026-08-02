"use client";

import { useEffect } from "react";

export default function ChatAccessibilityLabel() {
  useEffect(() => {
    const labelChatButton = () => {
      const button = document.getElementById("optiflowz-chat-open");
      if (!(button instanceof HTMLButtonElement)) return false;

      button.setAttribute("aria-label", "Open OptiFlowz AI chat");
      return true;
    };

    if (labelChatButton()) return;

    const observer = new MutationObserver(() => {
      if (labelChatButton()) observer.disconnect();
    });

    observer.observe(document.body, { childList: true, subtree: true });
    const timeoutId = window.setTimeout(() => observer.disconnect(), 10_000);

    return () => {
      observer.disconnect();
      window.clearTimeout(timeoutId);
    };
  }, []);

  return null;
}
