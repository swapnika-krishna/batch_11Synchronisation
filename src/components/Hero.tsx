import { motion } from 'motion/react';
import { Play, ArrowRight, Shield, Zap, Layers, Terminal, Lock, Workflow } from 'lucide-react';

interface HeroProps {
  onStart: () => void;
  onExplore: () => void;
}

export function Hero({ onStart, onExplore }: HeroProps) {
  return (
    <div className="relative isolate pt-14 pb-32 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,theme(colors.primary/5),transparent_70%)]" />
        <div className="absolute top-0 left-0 w-full h-full bg-noise opacity-[0.03] pointer-events-none" />
        
        {/* Animated Orbs */}
        <motion.div 
          animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 left-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ x: [0, -100, 0], y: [0, -50, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 right-20 w-[30rem] h-[30rem] bg-indigo-500/10 rounded-full blur-[140px]" 
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/50 dark:bg-white/5 border border-primary/20 backdrop-blur-md mb-6 sm:mb-10 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">v2.0 Logic Kernel Ready</span>
            </div>
            
            <h1 className="mb-6 sm:mb-10 text-foreground uppercase hero-heading text-balance">
              Sync <span className="relative inline-block text-primary italic-serif">
                Better
              </span> <br />
              Master Concurrency
            </h1>

            <p className="mt-6 sm:mt-10 text-base sm:text-xl leading-relaxed text-muted-foreground font-medium max-w-2xl mx-auto">
              A high-fidelity visual laboratory for exploring how Operating Systems manage 
              <span className="text-foreground"> race conditions</span>, 
              <span className="text-foreground"> semaphores</span>, and 
              <span className="text-foreground"> monitors</span>.
            </p>

            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onStart}
                className="group relative w-full sm:w-auto px-10 py-5 bg-foreground text-background rounded-3xl font-black text-lg overflow-hidden shadow-2xl transition-all"
              >
                <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                <span className="relative flex items-center justify-center gap-3 group-hover:text-foreground">
                  <Terminal className="w-5 h-5 shrink-0" />
                  Boot Simulator
                </span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
                onClick={onExplore}
                className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 rounded-3xl font-black text-lg border-2 border-border bg-background/50 backdrop-blur-sm hover:border-primary transition-all"
              >
                Study Theory
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Feature Bento Grid Highlights */}
        <div className="mt-40 grid grid-cols-1 md:grid-cols-12 gap-6 px-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="md:col-span-8 p-10 rounded-[3rem] bg-card/40 backdrop-blur-xl border border-border shadow-xl hover:shadow-primary/5 transition-all relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
              <Workflow className="w-64 h-64 text-primary" />
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-8">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="mb-4">Atomic Visual Kernel</h3>
              <p className="text-muted-foreground max-w-xl">
                Watch process execution instruction-by-instruction. Understand how context switching leads to data inconsistency without proper locking.
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="md:col-span-4 p-10 rounded-[3rem] bg-primary text-primary-foreground shadow-2xl shadow-primary/20 relative overflow-hidden group"
          >
             <div className="absolute -bottom-10 -right-10 opacity-20">
                <Lock className="w-48 h-48" />
             </div>
             <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-24 backdrop-blur-md">
                   <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                   <h3 className="mb-3 text-white">Mutual Exclusion</h3>
                   <p className="text-primary-foreground/80 font-medium">
                     Guaranteed safety for your shared state through automated monitor constructs.
                   </p>
                </div>
             </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
