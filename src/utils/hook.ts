import { useState, useEffect, useRef } from 'react';

function useElementSize() {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.ResizeObserver) {
      console.warn('ResizeObserver is not supported in this environment.');
      return;
    }

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect) {
          setSize({
            width: entry.contentRect.width,
            height: entry.contentRect.height,
          });
          console.log({
            width: entry.contentRect.width,
            height: entry.contentRect.height,
          })
        }
      }
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current && observer) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return [ref, size] as const;
}

export default useElementSize;