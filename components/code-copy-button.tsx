'use client';

import { useEffect, useRef, useState } from 'react';

type CopyState = 'copied' | 'failed' | 'idle';

const copyLabels: Record<CopyState, string> = {
  copied: 'Copied',
  failed: 'Copy failed — retry',
  idle: 'Copy',
};

export function CodeCopyButton({ value }: { value: string }) {
  const [state, setState] = useState<CopyState>('idle');
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, []);

  async function copy(): Promise<void> {
    if (resetTimer.current) clearTimeout(resetTimer.current);

    try {
      await navigator.clipboard.writeText(value);
      setState('copied');
    } catch {
      setState('failed');
    }

    resetTimer.current = setTimeout(() => setState('idle'), 8000);
  }

  return (
    <button
      className="code-copy-button functional-label"
      type="button"
      data-state={state}
      onClick={copy}
      aria-label={`${copyLabels[state]} code`}
    >
      <span aria-hidden="true">{copyLabels[state]}</span>
      <span className="visually-hidden" aria-live="polite">{copyLabels[state]}</span>
    </button>
  );
}
