// src/data/topicsData.ts
export interface TopicSeed {
  slug: string;
  title: string;
  stage: string;
  category: string;
  summary: string;
  description: string;
  estimatedHours: number;
  orderIndex: number;
  subtopics: { slug: string; title: string; description: string }[];
  prerequisites: string[]; // slugs
}

export const TOPICS_DATA: TopicSeed[] = [
  // --- NEWBIE (0 - 999) ---
  {
    slug: 'prog-fundamentals',
    title: 'Programming Fundamentals',
    stage: 'Newbie',
    category: 'Fundamentals',
    summary: 'Master standard I/O, fast I/O, primitive data types, arrays, conditionals, loops, and functions.',
    description: 'The absolute prerequisite for CP. Learn fast input/output techniques, 64-bit integer overflows, formatting floating points, multidimensional arrays, and clean modular code.',
    estimatedHours: 8,
    orderIndex: 1,
    subtopics: [
      { slug: 'fast-io', title: 'Fast I/O & Basic Types', description: 'cin.tie(NULL), ios_base::sync_with_stdio(false), long long precision, and EOF handling.' },
      { slug: 'loops-conditions', title: 'Loops & Conditionals', description: 'Nested loops, break/continue, conditionals, and switch statements.' },
      { slug: 'arrays-strings', title: 'Arrays & String Manipulation', description: 'Fixed and dynamic arrays, std::string methods, ASCII arithmetic.' },
      { slug: 'functions-recursion-basics', title: 'Functions & Simple Recursion', description: 'Pass-by-value vs pass-by-reference, base cases, recursion stack.' }
    ],
    prerequisites: []
  },
  {
    slug: 'time-space-complexity',
    title: 'Complexity Analysis (Big-O)',
    stage: 'Newbie',
    category: 'Fundamentals',
    summary: 'Understand time and space complexity, operation counting, and judging constraints within 1.0s.',
    description: 'Learn how to map N constraints (10^5, 10^7, 10^18) to acceptable asymptotic bounds (O(N), O(N log N), O(sqrt(N)), O(1)).',
    estimatedHours: 4,
    orderIndex: 2,
    subtopics: [
      { slug: 'big-o-notation', title: 'Big-O, Omega, and Theta', description: 'Formal asymptotic definitions and practical competitive counting.' },
      { slug: 'operation-counting', title: '1-Second Rule & Ops Counting', description: '~10^8 operations per second in C++, cache effects, constant factors.' },
      { slug: 'space-limits', title: 'Space Limits & Memory Footprints', description: 'Stack limits, 256MB memory bounds, vector reallocation overhead.' }
    ],
    prerequisites: ['prog-fundamentals']
  },
  {
    slug: 'basic-sorting-searching',
    title: 'Sorting & Searching Basics',
    stage: 'Newbie',
    category: 'Algorithms',
    summary: 'Custom comparators, std::sort, linear search, and binary search fundamentals.',
    description: 'Sorting enables greedy choices and binary search. Master std::sort with custom lambdas and structs, stability, and lower_bound/upper_bound on sorted arrays.',
    estimatedHours: 8,
    orderIndex: 3,
    subtopics: [
      { slug: 'std-sort-comparators', title: 'std::sort & Custom Comparators', description: 'Strict weak ordering, lambdas, multi-field tie-breaking.' },
      { slug: 'linear-search', title: 'Linear Search & Sentinel Checks', description: 'Early exit conditions and sentinel values.' },
      { slug: 'binary-search-intro', title: 'Introductory Binary Search', description: 'std::lower_bound, std::upper_bound, manual while(l <= r).' }
    ],
    prerequisites: ['prog-fundamentals', 'time-space-complexity']
  },
  {
    slug: 'prefix-sums-diff-arrays',
    title: 'Prefix Sums & Difference Arrays',
    stage: 'Newbie',
    category: 'Data Structures',
    summary: 'Turn O(N) range queries into O(1) and range updates into O(1) with 1D/2D arrays.',
    description: 'The foundation of range queries. Calculate running cumulative sums, 2D grid sub-rectangle sums with inclusion-exclusion, and range addition updates.',
    estimatedHours: 6,
    orderIndex: 4,
    subtopics: [
      { slug: '1d-prefix-sums', title: '1D Prefix Sums', description: 'Cumulative sum array, 1-indexed indexing, subarray queries in O(1).' },
      { slug: 'difference-arrays', title: '1D Difference Arrays', description: 'Range increment [l, r] in O(1) time and reconstruction in O(N).' },
      { slug: '2d-prefix-sums', title: '2D Prefix Sums', description: 'Grid subrectangle queries using PIE formula: pref[r2][c2] - pref[r1-1][c2] - ...' }
    ],
    prerequisites: ['prog-fundamentals']
  },
  {
    slug: 'frequency-hash-maps',
    title: 'Frequency Arrays & Hash Maps',
    stage: 'Newbie',
    category: 'Data Structures',
    summary: 'Counting frequencies, hashing strings and numbers, std::map vs std::unordered_map.',
    description: 'Learn frequency indexing, coordinate hashing, avoiding anti-hash tests in Codeforces for unordered_map via custom hashes, and ordered lookups.',
    estimatedHours: 6,
    orderIndex: 5,
    subtopics: [
      { slug: 'frequency-arrays', title: 'Direct Address Frequency Arrays', description: 'Character frequency, small integer tallying in O(1).' },
      { slug: 'std-map-unordered-map', title: 'std::map vs std::unordered_map', description: 'Red-black tree O(log N) vs hash table O(1) average, worst-case O(N) collisions.' },
      { slug: 'custom-hash', title: 'Anti-Hash Protection in C++', description: 'Custom splitmix64 hash functor to prevent 10^5 hash collision hacks.' }
    ],
    prerequisites: ['prog-fundamentals']
  },
  {
    slug: 'two-pointers-sliding-window',
    title: 'Two Pointers & Sliding Window',
    stage: 'Newbie',
    category: 'Algorithms',
    summary: 'Monotonic range expansion and contraction for linear time complexity.',
    description: 'Replace nested O(N^2) loops with O(N) linear scans. Learn opposite-direction two pointers (palindrome, pair sum) and same-direction sliding window (subarray constraints).',
    estimatedHours: 8,
    orderIndex: 6,
    subtopics: [
      { slug: 'opposite-two-pointers', title: 'Opposite Direction Pointers', description: 'Two Sum on sorted arrays, palindromes, container problem.' },
      { slug: 'fixed-sliding-window', title: 'Fixed-Size Sliding Window', description: 'Subarrays of exact length K, maintain state with fast sliding.' },
      { slug: 'variable-sliding-window', title: 'Variable-Size Sliding Window', description: 'Expanding right pointer and shrinking left pointer under monotonicity.' }
    ],
    prerequisites: ['basic-sorting-searching']
  },
  {
    slug: 'basic-math-modular',
    title: 'Basic Math & Modular Arithmetic',
    stage: 'Newbie',
    category: 'Mathematics',
    summary: 'GCD, LCM, Prime checks, Divisibility rules, and addition/multiplication under modulo 10^9+7.',
    description: 'Crucial for passing almost all CP problems. Master Euclidean algorithm, trial division up to sqrt(N), and avoiding negative mod arithmetic bug.',
    estimatedHours: 8,
    orderIndex: 7,
    subtopics: [
      { slug: 'gcd-lcm', title: 'Euclidean GCD & LCM', description: 'std::gcd, iterative Euclid, LCM formula with overflow prevention.' },
      { slug: 'trial-division-primes', title: 'Primality Testing & Divisors in O(sqrt(N))', description: 'Finding all divisors and prime factors up to square root of N.' },
      { slug: 'modular-arithmetic-rules', title: 'Modular Arithmetic Essentials', description: '(a+b)%MOD, (a*b)%MOD, handling negative modulo (a%MOD + MOD)%MOD.' }
    ],
    prerequisites: ['prog-fundamentals']
  },
  {
    slug: 'basic-bit-manipulation',
    title: 'Bit Manipulation Fundamentals',
    stage: 'Newbie',
    category: 'Mathematics',
    summary: 'Bitwise AND, OR, XOR, NOT, left/right shifts, set bit operations, and power of 2 tricks.',
    description: 'Learn binary representation, bitwise operators, __builtin_popcount, __builtin_clz, extracting the lowest set bit (x & -x), and iterating subsets of size <= 20.',
    estimatedHours: 6,
    orderIndex: 8,
    subtopics: [
      { slug: 'bitwise-operators', title: 'Operators & Bit Masks', description: '&, |, ^, ~, <<, >> and operator precedence traps.' },
      { slug: 'built-in-intrinsics', title: 'GCC Builtins & Bit Hacks', description: '__builtin_popcountll, __builtin_ctz, x & (x - 1), x & (-x).' },
      { slug: 'iterating-subsets-small', title: 'Iterating All Subsets (2^N)', description: 'Using integer bits as set elements for N <= 20.' }
    ],
    prerequisites: ['prog-fundamentals']
  },
  {
    slug: 'basic-greedy',
    title: 'Basic Greedy Algorithms',
    stage: 'Newbie',
    category: 'Algorithms',
    summary: 'Greedy choice property, interval scheduling, exchange arguments, and sorting + greedy.',
    description: 'Greedy strategies make locally optimal decisions. Learn standard greedy paradigms like interval scheduling, fractional knapsack, and how to verify correctness.',
    estimatedHours: 8,
    orderIndex: 9,
    subtopics: [
      { slug: 'sorting-greedy', title: 'Sort and Pick Greedy', description: 'Activity selection, sorting by endpoints, processing largest/smallest.' },
      { slug: 'interval-problems', title: 'Interval Scheduling & Merging', description: 'Merging overlapping intervals, non-overlapping interval maximization.' },
      { slug: 'exchange-arguments-intro', title: 'Exchange Argument Intuition', description: 'Proving that swapping adjacent inversions does not worsen the solution.' }
    ],
    prerequisites: ['basic-sorting-searching']
  },

  // --- PUPIL (1000 - 1199) ---
  {
    slug: 'binary-search-on-answer',
    title: 'Binary Search on Answer',
    stage: 'Pupil',
    category: 'Algorithms',
    summary: 'Monotonic predicate checking for min-max or max-min optimization problems.',
    description: 'One of the most frequent patterns in Div. 2 B and C. Formulate check(x) function that returns true/false monotonically, and binary search over value range.',
    estimatedHours: 10,
    orderIndex: 10,
    subtopics: [
      { slug: 'monotonic-predicate', title: 'Monotonic Predicate Design', description: 'Identifying FFFTTT or TTTFFF search spaces.' },
      { slug: 'bs-discrete-search', title: 'Integer Binary Search Bounds', description: 'Choosing low, high, mid calculation avoiding overflow (l + (r-l)/2).' },
      { slug: 'floating-point-bs', title: 'Continuous & Floating Point Binary Search', description: 'Fixed iterations (for i=0; i<100) vs epsilon convergence.' }
    ],
    prerequisites: ['basic-sorting-searching']
  },
  {
    slug: 'standard-data-structures-stl',
    title: 'Stacks, Queues, Multisets & Priority Queues',
    stage: 'Pupil',
    category: 'Data Structures',
    summary: 'std::stack, std::queue, std::deque, std::priority_queue, and std::multiset.',
    description: 'Master linear and associative containers in C++ STL. Understand multiset element deletion by iterator vs value, max-heaps vs min-heaps, and deque double-ended queues.',
    estimatedHours: 10,
    orderIndex: 11,
    subtopics: [
      { slug: 'stacks-and-queues', title: 'Stacks & Queues', description: 'FIFO vs LIFO, bracket matching, queue simulations.' },
      { slug: 'priority-queues', title: 'Priority Queues (Binary Heaps)', description: 'std::priority_queue<T, vector<T>, greater<T>>, O(log N) push/pop.' },
      { slug: 'multisets-subtleties', title: 'std::multiset Subtleties', description: 'ms.erase(val) vs ms.erase(ms.find(val)), lower_bound on set.' }
    ],
    prerequisites: ['frequency-hash-maps']
  },
  {
    slug: 'recursion-backtracking',
    title: 'Recursion & Backtracking',
    stage: 'Pupil',
    category: 'Algorithms',
    summary: 'State-space tree exploration, permutations, combinations, N-Queens, and pruning.',
    description: 'Systematic exhaustive search. Master building permutations, subsets, partition problems, recursion state restoration (backtracking), and branch-and-bound pruning.',
    estimatedHours: 10,
    orderIndex: 12,
    subtopics: [
      { slug: 'subset-generation-recursion', title: 'Subset & Combination Generation', description: 'Pick or skip choices, lexicographical combination trees.' },
      { slug: 'permutation-generation', title: 'Permutations & std::next_permutation', description: 'Recursive permutation tree and C++ STL next_permutation.' },
      { slug: 'backtracking-pruning', title: 'Constraint Pruning & Board Games', description: 'Sudoku, N-Queens, grid search with visited state restoration.' }
    ],
    prerequisites: ['prog-fundamentals']
  },
  {
    slug: 'number-theory-sieve',
    title: 'Sieve of Eratosthenes & Divisors',
    stage: 'Pupil',
    category: 'Mathematics',
    summary: 'Generate all primes up to 10^7 in O(N log log N), linear sieve, prime factorization.',
    description: 'Prime generation and factoring. Master Sieve of Eratosthenes, smallest prime factor (SPF) array for O(log N) prime factorizations, and Euler phi function intro.',
    estimatedHours: 10,
    orderIndex: 13,
    subtopics: [
      { slug: 'eratosthenes-sieve', title: 'Standard Sieve of Eratosthenes', description: 'Boolean array sieve up to 10^7, odd-number memory optimization.' },
      { slug: 'spf-factorization', title: 'Smallest Prime Factor (SPF) Linear Sieve', description: 'Precomputing SPF for fast multi-query O(log X) prime factorization.' },
      { slug: 'number-of-divisors-formula', title: 'Divisor Count & Sum Functions', description: 'Tau(N) and Sigma(N) derived from prime exponent decomposition.' }
    ],
    prerequisites: ['basic-math-modular']
  },
  {
    slug: 'graph-traversal-bfs-dfs',
    title: 'Graph Traversal (BFS & DFS)',
    stage: 'Pupil',
    category: 'Graphs',
    summary: 'Adjacency lists, Breadth-First Search (shortest path in unweighted graphs), Depth-First Search.',
    description: 'The foundation of graph theory. Represent graphs with vectors of vectors, explore connected components, find shortest path on unweighted graphs with BFS, and detect cycles.',
    estimatedHours: 12,
    orderIndex: 14,
    subtopics: [
      { slug: 'adj-list-representation', title: 'Graph Representations', description: 'Adjacency matrix vs Adjacency list, directed vs undirected, weighted graphs.' },
      { slug: 'bfs-traversal', title: 'Breadth-First Search (BFS)', description: 'Queue-based traversal, shortest hop distances, multi-source BFS.' },
      { slug: 'dfs-connected-components', title: 'Depth-First Search (DFS)', description: 'Call-stack DFS, connected components, 2D grid flood fill.' },
      { slug: 'bipartite-graph-check', title: 'Bipartite Graph Coloring', description: '2-coloring using BFS/DFS, odd cycle equivalence.' }
    ],
    prerequisites: ['standard-data-structures-stl', 'recursion-backtracking']
  },
  {
    slug: 'tree-fundamentals',
    title: 'Tree Fundamentals',
    stage: 'Pupil',
    category: 'Graphs',
    summary: 'Tree properties (N vertices, N-1 edges), tree diameter, center, subtree sizes, and heights.',
    description: 'Trees are connected acyclic graphs. Learn parent-child relationships, rootings, calculating subtree sizes in DFS, and finding the tree diameter via 2 BFSs.',
    estimatedHours: 10,
    orderIndex: 15,
    subtopics: [
      { slug: 'tree-dfs-properties', title: 'Tree DFS & Subtree Calculation', description: 'Running DFS without visited array (checking u != parent).' },
      { slug: 'tree-diameter', title: 'Tree Diameter Calculation', description: 'Double BFS method and DP method for finding longest path in tree.' },
      { slug: 'tree-centers-distances', title: 'Tree Center & All-Pair Distances', description: 'Finding the midpoint of diameter, tree eccentricity.' }
    ],
    prerequisites: ['graph-traversal-bfs-dfs']
  },

  // --- SPECIALIST (1200 - 1399) ---
  {
    slug: 'disjoint-set-union',
    title: 'Disjoint Set Union (DSU)',
    stage: 'Specialist',
    category: 'Data Structures',
    summary: 'Union-Find data structure with path compression and union by rank/size in O(alpha(N)).',
    description: 'Dynamic connectivity data structure. Master find and union operations, size/rank tracking, finding connected components, detecting cycles, and weighted DSU.',
    estimatedHours: 10,
    orderIndex: 16,
    subtopics: [
      { slug: 'dsu-path-compression', title: 'Path Compression & Union by Rank/Size', description: 'Inverse Ackermann time complexity, root parent updates.' },
      { slug: 'dsu-cycle-detection', title: 'Cycle Detection & Component Tracking', description: 'Checking whether edge (u, v) creates a cycle, component sizes.' },
      { slug: 'potential-weighted-dsu', title: 'Potential / Weighted DSU', description: 'Maintaining parity or relative weights between connected nodes.' }
    ],
    prerequisites: ['tree-fundamentals']
  },
  {
    slug: 'shortest-paths-dijkstra',
    title: 'Shortest Paths (Dijkstra & 0-1 BFS)',
    stage: 'Specialist',
    category: 'Graphs',
    summary: 'Dijkstra with priority queue O((V+E) log V), 0-1 BFS with std::deque O(V+E).',
    description: 'Shortest path algorithms on weighted graphs with non-negative edges. Master Dijkstra state tuples, distance array initialization, and 0-1 BFS for binary edge weights.',
    estimatedHours: 12,
    orderIndex: 17,
    subtopics: [
      { slug: '0-1-bfs', title: '0-1 BFS with std::deque', description: 'Pushing 0-weight edges to front and 1-weight edges to back in O(V+E).' },
      { slug: 'dijkstra-standard', title: 'Standard Dijkstra with Priority Queue', description: 'Min-heap priority_queue<pair<long long, int>>, skipping stale states.' },
      { slug: 'dijkstra-state-expansion', title: 'State-Graph Dijkstra', description: 'Expanding node states with fuel, tickets, or remaining k discounts.' }
    ],
    prerequisites: ['graph-traversal-bfs-dfs', 'standard-data-structures-stl']
  },
  {
    slug: 'minimum-spanning-tree',
    title: 'Minimum Spanning Tree (Kruskal & Prim)',
    stage: 'Specialist',
    category: 'Graphs',
    summary: 'Kruskal with DSU O(E log E) and Prim algorithm. Cut property of MST.',
    description: 'Finding subset of edges that connects all vertices with minimum total weight. Master Kruskal sorting edges by weight + DSU, maximum spanning trees, and minimax paths.',
    estimatedHours: 10,
    orderIndex: 18,
    subtopics: [
      { slug: 'kruskal-algorithm', title: 'Kruskal Algorithm with DSU', description: 'Greedy edge selection, cycle prevention via DSU, proof of correctness.' },
      { slug: 'prim-algorithm', title: 'Prim Algorithm', description: 'Dense graph vs sparse graph considerations with priority queue.' },
      { slug: 'mst-properties', title: 'Minimax & Maximum Spanning Trees', description: 'Bottleneck edges, cycle and cut properties of spanning trees.' }
    ],
    prerequisites: ['disjoint-set-union']
  },
  {
    slug: 'topological-sort-dag',
    title: 'Topological Sort & DAGs',
    stage: 'Specialist',
    category: 'Graphs',
    summary: 'Kahn algorithm with in-degrees, DFS post-order reversal, cycle detection in directed graphs.',
    description: 'Linear ordering of vertices in Directed Acyclic Graphs. Master Kahn in-degree algorithm with queues, lexicographically smallest topological sort with priority_queue.',
    estimatedHours: 8,
    orderIndex: 19,
    subtopics: [
      { slug: 'kahn-algorithm', title: 'Kahn Algorithm (In-degree queue)', description: 'Tracking in-degrees, decrementing neighbors, cycle detection.' },
      { slug: 'lexicographical-toposort', title: 'Lexicographical Topological Sort', description: 'Using priority queue to produce smallest linear ordering.' },
      { slug: 'dag-longest-path', title: 'Longest/Shortest Paths on DAGs', description: 'Dynamic programming on DAG in topological order in O(V+E).' }
    ],
    prerequisites: ['graph-traversal-bfs-dfs']
  },
  {
    slug: 'dynamic-programming-1d-knapsack',
    title: 'Dynamic Programming: 1D & Knapsack',
    stage: 'Specialist',
    category: 'Dynamic Programming',
    summary: 'Memoization, tabulation, 0/1 knapsack, unbounded knapsack, and transition spaces.',
    description: 'The turning point for CP. Transition from recursion to overlapping subproblems. Master 1D state representations, space optimization to 1 array, and subset sum.',
    estimatedHours: 14,
    orderIndex: 20,
    subtopics: [
      { slug: 'memoization-tabulation', title: 'Memoization vs Tabulation', description: 'Top-down with cache array vs bottom-up forward/backward push transitions.' },
      { slug: '0-1-knapsack', title: '0/1 Knapsack Problem', description: 'Choosing subset under weight W, iterating capacity backward for 1D space.' },
      { slug: 'unbounded-knapsack-coin-change', title: 'Unbounded Knapsack & Coin Change', description: 'Iterating capacity forward for multiple use, counting ways vs minimum coins.' }
    ],
    prerequisites: ['recursion-backtracking']
  },
  {
    slug: 'dp-subsequences-grid',
    title: 'DP on Subsequences & 2D Grids',
    stage: 'Specialist',
    category: 'Dynamic Programming',
    summary: 'Longest Increasing Subsequence (LIS) O(N log N), Longest Common Subsequence (LCS), 2D grid DP.',
    description: 'Classic DP problems. Master O(N^2) and O(N log N) patience sorting for LIS using binary search, LCS table reconstruction, and path counting in grids with obstacles.',
    estimatedHours: 12,
    orderIndex: 21,
    subtopics: [
      { slug: 'lis-nlogn', title: 'Longest Increasing Subsequence in O(N log N)', description: 'Patience sorting, tails array, std::lower_bound replacement.' },
      { slug: 'lcs-and-edit-distance', title: 'Longest Common Subsequence & Edit Distance', description: 'Two-string alignment matrix, match/insert/delete operations.' },
      { slug: 'grid-dp-paths', title: '2D Grid DP & Path Reconstruction', description: 'Counting paths, collecting maximum points, back-tracing path.' }
    ],
    prerequisites: ['dynamic-programming-1d-knapsack', 'binary-search-on-answer']
  },
  {
    slug: 'fenwick-tree-bit',
    title: 'Fenwick Tree (Binary Indexed Tree)',
    stage: 'Specialist',
    category: 'Data Structures',
    summary: 'Point update and range prefix sum query in O(log N) with minimal code.',
    description: 'The most lightweight and cache-friendly range query structure. Master LSB trick (i & -i), 1-based indexing, range updates with point queries, and inversion counting.',
    estimatedHours: 10,
    orderIndex: 22,
    subtopics: [
      { slug: 'fenwick-point-update-range-query', title: 'Point Update Range Query (PURQ)', description: 'bit[i] sums intervals of length lowbit(i), update and query loops.' },
      { slug: 'inversion-counting-fenwick', title: 'Inversion Counting with Coordinate Compression', description: 'Sorting values, compressing to [1..N], querying greater elements.' },
      { slug: 'fenwick-range-update', title: 'Range Update Point Query (RUPQ)', description: 'Applying difference array concepts over a Fenwick Tree.' }
    ],
    prerequisites: ['prefix-sums-diff-arrays', 'basic-bit-manipulation']
  },
  {
    slug: 'segment-tree-basics',
    title: 'Segment Tree Fundamentals',
    stage: 'Specialist',
    category: 'Data Structures',
    summary: 'Point update, range sum/min/max query in O(log N) with array representation.',
    description: 'The workhorse of competitive programming. Master tree size (4*N), divide and conquer tree building, point updates, range associative queries, and walking the tree.',
    estimatedHours: 14,
    orderIndex: 23,
    subtopics: [
      { slug: 'segtree-build-query', title: 'Segment Tree Build & Range Queries', description: 'Recursive 4*N structure, left child 2*node, right child 2*node+1.' },
      { slug: 'segtree-point-update', title: 'Point Updates & Associative Merging', description: 'Updating single leaf and recomputing ancestors in O(log N).' },
      { slug: 'segtree-walk-binary-search', title: 'Walking the Segment Tree (Binary Search)', description: 'Finding the first element >= X in a range in O(log N) instead of O(log^2 N).' }
    ],
    prerequisites: ['binary-search-on-answer', 'tree-fundamentals']
  },
  {
    slug: 'sparse-table-rmq',
    title: 'Sparse Table (Range Minimum Query)',
    stage: 'Specialist',
    category: 'Data Structures',
    summary: 'O(N log N) static precomputation and O(1) idempotent range queries (min, max, gcd).',
    description: 'For static arrays without updates, sparse tables answer range minimum/maximum/gcd queries in O(1) by overlapping two power-of-two intervals.',
    estimatedHours: 8,
    orderIndex: 24,
    subtopics: [
      { slug: 'sparse-table-construction', title: 'Table Construction & Log Precomputation', description: 'st[i][j] covers [j, j + 2^i - 1], bit shifts, __builtin_clz.' },
      { slug: 'idempotent-queries', title: 'O(1) Idempotent Range Queries', description: 'Querying min(st[k][L], st[k][R - (1<<k) + 1]) for k = floor(log2(len)).' }
    ],
    prerequisites: ['basic-bit-manipulation']
  },
  {
    slug: 'combinatorics-fast-exponentiation',
    title: 'Combinatorics & Fast Exponentiation',
    stage: 'Specialist',
    category: 'Mathematics',
    summary: 'Binary exponentiation O(log P), Fermat Little Theorem modular inverse, nCr formulas.',
    description: 'Compute a^b mod m in O(log b), modular inverse for prime moduli, precomputing factorials and inverse factorials up to 10^6 for O(1) combination queries nCr.',
    estimatedHours: 10,
    orderIndex: 25,
    subtopics: [
      { slug: 'binary-exponentiation', title: 'Binary Exponentiation', description: 'Repeated squaring, handling large powers, matrix exponentiation intro.' },
      { slug: 'modular-inverse-fermat', title: 'Modular Inverse (Fermat Little Theorem)', description: 'inv(a) = a^(MOD-2) mod MOD for prime MOD.' },
      { slug: 'precomputing-ncr', title: 'O(1) nCr with Factorial Precomputations', description: 'fact[i] and invFact[i] arrays, handling n < r edge cases.' }
    ],
    prerequisites: ['basic-math-modular', 'number-theory-sieve']
  },
  {
    slug: 'bitmask-dp-fundamentals',
    title: 'Bitmask DP Fundamentals',
    stage: 'Specialist',
    category: 'Dynamic Programming',
    summary: 'Represent subsets as integer bitmasks, Traveling Salesperson Problem (TSP) in O(N^2 * 2^N).',
    description: 'When N is small (N <= 20), subsets can be encoded as integers from 0 to 2^N - 1. Learn Hamiltonian paths, matching small sets, and submask iteration in O(3^N).',
    estimatedHours: 12,
    orderIndex: 26,
    subtopics: [
      { slug: 'tsp-bitmask-dp', title: 'Traveling Salesperson Problem (TSP)', description: 'dp[mask][u] shortest path visiting subset of vertices in mask ending at u.' },
      { slug: 'submask-iteration', title: 'Submask Enumeration in O(3^N)', description: 'for (int s = m; s > 0; s = (s - 1) & m) for efficient subset convolutions.' }
    ],
    prerequisites: ['dynamic-programming-1d-knapsack', 'basic-bit-manipulation']
  },

  // --- EXPERT (1400 - 1599) ---
  {
    slug: 'lowest-common-ancestor-binary-lifting',
    title: 'Lowest Common Ancestor (LCA) & Binary Lifting',
    stage: 'Expert',
    category: 'Trees',
    summary: 'Binary lifting table up[node][i] in O(N log N) precomputation, O(log N) LCA and distance queries.',
    description: 'Find ancestor at 2^i jumps. Compute LCA of any two nodes, tree distance dist(u, v) = depth[u] + depth[v] - 2*depth[lca], and path queries on trees.',
    estimatedHours: 12,
    orderIndex: 27,
    subtopics: [
      { slug: 'binary-lifting-table', title: 'Binary Lifting Precomputation', description: 'up[u][i] = up[up[u][i-1]][i-1], depth array calculation.' },
      { slug: 'lca-query-algorithm', title: 'LCA Query in O(log N)', description: 'Lifting deeper node to same level, then lifting both simultaneously.' },
      { slug: 'tree-difference-arrays', title: 'Tree Difference Arrays / Path Accumulation', description: 'Adding values on path u-v by updating u, v, lca, and parent(lca).' }
    ],
    prerequisites: ['tree-fundamentals', 'sparse-table-rmq']
  },
  {
    slug: 'tree-dp-rerooting',
    title: 'Tree DP & Rerooting DP',
    stage: 'Expert',
    category: 'Dynamic Programming',
    summary: 'Subtree DP aggregation and O(N) rerooting technique to compute tree answer for every root.',
    description: 'Solve tree problems where answer for every vertex as root is required in O(N). First pass: bottom-up DP. Second pass: top-down parent transition propagation.',
    estimatedHours: 14,
    orderIndex: 28,
    subtopics: [
      { slug: 'subtree-dp-accumulation', title: 'Bottom-up Tree DP', description: 'Combining child states into parent, tree knapsacks, tree matchings.' },
      { slug: 'rerooting-two-pass', title: 'Rerooting DP (Two-pass DFS)', description: 'First pass computes answers for rooted tree at 1; second pass shifts root.' },
      { slug: 'prefix-suffix-child-merging', title: 'Prefix-Suffix Child Merging', description: 'Removing a child contribution in O(1) without invertibility assumption.' }
    ],
    prerequisites: ['lowest-common-ancestor-binary-lifting', 'dynamic-programming-1d-knapsack']
  },
  {
    slug: 'segment-tree-lazy-propagation',
    title: 'Segment Tree with Lazy Propagation',
    stage: 'Expert',
    category: 'Data Structures',
    summary: 'Range updates (addition, assignment) and range queries in O(log N) via lazy tags.',
    description: 'When updating entire intervals [L, R], push updates down only when needed. Master pushdown, merging lazy tags, multiple tag interactions (assignment + addition).',
    estimatedHours: 14,
    orderIndex: 29,
    subtopics: [
      { slug: 'lazy-tag-pushdown', title: 'Lazy Tag Mechanism & Pushdown', description: 'Postponing updates to children until traversed, clear push() function.' },
      { slug: 'range-add-range-sum', title: 'Range Add & Range Sum Segment Tree', description: 'Multiplying tag by segment length (r - l + 1), child propagation.' },
      { slug: 'combining-multiple-lazy-tags', title: 'Compound Tags (Set & Add)', description: 'Maintaining precedence and correct combination of multiple operations.' }
    ],
    prerequisites: ['segment-tree-basics']
  },
  {
    slug: 'strongly-connected-components-bridges',
    title: 'Strongly Connected Components & Bridges',
    stage: 'Expert',
    category: 'Graphs',
    summary: 'Tarjan and Kosaraju for SCCs, finding bridges and articulation points in O(V+E).',
    description: 'Decompose directed graphs into DAG of SCCs (2-SAT fundamentals). Find critical network links (bridges) and nodes (articulation points) with tin and low arrays.',
    estimatedHours: 14,
    orderIndex: 30,
    subtopics: [
      { slug: 'bridges-articulation-points', title: 'Bridges & Articulation Points (Tarjan)', description: 'tin[u] and low[u] arrays, back-edge comparisons, bridge condition low[v] > tin[u].' },
      { slug: 'kosaraju-scc', title: 'Kosaraju 2-Pass SCC Algorithm', description: 'DFS finishing times, graph reversal, second DFS traversal.' },
      { slug: 'tarjan-scc-condensation', title: 'Tarjan SCC & Condensation DAG', description: 'Stack-based single pass SCC, compressing SCCs into a DAG.' }
    ],
    prerequisites: ['topological-sort-dag']
  },
  {
    slug: 'string-hashing-kmp-z',
    title: 'String Hashing, KMP & Z-Algorithm',
    stage: 'Expert',
    category: 'Strings',
    summary: 'Polynomial rolling hash O(1) substring queries, Knuth-Morris-Pratt, and Z-algorithm O(N).',
    description: 'String matching algorithms. Master double polynomial hashing with large prime bases, KMP pi-table (prefix function), and Z-array longest common prefixes.',
    estimatedHours: 14,
    orderIndex: 31,
    subtopics: [
      { slug: 'polynomial-rolling-hash', title: 'Double Polynomial Rolling Hash', description: 'Two independent (base, mod) pairs to eliminate collision hacks on Codeforces.' },
      { slug: 'kmp-prefix-function', title: 'KMP & Prefix Function (pi array)', description: 'Longest proper prefix that is also suffix, string period theorems.' },
      { slug: 'z-algorithm', title: 'Z-Algorithm & Z-Box', description: 'Z[i] = longest common prefix of S and S[i..N-1], linear time matching.' }
    ],
    prerequisites: ['combinatorics-fast-exponentiation']
  },
  {
    slug: 'trie-data-structure',
    title: 'Trie Data Structure & 0/1 Trie',
    stage: 'Expert',
    category: 'Data Structures',
    summary: 'Prefix tree for words and binary 0/1 trie for maximum XOR pair queries in O(30).',
    description: 'Store strings or binary representations. Master dictionary lookups, prefix counts, and 0/1 binary tries for finding the maximum XOR subarray in O(N * 30).',
    estimatedHours: 10,
    orderIndex: 32,
    subtopics: [
      { slug: 'standard-string-trie', title: 'Standard Character Trie', description: 'Alphabet nodes, prefix search, word insertions and deletions.' },
      { slug: 'binary-01-trie', title: '0/1 Trie for Maximum XOR', description: 'Greedy bit selection for opposite bit to maximize XOR in O(B).' }
    ],
    prerequisites: ['basic-bit-manipulation']
  },
  {
    slug: 'advanced-dp-digit-interval',
    title: 'Advanced DP: Digit DP & Interval DP',
    stage: 'Expert',
    category: 'Dynamic Programming',
    summary: 'Digit DP for counting numbers with digit constraints; Interval DP O(N^3) on subarrays.',
    description: 'Digit DP counts integers in [L, R] satisfying properties (sum of digits, no consecutive identical digits) using tight and leading-zero flags. Interval DP solves matrix chain / burst balloons.',
    estimatedHours: 14,
    orderIndex: 33,
    subtopics: [
      { slug: 'digit-dp-tight-flag', title: 'Digit DP Framework', description: 'dp(idx, tight, leading_zero, state) with memoization over digit strings.' },
      { slug: 'interval-dp-framework', title: 'Interval DP (Length-based iteration)', description: 'dp[l][r] = min_{k} (dp[l][k] + dp[k+1][r] + cost), Matrix Chain Multiplication.' }
    ],
    prerequisites: ['dynamic-programming-1d-knapsack', 'dp-subsequences-grid']
  },
  {
    slug: 'coordinate-compression-sweep-line',
    title: 'Coordinate Compression & Sweep Line',
    stage: 'Expert',
    category: 'Algorithms',
    summary: 'Mapping arbitrary coordinates to [0..2N], processing events along an axis.',
    description: 'Sweep line processes 2D geometric events (rectangle unions, line intersections, skyline) in order along an axis, coupled with coordinate compression.',
    estimatedHours: 12,
    orderIndex: 34,
    subtopics: [
      { slug: 'coordinate-compression', title: 'Coordinate Compression in C++', description: 'std::sort + std::unique + std::lower_bound to shrink values.' },
      { slug: 'sweep-line-events', title: 'Sweep Line Event Processing', description: 'Segment overlap, interval covering, area of union of rectangles.' }
    ],
    prerequisites: ['fenwick-tree-bit', 'segment-tree-basics']
  },
  {
    slug: 'game-theory-nim',
    title: 'Game Theory & Sprague-Grundy',
    stage: 'Expert',
    category: 'Mathematics',
    summary: 'Combinatorial games, normal play convention, Nim-sum (XOR sum), and Grundy values.',
    description: 'Impartial games under normal play convention. Learn Bouton theorem (Nim-sum = 0 means P-position), mex function, and decomposing independent games into Grundy states.',
    estimatedHours: 10,
    orderIndex: 35,
    subtopics: [
      { slug: 'game-positions-p-n', title: 'P-Positions and N-Positions', description: 'Winning and losing states, backwards induction on game DAGs.' },
      { slug: 'nim-game-xor', title: 'Game of Nim & Nim-Sum', description: 'XOR sum proof of winning strategy in pile subtraction.' },
      { slug: 'sprague-grundy-mex', title: 'Sprague-Grundy Theorem & Mex', description: 'Computing G(state) = mex({G(next_states)}) and XORing game components.' }
    ],
    prerequisites: ['basic-bit-manipulation']
  },

  // --- CANDIDATE MASTER (1600 - 1899) ---
  {
    slug: 'centroid-decomposition',
    title: 'Centroid Decomposition',
    stage: 'Candidate Master',
    category: 'Trees',
    summary: 'Divide and conquer on trees with tree centroids, recursion depth O(log N).',
    description: 'Decompose any tree into a centroid tree of height O(log N). Count paths with length K, answer dynamic distance queries, and nearest marked node queries.',
    estimatedHours: 16,
    orderIndex: 36,
    subtopics: [
      { slug: 'finding-centroid', title: 'Finding Tree Centroid in O(N)', description: 'Centroid removal leaves subtrees of size <= N/2.' },
      { slug: 'path-counting-centroid', title: 'Path Queries across Centroids', description: 'Aggregating paths passing through the centroid in O(Subtree Size).' },
      { slug: 'centroid-tree-hierarchy', title: 'Dynamic Distance Queries via Centroid Tree', description: 'Climbing O(log N) centroid ancestors to update or query shortest distance.' }
    ],
    prerequisites: ['lowest-common-ancestor-binary-lifting']
  },
  {
    slug: 'heavy-light-decomposition',
    title: 'Heavy-Light Decomposition (HLD)',
    stage: 'Candidate Master',
    category: 'Trees',
    summary: 'Partition tree edges into heavy and light paths, map tree paths to contiguous segment tree segments.',
    description: 'Answer arbitrary path queries (sum, max, updates) between any two tree nodes in O(log^2 N) by decomposing into at most O(log N) heavy chains.',
    estimatedHours: 16,
    orderIndex: 37,
    subtopics: [
      { slug: 'heavy-light-chain-split', title: 'HLD Chain Partitioning', description: 'Heavy child has largest subtree size; heavy paths mapped contiguously in Euler tour.' },
      { slug: 'hld-path-queries', title: 'Path Queries & Updates with Segment Tree', description: 'Jumping up heavy chain heads until LCA is reached in O(log^2 N).' },
      { slug: 'hld-subtree-queries', title: 'Subtree Queries in HLD', description: 'Subtree forms a single contiguous range in the flattened array in O(log N).' }
    ],
    prerequisites: ['segment-tree-lazy-propagation', 'lowest-common-ancestor-binary-lifting']
  },
  {
    slug: 'persistent-segment-tree',
    title: 'Persistent Segment Trees',
    stage: 'Candidate Master',
    category: 'Data Structures',
    summary: 'Maintain history of all versions in O(log N) memory per update by sharing unchanged nodes.',
    description: 'Answering range queries on historical versions and solving range K-th smallest queries with persistent segment trees over coordinate arrays in O(log N).',
    estimatedHours: 16,
    orderIndex: 38,
    subtopics: [
      { slug: 'persistent-node-cloning', title: 'Node Cloning & Version Roots', description: 'Creating new node for updated path, linking unchanged child pointers.' },
      { slug: 'range-kth-smallest', title: 'Range K-th Smallest Query', description: 'Difference between root[R] and root[L-1] to walk the frequency tree.' }
    ],
    prerequisites: ['segment-tree-basics']
  },
  {
    slug: 'mos-algorithm-offline-queries',
    title: "Mo's Algorithm & Offline Queries",
    stage: 'Candidate Master',
    category: 'Algorithms',
    summary: 'Sort queries by blocks of size sqrt(N) to achieve O((N + Q) * sqrt(N)) time complexity.',
    description: 'Offline range query processing. Maintain active window [curl, curr] with add(idx) and remove(idx) operations. Hilbert curve sorting optimization.',
    estimatedHours: 14,
    orderIndex: 39,
    subtopics: [
      { slug: 'mos-block-sorting', title: 'Square Root Block Sorting', description: 'Sorting queries by (L / B, R) with zigzag parity optimization.' },
      { slug: 'mos-on-trees', title: "Mo's Algorithm on Trees", description: 'Euler tour flattening with in/out timestamps, handling LCA separately.' },
      { slug: 'mos-with-updates', title: "Mo's with Point Updates", description: '3D block sorting with time dimension in O(N^(5/3)).' }
    ],
    prerequisites: ['fenwick-tree-bit']
  },
  {
    slug: 'max-flow-min-cut',
    title: 'Maximum Flow & Minimum Cut (Dinic)',
    stage: 'Candidate Master',
    category: 'Graphs',
    summary: 'Flow networks, augmenting paths, residual graph, Dinic algorithm in O(V^2 * E).',
    description: 'Max-Flow Min-Cut Theorem. Implement Dinic with level graphs (BFS) and blocking flow (DFS with dead-end pruning ptr). Bipartite matching in O(E * sqrt(V)).',
    estimatedHours: 16,
    orderIndex: 40,
    subtopics: [
      { slug: 'flow-network-concepts', title: 'Residual Graphs & Conservation of Flow', description: 'Forward and backward edges, capacity and residual capacity.' },
      { slug: 'dinic-algorithm', title: 'Dinic Algorithm Implementation', description: 'Level graph construction via BFS and blocking flow via DFS with work pointers.' },
      { slug: 'min-cut-theorem-applications', title: 'Min-Cut Applications & Project Selection', description: 'Finding min cut edges, maximum weight closure of a graph.' }
    ],
    prerequisites: ['graph-traversal-bfs-dfs']
  },
  {
    slug: 'suffix-array-lcp',
    title: 'Suffix Array & LCP Array',
    stage: 'Candidate Master',
    category: 'Strings',
    summary: 'Sort all suffixes in O(N log N) using prefix doubling; Kasai algorithm for LCP in O(N).',
    description: 'Powerful string data structure. Count distinct substrings, find longest common repeated substring, and solve multi-string pattern queries with binary search.',
    estimatedHours: 16,
    orderIndex: 41,
    subtopics: [
      { slug: 'suffix-array-doubling', title: 'Suffix Array Construction via Doubling', description: 'Equivalence classes, sorting pairs of rank in O(N log^2 N) or O(N log N).' },
      { slug: 'kasai-lcp', title: "Kasai's Algorithm for LCP Array", description: 'Deriving heights between adjacent suffixes in linear time using h >= h_prev - 1.' },
      { slug: 'distinct-substring-counting', title: 'Substring Queries with LCP and RMQ', description: 'Total distinct substrings = N*(N+1)/2 - sum(LCP); range LCP via sparse table.' }
    ],
    prerequisites: ['string-hashing-kmp-z', 'sparse-table-rmq']
  },
  {
    slug: 'dp-optimizations-cht-lichao',
    title: 'DP Optimization: Convex Hull Trick & Li Chao Tree',
    stage: 'Candidate Master',
    category: 'Dynamic Programming',
    summary: 'Optimize 1D DP transitions of the form dp[i] = min(dp[j] + m_j * x_i + c_j) from O(N^2) to O(N log N).',
    description: 'When transition cost is a family of linear functions y = m*x + c. Master envelope maintenance via deque (monotonic slopes) and dynamic Li Chao Tree (arbitrary slopes).',
    estimatedHours: 16,
    orderIndex: 42,
    subtopics: [
      { slug: 'static-cht-deque', title: 'Convex Hull Trick with Monotonic Slopes', description: 'Stack/deque of lines, pop redundant lines via intersection test.' },
      { slug: 'li-chao-segment-tree', title: 'Li Chao Segment Tree', description: 'Store dominant line at segment node, push loser down in O(log C).' }
    ],
    prerequisites: ['segment-tree-basics', 'dynamic-programming-1d-knapsack']
  },

  // --- MASTER (1900 - 2099) ---
  {
    slug: 'fft-ntt-polynomials',
    title: 'Fast Fourier Transform (FFT) & NTT',
    stage: 'Master',
    category: 'Mathematics',
    summary: 'Multiply polynomials of degree N in O(N log N) with complex roots of unity and NTT.',
    description: 'Convolution of sequences. Master Cooley-Tukey FFT, bit-reversal permutation, Number Theoretic Transform (NTT) using primitive roots modulo 998244353.',
    estimatedHours: 18,
    orderIndex: 43,
    subtopics: [
      { slug: 'cooley-tukey-fft', title: 'Cooley-Tukey Radix-2 FFT', description: 'Discrete Fourier Transform, complex roots of unity, in-place butterfly operations.' },
      { slug: 'number-theoretic-transform', title: 'Number Theoretic Transform (NTT)', description: 'NTT modulo 998244353, primitive root g = 3, exact modular arithmetic.' },
      { slug: 'string-matching-wildcards', title: 'Applications: Polynomial Convolution & Wildcards', description: 'Counting sums of subsets, string matching with wildcards in O(N log N).' }
    ],
    prerequisites: ['combinatorics-fast-exponentiation']
  },
  {
    slug: 'computational-geometry-convex-hull',
    title: 'Computational Geometry & Convex Hull',
    stage: 'Master',
    category: 'Geometry',
    summary: 'Point structures, cross product orientation tests, Monotone Chain Convex Hull in O(N log N).',
    description: 'Robust geometric algorithms. Avoid floating-point imprecision using integer cross products. Graham Scan / Andrew Monotone Chain for convex hull, rotating calipers.',
    estimatedHours: 16,
    orderIndex: 44,
    subtopics: [
      { slug: 'point-vector-cross-product', title: 'Vector Cross Product & Orientation', description: 'Cross product sign determines left turn, right turn, or collinearity.' },
      { slug: 'andrew-monotone-chain', title: "Andrew's Monotone Chain Convex Hull", description: 'Sorting points, constructing upper and lower hulls using stack.' },
      { slug: 'rotating-calipers', title: 'Rotating Calipers for Maximum Distance', description: 'Finding antipodal pairs in O(N) along the convex hull.' }
    ],
    prerequisites: ['basic-sorting-searching']
  },
  {
    slug: 'min-cost-max-flow',
    title: 'Min-Cost Max-Flow (MCMF)',
    stage: 'Master',
    category: 'Graphs',
    summary: 'Send flow along minimum cost augmenting paths using SPFA or Dijkstra with Johnson potentials.',
    description: 'Find maximum flow at minimal total cost. Master successive shortest path algorithm, potentials to enable Dijkstra with negative cost edges, and assignment problems.',
    estimatedHours: 18,
    orderIndex: 45,
    subtopics: [
      { slug: 'successive-shortest-path', title: 'Successive Shortest Path with SPFA', description: 'Residual graph with negative costs, cycle cancellation.' },
      { slug: 'johnson-potentials-mcmf', title: 'Primal-Dual with Johnson Potentials', description: 'Dual potentials to ensure non-negative reduced costs for fast Dijkstra.' }
    ],
    prerequisites: ['max-flow-min-cut', 'shortest-paths-dijkstra']
  },
  {
    slug: 'sos-dp-divide-conquer-dp',
    title: 'SOS DP & Divide-and-Conquer DP Optimization',
    stage: 'Master',
    category: 'Dynamic Programming',
    summary: 'Sum Over Subsets DP in O(N * 2^N); Quadrangle inequality DP optimization in O(K N log N).',
    description: 'Compute f(mask) = sum_{submask in mask} a[submask] in O(N * 2^N) instead of O(3^N). Divide and Conquer DP optimization when optimal transition point opt[i][j] is monotonic.',
    estimatedHours: 16,
    orderIndex: 46,
    subtopics: [
      { slug: 'sum-over-subsets-sos', title: 'SOS DP (Fast Walsh-Hadamard subset sum)', description: 'Iterating bit positions to accumulate submask contributions in O(N * 2^N).' },
      { slug: 'divide-conquer-dp-opt', title: 'Divide and Conquer DP Optimization', description: 'Quadrangles inequality: opt[i][j] <= opt[i][j+1], recursive midpoint search.' }
    ],
    prerequisites: ['bitmask-dp-fundamentals', 'dp-optimizations-cht-lichao']
  },
  {
    slug: 'link-cut-trees-advanced-ds',
    title: 'Link-Cut Trees & Dynamic Trees',
    stage: 'Master',
    category: 'Data Structures',
    summary: 'Maintain a forest of trees supporting dynamic link, cut, and path queries in O(log N).',
    description: 'Splay tree based decomposition into preferred paths. Handle dynamic tree connectivity, edge insertions and deletions, and path aggregation in logarithmic amortized time.',
    estimatedHours: 20,
    orderIndex: 47,
    subtopics: [
      { slug: 'splay-tree-fundamentals', title: 'Splay Tree Rotations & Access', description: 'Zig-zig and zig-zag splay operations, accessing root.' },
      { slug: 'lct-access-link-cut', title: 'Link-Cut Tree: Access, Link, and Cut', description: 'Making preferred paths into splay trees, swapping dashed/solid edges.' }
    ],
    prerequisites: ['heavy-light-decomposition']
  },

  // --- INTERNATIONAL MASTER & GRANDMASTER (2100+) ---
  {
    slug: 'suffix-automaton',
    title: 'Suffix Automaton (SAM)',
    stage: 'International Master',
    category: 'Strings',
    summary: 'Directed acyclic word graph representing all substrings of a string in O(N) states and transitions.',
    description: 'The definitive string structure. Online linear-time construction of SAM. Solve distinct substring counting, occurrences, multi-string LCS, and pattern searches in O(N).',
    estimatedHours: 20,
    orderIndex: 48,
    subtopics: [
      { slug: 'sam-construction', title: 'Online Suffix Automaton Construction', description: 'States as right-end equivalence classes, link transitions in O(N * Sigma).' },
      { slug: 'sam-substring-dp', title: 'DP on Suffix Automaton DAG', description: 'Counting distinct substrings, k-th lexicographical substring in O(|S|).' }
    ],
    prerequisites: ['suffix-array-lcp']
  },
  {
    slug: 'advanced-combinatorics-burnside-gf',
    title: 'Advanced Combinatorics & Generating Functions',
    stage: 'International Master',
    category: 'Mathematics',
    summary: 'Ordinary & Exponential generating functions, Burnside Lemma, Polya Enumeration.',
    description: 'Symmetry groups, counting distinct colorings under rotations and reflections. Formal power series inversion, log, exp in O(N log N) via NTT.',
    estimatedHours: 20,
    orderIndex: 49,
    subtopics: [
      { slug: 'burnside-polya', title: 'Burnside Lemma & Polya Enumeration', description: 'Counting equivalence classes under group actions.' },
      { slug: 'generating-functions-ntt', title: 'Formal Power Series Operations', description: 'Inversion, derivative, integral, log and exp of polynomials.' }
    ],
    prerequisites: ['fft-ntt-polynomials']
  },
  {
    slug: 'grandmaster-multi-concept',
    title: 'Grandmaster Multi-Concept Problem Solving',
    stage: 'Grandmaster',
    category: 'Advanced Problem Solving',
    summary: 'High-level synthesis: combining advanced flow, persistent structures, interactive strategies, and hard ICPC problems.',
    description: 'Grandmaster mastery does not just mean new algorithms—it is the intuitive ability to combine 3+ techniques (e.g. centroid decomposition + persistent segment tree + FFT) under contest pressure.',
    estimatedHours: 30,
    orderIndex: 50,
    subtopics: [
      { slug: 'interactive-problem-strategies', title: 'Interactive Problems & Query Reduction', description: 'Information theoretic bounds, adaptive adversary handling, ternary and binary tests.' },
      { slug: 'multi-technique-synthesis', title: 'Multi-Technique ICPC World Finals Problems', description: 'Formulating problems that require flow + geometry or tree DP + persistent segtree.' }
    ],
    prerequisites: ['link-cut-trees-advanced-ds', 'suffix-automaton', 'advanced-combinatorics-burnside-gf']
  }
];
