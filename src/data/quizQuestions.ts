export type QuizLevel = 1 | 2 | 3;

export interface Question {
  id: number;
  question: string;
  options: string[];
  answer: number;
  type?: 'multiple-choice' | 'programming' | 'fill-blank';
  boilerplate?: string;
  expectedOutput?: string;
  hint?: string;
  level: QuizLevel;
  clue?: string;
}

export const QUIZ_QUESTIONS: Question[] = [
  // LEVEL 1: BEGINNER (1-20)
  {
    id: 101,
    question: "What is the primary goal of process synchronization?",
    options: ["To speed up CPU clock cycles", "To coordinate processes that share data", "To increase memory capacity", "To prevent processes from starting"],
    answer: 1,
    level: 1
  },
  {
    id: 102,
    question: "A 'Race Condition' occurs when...",
    options: ["Processes run too fast", "The outcome depends on the order of execution", "A process crashes during boot", "Multiple CPUs are used"],
    answer: 1,
    level: 1
  },
  {
    id: 103,
    question: "Which of these is NOT a requirement for a solution to the critical section problem?",
    options: ["Mutual Exclusion", "Progress", "Bounded Waiting", "Infinite Memory"],
    answer: 3,
    level: 1
  },
  {
    id: 104,
    question: "What does 'Mutual Exclusion' mean?",
    options: ["No two processes can be in their critical sections at once", "All processes must wait for the OS", "Processes cannot communicate", "Processes have exclusive access to the monitor"],
    answer: 0,
    level: 1
  },
  {
    id: 105,
    question: "The 'Critical Section' is where a process...",
    options: ["Starts execution", "Waits for input", "Accesses shared resources", "Terminates"],
    answer: 2,
    level: 1
  },
  {
    id: 106,
    question: "What is 'Progress' in the context of the CS problem?",
    options: ["A process must finish in 1 second", "Processes not in CS shouldn't block others from entering", "The CPU must always be 100% busy", "The OS must update progress bars"],
    answer: 1,
    level: 1
  },
  {
    id: 107,
    question: "What is 'Bounded Waiting'?",
    options: ["A limit on how many processes can exist", "A limit on how long a process waits to enter CS", "Waiting for a keyboard event", "Blocking all background tasks"],
    answer: 1,
    level: 1
  },
  {
    id: 108,
    question: "A process that is 'busy-waiting' is...",
    options: ["Sleeping in a queue", "Actively checking a condition in a loop", "Waitlisted by the scheduler", "Running a background update"],
    answer: 1,
    level: 1
  },
  {
    id: 109,
    question: "Disabling interrupts is a viable sync solution for:",
    options: ["Multi-processor systems", "Single-processor systems", "Web browsers", "Real-time games"],
    answer: 1,
    level: 1
  },
  {
    id: 110,
    question: "What is an 'Atomic' operation?",
    options: ["A multi-step process", "An uninterruptible unit of operation", "A radioactive decay function", "A process using high energy"],
    answer: 1,
    level: 1
  },
  {
    id: 111,
    question: "The simplest software sync tool is a:",
    options: ["Semaphore", "Monitor", "Lock", "Global Variable"],
    answer: 2,
    level: 1
  },
  {
    id: 112,
    question: "In a non-preemptive kernel, race conditions on kernel data:",
    options: ["Are intensified", "Are eliminated within kernel mode", "Require complex hardware locks", "Cause immediate blue screens"],
    answer: 1,
    level: 1
  },
  {
    id: 113,
    question: "Peterson's Algorithm is limited to how many processes?",
    options: ["1", "2", "Unlimited", "The number of CPU cores"],
    answer: 1,
    level: 1
  },
  {
    id: 114,
    question: "Which hardware instruction can implement a lock atomically?",
    options: ["MOV", "ADD", "TestAndSet", "GOTO"],
    answer: 2,
    level: 1
  },
  {
    id: 115,
    question: "A 'Spinlock' is efficient if...",
    options: ["The wait time is long", "The wait time is very short", "Memory is low", "The CPU has only one core"],
    answer: 1,
    level: 1
  },
  {
    id: 116,
    question: "The 'Entry Section' in a sync problem is used to:",
    options: ["Log the process ID", "Request permission to enter CS", "Initialize local variables", "Check for software updates"],
    answer: 1,
    level: 1
  },
  {
    id: 117,
    question: "The 'Exit Section' is used to:",
    options: ["Delete the process", "Release control so others can enter CS", "Restart the CPU", "Free all local memory"],
    answer: 1,
    level: 1
  },
  {
    id: 118,
    question: "Shared data is often called a:",
    options: ["Safe Zone", "Critical Resource", "Buffer Entry", "Kernel Hook"],
    answer: 1,
    level: 1
  },
  {
    id: 119,
    question: "Most modern OS kernels are:",
    options: ["Preemptive", "Non-preemptive", "Single-threaded", "Analog"],
    answer: 0,
    level: 1
  },
  {
    id: 120,
    question: "The state of being unable to proceed due to waiting for an event that will never happen is:",
    options: ["Starvation", "Livelock", "Deadlock", "Suspension"],
    answer: 2,
    level: 1
  },

  // LEVEL 2: INTERMEDIATE (21-40)
  {
    id: 201,
    question: "A counting semaphore can range over...",
    options: ["Only 0 and 1", "Unrestricted organic numbers", "Only negative values", "A specified range of non-negative integers"],
    answer: 3,
    level: 2
  },
  {
    id: 202,
    question: "The 'wait()' operation on a semaphore is also called:",
    options: ["P (Proberen)", "V (Verhogen)", "S (Signal)", "D (Decrement)"],
    answer: 0,
    level: 2
  },
  {
    id: 203,
    question: "The 'signal()' operation on a semaphore is also called:",
    options: ["P", "V", "Wait", "Block"],
    answer: 1,
    level: 2
  },
  {
    id: 204,
    question: "A binary semaphore is effectively a:",
    options: ["Counter", "Mutex Lock", "Monitor", "Condition Variable"],
    answer: 1,
    level: 2
  },
  {
    id: 205,
    question: "Peterson's solution uses which two variables?",
    options: ["count, flag", "turn, flag", "lock, key", "wait, signal"],
    answer: 1,
    level: 2
  },
  {
    id: 206,
    question: "Priority Inversion happens when:",
    options: ["High-priority task is blocked by low-priority task", "All tasks have same priority", "Kernel changes priority randomly", "Tasks run in reverse order"],
    answer: 0,
    level: 2
  },
  {
    id: 207,
    question: "The solution to Priority Inversion is:",
    options: ["Priority Blocking", "Priority Inheritance", "Round Robin", "First-In-First-Out"],
    answer: 1,
    level: 2
  },
  {
    id: 208,
    question: "The Bounded-Buffer problem is also known as:",
    options: ["Readers-Writers", "Producer-Consumer", "Dining Philosophers", "Sleeping Barber"],
    answer: 1,
    level: 2
  },
  {
    id: 209,
    question: "In Bounded-Buffer, 'full' semaphore tracks:",
    options: ["Number of empty slots", "Number of filled slots", "If the buffer is locked", "Number of producers"],
    answer: 1,
    level: 2
  },
  {
    id: 210,
    question: "In Bounded-Buffer, 'empty' semaphore tracks:",
    options: ["Available slots", "Full slots", "Consumer count", "Producer count"],
    answer: 0,
    level: 2
  },
  {
    id: 211,
    question: "In the Readers-Writers problem, 'Writers' require:",
    options: ["Shared access", "Exclusive access", "Read-only access", "Deferred access"],
    answer: 1,
    level: 2
  },
  {
    id: 212,
    question: "The Dining Philosophers problem illustrates challenges with:",
    options: ["Single-process systems", "Resource allocation for multiple processes", "Network latency", "Disk scheduling"],
    answer: 1,
    level: 2
  },
  {
    id: 213,
    question: "A high-level abstraction that provides sync mechanisms without manual lock handling is:",
    options: ["Semaphore", "Monitor", "Spinlock", "Global Mutex"],
    answer: 1,
    level: 2
  },
  {
    id: 214,
    question: "Condition variables in monitors are used for:",
    options: ["Updating software", "Wait/Signal sync", "Managing CPU frequency", "Calculating memory offsets"],
    answer: 1,
    level: 2
  },
  {
    id: 215,
    question: "Comparing 'Monitor' and 'Semaphore', which is more prone to programmer error?",
    options: ["Monitor", "Semaphore", "Both are equal", "Neither"],
    answer: 1,
    level: 2
  },
  {
    id: 216,
    question: "The 'CompareAndSwap' instruction takes how many arguments?",
    options: ["1", "2", "3", "4"],
    answer: 2,
    level: 2
  },
  {
    id: 217,
    question: "What happens if a process blocks on a semaphore?",
    options: ["It keeps spinning", "It is placed in a waiting queue", "It terminates", "It restarts the computer"],
    answer: 1,
    level: 2
  },
  {
    id: 218,
    question: "A 'Mutex' is a short form of:",
    options: ["Multiple Execution", "Mutual Exclusion", "Multi-Task Extension", "Mutation Experiment"],
    answer: 1,
    level: 2
  },
  {
    id: 219,
    question: "In the Sleeping Barber problem, if the shop is full, the customer:",
    options: ["Waits in a chair", "Leaves the shop", "Wakes the barber", "Crashes the system"],
    answer: 1,
    level: 2
  },
  {
    id: 220,
    question: "The Bakery Algorithm provides sync for:",
    options: ["2 processes", "N processes", "Only for I/O tasks", "Only for background tasks"],
    answer: 1,
    level: 2
  },

  // LEVEL 3: HIGH (41-60)
  {
    id: 301,
    question: "A Resource Allocation Graph (RAG) contains a cycle. This means:",
    options: ["Deadlock is certain", "Deadlock is possible", "Deadlock is impossible", "The OS must reboot"],
    answer: 1,
    level: 3
  },
  {
    id: 302,
    question: "In Banker's Algorithm, a 'Safe State' implies:",
    options: ["No deadlock can occur", "All processes will finish in 1ms", "The system is virus-free", "Memory is encrypted"],
    answer: 0,
    level: 3
  },
  {
    id: 303,
    question: "Which is NOT a necessary condition for deadlock?",
    options: ["Mutual Exclusion", "Hold and Wait", "No Preemption", "Resource Pooling"],
    answer: 3,
    level: 3
  },
  {
    id: 304,
    question: "'Circular Wait' is a condition for:",
    options: ["Fast execution", "Deadlock", "Infinite progress", "Automatic updates"],
    answer: 1,
    level: 3
  },
  {
    id: 305,
    question: "What is 'Livelock'?",
    options: ["Processes are blocked", "Processes change states but make no progress", "CPU is at 0% usage", "Memory is leaked slowly"],
    answer: 1,
    level: 3
  },
  {
    id: 306,
    question: "The 'ABA Problem' occurs in which type of synchronization?",
    options: ["Semaphores", "Compare-and-Swap based locks", "Monitors", "Peterson's Algorithm"],
    answer: 1,
    level: 3
  },
  {
    id: 307,
    question: "What is 'Lock-free' synchronization?",
    options: ["No locks are used", "At least one thread makes progress at all times", "All threads finish instantly", "Memory is shared without variables"],
    answer: 1,
    level: 3
  },
  {
    id: 308,
    question: "Read-Copy-Update (RCU) is highly efficient for:",
    options: ["Write-heavy workloads", "Read-mostly workloads", "Single-core systems", "Calculating PI"],
    answer: 1,
    level: 3
  },
  {
    id: 309,
    question: "A 'Futex' in Linux stands for:",
    options: ["Future Execution", "Fast User-space Mutex", "Functional Tiered Extension", "Fixed Unicode Text"],
    answer: 1,
    level: 3
  },
  {
    id: 310,
    question: "Which sync primitive allows a group of threads to wait until all have reached a point?",
    options: ["Mutex", "Barrier", "Semaphore", "Spinlock"],
    answer: 1,
    level: 3
  },
  {
    id: 311,
    question: "Monitor semantics where the signaling process continues and the signaled waits is:",
    options: ["Signal and Wait", "Signal and Continue", "Wait and Signal", "Exit and Notify"],
    answer: 0,
    level: 3
  },
  {
    id: 312,
    question: "In the Dining Philosophers, if all pick up the left fork first:",
    options: ["Philosophers eat faster", "Deadlock occurs", "Food is shared efficiently", "OS optimizes forks"],
    answer: 1,
    level: 3
  },
  {
    id: 313,
    question: "Memory Barriers (Fences) are needed because of:",
    options: ["CPU reordering of instructions", "Physical heat", "Virtual memory errors", "Power fluctuations"],
    answer: 0,
    level: 3
  },
  {
    id: 314,
    question: "Transactional Memory (TM) allows for:",
    options: ["Banking transactions", "Grouped memory operations with rollback", "Faster disk writes", "Secure boot"],
    answer: 1,
    level: 3
  },
  {
    id: 315,
    question: "An 'Unsafe State' in Banker's Algorithm means:",
    options: ["Deadlock is happening now", "The system might enter deadlock", "A virus is detected", "The CPU is overheating"],
    answer: 1,
    level: 3
  },
  {
    id: 316,
    question: "Hierarchical Locking (Lock Ordering) prevents which deadlock condition?",
    options: ["Mutual Exclusion", "Circular Wait", "No Preemption", "Hold and Wait"],
    answer: 1,
    level: 3
  },
  {
    id: 317,
    question: "In the Cigarette Smokers Problem, the 'Agent' is:",
    options: ["A process scheduler", "The resource provider", "A network interface", "A virus scanner"],
    answer: 1,
    level: 3
  },
  {
    id: 318,
    question: "Adaptive Locks (used in Solaris/Windows) switch between spin and sleep based on:",
    options: ["Time of day", "Lock holder's status (running or not)", "Battery level", "Number of open windows"],
    answer: 1,
    level: 3
  },
  {
    id: 319,
    question: "Which scheduling policy is often combined with Priority Inheritance?",
    options: ["Round Robin", "Rate Monotonic Scheduling", "First-Come-First-Serve", "Shortest Job First"],
    answer: 1,
    level: 3
  },
  {
    id: 320,
    question: "The 'Readers-Writers' problem where writers never starve is the:",
    options: ["First solution", "Second solution", "Third solution", "None of these"],
    answer: 1,
    level: 3
  }
];
