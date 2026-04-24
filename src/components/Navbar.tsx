import { 
  Sun, 
  Moon, 
  Cpu, 
  BookOpen, 
  Layers,
  HelpCircle,
  Code2
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

export function Navbar({ activeTab, setActiveTab, theme, toggleTheme }: NavbarProps) {
  const tabs = [
    { id: 'home', label: 'Home', icon: Cpu },
    { id: 'concepts', label: 'Theory', icon: BookOpen },
    { id: 'academy', label: 'Algorithms', icon: Layers },
    { id: 'playground', label: 'Sandbox', icon: Code2 },
    { id: 'quiz', label: 'Quiz', icon: HelpCircle },
  ];

  return (
    <nav className="fixed top-2 sm:top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-[98%] sm:max-w-7xl px-2 sm:px-4 pointer-events-none">
      <div className="bg-background/60 backdrop-blur-2xl border border-white/20 dark:border-white/5 h-16 sm:h-20 rounded-[2rem] sm:rounded-[2.5rem] flex items-center justify-between px-4 sm:px-10 shadow-2xl shadow-black/10 pointer-events-auto relative overflow-hidden">
        <div className="absolute inset-0 bg-noise opacity-[0.02] pointer-events-none" />
        
        <div 
          className="flex items-center gap-2 sm:gap-4 cursor-pointer group shrink-0"
          onClick={() => setActiveTab('home')}
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-foreground dark:bg-primary rounded-xl sm:rounded-2xl flex items-center justify-center transform group-hover:rotate-[15deg] transition-all duration-500 shadow-xl">
            <Cpu className="w-5 h-5 sm:w-6 sm:h-6 text-background dark:text-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-lg sm:text-xl tracking-tighter hidden xs:block leading-none uppercase">
              Sync<span className="text-primary italic">Lab</span>
            </span>
            <span className="text-[7px] sm:text-[8px] font-black tracking-[0.3em] uppercase text-muted-foreground hidden sm:block pt-1 opacity-50">
              Kernel v2.4
            </span>
          </div>
        </div>

        <div className="flex items-center p-1 sm:p-1.5 bg-secondary/30 rounded-[2rem] sm:rounded-[4rem] rounded-tl-[3.5rem] rounded-br-[3.5rem] backdrop-blur-xl border border-white/10 mx-2 sm:mx-4 overflow-x-auto scrollbar-hide shrink min-w-0 shadow-inner ring-1 ring-white/5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "relative flex items-center gap-2 px-3 sm:px-6 py-2 sm:py-2.5 rounded-[1rem] sm:rounded-[1.25rem] text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all duration-300 whitespace-nowrap",
                activeTab === tab.id 
                  ? "bg-foreground text-background dark:bg-primary dark:text-foreground shadow-2xl shadow-black/20" 
                  : "text-muted-foreground hover:text-foreground hover:bg-white/10"
              )}
            >
              <tab.icon className={cn("w-3.5 h-3.5 sm:w-4 sm:h-4", activeTab === tab.id ? "animate-pulse" : "")} />
              <span className="hidden md:block lg:block">{tab.label}</span>
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute inset-0 bg-primary/20 rounded-[1rem] sm:rounded-[1.25rem] -z-10 blur-sm"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <button
            onClick={toggleTheme}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-secondary/50 border border-white/20 flex items-center justify-center hover:bg-primary/20 transition-all group active:scale-90"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 group-hover:rotate-45 transition-transform duration-500" />
            ) : (
              <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700 group-hover:rotate-[30deg] transition-transform duration-500" />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
