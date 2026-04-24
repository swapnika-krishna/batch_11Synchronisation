import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Terminal as TerminalIcon, Play, RefreshCw } from 'lucide-react';

interface TerminalProps {
  boilerplate: string;
  onRun: (code: string) => void;
  isLoading?: boolean;
  title?: string;
}

export function Terminal({ boilerplate, onRun, isLoading, title }: TerminalProps) {
  const [code, setCode] = useState(boilerplate);

  useEffect(() => {
    setCode(boilerplate);
  }, [boilerplate]);

  return (
    <div className="bg-zinc-950 rounded-[2.5rem] border border-zinc-800 overflow-hidden shadow-2xl font-mono">
      <div className="flex items-center justify-between px-6 py-4 bg-zinc-900/50 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-4 h-4 text-primary" />
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{title || 'OS Terminal v1.0'}</span>
        </div>
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
        </div>
      </div>

      <div className="p-4 space-y-4">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-40 bg-transparent text-primary resize-none outline-none text-sm leading-relaxed"
          spellCheck={false}
          autoCapitalize="none"
        />

        <div className="flex items-center justify-between pt-2 border-t border-zinc-900">
          <button
            onClick={() => setCode(boilerplate)}
            className="flex items-center gap-2 px-3 py-1.5 text-[10px] font-bold text-zinc-400 hover:text-white transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            RESET
          </button>
          
          <button
            onClick={() => onRun(code)}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg text-[10px] font-bold uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all"
          >
            {isLoading ? (
              <RefreshCw className="w-3 h-3 animate-spin" />
            ) : (
              <Play className="w-3 h-3 fill-current" />
            )}
            Execute
          </button>
        </div>
      </div>

      <div className="px-4 py-2 bg-zinc-900 border-t border-zinc-800 text-[10px] text-zinc-500">
        &gt; ready_
      </div>
    </div>
  );
}
