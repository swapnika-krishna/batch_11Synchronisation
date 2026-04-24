import { useState, useEffect, useRef, useCallback } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Settings2,
  Activity,
  History as HistoryIcon,
  Lock as LockIcon,
  AlertCircle,
  CheckCircle2,
  Clock,
  Shield,
  Terminal,
  Zap,
  Layers,
  Star,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";
import { AlgorithmType, SimulationState, Process } from "../types";
import { COLORS, ALGORITHMS } from "../constants";

interface SimulatorProps {
  lockedAlgo?: AlgorithmType;
  hideAlgoSelection?: boolean;
}

export function Simulator({ lockedAlgo, hideAlgoSelection }: SimulatorProps) {
  const [algo, setAlgo] = useState<AlgorithmType>(lockedAlgo || "mutex");

  useEffect(() => {
    if (lockedAlgo) {
      setAlgo(lockedAlgo);
    }
  }, [lockedAlgo]);
  const [processCount, setProcessCount] = useState(4);
  const [burstTime, setBurstTime] = useState(3);
  const [speed, setSpeed] = useState(1);
  const [targetExecs, setTargetExecs] = useState(1);

  const [state, setState] = useState<SimulationState>({
    time: 0,
    processes: [],
    queue: [],
    criticalSection: [],
    ganttData: [],
    logs: ["Simulation initialized."],
    isRunning: false,
    isPaused: false,
    isFinished: false,
    speed: 1,
    algorithm: "mutex",
    stats: {
      totalWaitTime: 0,
      completedCount: 0,
      csEntries: 0,
    },
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const initProcesses = useCallback(() => {
    const countMap: Record<string, number> = {
      peterson: 2,
      dekker: 2,
      dining: 5,
    };
    let count = countMap[algo] || processCount;

    const newProcesses: Process[] = Array.from({ length: count }, (_, i) => {
      let role: string = "";
      if (algo === "prodcons") {
        role = i < 2 ? " (Producer)" : " (Consumer)";
      } else if (algo === "dining") {
        role = ` (Philo ${i})`;
      } else if (algo === "rw") {
        role = i < 2 ? " (Writer)" : " (Reader)";
      }

      return {
        id: i,
        state: "idle",
        color: COLORS[i % COLORS.length],
        waitTime: 0,
        burstTime: algo === "dining" ? 4 : burstTime + (Math.random() * 2 - 1),
        remainingTime: 0,
        progress: 0,
        completedExecutions: 0,
        targetExecutions: targetExecs,
      };
    });

    let algoState: any = {};
    if (algo === "peterson") {
      algoState = { turn: 0, flag: [false, false] };
    } else if (algo === "semaphore") {
      algoState = { mutex: 1 };
    } else if (algo === "prodcons") {
      algoState = { mutex: 1, empty: 5, full: 0, buffer: [], bufferSize: 5 };
    } else if (algo === "dining") {
      algoState = {
        forks: [true, true, true, true, true],
        philosopherStates: [
          "thinking",
          "thinking",
          "thinking",
          "thinking",
          "thinking",
        ],
      };
    } else if (algo === "rw") {
      algoState = { readcount: 0, mutex: 1, wrt: 1 };
    }

    setState((prev) => ({
      ...prev,
      time: 0,
      processes: newProcesses,
      queue: [],
      criticalSection: [],
      ganttData: [],
      logs: [`Initialized ${algo} simulation.`],
      isRunning: false,
      isPaused: false,
      isFinished: false,
      algorithm: algo,
      algoSpecificState: algoState,
      stats: {
        totalWaitTime: 0,
        completedCount: 0,
        csEntries: 0,
      },
    }));
  }, [algo, processCount, burstTime, targetExecs]);

  useEffect(() => {
    initProcesses();
  }, [initProcesses]);

  const addLog = (msg: string) => {
    setState((prev) => ({
      ...prev,
      logs: [msg, ...prev.logs].slice(0, 50),
    }));
  };

  const tick = useCallback(() => {
    setState((prev) => {
      if (prev.isPaused || !prev.isRunning) return prev;

      const nextTime = prev.time + 0.1 * speed;
      let nextProcesses = [...prev.processes];
      let nextQueue = [...prev.queue];
      let nextCS = [...prev.criticalSection];
      let nextGantt = [...prev.ganttData];
      let nextStats = { ...prev.stats };
      let logs = [...prev.logs];
      let nextAlgoState = { ...prev.algoSpecificState };

      // 1. Update existing processes
      nextProcesses = nextProcesses.map((p) => {
        if (p.state === "waiting") {
          return { ...p, waitTime: p.waitTime + 0.1 * speed };
        }
        if (p.state === "running") {
          const newRemaining = Math.max(0, p.remainingTime - 0.1 * speed);
          const progress = ((p.burstTime - newRemaining) / p.burstTime) * 100;
          return { ...p, remainingTime: newRemaining, progress };
        }
        return p;
      });

      // 2. State machine transitions
      nextProcesses = nextProcesses.map((p) => {
        if (p.state === "idle" && p.completedExecutions < p.targetExecutions) {
          // Probability of requesting access - slightly increased and scaled
          if (Math.random() < 0.05 * speed) {
            const msg = `P${p.id} requesting access...`;
            if (!logs.includes(msg)) logs = [msg, ...logs].slice(0, 50);
            return { ...p, state: "waiting" };
          }
        }
        return p;
      });

      // 3. Algorithm-specific logic for entering CS
      const waitingProcesses = nextProcesses.filter(
        (p) => p.state === "waiting",
      );

      waitingProcesses.forEach((p) => {
        let canEnter = false;

        switch (prev.algorithm) {
          case "mutex":
          case "monitor":
          case "condition":
          case "tas":
          case "cas":
          case "swap":
          case "faa":
          case "llsc":
          case "bakery":
            if (nextCS.length === 0) {
              canEnter = true;
              const typeLabel =
                prev.algorithm === "monitor"
                  ? "Monitor access"
                  : prev.algorithm === "bakery"
                    ? "lowest Ticket"
                    : "Atomic Lock";
              logs = [
                `P${p.id} acquires ${typeLabel} -> enters CS`,
                ...logs,
              ].slice(0, 50);
            }
            break;

          case "peterson":
          case "dekker":
            const i = p.id;
            const j = 1 - i;
            if (nextAlgoState.flag && !nextAlgoState.flag[i]) {
              nextAlgoState.flag[i] = true;
              nextAlgoState.turn = j;
              logs = [`P${i} sets flag[${i}]=true, turn=${j}`, ...logs].slice(
                0,
                50,
              );
            }
            if (
              nextAlgoState.flag &&
              nextAlgoState.flag[i] &&
              (nextAlgoState.turn === i || !nextAlgoState.flag[j])
            ) {
              canEnter = true;
              logs = [`P${i} enters CS (priority check passed)`, ...logs].slice(
                0,
                50,
              );
            }
            break;

          case "semaphore":
            if (nextCS.length < 1) {
              // Binary semaphore simulation based on user request
              canEnter = true;
              logs = [`P${p.id} -> wait(S) -> S=0 -> enters CS`, ...logs].slice(
                0,
                50,
              );
            }
            break;

          case "prodcons":
            const isProducer = p.id < 2;
            if (isProducer) {
              if (nextAlgoState.empty! > 0 && nextAlgoState.mutex! === 1) {
                nextAlgoState.empty!--;
                nextAlgoState.mutex! = 0;
                canEnter = true;
                logs = [
                  `Producer P${p.id} producing... (empty=${nextAlgoState.empty})`,
                  ...logs,
                ].slice(0, 50);
              }
            } else {
              // Consumer
              if (nextAlgoState.full! > 0 && nextAlgoState.mutex! === 1) {
                nextAlgoState.full!--;
                nextAlgoState.mutex! = 0;
                canEnter = true;
                logs = [
                  `Consumer P${p.id} consuming... (full=${nextAlgoState.full})`,
                  ...logs,
                ].slice(0, 50);
              }
            }
            break;

          case "dining":
            const pId = p.id;
            const leftFork = pId;
            const rightFork = (pId + 1) % 5;
            if (
              nextAlgoState.forks![leftFork] &&
              nextAlgoState.forks![rightFork]
            ) {
              nextAlgoState.forks![leftFork] = false;
              nextAlgoState.forks![rightFork] = false;
              canEnter = true;
              logs = [
                `Philo P${pId} picks up forks ${leftFork} and ${rightFork} -> starts eating`,
                ...logs,
              ].slice(0, 50);
            }
            break;

          case "rw":
            const isWriter = p.id < 2;
            if (isWriter) {
              if (nextAlgoState.wrt! === 1 && nextAlgoState.readcount! === 0) {
                nextAlgoState.wrt! = 0;
                canEnter = true;
                logs = [
                  `Writer P${p.id} acquires wrt lock -> writing...`,
                  ...logs,
                ].slice(0, 50);
              }
            } else {
              // Reader
              if (nextAlgoState.wrt! === 1 || nextCS.some((id) => id >= 2)) {
                // If it's the first reader, it must wait for wrt
                if (nextAlgoState.readcount === 0 && nextAlgoState.wrt === 1) {
                  nextAlgoState.wrt = 0; // Lock writers
                  logs = [
                    `Reader P${p.id} is the first reader -> locks writer`,
                    ...logs,
                  ].slice(0, 50);
                }
                nextAlgoState.readcount!++;
                canEnter = true;
                logs = [
                  `Reader P${p.id} enters (total readers: ${nextAlgoState.readcount})`,
                  ...logs,
                ].slice(0, 50);
              }
            }
            break;
        }

        if (canEnter) {
          nextCS.push(p.id);
          nextProcesses = nextProcesses.map((proc) =>
            proc.id === p.id
              ? {
                  ...proc,
                  state: "running",
                  remainingTime: proc.burstTime,
                  progress: 0,
                }
              : proc,
          );
          nextGantt.push({
            processId: p.id,
            start: prev.time,
            end: prev.time,
            color: p.color,
          });
          nextStats.csEntries++;
        }
      });

      // 4. Handle process completion (Exit Section)
      const finishedIds: number[] = [];
      nextProcesses = nextProcesses.map((p) => {
        if (p.state === "running" && p.remainingTime <= 0) {
          finishedIds.push(p.id);
          const nextCompleted = p.completedExecutions + 1;

          // Complete Gantt record
          const lastEntryIdx =
            nextGantt.length -
            1 -
            [...nextGantt].reverse().findIndex((e) => e.processId === p.id);
          if (lastEntryIdx !== -1) {
            nextGantt[lastEntryIdx] = {
              ...nextGantt[lastEntryIdx],
              end: prev.time,
            };
          }

          // EXIT SECTION LOGIC
          switch (prev.algorithm) {
            case "mutex":
              logs = [
                `P${p.id} finishes -> release(lock) -> lock=0`,
                ...logs,
              ].slice(0, 50);
              break;
            case "peterson":
              nextAlgoState.flag![p.id] = false;
              logs = [
                `P${p.id} finishes -> flag[${p.id}]=false`,
                ...logs,
              ].slice(0, 50);
              break;
            case "semaphore":
              logs = [`P${p.id} -> signal(S) -> S=1`, ...logs].slice(0, 50);
              break;
            case "prodcons":
              nextAlgoState.mutex! = 1;
              if (p.id < 2) {
                nextAlgoState.full!++;
                logs = [
                  `Producer P${p.id} finishes -> signal(full) (full=${nextAlgoState.full})`,
                  ...logs,
                ].slice(0, 50);
              } else {
                nextAlgoState.empty!++;
                logs = [
                  `Consumer P${p.id} finishes -> signal(empty) (empty=${nextAlgoState.empty})`,
                  ...logs,
                ].slice(0, 50);
              }
              break;
            case "dining":
              nextAlgoState.forks![p.id] = true;
              nextAlgoState.forks![(p.id + 1) % 5] = true;
              logs = [
                `Philo P${p.id} finishes eating -> releases forks ${p.id} and ${(p.id + 1) % 5}`,
                ...logs,
              ].slice(0, 50);
              break;
            case "rw":
              if (p.id < 2) {
                // Writer
                nextAlgoState.wrt! = 1;
                logs = [
                  `Writer P${p.id} finishes -> releases wrt lock`,
                  ...logs,
                ].slice(0, 50);
              } else {
                // Reader
                nextAlgoState.readcount!--;
                if (nextAlgoState.readcount === 0) {
                  nextAlgoState.wrt! = 1;
                  logs = [
                    `Reader P${p.id} finishes -> last reader -> releases wrt lock`,
                    ...logs,
                  ].slice(0, 50);
                } else {
                  logs = [
                    `Reader P${p.id} finishes (remaining readers: ${nextAlgoState.readcount})`,
                    ...logs,
                  ].slice(0, 50);
                }
              }
              break;
          }

          if (nextCompleted >= p.targetExecutions) {
            return {
              ...p,
              state: "finished",
              completedExecutions: nextCompleted,
              progress: 0,
            };
          }
          return {
            ...p,
            state: "idle",
            completedExecutions: nextCompleted,
            progress: 0,
          };
        }
        return p;
      });

      if (finishedIds.length > 0) {
        nextCS = nextCS.filter((id) => !finishedIds.includes(id));
        nextStats.completedCount += finishedIds.length;
      }

      const trulyFinished = nextProcesses.every((p) => p.state === "finished");

      return {
        ...prev,
        time: nextTime,
        processes: nextProcesses,
        queue: nextQueue,
        criticalSection: nextCS,
        ganttData: nextGantt,
        stats: nextStats,
        logs: trulyFinished
          ? ["Simulation completed successfully.", ...logs].slice(0, 50)
          : logs,
        isRunning: !trulyFinished,
        isFinished: trulyFinished,
        algoSpecificState: nextAlgoState,
      };
    });
  }, [speed]);

  useEffect(() => {
    if (state.isRunning && !state.isPaused) {
      timerRef.current = setInterval(tick, 100);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state.isRunning, state.isPaused, tick]);

  const startSimulation = () => {
    setState((prev) => ({ ...prev, isRunning: true, isPaused: false }));
    addLog("OS Kernel starting simulation...");
  };

  const stopSimulation = () => {
    setState((prev) => ({ ...prev, isRunning: false }));
    addLog("OS Kernel simulation suspended.");
  };

  return (
    <div className="space-y-6 sm:space-y-12">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Sidebar Controls */}
        <div className="xl:col-span-3 space-y-6">
          <div className="bg-card border border-border rounded-[2.5rem] p-8 shadow-sm">
            <h2 className="text-xl font-black mb-6 flex items-center gap-2">
              <Settings2 className="w-5 h-5 text-primary" />
              Configure
            </h2>

            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                    {hideAlgoSelection ? "Active Algorithm" : "Mechanism"}
                  </label>
                  <div className="px-2 py-0.5 bg-primary/10 rounded text-[10px] font-bold text-primary">
                    Live
                  </div>
                </div>
                {!hideAlgoSelection ? (
                  <div className="grid gap-2">
                    {(
                      [
                        "mutex",
                        "peterson",
                        "semaphore",
                        "prodcons",
                        "dining",
                        "rw",
                      ] as AlgorithmType[]
                    ).map((id) => (
                      <button
                        key={id}
                        disabled={state.isRunning}
                        onClick={() => setAlgo(id)}
                        className={cn(
                          "w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all border-2",
                          algo === id
                            ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20"
                            : "border-transparent hover:bg-accent text-muted-foreground",
                        )}
                      >
                        {id === "prodcons"
                          ? "Producer-Consumer"
                          : id === "dining"
                            ? "Dining Philo"
                            : id === "rw"
                              ? "Readers-Writers"
                              : id.charAt(0).toUpperCase() + id.slice(1)}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="px-4 py-3 rounded-xl text-sm font-bold bg-primary/10 border-2 border-primary/20 text-primary">
                    {algo === "prodcons"
                      ? "Producer-Consumer"
                      : algo === "dining"
                        ? "Dining Philo"
                        : algo === "rw"
                          ? "Readers-Writers"
                          : algo.charAt(0).toUpperCase() + algo.slice(1)}
                  </div>
                )}
              </div>

              <div className="space-y-6 pt-4 border-t border-border/50">
                {algo !== "peterson" &&
                  algo !== "dining" &&
                  algo !== "prodcons" && (
                    <div className="space-y-3">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-muted-foreground uppercase tracking-widest">
                          Processes
                        </span>
                        <span className="text-primary">{processCount}</span>
                      </div>
                      <input
                        type="range"
                        min="2"
                        max="6"
                        value={processCount}
                        onChange={(e) =>
                          setProcessCount(parseInt(e.target.value))
                        }
                        disabled={state.isRunning}
                        className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                    </div>
                  )}

                <div className="space-y-3">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-muted-foreground uppercase tracking-widest">
                      Speed
                    </span>
                    <span className="text-primary">{speed}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.25"
                    max="4"
                    step="0.25"
                    value={speed}
                    onChange={(e) => setSpeed(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={state.isRunning ? stopSimulation : startSimulation}
                  className={cn(
                    "w-full py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-xl",
                    state.isRunning
                      ? "bg-red-500 text-white shadow-red-500/20 hover:bg-red-600"
                      : "bg-primary text-primary-foreground shadow-primary/20 hover:scale-[1.02] active:scale-95",
                  )}
                >
                  {state.isRunning ? (
                    <>
                      <Pause className="w-5 h-5 fill-current" />
                      Suspend
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 fill-current" />
                      Simulate
                    </>
                  )}
                </button>

                {state.isFinished && (
                  <button
                    onClick={initProcesses}
                    className="w-full mt-3 py-4 bg-secondary text-secondary-foreground rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-accent transition-all flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Visualization area */}
        <div className="flex flex-col relative overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm xl:col-span-9 min-h-[500px] p-4 lg:p-10 sm:min-h-[700px]">
          <div className="absolute top-0 left-0 w-full h-1 bg-primary/10">
            <motion.div
              className="h-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]"
              animate={{ width: state.isRunning ? "100%" : "0%" }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />
          </div>

          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-2xl">
                <Activity className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-black text-lg tracking-tight uppercase tracking-widest">
                Simulation <span className="text-primary italic">Stage</span>
              </h3>
            </div>

            <div className="flex gap-2">
              {algo === "prodcons" && (
                <div className="flex gap-2">
                  <div className="bg-blue-500/10 text-blue-500 px-4 py-2 rounded-xl text-[10px] font-black border border-blue-500/20 uppercase">
                    Empty: {state.algoSpecificState?.empty}
                  </div>
                  <div className="bg-amber-500/10 text-amber-500 px-4 py-2 rounded-xl text-[10px] font-black border border-amber-500/20 uppercase">
                    Full: {state.algoSpecificState?.full}
                  </div>
                </div>
              )}
              {algo === "rw" && (
                <div className="bg-secondary/50 px-4 py-2 rounded-xl text-[10px] font-black border border-border uppercase tracking-widest text-muted-foreground">
                  Readers:{" "}
                  <span className="text-primary">
                    {state.algoSpecificState?.readcount}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-[180px_1fr] gap-4 relative">
            {/* Dedicated Waiting Lane (Prominent Ready Queue) */}
            <div className="hidden md:flex border-r-2 border-primary/20 bg-primary/5 rounded-[2rem] flex-col items-center py-10 gap-8 relative overflow-hidden shadow-inner">
              <div className="absolute top-0 left-0 w-full h-1 bg-primary/30" />
              <div className="text-[11px] font-black text-primary uppercase tracking-[0.3em] text-center px-4 leading-tight">
                Process <br /> Ready Queue
              </div>

              <div className="flex-1 w-full overflow-y-auto px-4 flex flex-col gap-6 items-center scrollbar-hide py-4">
                <AnimatePresence>
                  {state.processes.filter((p) => p.state === "waiting")
                    .length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex-1 flex flex-col items-center justify-center text-muted-foreground opacity-10"
                    >
                      <Shield className="w-8 h-8" />
                      <span className="text-[8px] font-black uppercase tracking-[0.3em] vertical-text mt-4">
                        Empty
                      </span>
                    </motion.div>
                  ) : (
                    state.processes
                      .filter((p) => p.state === "waiting")
                      .map((p, index) => (
                        <motion.div
                          key={p.id}
                          layout
                          initial={{ opacity: 0, x: -30 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                          className="relative group shrink-0"
                        >
                          <div
                            className="w-14 h-14 rounded-xl flex flex-col items-center justify-center text-white font-black text-[9px] shadow-2xl border-4 border-background relative group"
                            style={{ 
                              backgroundColor: p.color,
                              boxShadow: `0 0 15px ${p.color}33`
                            }}
                          >
                            P{p.id}
                            <div className="absolute inset-0 rounded-[0.9rem] border-2 border-white/20 animate-pulse" />
                          </div>
                          <div className="absolute -right-1 -top-1 bg-amber-500 rounded-full p-1.5 shadow-md border-2 border-background animate-pulse">
                            <Clock className="w-2.5 h-2.5 text-white" />
                          </div>
                        </motion.div>
                      ))
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Main Stage */}
            <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-[2.5rem] bg-secondary/5 border border-border/20">
              {/* Dining Philo Table */}
              {algo === "dining" && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-[320px] h-[320px] rounded-full border-[10px] border-secondary/20 flex items-center justify-center relative">
                    {/* Forks */}
                    {[0, 1, 2, 3, 4].map((idx) => {
                      const angle = (idx / 5) * 2 * Math.PI + Math.PI / 5;
                      const radius = 160;
                      const x = Math.cos(angle) * radius;
                      const y = Math.sin(angle) * radius;
                      const isAvailable = state.algoSpecificState?.forks?.[idx];
                      return (
                        <motion.div
                          key={idx}
                          className="absolute z-40"
                          animate={{
                            x,
                            y,
                            opacity: isAvailable ? 1 : 0.2,
                            rotate: (angle * 180) / Math.PI + 90,
                            scale: isAvailable ? 1.1 : 0.9,
                          }}
                        >
                          <div
                            className={cn(
                              "w-2 h-16 rounded-full shadow-lg",
                              isAvailable ? "bg-primary" : "bg-zinc-500",
                            )}
                          />
                          <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] font-black uppercase text-muted-foreground">
                            {isAvailable ? "Free" : "In Use"}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Central Resource View */}
              <div className="relative w-full max-w-[280px] aspect-square sm:w-[420px] sm:h-[420px] rounded-full border border-border/20 flex items-center justify-center">
                <div className="text-center z-10 space-y-8">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={
                        state.criticalSection.length > 0 ? "occupied" : "empty"
                      }
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="space-y-6"
                    >
                      <div
                        className={cn(
                          "w-40 h-40 sm:w-56 sm:h-56 bg-background border-4 rounded-[2.5rem] flex flex-col items-center justify-center mx-auto shadow-2xl transition-all duration-700 relative overflow-hidden",
                          state.criticalSection.length > 0
                            ? "border-green-500 scale-105"
                            : "border-primary/20",
                        )}
                      >
                        <AnimatePresence mode="wait">
                          {state.criticalSection.length > 0 ? (
                            <motion.div
                              key="active"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              className="flex flex-wrap justify-center gap-3 p-4 z-20"
                            >
                              {state.criticalSection.map((id) => {
                                const p = state.processes.find(
                                  (proc) => proc.id === id,
                                );
                                return (
                                  <motion.div
                                    key={id}
                                    layoutId={`proc-${id}`}
                                    className="relative"
                                  >
                                    <div
                                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl shadow-xl flex flex-col items-center justify-center text-[10px] font-black text-white"
                                      style={{ backgroundColor: p?.color }}
                                    >
                                      P{id}
                                      <span className="text-[7px] opacity-70 mt-1 uppercase leading-none">
                                        In CS
                                      </span>
                                    </div>
                                    {p && (
                                      <svg className="absolute -inset-2 w-[72px] h-[72px] sm:w-[80px] sm:h-[80px] -rotate-90 pointer-events-none">
                                        <motion.circle
                                          cx="36"
                                          cy="36"
                                          r="32"
                                          fill="none"
                                          stroke="currentColor"
                                          strokeWidth="4"
                                          strokeDasharray="201"
                                          strokeLinecap="round"
                                          animate={{
                                            strokeDashoffset:
                                              201 * (1 - p.progress / 100),
                                          }}
                                          className="text-white/40"
                                        />
                                      </svg>
                                    )}
                                  </motion.div>
                                );
                              })}
                            </motion.div>
                          ) : (
                            <motion.div
                              key="idle"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 0.2 }}
                              className="flex flex-col items-center gap-2"
                            >
                              <LockIcon className="w-16 h-16 text-primary" />
                              <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                                Unlocked
                              </span>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Shared variable display */}
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-zinc-950/90 text-white px-3 py-1.5 rounded-xl text-[8px] font-black shadow-2xl border border-zinc-800 whitespace-nowrap tracking-wider z-30">
                          {algo === "mutex" &&
                            `LOCK = ${state.criticalSection.length > 0 ? 1 : 0}`}
                          {algo === "semaphore" &&
                            `S = ${1 - state.criticalSection.length}`}
                          {algo === "peterson" &&
                            `TURN = ${state.algoSpecificState?.turn}`}
                          {algo === "prodcons" &&
                            `MUTEX = ${state.algoSpecificState?.mutex}`}
                          {algo === "rw" &&
                            `WRT = ${state.algoSpecificState?.wrt}`}
                          {algo === "dining" && `Resource Active`}
                        </div>
                      </div>

                      <div
                        className={cn(
                          "inline-flex px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em]",
                          state.criticalSection.length > 0
                            ? "bg-green-500/10 text-green-500 border border-green-500/20"
                            : "bg-muted text-muted-foreground/40",
                        )}
                      >
                        {algo === "prodcons"
                          ? "Buffer Access"
                          : algo === "rw"
                            ? state.algoSpecificState?.readcount! > 0
                              ? `Reading (${state.algoSpecificState?.readcount})`
                              : "Writing"
                            : state.criticalSection.length > 0
                              ? "Critical Section"
                              : "Idle"}
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  <div className="flex flex-wrap justify-center gap-5 max-w-[240px] mx-auto min-h-[60px] pt-4">
                    {/* Active processes are now displayed inside the central resource area above */}
                  </div>
                </div>

                {/* Orbiting Processes */}
                {state.processes.map((p, i) => {
                  const angle = (i / state.processes.length) * 2 * Math.PI;
                  const radiusX = window.innerWidth < 640 ? 120 : 230;
                  const radiusY = window.innerWidth < 640 ? 120 : 230;
                  const x = Math.cos(angle) * radiusX;
                  const y = Math.sin(angle) * radiusY;

                  const isWaiting =
                    p.state === "waiting" || p.state === "requesting";
                  const isRunning = p.state === "running";

                  return (
                    <motion.div
                      key={p.id}
                      className="absolute w-16 h-16 sm:w-20 sm:h-20"
                      animate={{
                        x: isRunning
                          ? 0
                          : isWaiting
                            ? window.innerWidth < 640
                              ? x * 0.5
                              : -420
                            : x,
                        y: isRunning
                          ? 0
                          : isWaiting
                            ? window.innerWidth < 640
                              ? y * 0.5
                              : (i - state.processes.length / 2) * 75
                            : y,
                        opacity: isRunning ? 0.3 : isWaiting ? 0.6 : 1,
                        scale: isRunning || isWaiting ? 0.7 : 1,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 35,
                        damping: 22,
                      }}
                    >
                      <div className="relative group flex flex-col items-center">
                        <div
                          className={cn(
                            "w-14 h-14 rounded-2xl border-4 border-background shadow-2xl flex items-center justify-center text-white font-black transition-all duration-300",
                            p.state === "finished"
                              ? "opacity-20 grayscale saturate-0"
                              : "hover:scale-110",
                          )}
                          style={{ backgroundColor: p.color }}
                        >
                          {p.id}
                        </div>

                        <div
                          className={cn(
                            "mt-3 px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest whitespace-nowrap shadow-sm border border-transparent",
                            p.state === "idle"
                              ? "bg-muted/50 text-muted-foreground"
                              : "bg-primary text-primary-foreground",
                          )}
                        >
                          {p.state}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Narrative / Working Explanation */}
          <div className="mt-8 bg-secondary/5 border-t border-border/20 p-5 -mx-10 -mb-10 flex items-start gap-4">
            <div className="shrink-0 p-3 bg-primary/10 rounded-xl">
              <Terminal className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1">
              <div className="text-[9px] font-black text-primary uppercase tracking-[0.2em] mb-1 opacity-70">
                Scheduler Intelligence
              </div>
              <p className="text-xs font-bold text-muted-foreground leading-relaxed italic pr-12">
                {state.isRunning
                  ? state.criticalSection.length > 0
                    ? `CRITICAL SECTION OCCUPIED: Process P${state.criticalSection[0]} has locked the shared resource. Concurrent requests are being queued in the Block Lane to preserve data integrity.`
                    : "RESOURCE HANDOVER: The resource is currently free. The system kernel is polling the Ready Queue for the next eligible process."
                  : "SIMULATOR STANDBY: Configure process parameters on the left, select your synchronization algorithm, and initiate the kernel simulation."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Section Grid (Below Vis) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-card border border-border rounded-[2.5rem] p-8 shadow-sm h-[400px] flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Terminal className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-lg font-black tracking-tight">System Logs</h2>
            </div>
            <div className="px-3 py-1 bg-secondary rounded-lg text-[10px] font-black text-muted-foreground uppercase tracking-widest">
              Live Stream
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-3 custom-scrollbar font-mono text-xs">
            {state.logs.length === 0 && (
              <div className="text-muted-foreground italic opacity-50">
                Awaiting kernel boot...
              </div>
            )}
            {state.logs.map((log, i) => (
              <div
                key={i}
                className="py-2 border-b border-border/30 last:border-0 flex gap-4 animate-in fade-in slide-in-from-left-2 transition-all"
              >
                <span className="text-muted-foreground opacity-20 font-bold min-w-[20px]">
                  {(state.logs.length - i).toString().padStart(2, "0")}
                </span>
                <span
                  className={cn(
                    "leading-relaxed",
                    log.includes("lock") || log.includes("acquired")
                      ? "text-emerald-500 font-bold"
                      : log.includes("waiting") || log.includes("blocked")
                        ? "text-amber-500 font-medium"
                        : "text-muted-foreground",
                  )}
                >
                  {log}
                </span>
                <span className="ml-auto text-[8px] opacity-10 font-bold select-none">
                  {new Date().toLocaleTimeString().split(" ")[0]}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-border/50 text-[10px] font-black uppercase text-muted-foreground flex justify-between tracking-widest">
            <span>Kernel: OK</span>
            <span>Buffered: {state.logs.length} events</span>
          </div>
        </div>

        <div className="bg-primary/[0.03] border border-primary/20 rounded-[2.5rem] p-8 flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-lg font-black tracking-tight text-primary">
              Protocol Blueprint
            </h3>
          </div>

          <div className="flex-1 space-y-8">
            <div className="space-y-3">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-primary/60">
                Algorithm Definition
              </h4>
              <p className="text-sm font-semibold leading-relaxed text-secondary-foreground/80">
                {ALGORITHMS.find((a) => a.id === state.algorithm)?.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {ALGORITHMS.find((a) => a.id === state.algorithm)?.properties.map(
                (prop, i) => (
                  <div
                    key={i}
                    className="p-4 bg-background/80 rounded-2xl border border-primary/10 shadow-sm"
                  >
                    <span className="text-[9px] font-black text-primary/40 uppercase block mb-1.5 tracking-tighter">
                      {prop.label}
                    </span>
                    <span className="text-sm font-black">{prop.value}</span>
                  </div>
                ),
              )}
            </div>

            <div className="mt-auto pt-6 border-t border-primary/10">
              <div className="flex items-center gap-2 text-primary/60 mb-3">
                <Star className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  Key Performance Metric
                </span>
              </div>
              <div className="text-xl font-black text-primary">
                {state.isRunning ? (
                  <motion.span
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    Calculating impact...
                  </motion.span>
                ) : (
                  "Efficiency Rating: High"
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section (Replaced detailed version with a more compact one) */}
      <AnimatePresence>
        {state.isFinished && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 sm:mt-12 bg-zinc-900 border border-zinc-800 rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-12 text-white shadow-3xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none hidden sm:block">
              <Zap className="w-48 h-48" />
            </div>

            <div className="relative z-10 space-y-12">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                  <h2 className="text-3xl font-black tracking-tight mb-3">
                    Scheduling Summary
                  </h2>
                  <p className="text-zinc-400 font-medium">
                    Post-execution diagnostics for kernel context{" "}
                    {state.algorithm}
                  </p>
                </div>
                <button
                  onClick={initProcesses}
                  className="flex items-center gap-2 px-10 py-5 bg-white text-black rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-zinc-200 transition-all hover:scale-105 active:scale-95"
                >
                  <RotateCcw className="w-5 h-5" />
                  New Sequence
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {[
                  {
                    label: "Latency",
                    value: `${state.processes.reduce((acc, p) => acc + p.waitTime, 0).toFixed(1)}s`,
                    icon: Clock,
                  },
                  {
                    label: "Avg Block",
                    value: `${(state.processes.reduce((acc, p) => acc + p.waitTime, 0) / state.processes.length).toFixed(2)}s`,
                    icon: HistoryIcon,
                  },
                  {
                    label: "Utilization",
                    value: `${Math.min(100, (state.ganttData.reduce((acc, e) => acc + (e.end - e.start), 0) / state.time) * 100).toFixed(1)}%`,
                    icon: Zap,
                  },
                  {
                    label: "Throughput",
                    value: `${(state.stats.completedCount / state.time).toFixed(2)} ops/s`,
                    icon: Activity,
                  },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="p-4 sm:p-8 bg-white/5 rounded-2xl sm:rounded-3xl border border-white/10 group hover:border-white/20 transition-all"
                  >
                    <div className="flex items-center justify-between mb-2 sm:mb-4">
                      <stat.icon className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-500 group-hover:text-white transition-colors" />
                    </div>
                    <span className="text-[8px] sm:text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-1">
                      {stat.label}
                    </span>
                    <span className="text-xl sm:text-3xl font-black tracking-tight">
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-12 border-t border-white/10">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-8 flex items-center gap-3">
                  <Layers className="w-4 h-4" />
                  Kernal Timeline Allocation
                </h3>
                <div className="grid gap-6">
                  {state.processes.map((p) => {
                    const pEntries = state.ganttData.filter(
                      (e) => e.processId === p.id,
                    );
                    return (
                      <div
                        key={p.id}
                        className="relative h-12 flex items-center"
                      >
                        <div className="w-20 font-black text-xs text-zinc-500">
                          P{p.id}
                        </div>
                        <div className="flex-1 h-2.5 bg-white/5 rounded-full relative overflow-hidden">
                          {pEntries.map((entry, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ scaleX: 0 }}
                              animate={{ scaleX: 1 }}
                              className="absolute h-full rounded-full origin-left"
                              style={{
                                left: `${(entry.start / state.time) * 100}%`,
                                width: `${((entry.end - entry.start) / state.time) * 100}%`,
                                backgroundColor: p.color,
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
