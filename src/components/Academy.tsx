import { useState, useEffect } from "react";
import { ALGORITHMS } from "../constants";
import { AlgorithmType } from "../types";
import { Simulator } from "./Simulator";
import { Terminal as TerminalComponent } from "./Terminal";
import { ALGO_CODE_TEMPLATES, getDefaultTemplate } from "../data/codeTemplates";
import { 
  ChevronLeft, 
  BookOpen, 
  Zap, 
  Terminal, 
  ShieldCheck, 
  Cpu,
  Star,
  Binary,
  Code2,
  Layers
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";

export function Academy() {
  const [selectedAlgo, setSelectedAlgo] = useState<AlgorithmType | null>(null);
  const [selectedLang, setSelectedLang] = useState<string>("c");
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);

  const categories = [
    { id: 'software', title: 'Synchronization Algorithms (Software)', subtitle: 'Logic-based solutions without special hardware support.' },
    { id: 'mechanism', title: 'Higher-Level Synchronization Mechanisms', subtitle: 'Abstract tools provided by operating systems and compilers.' },
    { id: 'problem', title: 'Classical Synchronization Problems', subtitle: 'Standard coordination challenges using the above tools.' },
    { id: 'hardware', title: 'Synchronization Algorithms (Hardware)', subtitle: 'Atomic instructions provided by modern CPU architectures.' },
  ];

  useEffect(() => {
    if (selectedAlgo) {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [selectedAlgo]);

  if (selectedAlgo) {
    const data = ALGORITHMS.find(a => a.id === selectedAlgo)!;
    
    // Mark as read for quiz unlocking
    const savedRead = localStorage.getItem('concepts_read');
    const readList = savedRead ? JSON.parse(savedRead) : [];
    if (!readList.includes(selectedAlgo)) {
      localStorage.setItem('concepts_read', JSON.stringify([...readList, selectedAlgo]));
    }

    return (
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-12 pb-20"
      >
        <div className="flex items-center justify-between">
          <button 
            onClick={() => setSelectedAlgo(null)}
            className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors group px-6 py-3 bg-secondary/30 rounded-2xl border border-border"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Algorithm Registry
          </button>
          <div className="text-[10px] font-black uppercase tracking-widest text-primary/50">
            Academy / <span className="text-foreground">{data.title}</span>
          </div>
        </div>

        <section className="grid grid-cols-1 xl:grid-cols-12 gap-12 sm:gap-16">
          <div className="xl:col-span-12 space-y-8 mb-8 border-b-4 border-foreground pb-12">
             <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-2xl text-[11px] font-black uppercase tracking-widest border border-primary/20">
                <BookOpen className="w-4 h-4" />
                Technical Specification v2.0
             </div>
             <h1 className="page-heading mb-6">
                {data.title}
             </h1>
             <p className="text-xl sm:text-2xl text-muted-foreground font-medium leading-tight max-w-4xl">
                {data.description}
             </p>
          </div>

          <div className="xl:col-span-4 space-y-10">
            <div className="grid grid-cols-1 gap-4">
              {data.properties.map((prop, i) => (
                <div key={i} className="p-8 bg-card border border-border rounded-[2.5rem] space-y-2 group transition-all hover:border-primary shadow-sm">
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary opacity-60">
                    {prop.label}
                  </span>
                  <p className="text-2xl font-black text-foreground">
                    {prop.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-zinc-950 text-white rounded-[3rem] p-10 space-y-8 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                  <ShieldCheck className="w-48 h-48" />
               </div>
               <div className="flex items-center gap-3 text-primary relative z-10">
                  <ShieldCheck className="w-6 h-6" />
                  <span className="text-xs font-black uppercase tracking-[0.2em]">Safety Verification</span>
               </div>
               <div className="space-y-6 relative z-10">
                  <div className="flex gap-4">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0" />
                    <p className="text-sm font-medium text-zinc-400 leading-relaxed uppercase tracking-wide">Mutual Exclusion: Correct execution prevents atomic interleaving.</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0" />
                    <p className="text-sm font-medium text-zinc-400 leading-relaxed uppercase tracking-wide">Bounded Wait: No process waits indefinitely for context grant.</p>
                  </div>
               </div>
            </div>
          </div>

          <div className="xl:col-span-8 space-y-8">
            <div className="bg-secondary/20 border-2 border-primary/20 rounded-[3.5rem] p-4 shadow-[0_40px_100px_rgba(0,0,0,0.5)] overflow-hidden group relative">
              <div className="bg-background rounded-[3rem] overflow-hidden border border-border/50 shadow-inner">
                <Simulator lockedAlgo={selectedAlgo} hideAlgoSelection={true} />
              </div>
            </div>
            
            <div className="bg-card border border-border rounded-[3rem] p-10 space-y-6">
               <div className="flex items-center justify-between border-b border-border pb-6">
                  <h3 className="font-black tracking-tight uppercase flex items-center gap-3">
                    <Code2 className="w-6 h-6 text-primary" />
                    Pseudocode Implementation
                  </h3>
               </div>
               <div className="bg-zinc-950 rounded-3xl p-8 overflow-hidden font-mono text-sm shadow-xl">
                  <pre className="text-primary/90 leading-loose scrollbar-hide overflow-x-auto">
                    <code>{data.pseudocode}</code>
                  </pre>
               </div>
            </div>
          </div>
        </section>
      </motion.div>
    );
  }

  return (
    <div className="space-y-24 pb-20 animate-in fade-in duration-700">
      <div className="max-w-4xl space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-2xl text-[10px] font-black uppercase tracking-widest mb-4">
          <Cpu className="w-4 h-4" />
          Algorithm Academy
        </div>
        <h2 className="page-heading">
          Master Your <br />
          <span className="text-primary italic">Synchronization</span>
        </h2>
        <p className="text-xl text-muted-foreground font-medium max-w-2xl leading-relaxed">
          Comprehensive curriculum covering software logic, kernel primitives, classical problems, and hardware-level atomicity.
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
                  onClick={() => setSelectedAlgo(algo.id)}
                  className="group relative flex flex-col items-start p-8 sm:p-10 bg-card border border-border rounded-[2.5rem] hover:border-primary transition-all text-left shadow-sm hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-2 overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-all pointer-events-none">
                    <Star className="w-32 h-32 text-primary" />
                  </div>
                  
                  <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mb-10 group-hover:bg-primary transition-colors duration-500">
                     {cat.id === 'software' && <Code2 className="w-8 h-8 text-foreground group-hover:text-background" />}
                     {cat.id === 'mechanism' && <Cpu className="w-8 h-8 text-foreground group-hover:text-background" />}
                     {cat.id === 'problem' && <Star className="w-8 h-8 text-foreground group-hover:text-background" />}
                     {cat.id === 'hardware' && <Binary className="w-8 h-8 text-foreground group-hover:text-background" />}
                  </div>

                  <div className="space-y-4 relative z-10">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary opacity-60">
                      Module {cat.id.charAt(0).toUpperCase()}{i + 1}
                    </span>
                    <h3 className="font-black tracking-tight leading-none group-hover:text-primary transition-colors">
                      {algo.title}
                    </h3>
                    <p className="text-sm font-medium text-muted-foreground leading-relaxed line-clamp-2">
                      {algo.subtitle}
                    </p>
                  </div>

                  <div className="mt-8 pt-8 border-t border-border/50 w-full flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">
                      Enter Module
                    </span>
                    <ShieldCheck className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
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
