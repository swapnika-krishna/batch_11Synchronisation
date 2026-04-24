export type AlgorithmType = 
  | 'mutex' 
  | 'semaphore' 
  | 'peterson' 
  | 'dekker'
  | 'bakery'
  | 'monitor'
  | 'condition'
  | 'prodcons' 
  | 'dining' 
  | 'rw'
  | 'tas'
  | 'cas'
  | 'swap'
  | 'faa'
  | 'llsc'
  | 'barber'
  | '2pl';

export type ProcessState = 'idle' | 'requesting' | 'waiting' | 'running' | 'finished';

export interface Process {
  id: number;
  state: ProcessState;
  color: string;
  waitTime: number;
  burstTime: number;
  remainingTime: number;
  progress: number;
  completedExecutions: number;
  targetExecutions: number;
}

export interface GanttEntry {
  processId: number;
  start: number;
  end: number;
  color: string;
}

export interface SimulationState {
  time: number;
  processes: Process[];
  queue: number[];
  criticalSection: number[];
  ganttData: GanttEntry[];
  logs: string[];
  isRunning: boolean;
  isPaused: boolean;
  isFinished: boolean;
  speed: number;
  algorithm: AlgorithmType;
  stats: {
    totalWaitTime: number;
    completedCount: number;
    csEntries: number;
  };
  algoSpecificState?: {
    turn?: number;
    flag?: boolean[];
    readcount?: number;
    mutex?: number;
    wrt?: number;
    empty?: number;
    full?: number;
    buffer?: number[];
    bufferSize?: number;
    forks?: boolean[]; // true if fork is available
    philosopherStates?: ('thinking' | 'hungry' | 'eating')[];
  };
}

export interface ConceptData {
  id: AlgorithmType;
  title: string;
  subtitle: string;
  description: string;
  pseudocode: string;
  category: 'software' | 'hardware' | 'problem' | 'mechanism';
  properties: { label: string; value: string }[];
  codeTemplates?: Record<string, string>;
}
