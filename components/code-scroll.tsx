'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

export function CodeScroll({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cue, setCue] = useState<'none' | 'visible' | 'at-end'>('none');

  useEffect(() => {
    const pre = containerRef.current?.querySelector('pre');
    if (!pre) return;

    const updateOverflow = () => {
      const extent = pre.scrollWidth - pre.clientWidth;
      if (extent <= 0) {
        setCue('none');
      } else {
        // The browser can clamp a fractional scroll offset at the far edge.
        setCue(extent - pre.scrollLeft <= 1 ? 'at-end' : 'visible');
      }
    };
    const observer = new ResizeObserver(updateOverflow);
    observer.observe(pre);
    pre.addEventListener('scroll', updateOverflow, { passive: true });
    document.fonts.addEventListener('loadingdone', updateOverflow);
    updateOverflow();

    return () => {
      observer.disconnect();
      pre.removeEventListener('scroll', updateOverflow);
      document.fonts.removeEventListener('loadingdone', updateOverflow);
    };
  }, []);

  return (
    <div ref={containerRef}>
      {children}
      {cue !== 'none' ? (
        <p className="code-scroll-cue functional-label" data-at-end={cue === 'at-end' ? '' : undefined}>
          Scroll for more code <span aria-hidden="true">→</span>
        </p>
      ) : null}
    </div>
  );
}
