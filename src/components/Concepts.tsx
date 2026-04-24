import { useState } from "react";
import { ALGORITHMS } from "../constants";
import {
  SYNCHRONIZATION_THEORY,
  SYNCHRONIZATION_FUNDAMENTALS,
} from "../data/theoryData";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";
import {
  Code2,
  Info,
  CheckCircle2,
  BookOpen,
  Star,
  Shield,
  ArrowRight,
  ChevronLeft,
} from "lucide-react";

export function Concepts() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  const selected = selectedId ? ALGORITHMS.find((a) => a.id === selectedId)! : null;

  if (selected) {
    return (
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-12 pb-20"
      >
        <div className="flex items-center justify-between">
          <button 
            onClick={() => setSelectedId(null)}
            className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors group px-6 py-3 bg-secondary/30 rounded-2xl border border-border"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Pillars
          </button>
          <div className="text-[10px] font-black uppercase tracking-widest text-primary/50">
            Concepts / <span className="text-foreground">{selected.title}</span>
          </div>
        </div>

        <section className="bg-zinc-950 text-white rounded-[3rem] p-8 sm:p-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-[0.05] hidden sm:block pointer-events-none">
            <Shield className="w-64 h-64 text-primary" />
          </div>

          <div className="relative z-10 space-y-12">
            <div className="space-y-6">
              <span className="text-xs font-black uppercase tracking-[0.3em] text-primary">Algorithm Kernel v1.0</span>
              <h1 className="text-4xl sm:text-7xl font-black tracking-tighter uppercase leading-none">
                {selected.title}
              </h1>
              <div className="flex flex-wrap gap-3">
                {selected.properties.map((prop, i) => (
                  <div key={i} className="px-6 py-3 bg-white/5 rounded-2xl border border-white/10">
                    <span className="text-[9px] font-black text-primary uppercase block mb-1 tracking-widest">{prop.label}</span>
                    <span className="text-sm font-bold text-white/90">{prop.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-20">
              <div className="space-y-10">
                <p className="text-xl sm:text-2xl text-zinc-400 font-medium leading-tight">
                  {selected.description}
                </p>
                <div className="bg-primary/10 p-10 rounded-[3rem] border border-primary/20 space-y-6">
                  <h5 className="text-sm font-black uppercase tracking-widest text-primary italic flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    Formal Correctness
                  </h5>
                  <ul className="space-y-4 text-sm font-bold text-zinc-300">
                    <li className="flex items-center gap-4">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Mutual Exclusion Guaranteed
                    </li>
                    <li className="flex items-center gap-4">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Progress Property Satisfied
                    </li>
                    <li className="flex items-center gap-4">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Deadlock-Free Logic Path
                    </li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Code2 className="w-4 h-4 text-primary" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 italic">Instruction Logic</span>
                </div>
                <div className="bg-black/50 rounded-[3rem] p-10 border border-white/5 shadow-inner">
                  <pre className="text-primary/90 font-mono text-sm leading-relaxed overflow-x-auto scrollbar-hide">
                    <code>{selected.pseudocode}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </section>
      </motion.div>
    );
  }

  return (
    <div className="space-y-16 sm:space-y-32 pb-16 sm:pb-32">
      {/* Introduction */}
      <section className="relative px-4 sm:px-6">
        <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-2 bg-primary/10 text-primary border border-primary/20 rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em]"
          >
            <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Curriculum Blueprint
          </motion.div>
          <h2 className="page-heading">
            The Science of <br />
            <span className="text-primary italic">Coordination</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl font-medium">
            Explore the mechanisms that prevent data corruption in concurrent
            systems. From hardware primitives to high-level monitor constructs.
          </p>
        </div>
      </section>

      {/* DETAILED FUNDAMENTALS - Improved Bento Grid */}
      <section className="px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b-4 border-foreground pb-4 sm:pb-6 gap-2">
            <h3 className="uppercase">
              01. Theoretical{" "}
              <span className="text-primary italic">
                Pillars
              </span>
            </h3>
            <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50">
              Core Foundations
            </div>
          </div>

          <div className="flex flex-col gap-10 sm:gap-20">
            {SYNCHRONIZATION_FUNDAMENTALS.map((fundamental, i) => (
              <motion.div
                key={fundamental.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className={cn(
                  "relative group bg-white dark:bg-white/5 border border-border rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-16 transition-all hover:bg-secondary/20 hover:border-primary/40 shadow-sm",
                  fundamental.id === "intro-definition" &&
                    "bg-primary/5 border-primary/20",
                )}
              >
                <div className="flex items-center gap-4 sm:gap-6 mb-6 sm:mb-10">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-foreground text-background rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-500">
                    <fundamental.icon className="w-6 h-6 sm:w-8 sm:h-8" />
                  </div>
                  <div>
                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-0.5 sm:mb-1 block">
                      Level 0{i + 1}
                    </span>
                    <h4 className="text-xl sm:text-2xl font-black tracking-tight">
                      {fundamental.title}
                    </h4>
                  </div>
                </div>

                <p className="text-muted-foreground font-medium text-base sm:text-lg leading-relaxed mb-6 sm:mb-10">
                  {fundamental.content}
                </p>

                {fundamental.subsections && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8 border-t border-border/50">
                    {fundamental.subsections.map((sub, si) => (
                      <div key={si} className="space-y-4">
                        <h5 className="text-[10px] font-black uppercase tracking-widest text-foreground flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                          {sub.title}
                        </h5>
                        <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                          {sub.content}
                        </p>
                        {sub.list && (
                          <div className="space-y-2">
                            {sub.list.map((item, li) => (
                              <div
                                key={li}
                                className="flex gap-3 text-xs bg-muted/30 p-4 rounded-2xl border border-transparent group-hover:border-primary/10 transition-all font-bold italic"
                              >
                                <span className="text-primary">▸</span>
                                {item}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ALGORITHMS SECTION */}
      <section className="px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-12 sm:space-y-20">
          <div className="max-w-2xl">
            <h3 className="uppercase mb-4">
              02. Algorithm{" "}
              <span className="text-primary italic">
                Academy
              </span>
            </h3>
            <p className="text-base sm:text-xl text-muted-foreground font-medium leading-relaxed">
              Explore the formal logic and interaction patterns of classic synchronization 
              mechanisms. Select a kernel to view detailed property analysis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {ALGORITHMS.map((algo) => (
              <button
                key={algo.id}
                onClick={() => setSelectedId(algo.id)}
                className="group relative bg-white dark:bg-white/5 border border-border rounded-[2.5rem] p-10 text-left transition-all hover:bg-secondary/40 hover:border-primary/40 hover:-translate-y-2 shadow-sm"
              >
                <div className="flex flex-col h-full justify-between gap-12">
                  <div className="space-y-4">
                    <div className="w-12 h-12 bg-foreground text-background rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-500">
                      <Code2 className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary mb-1 block">
                        {algo.subtitle}
                      </span>
                      <h4 className="text-2xl font-black tracking-tight">
                        {algo.title}
                      </h4>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-border/50">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">
                      View Documentation
                    </span>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* QUICK REFERENCE SECTION - Gradient Cards */}
      <section className="px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-16 space-y-3 sm:space-y-4">
            <h3 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">
              Rapid{" "}
              <span className="text-primary tracking-normal italic">
                Dictionary
              </span>
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground font-medium">
              Quick comparison of abstract synchronization entities
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {SYNCHRONIZATION_THEORY.map((concept, i) => (
              <motion.div
                key={concept.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="p-6 sm:p-10 bg-card rounded-[2rem] sm:rounded-[3rem] border border-border hover:shadow-2xl hover:shadow-primary/10 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-secondary rounded-xl sm:rounded-2xl flex items-center justify-center mb-6 sm:mb-8 group-hover:bg-primary transition-colors">
                    <concept.icon className="w-5 h-5 sm:w-6 sm:h-6 text-foreground group-hover:text-background" />
                  </div>
                  <h4 className="text-lg sm:text-xl font-black mb-3 sm:mb-4 tracking-tight">
                    {concept.title}
                  </h4>
                  <p className="text-[10px] sm:text-xs text-muted-foreground font-medium leading-relaxed mb-6 sm:mb-8">
                    {concept.description}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {concept.points.slice(0, 2).map((p, j) => (
                    <span
                      key={j}
                      className="px-2 sm:px-3 py-1 bg-muted text-[7px] sm:text-[8px] font-black uppercase rounded-lg group-hover:bg-primary/20 group-hover:text-primary transition-colors"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
