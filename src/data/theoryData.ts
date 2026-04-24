import { 
  ShieldAlert, 
  Lock as LockIcon, 
  RotateCcw, 
  Hourglass, 
  Ban, 
  Trophy, 
  Layers, 
  Workflow,
  MousePointer2,
  AlertTriangle,
  Lightbulb,
  Cpu,
  Unplug,
  Users,
  Activity,
  Terminal,
  Printer,
  Wallet,
  Shield,
  Zap,
  CheckCircle2,
  ListOrdered,
  RefreshCw,
  HardDrive,
  Scale,
  Brain
} from 'lucide-react';

export interface TheoryConcept {
  id: string;
  title: string;
  description: string;
  icon: any;
  points: string[];
}

export interface FundamentalData {
  id: string;
  title: string;
  content: string;
  icon: any;
  subsections?: { title: string; content: string; list?: string[] }[];
}

export const SYNCHRONIZATION_FUNDAMENTALS: FundamentalData[] = [
  {
    id: 'part-1-intro',
    title: 'Introduction to Process Synchronization',
    content: 'Process synchronization is the mechanism by which multiple processes or threads coordinate their execution in order to share resources, data, or code in a safe, consistent, and orderly manner. It handles the non-deterministic nature of concurrent execution where the OS scheduler can switch processes at any moment.',
    icon: Activity,
    subsections: [
      {
        title: 'Fundamental Goal',
        content: 'To ensure that when multiple processes access shared data simultaneously, the final state remains correct regardless of the order or speed of process execution.',
        list: [
          'Safety: Final state is correct',
          'Consistency: Data remains valid',
          'Orderly execution: Coordination of sharing'
        ]
      },
      {
        title: 'Why is Synchronization Needed?',
        content: 'Without coordination, concurrent processes can lead to race conditions where read-modify-write operations are interrupted.',
        list: [
          'Prevents data corruption',
          'Handles non-atomic operations',
          'Manages shared variables (e.g. counters)'
        ]
      },
      {
        title: 'Key Terminology',
        content: 'Common definitions in the synchronization landscape.',
        list: [
          'Race Condition: Outcome depends on relative timing',
          'Critical Section: Code segment accessing shared resources',
          'Mutual Exclusion: Only one process allowed in CS',
          'Atomic Operation: Indivisible unit of execution'
        ]
      }
    ]
  },
  {
    id: 'part-2-cs-problem',
    title: 'The Critical Section Problem',
    content: 'The core challenge of synchronization is designing a protocol that ensures exclusive access to shared code segments.',
    icon: LockIcon,
    subsections: [
      {
        title: 'Three Essential Requirements',
        content: 'Any valid solution must strictly satisfy these criteria:',
        list: [
          'Mutual Exclusion: If Pi is in CS, no other process can be',
          'Progress: If CS is empty, decision for entry cannot be delayed',
          'Bounded Waiting: Limit on entries before a requesting process enters'
        ]
      },
      {
        title: "Peterson's Solution",
        content: 'A classic software-based solution for two processes using shared variables "turn" and "flag[2]".',
        list: [
          'flag[i] = true: Pi is ready',
          'turn = j: Giving priority to other',
          'Works theoretically, but broken by modern instruction reordering'
        ]
      },
      {
        title: 'Bakery Algorithm',
        content: 'Leslie Lamport\'s algorithm for N processes based on a ticketing system.',
        list: [
          'Processes take a number (ticket)',
          'Smaller number enters first',
          'Ties broken by process ID'
        ]
      }
    ]
  },
  {
    id: 'part-3-hardware',
    title: 'Synchronization Hardware',
    content: 'Modern synchronization relies on hardware-level atomic instructions that provide uninterruptible primitive operations.',
    icon: HardDrive,
    subsections: [
      {
        title: 'Memory Barriers',
        content: 'Hardware instructions that enforce ordering constraints on memory operations.',
        list: [
          'Prevents instruction reordering by processors',
          'Ensures all writes complete before following reads',
          'Foundation for Acquire/Release semantics'
        ]
      },
      {
        title: 'Test-and-Set (TAS)',
        content: 'Atomically reads a memory location and sets it to true.',
        list: [
          'Atomic Read-Write cycle',
          'Used to implement basic binary locks',
          'Limitations: Lack of fair bounded waiting'
        ]
      },
      {
        title: 'Compare-and-Swap (CAS)',
        content: 'Atomically compares value with expected and updates if equal.',
        list: [
          'Cornerstone for lock-free data structures',
          'Returns old value or success status',
          'Prevents race conditions in non-blocking designs'
        ]
      }
    ]
  },
  {
    id: 'part-4-mutex',
    title: 'Mutex Locks',
    content: 'A software primitive that serves as a binary lock for mutual exclusion.',
    icon: Shield,
    subsections: [
      {
        title: 'Spinlocks vs Blocking',
        content: 'Comparison between busy-waiting and sleep-based locking.',
        list: [
          'Spinlocks: Zero context switch latency, wastes CPU cycles',
          'Blocking: Saves CPU time, has context switch overhead',
          'Selection: Short CS → Spin; Long CS → Block'
        ]
      },
      {
        title: 'Priority Inversion',
        content: 'Failure where high-priority task is blocked by low-priority holder.',
        list: [
          'Priority Inheritance Protocol: Temporarily raises holder priority',
          'Priority Ceiling Protocol: Constant high priority for lock duration'
        ]
      }
    ]
  },
  {
    id: 'part-5-semaphores',
    title: 'Semaphores',
    content: 'Integer signaling variables introduced by Dijkstra, more general than mutexes.',
    icon: Workflow,
    subsections: [
      {
        title: 'Binary vs Counting',
        content: 'Semaphores can act as locks or resource pool managers.',
        list: [
          'Binary (0-1): Identical to mutex functionality',
          'Counting (0-N): Tracks number of resources available',
          'Operations: Atomic wait() and signal()'
        ]
      },
      {
        title: 'Implementation Models',
        content: 'How semaphores handle waiting processes.',
        list: [
          'Spinlock Semaphore: Uses busy-waiting (P/V)',
          'Blocking Semaphore: Uses sleep/wakeup system calls',
          'Negative values indicate number of waiting processes'
        ]
      },
      {
        title: 'Classic Problems',
        content: 'Problems solved using semaphores.',
        list: [
          'Producer-Consumer: wait(empty), wait(mutex), signal(mutex), signal(full)',
          'Readers-Writers: Multiple readers allowed, exclusive writers',
          'Dining Philosophers: Resource deadlocks and starvation'
        ]
      }
    ]
  },
  {
    id: 'part-6-monitors',
    title: 'Monitors',
    content: 'High-level synchronization construct encapsulating shared data and procedures.',
    icon: Zap,
    subsections: [
      {
        title: 'Condition Variables',
        content: 'Used within monitors to allow processes to wait for specific logic conditions.',
        list: [
          'wait(): Releases monitor, suspends calling process',
          'signal(): Resumes exactly one waiting process',
          'Memoryless signals: Signal is lost if no one is waiting'
        ]
      },
      {
        title: 'Signal Semantics',
        content: 'Comparison between monitor signal handling models.',
        list: [
          'Hoare (Signal-and-Wait): Signal causes immediate switch to waiter',
          'Mesa (Signal-and-Continue): Signaler continues, waiter re-checks'
        ]
      },
      {
        title: 'Java Synchronization',
        content: 'Java\'s implementation of monitors.',
        list: [
          'synchronized keyword: Implicit monitor entry',
          'wait() and notify(): Object-level condition signaling',
          'Implicit lock associated with every object'
        ]
      }
    ]
  },
  {
    id: 'part-7-liveness',
    title: 'Liveness Failures',
    content: 'Deadlock, starvation, and livelock represent system states where progress stops.',
    icon: AlertTriangle,
    subsections: [
      {
        title: 'Coffman Deadlock Conditions',
        content: 'Four required conditions for a deadlock state.',
        list: [
          'Mutual Exclusion: Resource is non-shareable',
          'Hold and Wait: Process holds one, waits for another',
          'No Preemption: Cannot forcibly take resources',
          'Circular Wait: P0 waits for P1, P1 for P0'
        ]
      },
      {
        title: 'Livelock Definition',
        content: 'Processes keep changing state but never make progress.',
        list: [
          'Like two people dodging each other in a hall',
          'Wastes CPU but processes are technically active',
          'Often caused by synchronized backoff logic'
        ]
      },
      {
        title: 'Starvation',
        content: 'Process is perpetually denied resources due to scheduling priority.',
        list: [
          'Often occurs in Reader-Priority solutions',
          'Solution: Aging or fair FIFO queueing'
        ]
      }
    ]
  },
  {
    id: 'part-8-lock-free',
    title: 'Lock-Free & Non-Blocking',
    content: 'Techniques that coordinate thread access without the risk of traditional deadlocks.',
    icon: RefreshCw,
    subsections: [
      {
        title: 'Progress Guarantees',
        content: 'Tiers of non-blocking safety.',
        list: [
          'Obstruction-Free: Progress when running alone',
          'Lock-Free: One thread always makes progress',
          'Wait-Free: All threads complete in bounded steps'
        ]
      },
      {
        title: 'The ABA Problem',
        content: 'Specific CAS vulnerability where A -> B -> A state change is missed.',
        list: [
          'Solution: Use version tags (tagged pointers)',
          'Solution: Use Hazard Pointers for safe reuse',
          'Solution: RCU (Read-Copy-Update)'
        ]
      }
    ]
  },
  {
    id: 'part-9-advanced',
    title: 'Advanced Performance Patterns',
    content: 'Optimization strategies for scaling synchronization to many cores.',
    icon: Layers,
    subsections: [
      {
        title: 'Two-Phase Locking (2PL)',
        content: 'Database/Distributed protocol for serializable execution.',
        list: [
          'Growing Phase: Acquiring locks only',
          'Shrinking Phase: Releasing locks only',
          'Guarantees consistency but not deadlock-freedom'
        ]
      },
      {
        title: 'Spinlock Optimization',
        content: 'Techniques to reduce cache coherence traffic.',
        list: [
          'Test-and-Test-and-Set: Spinning on local cache first',
          'Exponential Backoff: Doubling wait time on failure',
          'Queue Locks: MCS locks reduce bus traffic'
        ]
      }
    ]
  },
  {
    id: 'part-10-summary',
    title: 'Key Point Summary',
    content: 'A condensed guide to the most vital synchronization principles.',
    icon: Trophy,
    subsections: [
      {
        title: 'Crucial Takeaways',
        content: 'The essential toolkit for any OS engineer.',
        list: [
          'Race conditions are the fundamental enemy of concurrency',
          'Mutual Exclusion, Progress, and Bounded Waiting are the pillars of correctness',
          'Hardware atomicity is required for all software locking primitives',
          'Blocking is better for long waits; spinning is better for short waits'
        ]
      },
      {
        title: 'Correctness Rules',
        content: 'Standard practices to avoid catastrophic failures.',
        list: [
          'Always acquire locks in a global consistent order to avoid deadlock',
          'Condition variables must be checked in a loop to handle spurious wakeups',
          'Favor high-level monitors over manual low-level semaphores for safety'
        ]
      }
    ]
  }
];


export const SYNCHRONIZATION_THEORY: TheoryConcept[] = [
  {
    id: 'mutex-lock',
    title: 'Mutex Lock',
    description: 'Shared variable used to provide exclusive access (binary).',
    icon: LockIcon,
    points: [
      'Ownership property',
      'Binary states',
      'Mutual exclusion focus',
      'Atomic Acquire/Release'
    ]
  },
  {
    id: 'peterson-algo',
    title: "Peterson's Algorithm",
    description: 'Classic 2-process software solution using turn & flags.',
    icon: RotateCcw,
    points: [
      'Provably correct (2-proc)',
      'No hardware needed',
      'Fair scheduling',
      'Software-only'
    ]
  },
  {
    id: 'semaphores',
    title: 'Semaphores',
    description: 'General integer-based signaling via Wait and Signal.',
    icon: Workflow,
    points: [
      'Counting semaphores',
      'Wait (P) / Signal (V)',
      'Queue-based waiting',
      'Resource pool manager'
    ]
  },
  {
    id: 'monitors-comp',
    title: 'Monitors',
    description: 'High-level constructs with automatic mutual exclusion.',
    icon: Shield,
    points: [
      'Compiler-enforced',
      'Condition variables',
      'Object-oriented',
      'Encapsulated procedures'
    ]
  }
];

