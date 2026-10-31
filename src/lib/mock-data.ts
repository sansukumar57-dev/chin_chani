import {
  StudyDocument,
  QuizQuestion,
  Flashcard,
  ChatMessage,
  TopicMastery,
  StudyPlanItem,
  UserProfile,
} from '@/types';

export const INITIAL_USER_PROFILE: UserProfile = {
  id: 'student-demo-user-1',
  fullName: 'Alex Vance',
  email: 'alex.vance@studygenie.edu',
  streakDays: 5,
  totalStudyHours: 18.5,
  documentsCount: 3,
  quizzesCount: 7,
  avgAccuracy: 78,
};

export const INITIAL_DOCUMENTS: StudyDocument[] = [
  {
    id: 'doc-physics-101',
    title: 'Newtonian Mechanics & Laws of Motion.pdf',
    subject: 'Physics',
    uploadDate: '2026-10-28',
    fileSize: '2.4 MB',
    tags: ['Mechanics', 'Forces', 'Newton Laws', 'Friction'],
    content: `Chapter 3: Newtonian Mechanics and the Laws of Motion

Isaac Newton formulated three fundamental laws of motion that describe the relationship between the forces acting on a body and its motion due to those forces.

1. First Law of Motion (Law of Inertia):
An object at rest remains at rest, and an object in motion continues in motion with constant velocity unless acted upon by a net external force. Inertia is the inherent tendency of an object to resist change in its state of motion. Mass is the quantitative measure of inertia.

2. Second Law of Motion (Law of Force and Acceleration):
The rate of change of momentum of a body is directly proportional to the applied net external force and takes place in the direction of that force. Mathematically expressed as: F_net = m * a, where F is net force in Newtons (N), m is mass in kilograms (kg), and a is acceleration in meters per second squared (m/s^2). Momentum (p) is defined as mass times velocity: p = m * v.

3. Third Law of Motion (Action and Reaction):
For every action, there is an equal and opposite reaction. When object A exerts a force on object B (F_AB), object B simultaneously exerts an equal and opposite force on object A (F_BA = -F_AB). Crucially, action and reaction forces act on DIFFERENT bodies, so they never cancel each other out.

4. Frictional Forces:
Friction is the contact force resisting relative lateral motion of two surfaces.
- Static friction (f_s <= mu_s * N): Prevents motion until maximum static threshold is reached.
- Kinetic friction (f_k = mu_k * N): Resists ongoing sliding motion, where mu_k < mu_s in almost all physical materials.
Normal force (N) is perpendicular to the contact surface.

Exam High-Yield Tip:
Never draw action-reaction pairs on the same free-body diagram. A free-body diagram should only isolate forces acting ON the object itself.`,
    summary: {
      mainTopic: 'Newtonian Mechanics & Fundamental Laws of Motion',
      overview: 'A rigorous breakdown of Newton’s three laws of motion, force calculations (F=ma), momentum, action-reaction pairs, and static versus kinetic friction.',
      keyConcepts: [
        {
          term: 'Inertia & Mass',
          explanation: 'Inertia is the resistance of any physical object to any change in its velocity; mass is its direct scalar measurement.',
          importance: 'Critical',
        },
        {
          term: 'Newton’s Second Law (F = ma)',
          explanation: 'Net force accelerates mass proportionally; fundamental equation for all classical trajectory and dynamic calculations.',
          importance: 'Critical',
        },
        {
          term: 'Action-Reaction Pairs',
          explanation: 'Forces always occur in matched pairs acting on separate bodies simultaneously (F_AB = -F_BA).',
          importance: 'High',
        },
        {
          term: 'Static vs. Kinetic Friction',
          explanation: 'Static friction adjusts up to a maximum threshold (mu_s * N); kinetic friction acts at constant value (mu_k * N) once sliding starts.',
          importance: 'High',
        },
      ],
      definitions: [
        {
          term: 'Inertia',
          definition: 'The resistance of an object to changes in its state of motion or rest.',
        },
        {
          term: 'Momentum (p)',
          definition: 'Vector quantity calculated as product of mass and velocity (p = m * v).',
        },
        {
          term: 'Normal Force (N)',
          definition: 'Perpendicular contact force exerted by a surface supporting an object.',
        },
      ],
      highYieldTakeaways: [
        'Action and reaction forces act on different bodies and therefore never cancel each other out.',
        'Net force F_net = 0 does not mean the object is stationary; it means acceleration is zero (constant velocity).',
        'Coefficient of kinetic friction (mu_k) is almost always lower than static friction (mu_s).',
        'Mass measures inertia and remains constant, whereas weight (W = mg) varies with gravity.',
        'Always draw a Free-Body Diagram (FBD) isolating single-body external forces before calculating.',
      ],
      examTips: [
        'Watch out for trick questions asking if normal force and weight are action-reaction pairs. They are NOT (both act on the same object).',
        'Break down forces into orthogonal components (X and Y axes) along and perpendicular to inclined planes.',
      ],
    },
  },
  {
    id: 'doc-bio-cell',
    title: 'Cellular Biology & Mitosis vs Meiosis.pdf',
    subject: 'Biology',
    uploadDate: '2026-10-29',
    fileSize: '3.1 MB',
    tags: ['Cytology', 'Genetics', 'Mitosis', 'Meiosis', 'DNA'],
    content: `Cell Division: Mitosis, Meiosis, and Chromosomal Inheritance

Cell division is the biological process by which a parent cell divides into two or more daughter cells.

1. The Cell Cycle:
Consists of Interphase (G1, S phase DNA replication, G2) and M phase (division).
Checkpoints (G1/S, G2/M, and Spindle checkpoint) ensure genome fidelity prior to continuation.

2. Mitosis:
Somatic cell division producing TWO genetically identical diploid (2n) daughter cells.
Stages: Prophase (chromatin condenses), Metaphase (chromosomes align on equatorial metaphase plate), Anaphase (sister chromatids pulled apart by spindle fibers), Telophase (nuclear envelopes reform) followed by Cytokinesis.
Functions: Tissue growth, cellular repair, and asexual reproduction.

3. Meiosis:
Gametic cell division producing FOUR genetically distinct haploid (n) daughter cells.
Divided into Meiosis I (reductional division) and Meiosis II (equational division).
Key source of genetic diversity:
- Crossing over (Homologous recombination) during Prophase I at chiasmata.
- Independent assortment of maternal and paternal homologues at Metaphase I.
- Random fertilization.

4. Nondisjunction:
Failure of homologous chromosomes or sister chromatids to separate properly during Anaphase I or II, resulting in aneuploidy (such as Trisomy 21 / Down Syndrome).`,
    summary: {
      mainTopic: 'Cell Division, Mitosis, and Meiotic Recombination',
      overview: 'Comprehensive review comparing somatic mitotic duplication with gametic meiotic reduction, genetic recombination mechanisms, and cell cycle checkpoints.',
      keyConcepts: [
        {
          term: 'Mitosis vs Meiosis',
          explanation: 'Mitosis results in two identical diploid (2n) cells; Meiosis results in four non-identical haploid (n) gametes.',
          importance: 'Critical',
        },
        {
          term: 'Crossing Over (Prophase I)',
          explanation: 'Exchange of genetic material between non-sister chromatids of homologous pairs generating unique recombinant chromosomes.',
          importance: 'Critical',
        },
        {
          term: 'Nondisjunction & Aneuploidy',
          explanation: 'Improper segregation of chromosomes leading to abnormal gametic chromosome counts.',
          importance: 'High',
        },
      ],
      definitions: [
        {
          term: 'Diploid (2n)',
          definition: 'A cell containing two complete chromosome sets, one from each parent.',
        },
        {
          term: 'Haploid (n)',
          definition: 'A cell possessing a single set of unpaired chromosomes (e.g., sperm and ovum).',
        },
      ],
      highYieldTakeaways: [
        'DNA replication occurs only once in Interphase (S-phase) prior to both Mitosis and Meiosis.',
        'Meiosis I separates homologous pairs; Meiosis II separates sister chromatids.',
        'Crossing over happens specifically in Prophase I at points called chiasmata.',
        'Mitosis produces 2 identical cells; Meiosis produces 4 genetically diverse cells.',
      ],
      examTips: [
        'Pay special attention to chromosome and chromatid counting at Anaphase I vs Anaphase II.',
        'Remember that spindle checkpoint tests whether kinetochores are properly attached to microtubules.',
      ],
    },
  },
  {
    id: 'doc-cs-algo',
    title: 'Data Structures & Big-O Time Complexity.pdf',
    subject: 'Computer Science',
    uploadDate: '2026-10-30',
    fileSize: '1.8 MB',
    tags: ['Algorithms', 'Data Structures', 'Big-O', 'Trees', 'Graphs'],
    content: `Algorithmic Analysis: Asymptotic Notation and Core Data Structures

1. Asymptotic Big-O Notation:
Quantifies execution time or memory utilization as input size (N) grows towards infinity:
- O(1): Constant time (Hash map key lookup, array indexing).
- O(log N): Logarithmic time (Binary search in sorted array, balanced BST search).
- O(N): Linear time (Iterating through unsorted array).
- O(N log N): Linearithmic time (MergeSort, QuickSort average case, HeapSort).
- O(N^2): Quadratic time (Nested loops, BubbleSort, SelectionSort).
- O(2^N): Exponential time (Recursive Fibonacci without memoization).

2. Linear Data Structures:
- Dynamic Arrays: O(1) random access, amortized O(1) append, O(N) insertion/deletion in middle.
- Linked Lists: O(1) insertion/deletion given pointer, O(N) random access.
- Stacks (LIFO) & Queues (FIFO): O(1) push/pop/enqueue/dequeue.

3. Hash Tables:
Provide amortized O(1) search, insert, and delete using a hash function. Collisions resolved via Chaining (linked lists) or Open Addressing (linear/quadratic probing).

4. Trees & Graphs:
- Binary Search Tree (BST): Average O(log N) operations, degraded to O(N) in skewed trees.
- Self-Balancing Trees (AVL, Red-Black): Guarantee O(log N) worst-case height.
- Graph Traversals: Breadth-First Search (BFS) using Queue (shortest path in unweighted graphs), Depth-First Search (DFS) using Stack/Recursion. Both run in O(V + E).`,
    summary: {
      mainTopic: 'Asymptotic Analysis, Big-O Complexity, and Core Data Structures',
      overview: 'Systematic study of runtime scaling, amortized complexity, and performance trade-offs among Arrays, Linked Lists, Hash Maps, Trees, and Graph search.',
      keyConcepts: [
        {
          term: 'Big-O Hierarchy',
          explanation: 'O(1) < O(log N) < O(N) < O(N log N) < O(N^2) < O(2^N); governs scalability in software systems.',
          importance: 'Critical',
        },
        {
          term: 'Hash Table Amortized O(1)',
          explanation: 'Constant-time lookups on average; degrades to O(N) if severe hash collisions occur without rehashing.',
          importance: 'Critical',
        },
        {
          term: 'BFS vs DFS Traversal',
          explanation: 'BFS uses FIFO queue for level-order/shortest paths; DFS uses LIFO recursion for cycle detection and topological sorting.',
          importance: 'High',
        },
      ],
      definitions: [
        {
          term: 'Amortized Analysis',
          definition: 'Averaging the time required to perform a sequence of operations over all the operations performed.',
        },
        {
          term: 'Topological Sort',
          definition: 'Linear ordering of vertices in a Directed Acyclic Graph (DAG) such that for every directed edge u -> v, u comes before v.',
        },
      ],
      highYieldTakeaways: [
        'MergeSort is always O(N log N) guaranteed in worst case, but requires O(N) auxiliary space.',
        'QuickSort is O(N log N) average, but degrades to O(N^2) if pivot selection is poor on pre-sorted arrays.',
        'Binary search requires the underlying array or collection to be strictly ordered.',
        'Hash collisions can be mitigated through good hash distributions and dynamic resizing with load factor ~0.75.',
      ],
      examTips: [
        'Always check whether space complexity is asked in addition to time complexity.',
        'In graph algorithms, remember that time complexity is expressed in terms of both Vertices (V) and Edges (E): O(V + E).',
      ],
    },
  },
];

export const INITIAL_QUIZ_QUESTIONS: Record<string, QuizQuestion[]> = {
  'doc-physics-101': [
    {
      id: 'q-phys-1',
      question: 'Which of the following is true regarding Newton’s third law action-reaction pairs?',
      options: [
        'They act on the same object and cancel each other out.',
        'They act on different objects and therefore never cancel each other out.',
        'They only exist when there is zero acceleration.',
        'The reaction force always occurs slightly after the action force.',
      ],
      correctAnswer: 1,
      explanation: 'Action and reaction forces act simultaneously on two distinct interacting bodies (F_AB = -F_BA), which means they cannot cancel each other.',
      topic: 'Newton Laws',
    },
    {
      id: 'q-phys-2',
      question: 'A 5 kg block rests on a table. If the coefficient of static friction is 0.4 and g = 10 m/s², what is the maximum static friction force?',
      options: ['10 N', '20 N', '50 N', '200 N'],
      correctAnswer: 1,
      explanation: 'Normal force N = m * g = 5 * 10 = 50 N. Maximum static friction f_s(max) = mu_s * N = 0.4 * 50 = 20 N.',
      topic: 'Friction',
    },
    {
      id: 'q-phys-3',
      question: 'If the net external force on an object is zero, what can be deduced about its motion?',
      options: [
        'The object must be stationary.',
        'The object must have zero velocity.',
        'The object has zero acceleration and constant velocity.',
        'The object is decelerating rapidly.',
      ],
      correctAnswer: 2,
      explanation: 'According to Newton’s First Law, F_net = 0 implies acceleration a = 0. The object can either be at rest or moving with constant velocity.',
      topic: 'Forces',
    },
    {
      id: 'q-phys-4',
      question: 'Why is the coefficient of kinetic friction (mu_k) generally lower than static friction (mu_s)?',
      options: [
        'Sliding creates microscopic cold welds that strengthen adhesion.',
        'Once sliding begins, microscopic surface asperities have less time to interlock.',
        'Kinetic friction increases the normal force.',
        'Kinetic friction defies Newton’s laws of thermodynamics.',
      ],
      correctAnswer: 1,
      explanation: 'Static contact allows microscopic irregularities to settle and bond. Once in relative motion, asperities skim over one another without deep interlocking.',
      topic: 'Friction',
    },
    {
      id: 'q-phys-5',
      question: 'A 1200 kg car accelerates uniformly from rest to 20 m/s in 5 seconds. What is the net horizontal force applied?',
      options: ['2400 N', '4800 N', '6000 N', '12000 N'],
      correctAnswer: 1,
      explanation: 'Acceleration a = (v - u) / t = (20 - 0) / 5 = 4 m/s². By F = m * a: F = 1200 * 4 = 4800 N.',
      topic: 'Mechanics',
    },
  ],
  'doc-bio-cell': [
    {
      id: 'q-bio-1',
      question: 'During which phase of meiosis does crossing over (homologous genetic recombination) occur?',
      options: ['Metaphase I', 'Prophase I', 'Anaphase II', 'Telophase I'],
      correctAnswer: 1,
      explanation: 'Crossing over takes place in Prophase I of Meiosis when homologous chromosomes pair in synapsis at chiasmata.',
      topic: 'Meiosis',
    },
    {
      id: 'q-bio-2',
      question: 'What is the primary chromosomal distinction between cells produced by mitosis vs meiosis?',
      options: [
        'Mitosis produces 4 haploid cells; Meiosis produces 2 diploid cells.',
        'Mitosis produces 2 identical diploid cells; Meiosis produces 4 unique haploid cells.',
        'Mitosis produces gametes; Meiosis produces somatic skin cells.',
        'Mitosis halves the chromosomal number.',
      ],
      correctAnswer: 1,
      explanation: 'Mitosis is an equational division yielding 2 genetically identical diploid (2n) cells, whereas meiosis yields 4 genetically diverse haploid (n) gametes.',
      topic: 'Mitosis',
    },
    {
      id: 'q-bio-3',
      question: 'What clinical condition is caused by meiotic nondisjunction of chromosome 21?',
      options: ['Turner Syndrome', 'Down Syndrome (Trisomy 21)', 'Sickle Cell Anemia', 'Cystic Fibrosis'],
      correctAnswer: 1,
      explanation: 'Nondisjunction during meiosis leads to an extra copy of chromosome 21 in gametes, giving rise to Trisomy 21 (Down Syndrome).',
      topic: 'Genetics',
    },
  ],
  'doc-cs-algo': [
    {
      id: 'q-cs-1',
      question: 'What is the worst-case time complexity of QuickSort when a poor pivot is repeatedly selected on an already sorted array?',
      options: ['O(N log N)', 'O(N)', 'O(N^2)', 'O(1)'],
      correctAnswer: 2,
      explanation: 'If the smallest or largest element is consistently picked as the pivot (e.g. naive pivot on sorted array), partitioning degrades to O(N) levels, resulting in O(N^2).',
      topic: 'Algorithms',
    },
    {
      id: 'q-cs-2',
      question: 'Which data structure is fundamentally utilized to implement Breadth-First Search (BFS) graph traversal?',
      options: ['Stack (LIFO)', 'Queue (FIFO)', 'Priority Queue', 'Red-Black Tree'],
      correctAnswer: 1,
      explanation: 'BFS explores neighbor nodes level by level using a First-In-First-Out (FIFO) Queue.',
      topic: 'Graphs',
    },
    {
      id: 'q-cs-3',
      question: 'What is the average time complexity of searching for a key in a well-balanced Hash Table?',
      options: ['O(log N)', 'O(N)', 'O(1)', 'O(N log N)'],
      correctAnswer: 2,
      explanation: 'With a uniform hash function and appropriate load factor, key lookups in a hash table execute in amortized constant time O(1).',
      topic: 'Data Structures',
    },
  ],
};

export const INITIAL_FLASHCARDS: Record<string, Flashcard[]> = {
  'doc-physics-101': [
    {
      id: 'fc-phys-1',
      documentId: 'doc-physics-101',
      topic: 'Newton Laws',
      front: 'State Newton’s 1st Law of Motion and its defining property.',
      back: 'Law of Inertia: An object remains at rest or in uniform velocity unless acted upon by a net external force. Mass is the quantitative measure of inertia.',
      status: 'mastered',
    },
    {
      id: 'fc-phys-2',
      documentId: 'doc-physics-101',
      topic: 'Newton Laws',
      front: 'Why do Newton’s 3rd Law action-reaction pairs never cancel each other out?',
      back: 'Because they act on DIFFERENT bodies simultaneously (F_AB = -F_BA). Only forces acting on the same body can cancel.',
      status: 'mastered',
    },
    {
      id: 'fc-phys-3',
      documentId: 'doc-physics-101',
      topic: 'Friction',
      front: 'What is the mathematical equation for maximum static friction?',
      back: 'f_s(max) = mu_s * Normal Force (N). Static friction matches applied lateral force up to this threshold.',
      status: 'learning',
    },
    {
      id: 'fc-phys-4',
      documentId: 'doc-physics-101',
      topic: 'Mechanics',
      front: 'What is the relationship between momentum (p) and Newton’s 2nd Law?',
      back: 'F_net = dp / dt. Net force is the time rate of change of momentum. When mass is constant, F = m * a.',
      status: 'learning',
    },
    {
      id: 'fc-phys-5',
      documentId: 'doc-physics-101',
      topic: 'Forces',
      front: 'Is Normal Force equal and opposite to Weight as an action-reaction pair?',
      back: 'NO! Both Normal force and Gravity act on the SAME object. The reaction to earth pulling the object is the object gravitationally pulling the earth.',
      status: 'unseen',
    },
  ],
  'doc-bio-cell': [
    {
      id: 'fc-bio-1',
      documentId: 'doc-bio-cell',
      topic: 'Meiosis',
      front: 'What is crossing over and where does it occur?',
      back: 'Exchange of genetic segments between non-sister homologous chromatids during Prophase I of Meiosis at chiasmata.',
      status: 'mastered',
    },
    {
      id: 'fc-bio-2',
      documentId: 'doc-bio-cell',
      topic: 'Mitosis',
      front: 'Name the four sequential stages of Mitosis.',
      back: '1. Prophase 2. Metaphase 3. Anaphase 4. Telophase (followed by Cytokinesis).',
      status: 'mastered',
    },
    {
      id: 'fc-bio-3',
      documentId: 'doc-bio-cell',
      topic: 'Genetics',
      front: 'What is Nondisjunction?',
      back: 'Failure of homologous chromosomes or sister chromatids to separate during Anaphase I or II, creating aneuploid gametes.',
      status: 'learning',
    },
  ],
  'doc-cs-algo': [
    {
      id: 'fc-cs-1',
      documentId: 'doc-cs-algo',
      topic: 'Algorithms',
      front: 'What is the worst-case and average-case complexity of MergeSort?',
      back: 'Guaranteed O(N log N) in all cases (worst, average, best). Trade-off: requires O(N) auxiliary memory.',
      status: 'mastered',
    },
    {
      id: 'fc-cs-2',
      documentId: 'doc-cs-algo',
      topic: 'Data Structures',
      front: 'What is the time complexity of searching an element in an unsorted vs sorted array?',
      back: 'Unsorted array: O(N) linear search. Sorted array: O(log N) using Binary Search.',
      status: 'learning',
    },
  ],
};

export const INITIAL_TOPIC_MASTERY: TopicMastery[] = [
  {
    topic: 'Newton Laws',
    subject: 'Physics',
    accuracy: 94,
    totalQuestions: 16,
    correctAnswers: 15,
    status: 'Mastered',
    recommendation: 'Exceptional comprehension! Challenge yourself with rotational dynamics and planetary orbits.',
  },
  {
    topic: 'Friction & Normal Forces',
    subject: 'Physics',
    accuracy: 45,
    totalQuestions: 11,
    correctAnswers: 5,
    status: 'Needs Revision',
    recommendation: 'Priority review: practice calculating normal force components on inclined planes with mu_s and mu_k.',
  },
  {
    topic: 'Meiosis & Crossing Over',
    subject: 'Biology',
    accuracy: 88,
    totalQuestions: 8,
    correctAnswers: 7,
    status: 'Mastered',
    recommendation: 'Solid understanding of chiasmata and recombination. Ready for advanced pedigree analysis.',
  },
  {
    topic: 'Aneuploidy & Nondisjunction',
    subject: 'Biology',
    accuracy: 60,
    totalQuestions: 10,
    correctAnswers: 6,
    status: 'Improving',
    recommendation: 'Review the distinction between Anaphase I nondisjunction (all gametes abnormal) vs Anaphase II.',
  },
  {
    topic: 'Big-O & Algorithm Scaling',
    subject: 'Computer Science',
    accuracy: 85,
    totalQuestions: 14,
    correctAnswers: 12,
    status: 'Mastered',
    recommendation: 'Great grasp of polynomial and log linear scaling. Explore amortized dynamic array resizing.',
  },
  {
    topic: 'Graph Traversals (BFS / DFS)',
    subject: 'Computer Science',
    accuracy: 42,
    totalQuestions: 12,
    correctAnswers: 5,
    status: 'Needs Revision',
    recommendation: 'Critical gap: review Queue-based level-order search vs recursive stack-based cycle detection.',
  },
];

export const INITIAL_STUDY_PLAN: StudyPlanItem[] = [
  {
    id: 'sp-1',
    day: 'Monday',
    topic: 'Friction on Inclined Planes (Physics)',
    durationMinutes: 30,
    type: 'AI Tutor',
    completed: true,
  },
  {
    id: 'sp-2',
    day: 'Tuesday',
    topic: 'Graph Traversals BFS/DFS (Computer Science)',
    durationMinutes: 25,
    type: 'Quiz',
    completed: false,
  },
  {
    id: 'sp-3',
    day: 'Wednesday',
    topic: 'Nondisjunction & Chromosomal Karyotypes (Biology)',
    durationMinutes: 20,
    type: 'Flashcards',
    completed: false,
  },
  {
    id: 'sp-4',
    day: 'Thursday',
    topic: 'Newton’s 3rd Law Momentum Collisions',
    durationMinutes: 35,
    type: 'Review',
    completed: false,
  },
  {
    id: 'sp-5',
    day: 'Friday',
    topic: 'Comprehensive High-Yield Mixed Practice Quiz',
    durationMinutes: 45,
    type: 'Quiz',
    completed: false,
  },
];

export const INITIAL_CHAT_MESSAGES: Record<string, ChatMessage[]> = {
  'doc-physics-101': [
    {
      id: 'msg-init-1',
      sender: 'assistant',
      text: "Hello! I'm your StudyGenie AI Tutor for **Newtonian Mechanics & Laws of Motion**. Ask me any question, ask for simple analogies, exam tips, or step-by-step problem breakdowns grounded in your notes!",
      timestamp: '10:00 AM',
    },
    {
      id: 'msg-init-2',
      sender: 'user',
      text: 'Explain why action and reaction forces don’t cancel each other out in simple terms with an example.',
      timestamp: '10:02 AM',
    },
    {
      id: 'msg-init-3',
      sender: 'assistant',
      text: `### Why Action and Reaction Never Cancel

Here is the key rule that many exam questions test: **Forces can only cancel out if they are acting on the EXACT SAME object.**

#### The Skateboard Example:
Imagine you are standing on a skateboard and you push firmly against a heavy brick wall:
1. **Action Force:** Your hands exert a force forward **ON THE WALL**.
2. **Reaction Force:** The wall simultaneously exerts an equal force backward **ON YOU**.

Because the wall's force acts **on your body**, you roll backward!
The two forces act on two completely different objects (your body vs. the brick wall), so they cannot cancel each other.

**Exam Rule of Thumb:** When drawing a Free-Body Diagram for any object, only include forces exerted *by other things on that object*. Never draw an action-reaction pair on the same diagram!`,
      timestamp: '10:03 AM',
      citations: ['Section 3: Third Law of Motion', 'Exam High-Yield Tip'],
    },
  ],
};

