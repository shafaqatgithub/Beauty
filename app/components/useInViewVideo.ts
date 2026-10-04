"use client";

import { RefObject, useEffect } from "react";

/** Plays a muted background video only while `targetRef` is on screen; stays paused for reduced motion. */
export function useInViewVideo(
  videoRef: RefObject<HTMLVideoElement | null>,
  targetRef: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    const video = videoRef.current;
    const target = targetRef.current;
    if (!video || !target) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.05 },
    );
    io.observe(target);
    return () => io.disconnect();
  }, [videoRef, targetRef]);
}
