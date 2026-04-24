import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { QUIZ_QUESTIONS, QuizLevel } from '../data/quizQuestions';
import { cn } from '../lib/utils';
import { 
  Trophy, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  RotateCcw,
  Star,
  ChevronLeft,
  Brain,
  Zap,
  Target,
  Medal,
  Lock
} from 'lucide-react';

interface QuizProps {
  completedLevels: number[];
  onCompleteLevel: (level: number) => void;
}

export function Quiz({ completedLevels, onCompleteLevel }: QuizProps) {
  const [level, setLevel] = useState<QuizLevel | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const filteredQuestions = level ? QUIZ_QUESTIONS.filter(q => q.level === level) : [];

  const handleAnswer = (optionIdx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(optionIdx);
    const correct = optionIdx === filteredQuestions[currentIdx].answer;
    setIsCorrect(correct);
    if (correct) setScore(prev => prev + 1);
  };

  const nextQuestion = () => {
    const nextIdx = currentIdx + 1;
    if (nextIdx < filteredQuestions.length) {
      setCurrentIdx(nextIdx);
      setSelectedOption(null);
      setIsCorrect(null);
    } else {
      setShowResult(true);
      // Passing threshold: 70%
      if (score + (isCorrect ? 1 : 0) >= Math.ceil(filteredQuestions.length * 0.7)) {
        onCompleteLevel(level!);
      }
    }
  };

  const resetQuiz = () => {
    setCurrentIdx(0);
    setScore(0);
    setShowResult(false);
    setSelectedOption(null);
    setIsCorrect(null);
    setLevel(null);
  };

  if (!level) {
    const levels: { id: QuizLevel; title: string, desc: string, icon: any, color: string }[] = [
      { id: 1, title: 'Beginner', desc: 'Sync fundamentals, race conditions, and basic concepts.', icon: Target, color: 'bg-emerald-500' },
      { id: 2, title: 'Intermediate', desc: 'Semaphores, Mutex, and classical sync problems.', icon: Zap, color: 'bg-amber-500' },
      { id: 3, title: 'High Level', desc: 'Advanced deadlock analysis and hardware mechanisms.', icon: Medal, color: 'bg-primary' },
    ];

    return (
      <div className="space-y-12">
        <div className="max-w-3xl space-y-4">
          <h2 className="page-heading">
            Interactive <br />
            <span className="text-primary italic">Sync Quiz</span>
          </h2>
          <p className="text-base text-muted-foreground font-medium max-w-xl">
            Test your knowledge across three progressive levels of operating system process synchronization.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
          {levels.map((l) => {
            const isUnlocked = l.id === 1 || completedLevels.includes(l.id - 1);
            const isCompleted = completedLevels.includes(l.id);

            return (
              <button
                key={l.id}
                disabled={!isUnlocked}
                onClick={() => setLevel(l.id)}
                className={cn(
                  "group p-8 border rounded-[2.5rem] transition-all text-left flex flex-col gap-6 relative overflow-hidden h-full",
                  isUnlocked 
                    ? "bg-card border-border hover:border-primary hover:shadow-xl hover:-translate-y-1" 
                    : "bg-secondary/20 border-transparent opacity-60 grayscale cursor-not-allowed"
                )}
              >
                {!isUnlocked && (
                  <div className="absolute inset-0 bg-background/50 backdrop-blur-[2px] flex items-center justify-center z-10">
                     <Lock className="w-10 h-10 text-muted-foreground/30" />
                  </div>
                )}
                
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg", 
                  isUnlocked ? l.color : "bg-muted-foreground/20"
                )}>
                  <l.icon className="w-6 h-6" />
                </div>
                
                <div>
                  <h3 className="text-2xl font-black uppercase tracking-tight mb-2 flex items-center gap-2">
                    {l.id}. {l.title}
                    {isCompleted && <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />}
                  </h3>
                  <p className="text-sm text-muted-foreground font-medium leading-relaxed">{l.desc}</p>
                </div>

                <div className="mt-auto pt-6 flex items-center justify-between">
                  <span className={cn(
                    "text-[10px] font-black uppercase tracking-widest",
                    isUnlocked ? "text-primary" : "text-muted-foreground"
                  )}>
                    {isCompleted ? "Retry Level" : isUnlocked ? "Start Quiz" : "Locked"}
                  </span>
                  <ArrowRight className={cn(
                    "w-4 h-4 transition-transform",
                    isUnlocked ? "text-primary group-hover:translate-x-1" : "text-muted-foreground"
                  )} />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  const progress = ((currentIdx + 1) / filteredQuestions.length) * 100;

  if (showResult) {
    const passed = score >= Math.ceil(filteredQuestions.length * 0.7);

    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto py-12"
      >
        <div className="bg-card border-2 border-border rounded-[3.5rem] p-12 text-center shadow-2xl space-y-8 relative overflow-hidden">
          <div className={cn(
            "w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl",
            passed ? "bg-emerald-500 text-white" : "bg-destructive text-white"
          )}>
            {passed ? <Trophy className="w-12 h-12" /> : <Brain className="w-12 h-12" />}
          </div>
          
          <div>
            <h2 className="text-5xl font-black tracking-tighter mb-2">
              {passed ? "Level Cleared!" : "Keep Studying"}
            </h2>
            <p className="text-muted-foreground uppercase tracking-widest text-xs font-black">
              Result for: <span className="text-primary">{level === 1 ? 'Beginner' : level === 2 ? 'Intermediate' : 'High Level'}</span>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="p-8 bg-secondary/50 rounded-3xl border border-border">
              <span className="text-[10px] font-black text-muted-foreground uppercase block mb-2">Correct Answers</span>
              <span className="text-5xl font-black text-primary">{score} / {filteredQuestions.length}</span>
            </div>
            <div className="p-8 bg-secondary/50 rounded-3xl border border-border text-left">
              <span className="text-[10px] font-black text-muted-foreground uppercase block mb-2">Requirement</span>
              <p className="font-bold leading-tight">
                {passed 
                  ? "Congratulations! You've mastered this level." 
                  : `You need at least ${Math.ceil(filteredQuestions.length * 0.7)} correct answers to pass.`}
              </p>
            </div>
          </div>

          <button
            onClick={resetQuiz}
            className="w-full py-5 bg-foreground text-background rounded-2xl font-black uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-3"
          >
            <RotateCcw className="w-5 h-5" />
            Back to Quiz Menu
          </button>
        </div>
      </motion.div>
    );
  }

  const question = filteredQuestions[currentIdx];

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setLevel(null)}
            className="w-12 h-12 bg-secondary border border-border rounded-2xl flex items-center justify-center hover:bg-accent transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-muted-foreground" />
          </button>
          <div className="h-10 w-[2px] bg-border mx-2" />
          <div>
            <h1 className="text-3xl font-black tracking-tight">{level === 1 ? 'Beginner' : level === 2 ? 'Intermediate' : 'High Level'}</h1>
            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest leading-none">Question {currentIdx + 1} of {filteredQuestions.length}</p>
          </div>
        </div>
        <div className="text-right">
           <span className="text-[10px] font-black text-muted-foreground uppercase block mb-1">Score</span>
           <div className="px-4 py-2 bg-primary/10 rounded-xl border border-primary/20 text-xl font-black text-primary">
              {score}
           </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-primary"
            animate={{ width: `${progress}%` }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-card border border-border rounded-[2.5rem] p-10 sm:p-12 shadow-sm relative overflow-hidden"
          >
            <h2 className="text-2xl sm:text-3xl font-black mb-12 leading-tight tracking-tight">
              {question.question}
            </h2>

            <div className="grid grid-cols-1 gap-4">
              {question.options.map((option, idx) => (
                <button
                  key={idx}
                  disabled={selectedOption !== null}
                  onClick={() => handleAnswer(idx)}
                  className={cn(
                    "w-full text-left p-6 rounded-2xl border-2 transition-all flex items-center justify-between group",
                    selectedOption === null 
                      ? "border-border hover:border-primary/50 hover:bg-secondary/50" 
                      : idx === question.answer
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-700"
                      : selectedOption === idx
                      ? "border-destructive bg-destructive/10 text-destructive"
                      : "border-border opacity-40"
                  )}
                >
                  <span className="font-bold text-lg">{option}</span>
                  {selectedOption !== null && idx === question.answer && <CheckCircle2 className="w-6 h-6 text-emerald-500" />}
                  {selectedOption === idx && idx !== question.answer && <XCircle className="w-6 h-6 text-destructive" />}
                </button>
              ))}
            </div>

            <div className="mt-12 flex justify-end">
              {selectedOption !== null && (
                <button
                  onClick={nextQuestion}
                  className="px-10 py-5 bg-primary text-primary-foreground rounded-2xl font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-xl shadow-primary/20 flex items-center gap-3"
                >
                  {currentIdx === filteredQuestions.length - 1 ? "Finish Level" : "Next Question"}
                  <ArrowRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
