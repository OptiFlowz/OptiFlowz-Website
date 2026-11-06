import type { ReactNode } from "react";

export default function VideoPlatformFeatures({ children }: { children: ReactNode }) {
  return (
    <div className="video-platform-features">
      {children}
    </div>
  );
}
