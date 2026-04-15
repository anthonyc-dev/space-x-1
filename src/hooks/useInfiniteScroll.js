import { useEffect, useRef } from 'react';

export function useInfiniteScroll(callback, options = {}) {
  const { threshold = 0.1, rootMargin = '100px' } = options;
  const targetRef = useRef(null);

  useEffect(() => {
    if (!targetRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            callback();
          }
        });
      },
      {
        threshold,
        rootMargin
      }
    );

    observer.observe(targetRef.current);

    return () => {
      observer.disconnect();
    };
  }, [callback, threshold, rootMargin]);

  return targetRef;
}