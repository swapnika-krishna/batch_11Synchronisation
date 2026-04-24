import { ConceptData } from "./types";

export const ALGORITHMS: ConceptData[] = [
  // SOFTWARE ALGORITHMS
  {
    id: 'peterson',
    category: 'software',
    title: "Peterson's Algorithm",
    subtitle: 'Classic 2-Process Synchronization',
    description: "A concurrent programming algorithm for mutual exclusion that allows two processes to share a single-use resource without conflict, using only shared memory for communication. It overcomes the strict alternation problem by combining reservation flags and a turn-taking variable to ensure safety and progress.",
    properties: [
      { label: 'PROCESSES', value: 'Exactly 2' },
      { label: 'MECHANISM', value: 'flag[2], turn' },
      { label: 'ASSURANCE', value: 'Deadlock-free, Bounded-waiting' }
    ],
    pseudocode: `// Process i (j is other)
flag[i] = true;
turn = j;
while(flag[j] && turn == j); 

// Critical Section

flag[i] = false;`
  },
  {
    id: 'dekker',
    category: 'software',
    title: "Dekker's Algorithm",
    subtitle: 'The First Concurrent Solution',
    description: "The first documented correct software-based solution to the mutual exclusion problem in computer science. It manages access between two processes without hardware atomic instructions through a complex multi-stage request and withdrawal logic that uses a turn variable to prevent starvation.",
    properties: [
      { label: 'HISTORY', value: 'First correct solution' },
      { label: 'LOGIC', value: 'Intent-based coordination' },
      { label: 'TYPE', value: 'Busy-waiting software protocol' }
    ],
    pseudocode: `flag[i] = true;
while(flag[j]) {
  if (turn == j) {
    flag[i] = false;
    while(turn == j);
    flag[i] = true;
  }
}
// Critical Section
turn = j; 
flag[i] = false;`
  },
  {
    id: 'bakery',
    category: 'software',
    title: "Bakery Algorithm",
    subtitle: 'Lamport\'s Ticket System',
    description: "Leslie Lamport's algorithm for providing mutual exclusion to any number of processes (N). It uses a ticketing system similar to a bakery: every process receives a number upon entry, and the one with the lowest number enters next. Ties are broken by lexicographical process IDs.",
    properties: [
      { label: 'LIMIT', value: 'N-Processes' },
      { label: 'SYSTEM', value: 'Ticketing / FIFO-like' },
      { label: 'DATA', value: 'choosing[], number[]' }
    ],
    pseudocode: `choosing[i] = true;
number[i] = max(number[0..n-1]) + 1;
choosing[i] = false;
for (j = 0; j < n; j++) {
  while (choosing[j]);
  while (number[j] != 0 && (number[j],j) < (number[i],i));
}
// Critical Section
number[i] = 0;`
  },

  // MECHANISMS
  {
    id: 'mutex',
    category: 'mechanism',
    title: 'Mutex Lock',
    subtitle: 'Mutual Exclusion Primitive',
    description: "Short for 'Mutual Exclusion', a mutex is a kernel/software primitive that serves as a binary lock. It provides exclusive access to a resource: a process must 'acquire' the lock before entering a critical section and 'release' it afterwards. It represents a strict locked/unlocked state.",
    properties: [
      { label: 'TYPE', value: 'Sleep or Busy-wait' },
      { label: 'OWNERSHIP', value: 'Strictly enforced' },
      { label: 'EFFICIENCY', value: 'Lightweight resource guard' }
    ],
    pseudocode: `acquire(mutex) {
   while (lock_available == false) // block;
   lock_available = false;
}
release(mutex) {
   lock_available = true;
}`
  },
  {
    id: 'semaphore',
    category: 'mechanism',
    title: 'Semaphores',
    subtitle: 'Integer Signaling Primitive',
    description: "Introduced by Dijkstra, semaphores are integer variables used as signaling counters for shared resources. A counting semaphore can allow multiple processes to access a finite pool of identical resources simultaneously through P(wait) and V(signal) atomic operations.",
    properties: [
      { label: 'VALUE', value: 'S >= 0 (Non-negative)' },
      { label: 'OPS', value: 'Wait (P) and Signal (V)' },
      { label: 'VERSIONS', value: 'Binary, Counting, Strong' }
    ],
    pseudocode: `wait(S) {
  while (S <= 0); // sleep/wait
  S--;
}
signal(S) {
  S++;
}`
  },
  {
    id: 'monitor',
    category: 'mechanism',
    title: 'Monitors',
    subtitle: 'Compiler-Enforced Safety',
    description: "A high-level synchronization construct that encapsulates shared variables and operations within an abstract data type. It provides automatic mutual exclusion: only one process can be active within the monitor at a time, protecting the programmer from manual locking errors.",
    properties: [
      { label: 'MODEL', value: 'Object-Oriented' },
      { label: 'NATURE', value: 'Compiler-level abstraction' },
      { label: 'WAITING', value: 'Condition variable queues' }
    ],
    pseudocode: `monitor SynchronizedResource {
  condition cv;
  int resource_busy = 0;
  
  public void enter() {
    if (resource_busy) cv.wait();
    resource_busy = 1;
  }
}`
  },

  // PROBLEMS
  {
    id: 'prodcons',
    category: 'problem',
    title: 'Producer-Consumer',
    subtitle: 'The Bounded-Buffer Simulation',
    description: "A classic multi-process synchronization problem where 'producers' put data into a finite-size shared buffer and 'consumers' take it out. Coordination must prevent buffer overflow (producers wait) and underflow (consumers wait) through semaphores or condition variables.",
    properties: [
      { label: 'INTERACTION', value: 'Cooperating processes' },
      { label: 'LIMIT', value: 'Buffer Size N' },
      { label: 'GUARD', value: 'Full/Empty/Mutex' }
    ],
    pseudocode: `Producer:
  wait(emptySlot); wait(mutex);
  buffer.add(item);
  signal(mutex); signal(fullSlot);

Consumer:
  wait(fullSlot); wait(mutex);
  buffer.remove(item);
  signal(mutex); signal(emptySlot);`
  },
  {
    id: 'dining',
    category: 'problem',
    title: 'Dining Philosophers',
    subtitle: 'Deadlock and Starvation Model',
    description: "A classic representation of resource allocation and deadlock risks. N philosophers sit at a table sharing forks. To eat, one needs two adjacent forks. Without proper hierarchy or arbitration, the system can enter a 'circular wait' deadlock where no progress is possible.",
    properties: [
      { label: 'DIAGNOSIS', value: 'Circular Resource Wait' },
      { label: 'RESOURCES', value: 'Shared single-unit forks' },
      { label: 'SOLUTION', value: 'Odd/Even or Resource Hierarchy' }
    ],
    pseudocode: `void philosopher(int i) {
  while(true) {
    think();
    wait(fork[i]);
    wait(fork[(i+1)%N]);
    eat();
    signal(fork[i]);
    signal(fork[(i+1)%N]);
  }
}`
  },
  {
    id: 'rw',
    category: 'problem',
    title: 'Readers-Writers',
    subtitle: 'Priority and Throughput Analysis',
    description: "Models concurrent access to a database or shared file. Coordination must allow multiple Readers simultaneously for efficiency, but grant exclusive access to a Writer for data integrity. The logic must manage reader/writer priority to prevent starvation of either side.",
    properties: [
      { label: 'READERS', value: 'Concurrent (Shared)' },
      { label: 'WRITERS', value: 'Exclusive (Atomic)' },
      { label: 'POLICY', value: 'Reader-biased or Writer-biased' }
    ],
    pseudocode: `Reader:
  wait(mutex); readcount++;
  if (readcount==1) wait(wrt);
  signal(mutex); // READING
  wait(mutex); readcount--;
  if (readcount==0) signal(wrt);
  signal(mutex);`
  },

  // HARDWARE
  {
    id: 'barber',
    category: 'problem',
    title: 'Sleeping Barber',
    subtitle: 'Resource/Thread Scheduling',
    description: "Models a barber shop with one barber and N waiting chairs. It demonstrates the challenges of coordinating a 'service' process with fluctuating 'client' processes using a limited queue (buffer). Coordination ensures the barber sleeps when idle and customers wait or leave based on capacity.",
    properties: [
      { label: 'BUFFER', value: 'N Waiting Chairs' },
      { label: 'STATES', value: 'Sleeping, Cutting, Waiting' },
      { label: 'SEM', value: 'Customers, Barber, Mutex' }
    ],
    pseudocode: `Barber:
  wait(customers); wait(mutex);
  waiting--; signal(barber); signal(mutex);
  cut_hair();

Customer:
  wait(mutex);
  if (waiting < N) {
    waiting++; signal(customers); signal(mutex);
    wait(barber); get_haircut();
  } else signal(mutex); // shop full`
  },

  // HARDWARE
  {
    id: '2pl',
    category: 'hardware',
    title: 'Two-Phase Locking (2PL)',
    subtitle: 'Concurrency Control Protocol',
    description: "A method used in databases and distributed systems to ensure serializability. It consists of two phases: a 'Growing' phase where locks are acquired, and a 'Shrinking' phase where locks are released. Once a process releases a lock, it can never acquire another one.",
    properties: [
      { label: 'PHASE 1', value: 'Growing (Locking)' },
      { label: 'PHASE 2', value: 'Shrinking (Unlocking)' },
      { label: 'GUARANTEE', value: 'Serializability' }
    ],
    pseudocode: `// Growing Phase
acquire(lock1);
acquire(lock2);
// Perform operations...

// Shrinking Phase
release(lock1);
release(lock2);
// No more locks allowed`
  },
  {
    id: 'tas',
    category: 'hardware',
    title: 'Test-and-Set',
    subtitle: 'Atomic Bit Selection',
    description: "An indivisible hardware instruction provided by the CPU to read a boolean flag and set it to 'true' in a single cycle. It prevents race conditions during lock entry by ensuring that 'checking the lock' and 'taking the lock' cannot be interrupted.",
    properties: [
      { label: 'ATOM', value: 'Read-Modify-Write cycle' },
      { label: 'BUS', value: 'Hardware-enforced lock' },
      { label: 'RESULT', value: 'Spinlock implementation' }
    ],
    pseudocode: `boolean TestAndSet(boolean *lock) {
   boolean old = *lock;
   *lock = true;
   return old;
}`
  },
  {
    id: 'cas',
    category: 'hardware',
    title: 'Compare-and-Swap',
    subtitle: 'Conditional Atomic Exchange',
    description: "A fundamental atomic CPU instruction that compares the value of a memory location with an 'expected' value and, only if they match, updates it to a 'new' value. It is the cornerstone for building lock-free and wait-free data structures in modern systems.",
    properties: [
      { label: 'PARAMS', value: 'Target, Expected, New' },
      { label: 'GUARANTEE', value: 'Compare + Exchange' },
      { label: 'USE', value: 'Non-blocking data structures' }
    ],
    pseudocode: `int CAS(int *val, int expected, int next) {
  int old = *val;
  if (*val == expected) *val = next;
  return old;
}`
  },
  {
    id: 'swap',
    category: 'hardware',
    title: 'Atomic Swap (XCHG)',
    subtitle: 'Zero-Wait Value Permutation',
    description: "An instruction that interchanges the contents of two words (typically a register and memory) atomically. Used to implement mutex entry by swapping a 'local locked' status with a 'shared lock' variable, ensuring only one process holds the token.",
    properties: [
      { label: 'X86', value: 'XCHG instruction' },
      { label: 'PRIMITIVE', value: 'Atomic Exchange' },
      { label: 'EFFICIENCY', value: 'O(1) cycle cost' }
    ],
    pseudocode: `void Swap(boolean *a, boolean *b) {
   boolean temp = *a;
   *a = *b;
   *b = temp;
}`
  },
  {
    id: 'faa',
    category: 'hardware',
    title: 'Fetch-and-Add',
    subtitle: 'Parallel Counter Increment',
    description: "Atomically increments the value at a memory location and returns the previous value. This is highly efficient for implementing ticket-based locks and shared counting variables in high-concurrency environments.",
    properties: [
      { label: 'ISA SUPPORT', value: 'x86 (LOCK XADD)' },
      { label: 'SCALABILITY', value: 'High' },
      { label: 'PRIMITIVE', value: 'Integer Accumulation' }
    ],
    pseudocode: `int FetchAndAdd(int *target, int count) {
  int old = *target;
  *target = *target + count;
  return old;
}`
  },
  {
    id: 'llsc',
    category: 'hardware',
    title: 'Load-Link / Store-Conditional',
    subtitle: 'Optimistic Hardware Concurrency',
    description: "A pair of hardware instructions used on RISC architectures. Load-Link reads a value, and Store-Conditional only writes a value back if no other process has modified that same location in the interim. It detects bus collisions effectively.",
    properties: [
      { label: 'ARCH', value: 'ARM, PowerPC, MIPS' },
      { label: 'LOGIC', value: 'Optimistic Retry' },
      { label: 'FAIL SAFE', value: 'Detects context switches' }
    ],
    pseudocode: `loop:
  LL r1, address
  // modify r1
  SC r2, r1, address
  if (r2 == 0) goto loop`
  }
];

export const COLORS = [
  '#FBC3C1', // primary pink/peach
  '#3b82f6', // blue
  '#ec4899', // pink
  '#10b981', // emerald
  '#f59e0b', // amber
  '#8b5cf6', // violet
  '#f97316', // orange
  '#ef4444', // red
];
