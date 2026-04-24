import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Concepts } from './components/Concepts';
import { Quiz } from './components/Quiz';
import { Playground } from './components/Playground';
import { Academy } from './components/Academy';
import { cn } from './lib/utils';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'concepts' | 'academy' | 'playground' | 'quiz'>('home');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);

  useEffect(() => {
    // Scroll to top on tab change
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [activeTab]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  // Load progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('quiz_progress');
    if (saved) {
      setCompletedLevels(JSON.parse(saved));
    }
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const markLevelComplete = (level: number) => {
    const updated = Array.from(new Set([...completedLevels, level]));
    setCompletedLevels(updated);
    localStorage.setItem('quiz_progress', JSON.stringify(updated));
  };

  return (
    <div className={cn("min-h-screen bg-background text-foreground transition-colors duration-300 selection:bg-primary selection:text-primary-foreground font-sans", theme ==='dark' ? 'dark' : '')}>
      
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        theme={theme} 
        toggleTheme={toggleTheme} 
      />
      
      <main className="container mx-auto px-4 pt-24 pb-20 sm:pt-48 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "circOut" }}
          >
            {activeTab === 'home' && (
              <Hero 
                onStart={() => setActiveTab('concepts')} 
                onExplore={() => setActiveTab('academy')} 
              />
            )}
            {activeTab === 'concepts' && <Concepts />}
            {activeTab === 'academy' && <Academy />}
            {activeTab === 'playground' && <Playground />}
            {activeTab === 'quiz' && (
              <Quiz 
                completedLevels={completedLevels} 
                onCompleteLevel={markLevelComplete} 
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="border-t border-border/50 py-12 mt-auto bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-1.5 bg-primary/10 rounded-full border border-primary/20">
               <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
               <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">System Operational</span>
            </div>
            <div className="text-center space-y-1">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">© 2026 SyncMaster Protocol</p>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/80">
                Built by <span className="text-foreground">Batch 11</span>
              </p>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
                Academic Direction: <span className="text-foreground/80">Prof. Mr. P. Venkata Rajulu</span>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
