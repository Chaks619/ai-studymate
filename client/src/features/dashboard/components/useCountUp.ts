import { useEffect, useRef, useState } from "react";

/**
 * Animates a number from 0 up to `target` with an ease-out curve. Uses the
 * timestamp requestAnimationFrame provides, so no wall-clock reads. Respects
 * the user's reduced-motion preference by snapping straight to the value.
 */
export function useCountUp(target: number, duration = 800) {
  const [value, setValue] = useState(0);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced || target <= 0) {
      setValue(target);
      return;
    }

    let frame = 0;
    startRef.current = null;

    const tick = (now: number) => {
      if (startRef.current === null) {
        startRef.current = now;
      }

      const progress = Math.min(
        (now - startRef.current) / duration,
        1
      );

      const eased = 1 - Math.pow(1 - progress, 3);

      setValue(Math.round(target * eased));

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return value;
}
