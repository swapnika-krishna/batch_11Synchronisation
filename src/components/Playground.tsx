import { useState } from 'react';
import { motion } from 'motion/react';
import { Terminal } from './Terminal';
import { 
  Code2, 
  Terminal as TerminalIcon, 
  Settings, 
  ChevronRight, 
  ChevronLeft,
  Variable,
  Box,
  Binary,
  Layers,
  Cpu,
  Star
} from 'lucide-react';
import { cn } from '../lib/utils';
import { ALGORITHMS } from '../constants';
import { AlgorithmType } from '../types';
import { ALGO_CODE_TEMPLATES } from '../data/codeTemplates';

type Language = 'c' | 'cpp' | 'python' | 'java';

export function Playground() {
  const [language, setLanguage] = useState<Language>('c');
  const [selectedAlgo, setSelectedAlgo] = useState<AlgorithmType | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [output, setOutput] = useState<string[]>([]);

  const handleRun = (code: string) => {
    setIsExecuting(true);
    setOutput([]);
    
    // Simulate execution steps
    setTimeout(() => {
      setOutput(prev => [...prev, `[system] Initializing ${language.toUpperCase()} hypervisor...`]);
      setTimeout(() => {
        setOutput(prev => [...prev, `[system] Memory barrier initialized at 0x00FF88`]);
        setTimeout(() => {
          if (code.length < 20) {
            setOutput(prev => [...prev, `[error] Execution aborted: Invalid code structure.`]);
          } else {
             setOutput(prev => [...prev, `[stdout] Spawning process threads...`]);
             setOutput(prev => [...prev, `[stdout] Process P0 acquired LOCK_ID_883`]);
             setOutput(prev => [...prev, `[stdout] Critical section entry granted.`]);
             setOutput(prev => [...prev, `[stdout] Releasing context...`]);
             setOutput(prev => [...prev, `[system] Simulation finished with status code 0.`]);
          }
          setIsExecuting(false);
        }, 1000);
      }, 800);
    }, 500);
  };

  const categories = [
    { id: 'software', title: 'Logic Sanbox', icon: Code2, subtitle: 'Test logic-based synchronization solutions.' },
    { id: 'mechanism', title: 'Kernel Lab', icon: Cpu, subtitle: 'High-level primitives simulation.' },
    { id: 'problem', title: 'Classic Simulator', icon: Star, subtitle: 'Solve standard coordination problems.' },
    { id: 'hardware', title: 'Atomic Playground', icon: Binary, subtitle: 'Atomic CPU instruction simulations.' },
  ];

  if (selectedAlgo) {
    const boilerplates: Record<Language, string> = {
      c: ALGO_CODE_TEMPLATES[selectedAlgo]?.c || `#include <pthread.h>\n\n// Logic for ${selectedAlgo} in C`,
      cpp: ALGO_CODE_TEMPLATES[selectedAlgo]?.cpp || `#include <mutex>\n\n// Logic for ${selectedAlgo} in C++`,
      python: ALGO_CODE_TEMPLATES[selectedAlgo]?.python || `import threading\n\n# Logic for ${selectedAlgo} in Python`,
      java: ALGO_CODE_TEMPLATES[selectedAlgo]?.java || `import java.util.concurrent.*;\n\n// Logic for ${selectedAlgo} in Java`
    };

    return (
      <div className="space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <button 
            onClick={() => {
              setSelectedAlgo(null);
              setOutput([]);
            }}
            className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Switch Sandbox
          </button>

          <div className="flex items-center gap-1.5 bg-secondary/50 p-1.5 rounded-2xl border border-border">
            {(['c', 'cpp', 'python', 'java'] as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => {
                  setLanguage(lang);
                  setOutput([]);
                }}
                className={cn(
                  "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                  language === lang 
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105" 
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                {lang === 'cpp' ? 'C++' : lang}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10">
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-[3rem] p-4 shadow-2xl relative group overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-primary/20 animate-scan pointer-events-none" />
                <Terminal 
                  title={`${selectedAlgo}_hypervisor_active`}
                  boilerplate={boilerplates[language]} 
                  onRun={handleRun}
                  isLoading={isExecuting}
                />
            </div>

            <div className="bg-zinc-950 rounded-[2.5rem] border border-zinc-800 p-10 font-mono text-sm min-h-[300px] shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-5">
                  <TerminalIcon className="w-48 h-48 text-white rotate-12" />
               </div>
               <div className="flex items-center gap-3 mb-8 text-[11px] uppercase font-black tracking-[0.3em] text-zinc-500 border-b border-zinc-900 pb-4">
                  <TerminalIcon className="w-4 h-4 text-primary" />
                  Hypervisor trace stream
               </div>
               <div className="space-y-2 relative z-10">
                  {output.length === 0 && !isExecuting && (
                    <p className="text-zinc-600 italic animate-pulse">Waiting for execution context...</p>
                  )}
                  {output.map((line, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={cn(
                        "flex gap-4 group",
                        line.includes('[error]') ? "text-red-400" : 
                        line.includes('[system]') ? "text-zinc-600" : 
                        "text-emerald-400 font-bold"
                      )}
                    >
                      <span className="opacity-10 select-none w-6 group-hover:opacity-30 transition-opacity">{(i+1).toString().padStart(2, '0')}</span>
                      <span>{line}</span>
                    </motion.div>
                  ))}
                  {isExecuting && (
                    <div className="flex items-center gap-3 text-primary font-black py-4 animate-pulse">
                       <div className="w-2 h-2 bg-primary rounded-full animate-ping" />
                       ALLOCATING KERNAL SHM SEGMENTS...
                    </div>
                  )}
               </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-24 pb-20 animate-in fade-in duration-700">
      <div className="max-w-4xl space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-2xl text-[10px] font-black uppercase tracking-widest mb-4">
          <TerminalIcon className="w-4 h-4" />
          Execution Playground
        </div>
        <h2 className="page-heading">
          Build Your <br />
          <span className="text-primary italic">Sandbox</span>
        </h2>
        <p className="text-lg text-muted-foreground font-medium max-w-2xl leading-relaxed">
          The central hub for code experimentation. Choose an algorithm pattern to load its multi-lang boilerplate or start with a clean slate.
        </p>
      </div>

      <div className="space-y-32">
        {categories.map((cat) => (
          <div key={cat.id} className="space-y-12">
            <div className="space-y-2">
              <h3 className="uppercase group flex items-center gap-4">
                <div className="w-2 h-10 bg-primary rounded-full group-hover:h-12 transition-all" />
                {cat.title}
              </h3>
              <p className="text-muted-foreground font-medium">{cat.subtitle}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {ALGORITHMS.filter(a => a.category === cat.id).map((algo, i) => (
                <motion.button
                  key={algo.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => {
                    setSelectedAlgo(algo.id);
                    setOutput([]);
                  }}
                  className="group relative flex flex-col items-start p-8 sm:p-10 bg-card border border-border rounded-[2.5rem] hover:border-primary transition-all text-left shadow-sm hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-2 overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-all pointer-events-none">
                    <cat.icon className="w-32 h-32 text-primary" />
                  </div>
                  
                  <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mb-10 group-hover:bg-primary transition-colors duration-500">
                     <cat.icon className="w-8 h-8 text-foreground group-hover:text-background" />
                  </div>

                  <div className="space-y-4 relative z-10">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary opacity-60">
                      Project Path {i + 1}
                    </span>
                    <h3 className="font-black tracking-tight leading-none group-hover:text-primary transition-colors">
                      {algo.title}
                    </h3>
                    <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                      Initialize boilerplate in C, C++, Python or Java.
                    </p>
                  </div>

                  <div className="mt-8 pt-8 border-t border-border/50 w-full flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">
                      Open Sandbox
                    </span>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors group-hover:translate-x-1" />
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
