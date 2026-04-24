export const ALGO_CODE_TEMPLATES: Record<string, Record<string, string>> = {
  peterson: {
    c: `#include <stdio.h>\n#include <stdbool.h>\n#include <pthread.h>\n\nbool flag[2];\nint turn;\n\nvoid* process(void* arg) {\n    int i = *(int*)arg;\n    int j = 1 - i;\n    \n    flag[i] = true;\n    turn = j;\n    while (flag[j] && turn == j);\n    \n    printf("P%d entered critical section\\n", i);\n    \n    flag[i] = false;\n    return NULL;\n}`,
    cpp: `#include <iostream>\n#include <atomic>\n#include <thread>\n#include <vector>\n\nstd::atomic<bool> flag[2] = {false, false};\nstd::atomic<int> turn = 0;\n\nvoid process(int i) {\n    int j = 1 - i;\n    flag[i] = true;\n    turn = j;\n    while (flag[j] && turn == j);\n    \n    std::cout << "P" << i << " in CS\\n";\n    \n    flag[i] = false;\n}`,
    python: `import threading\n\nflag = [False, False]\nturn = 0\n\ndef process(i):\n    global turn\n    j = 1 - i\n    flag[i] = True\n    turn = j\n    while flag[j] and turn == j: pass\n    \n    print(f"P{i} in Critical Section")\n    \n    flag[i] = False`,
    java: `class Peterson {\n    private volatile boolean[] flag = new boolean[2];\n    private volatile int turn;\n\n    public void process(int i) {\n        int j = 1 - i;\n        flag[i] = true;\n        turn = j;\n        while (flag[j] && turn == j);\n        \n        System.out.println("P" + i + " in CS");\n        \n        flag[i] = false;\n    }\n}`
  },
  mutex: {
    c: `#include <pthread.h>\n\npthread_mutex_t lock;\n\nvoid* thread_func(void* arg) {\n    pthread_mutex_lock(&lock);\n    // Critical Section\n    pthread_mutex_unlock(&lock);\n    return NULL;\n}`,
    cpp: `#include <mutex>\n\nstd::mutex mtx;\n\nvoid func() {\n    std::lock_guard<std::mutex> lock(mtx);\n    // Critical Section\n}`,
    python: `import threading\n\nlock = threading.Lock()\n\ndef func():\n    with lock:\n        print("Critical Section")`,
    java: `import java.util.concurrent.locks.ReentrantLock;\n\nclass MutexEx {\n    private final ReentrantLock lock = new ReentrantLock();\n\n    public void func() {\n        lock.lock();\n        try {\n            // CS\n        } finally {\n            lock.unlock();\n        }\n    }\n}`
  },
  semaphore: {
    c: `#include <semaphore.h>\n\nsem_t s;\n\nvoid func() {\n    sem_wait(&s);\n    // CS\n    sem_post(&s);\n}`,
    cpp: `#include <semaphore>\n\nstd::binary_semaphore sem{1};\n\nvoid func() {\n    sem.acquire();\n    // CS\n    sem.release();\n}`,
    python: `import threading\n\nsem = threading.Semaphore(1)\n\ndef func():\n    with sem:\n        print("CS accessed")`,
    java: `import java.util.concurrent.Semaphore;\n\nclass SemEx {\n    private Semaphore sem = new Semaphore(1);\n\n    public void func() throws InterruptedException {\n        sem.acquire();\n        // CS\n        sem.release();\n    }\n}`
  },
  prodcons: {
    c: `#include <semaphore.h>\nsem_t empty, full, mutex;\n\nvoid producer() {\n    sem_wait(&empty);\n    sem_wait(&mutex);\n    // add to buffer\n    sem_post(&mutex);\n    sem_post(&full);\n}`,
    python: `import threading\n\nempty = threading.Semaphore(10)\nfull = threading.Semaphore(0)\nmutex = threading.Lock()\n\ndef producer():\n    with empty:\n        with mutex:\n            # add items\n            full.release()`,
    cpp: `#include <semaphore>\n#include <mutex>\n\nstd::counting_semaphore<10> empty{10};\nstd::counting_semaphore<10> full{0};\nstd::mutex mtx;\n\nvoid produce() {\n    empty.acquire();\n    std::lock_guard<std::mutex> lock(mtx);\n    // ...\n    full.release();\n}`,
    java: `import java.util.concurrent.Semaphore;\n\nclass ProCon {\n    Semaphore empty = new Semaphore(10);\n    Semaphore full = new Semaphore(0);\n    public void produce() throws InterruptedException {\n        empty.acquire();\n        // ...\n        full.release();\n    }\n}`
  },
  dining: {
    c: `sem_t forks[5];\n\nvoid philosopher(int i) {\n    sem_wait(&forks[i]);\n    sem_wait(&forks[(i+1)%5]);\n    // Eat\n    sem_post(&forks[i]);\n    sem_post(&forks[(i+1)%5]);\n}`,
    python: `import threading\nforks = [threading.Semaphore(1) for _ in range(5)]\n\ndef philosopher(i):\n    with forks[i]:\n        with forks[(i+1)%5]:\n            print(f"P{i} eating")`,
    cpp: `#include <semaphore>\nstd::binary_semaphore forks[5]{{1}, {1}, {1}, {1}, {1}};\n\nvoid philosopher(int i) {\n    forks[i].acquire();\n    forks[(i+1)%5].acquire();\n    // eat\n    forks[i].release();\n    forks[(i+1)%5].release();\n}`,
    java: `import java.util.concurrent.Semaphore;\n\nclass Dining {\n    Semaphore[] forks = new Semaphore[5];\n    void eat(int i) throws InterruptedException {\n        forks[i].acquire();\n        forks[(i+1)%5].acquire();\n        // eat\n        forks[i].release();\n    }\n}`
  },
  rw: {
    c: `sem_t mutex, wrt;\nint readcount = 0;\n\nvoid reader() {\n    sem_wait(&mutex);\n    readcount++;\n    if (readcount == 1) sem_wait(&wrt);\n    sem_post(&mutex);\n    // Reading\n    sem_wait(&mutex);\n    readcount--;\n    if (readcount == 0) sem_post(&wrt);\n    sem_post(&mutex);\n}`,
    python: `import threading\nwrt = threading.Lock()\nmutex = threading.Lock()\nrc = 0\n\ndef reader():\n    global rc\n    with mutex: \n        rc += 1\n        if rc == 1: wrt.acquire()\n    # Read\n    with mutex:\n        rc -= 1\n        if rc == 0: wrt.release()`,
    cpp: `#include <shared_mutex>\n\nstd::shared_mutex mtx;\n\nvoid reader() {\n    std::shared_lock<std::shared_mutex> lock(mtx);\n    // Reading\n}\n\nvoid writer() {\n    std::unique_lock<std::shared_mutex> lock(mtx);\n    // Writing\n}`,
    java: `import java.util.concurrent.locks.ReentrantReadWriteLock;\n\nclass RW {\n    ReentrantReadWriteLock lock = new ReentrantReadWriteLock();\n    void read() {\n        lock.readLock().lock();\n        // ...\n        lock.readLock().unlock();\n    }\n}`
  },
  tas: {
    c: `#include <stdatomic.h>\n\natomic_bool lock = false;\n\nvoid acquire() {\n    while (atomic_exchange(&lock, true));\n}`,
    cpp: `#include <atomic>\n\nstd::atomic_flag lock = ATOMIC_FLAG_INIT;\n\nvoid acquire() {\n    while (lock.test_and_set(std::memory_order_acquire));\n}`,
    python: `# (Mock simulation of hardware instruction)\ndef test_and_set(target):\n    old = target['val']\n    target['val'] = True\n    return old\n\nlock = {'val': False}\nwhile test_and_set(lock): pass`,
    java: `import java.util.concurrent.atomic.AtomicBoolean;\n\nclass TAS {\n    AtomicBoolean lock = new AtomicBoolean(false);\n    void acquire() {\n        while (lock.getAndSet(true));\n    }\n}`
  }
};

// Fallback for others
export const getDefaultTemplate = (algo: string, lang: string) => {
  return ALGO_CODE_TEMPLATES[algo]?.[lang] || `// Implementation of ${algo} in ${lang.toUpperCase()}\n// Standard synchronization pattern applied.\n\nvoid main() {\n    // Kernel initialization\n    // Atomic logic for ${algo}\n}`;
};
