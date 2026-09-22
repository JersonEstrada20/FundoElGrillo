import React, { useState, useRef } from "react";
import { Loader2 } from "lucide-react";

const THRESHOLD = 60;

export default function PullToRefresh({ onRefresh, children }) {
  const [pull, setPull] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  const touchStartY = useRef(null);

  const onTouchStart = (e) => {
    if (window.scrollY <= 0 && !refreshing) {
      touchStartY.current = e.touches[0].clientY;
      setIsPulling(true);
    }
  };

  const onTouchMove = (e) => {
    if (touchStartY.current === null || refreshing) return;
    if (window.scrollY > 0) {
      if (pull > 0) setPull(0);
      return;
    }
    const diff = e.touches[0].clientY - touchStartY.current;
    if (diff > 0) {
      setPull(Math.min(diff * 0.4, THRESHOLD * 1.5));
    }
  };

  const onTouchEnd = async () => {
    if (touchStartY.current === null) return;
    touchStartY.current = null;
    setIsPulling(false);
    if (pull >= THRESHOLD) {
      setRefreshing(true);
      setPull(THRESHOLD);
      try {
        await onRefresh?.();
      } finally {
        setRefreshing(false);
        setPull(0);
      }
    } else {
      setPull(0);
    }
  };

  const progress = Math.min(pull / THRESHOLD, 1);

  return (
    <div
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div
        className="flex items-center justify-center overflow-hidden"
        style={{
          height: pull,
          opacity: progress,
          transition: isPulling ? "none" : "height 0.3s ease, opacity 0.3s ease",
        }}
      >
        <Loader2 className={`w-5 h-5 text-accent ${refreshing ? "animate-spin" : ""}`} />
      </div>
      {children}
    </div>
  );
}