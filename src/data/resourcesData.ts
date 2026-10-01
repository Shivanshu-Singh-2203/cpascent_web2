// src/data/resourcesData.ts
export interface ResourceSeed {
  title: string;
  type: string; // Article, Book, Video, Reference, Course
  author: string;
  url: string;
  topicSlug: string;
  difficulty: string;
  description: string;
  recommendedStage: string;
  verificationStatus: string;
}

export const RESOURCES_DATA: ResourceSeed[] = [
  // Books & Universal References
  {
    title: "Competitive Programmer's Handbook (CPH)",
    type: "Book",
    author: "Antti Laaksonen",
    url: "https://cses.fi/book/book.pdf",
    topicSlug: "prog-fundamentals",
    difficulty: "Beginner",
    description: "The gold standard concise handbook for modern competitive programming.",
    recommendedStage: "Newbie",
    verificationStatus: "Verified"
  },
  {
    title: "USACO Guide — Bronze & General Fundamentals",
    type: "Course",
    author: "USACO Guide Team",
    url: "https://usaco.guide/bronze",
    topicSlug: "prog-fundamentals",
    difficulty: "Beginner",
    description: "Interactive learning curriculum with theory, quizzes, and problem sets for basic programming.",
    recommendedStage: "Newbie",
    verificationStatus: "Verified"
  },
  {
    title: "Codeforces EDU: Fast I/O and Complexity",
    type: "Course",
    author: "Mike Mirzayanov",
    url: "https://codeforces.com/edu/courses",
    topicSlug: "time-space-complexity",
    difficulty: "Beginner",
    description: "Official Codeforces Academy course on execution limits and asymptotic behavior.",
    recommendedStage: "Newbie",
    verificationStatus: "Verified"
  },
  {
    title: "C++ STL Reference — std::vector, std::sort, std::pair",
    type: "Reference",
    author: "cppreference.com",
    url: "https://en.cppreference.com/w/cpp/algorithm/sort",
    topicSlug: "basic-sorting-searching",
    difficulty: "Beginner",
    description: "Detailed specification of std::sort, custom comparators, and time guarantees.",
    recommendedStage: "Newbie",
    verificationStatus: "Verified"
  },
  {
    title: "USACO Guide — Prefix Sums",
    type: "Article",
    author: "USACO Guide Team",
    url: "https://usaco.guide/silver/prefix-sums",
    topicSlug: "prefix-sums-diff-arrays",
    difficulty: "Beginner",
    description: "Complete tutorial on 1D and 2D prefix sums with diagrams and Silver division applications.",
    recommendedStage: "Newbie",
    verificationStatus: "Verified"
  },
  {
    title: "Blowing up unordered_map and how to stop it",
    type: "Article",
    author: "neal (Neal Wu)",
    url: "https://codeforces.com/blog/entry/62393",
    topicSlug: "frequency-hash-maps",
    difficulty: "Intermediate",
    description: "Famous Codeforces blog post on preventing O(N^2) anti-hash hacking attacks using custom splitmix64.",
    recommendedStage: "Newbie",
    verificationStatus: "Verified"
  },
  {
    title: "USACO Guide — Two Pointers Technique",
    type: "Article",
    author: "USACO Guide Team",
    url: "https://usaco.guide/silver/two-pointers",
    topicSlug: "two-pointers-sliding-window",
    difficulty: "Beginner",
    description: "Comprehensive guide to two-pointer mechanics, subarray sums, and monotonic sliding windows.",
    recommendedStage: "Newbie",
    verificationStatus: "Verified"
  },
  {
    title: "CP-Algorithms: Euclidean Algorithm for GCD",
    type: "Article",
    author: "e-maxx / cp-algorithms",
    url: "https://cp-algorithms.com/algebra/euclid-algorithm.html",
    topicSlug: "basic-math-modular",
    difficulty: "Beginner",
    description: "Mathematical proof, logarithmic complexity, and implementation of Euclid's algorithm.",
    recommendedStage: "Newbie",
    verificationStatus: "Verified"
  },
  {
    title: "CP-Algorithms: Modular Arithmetic & Modulo Operations",
    type: "Article",
    author: "cp-algorithms",
    url: "https://cp-algorithms.com/algebra/module-arithmetics.html",
    topicSlug: "basic-math-modular",
    difficulty: "Beginner",
    description: "Addition, multiplication, and negative value normalization under large prime modulos.",
    recommendedStage: "Newbie",
    verificationStatus: "Verified"
  },
  {
    title: "Bit Manipulation Tricks for Competitive Programming",
    type: "Article",
    author: "Errichto",
    url: "https://codeforces.com/blog/entry/73558",
    topicSlug: "basic-bit-manipulation",
    difficulty: "Beginner",
    description: "Curated collection of practical bit hacks, built-ins, and iteration patterns.",
    recommendedStage: "Newbie",
    verificationStatus: "Verified"
  },
  {
    title: "USACO Guide — Greedy Algorithms with Sorting",
    type: "Article",
    author: "USACO Guide Team",
    url: "https://usaco.guide/silver/greedy-sorting",
    topicSlug: "basic-greedy",
    difficulty: "Beginner",
    description: "Interval scheduling, maximum disjoint segments, and exchange argument proof techniques.",
    recommendedStage: "Newbie",
    verificationStatus: "Verified"
  },

  // --- PUPIL RESOURCES ---
  {
    title: "Codeforces EDU: Binary Search Complete Course",
    type: "Course",
    author: "Mike Mirzayanov",
    url: "https://codeforces.com/edu/course/2/lesson/6",
    topicSlug: "binary-search-on-answer",
    difficulty: "Beginner-Intermediate",
    description: "Interactive multi-part step-by-step course on discrete and continuous binary search.",
    recommendedStage: "Pupil",
    verificationStatus: "Verified"
  },
  {
    title: "USACO Guide — Binary Search on Answer",
    type: "Article",
    author: "USACO Guide Team",
    url: "https://usaco.guide/silver/binary-search",
    topicSlug: "binary-search-on-answer",
    difficulty: "Intermediate",
    description: "Formulating check(x) predicate functions for min-max problems.",
    recommendedStage: "Pupil",
    verificationStatus: "Verified"
  },
  {
    title: "C++ STL Sets, Maps, Multisets & Priority Queues",
    type: "Video",
    author: "Errichto Algorithms",
    url: "https://www.youtube.com/watch?v=g-14iS5_N24",
    topicSlug: "standard-data-structures-stl",
    difficulty: "Intermediate",
    description: "Detailed video tutorial covering common pitfalls, iterator invalidation, and custom orders.",
    recommendedStage: "Pupil",
    verificationStatus: "Verified"
  },
  {
    title: "CP-Algorithms: Sieve of Eratosthenes",
    type: "Article",
    author: "cp-algorithms",
    url: "https://cp-algorithms.com/algebra/sieve-of-eratosthenes.html",
    topicSlug: "number-theory-sieve",
    difficulty: "Beginner-Intermediate",
    description: "Standard sieve, segmented sieve for large ranges, and linear sieve (SPF) in O(N).",
    recommendedStage: "Pupil",
    verificationStatus: "Verified"
  },
  {
    title: "CP-Algorithms: Breadth-First Search (BFS)",
    type: "Article",
    author: "cp-algorithms",
    url: "https://cp-algorithms.com/graph/breadth-first-search.html",
    topicSlug: "graph-traversal-bfs-dfs",
    difficulty: "Intermediate",
    description: "Shortest paths on unweighted graphs, connected components, and multi-source BFS.",
    recommendedStage: "Pupil",
    verificationStatus: "Verified"
  },
  {
    title: "CP-Algorithms: Depth-First Search (DFS)",
    type: "Article",
    author: "cp-algorithms",
    url: "https://cp-algorithms.com/graph/depth-first-search.html",
    topicSlug: "graph-traversal-bfs-dfs",
    difficulty: "Intermediate",
    description: "DFS call tree, entry/exit timestamps, cycle finding, and component identification.",
    recommendedStage: "Pupil",
    verificationStatus: "Verified"
  },
  {
    title: "USACO Guide — Tree Fundamentals & Tree Traversal",
    type: "Article",
    author: "USACO Guide Team",
    url: "https://usaco.guide/silver/tree-traversal",
    topicSlug: "tree-fundamentals",
    difficulty: "Intermediate",
    description: "Computing subtree sizes, tree diameter via two BFS runs, and tree centers.",
    recommendedStage: "Pupil",
    verificationStatus: "Verified"
  },

  // --- SPECIALIST RESOURCES ---
  {
    title: "CP-Algorithms: Disjoint Set Union (DSU)",
    type: "Article",
    author: "cp-algorithms",
    url: "https://cp-algorithms.com/data_structures/disjoint_set_union.html",
    topicSlug: "disjoint-set-union",
    difficulty: "Intermediate",
    description: "Path compression, union by rank/size, rollback DSU, and bipartite DSU applications.",
    recommendedStage: "Specialist",
    verificationStatus: "Verified"
  },
  {
    title: "Codeforces EDU: Disjoint Set Union Course",
    type: "Course",
    author: "Baryshnikov",
    url: "https://codeforces.com/edu/course/2/lesson/7",
    topicSlug: "disjoint-set-union",
    difficulty: "Intermediate",
    description: "Full problem set and video explanations for DSU and its extensions.",
    recommendedStage: "Specialist",
    verificationStatus: "Verified"
  },
  {
    title: "CP-Algorithms: Dijkstra Algorithm",
    type: "Article",
    author: "cp-algorithms",
    url: "https://cp-algorithms.com/graph/dijkstra.html",
    topicSlug: "shortest-paths-dijkstra",
    difficulty: "Intermediate",
    description: "Dense O(V^2) vs sparse O(E log V) priority queue implementations and shortest path tree restoration.",
    recommendedStage: "Specialist",
    verificationStatus: "Verified"
  },
  {
    title: "CP-Algorithms: 0-1 BFS",
    type: "Article",
    author: "cp-algorithms",
    url: "https://cp-algorithms.com/graph/01_bfs.html",
    topicSlug: "shortest-paths-dijkstra",
    difficulty: "Intermediate",
    description: "Optimal linear time O(V + E) shortest paths on graphs with weights in {0, 1}.",
    recommendedStage: "Specialist",
    verificationStatus: "Verified"
  },
  {
    title: "CP-Algorithms: Minimum Spanning Tree — Kruskal",
    type: "Article",
    author: "cp-algorithms",
    url: "https://cp-algorithms.com/graph/mst_kruskal.html",
    topicSlug: "minimum-spanning-tree",
    difficulty: "Intermediate",
    description: "Greedy edge sorting with DSU and proof of cut property.",
    recommendedStage: "Specialist",
    verificationStatus: "Verified"
  },
  {
    title: "CP-Algorithms: Topological Sorting",
    type: "Article",
    author: "cp-algorithms",
    url: "https://cp-algorithms.com/graph/topological-sort.html",
    topicSlug: "topological-sort-dag",
    difficulty: "Intermediate",
    description: "Linear graph ordering with Kahn algorithm and DFS departure time reversal.",
    recommendedStage: "Specialist",
    verificationStatus: "Verified"
  },
  {
    title: "Dynamic Programming: From Novice to Advanced",
    type: "Article",
    author: "Dumitru",
    url: "https://www.topcoder.com/thrive/articles/Dynamic%20Programming:%20From%20Novice%20to%20Advanced",
    topicSlug: "dynamic-programming-1d-knapsack",
    difficulty: "Intermediate",
    description: "The classic TopCoder article teaching state definition, transitions, and subproblem formulation.",
    recommendedStage: "Specialist",
    verificationStatus: "Verified"
  },
  {
    title: "AtCoder Educational DP Contest Problem Walkthrough",
    type: "Video",
    author: "Errichto",
    url: "https://www.youtube.com/watch?v=FAQxdm0bTaw",
    topicSlug: "dynamic-programming-1d-knapsack",
    difficulty: "Intermediate",
    description: "Deep dive into classical DP patterns from Knapsack to Grid paths.",
    recommendedStage: "Specialist",
    verificationStatus: "Verified"
  },
  {
    title: "CP-Algorithms: Longest Increasing Subsequence in O(N log N)",
    type: "Article",
    author: "cp-algorithms",
    url: "https://cp-algorithms.com/sequences/longest_increasing_subseq.html",
    topicSlug: "dp-subsequences-grid",
    difficulty: "Intermediate",
    description: "Patience sorting algorithm with std::lower_bound and parent pointer sequence recovery.",
    recommendedStage: "Specialist",
    verificationStatus: "Verified"
  },
  {
    title: "CP-Algorithms: Fenwick Tree (Binary Indexed Tree)",
    type: "Article",
    author: "cp-algorithms",
    url: "https://cp-algorithms.com/data_structures/fenwick.html",
    topicSlug: "fenwick-tree-bit",
    difficulty: "Intermediate",
    description: "Bitwise indexing, point updates, prefix sums, 2D Fenwick trees, and range updates.",
    recommendedStage: "Specialist",
    verificationStatus: "Verified"
  },
  {
    title: "Codeforces EDU: Segment Tree Part 1",
    type: "Course",
    author: "Pavel Mavrin (pashka)",
    url: "https://codeforces.com/edu/course/2/lesson/4",
    topicSlug: "segment-tree-basics",
    difficulty: "Intermediate",
    description: "World-class course by ICPC World Champion Pavel Mavrin covering point update segment trees.",
    recommendedStage: "Specialist",
    verificationStatus: "Verified"
  },
  {
    title: "CP-Algorithms: Segment Tree",
    type: "Article",
    author: "cp-algorithms",
    url: "https://cp-algorithms.com/data_structures/segment_tree.html",
    topicSlug: "segment-tree-basics",
    difficulty: "Intermediate",
    description: "Comprehensive guide to point update and associative range query implementations.",
    recommendedStage: "Specialist",
    verificationStatus: "Verified"
  },
  {
    title: "CP-Algorithms: Sparse Table",
    type: "Article",
    author: "cp-algorithms",
    url: "https://cp-algorithms.com/data_structures/sparse-table.html",
    topicSlug: "sparse-table-rmq",
    difficulty: "Intermediate",
    description: "O(N log N) precomputation and O(1) range minimum and range GCD queries.",
    recommendedStage: "Specialist",
    verificationStatus: "Verified"
  },
  {
    title: "CP-Algorithms: Binary Exponentiation & Modular Inverse",
    type: "Article",
    author: "cp-algorithms",
    url: "https://cp-algorithms.com/algebra/binary-exp.html",
    topicSlug: "combinatorics-fast-exponentiation",
    difficulty: "Intermediate",
    description: "Logarithmic powering, Fermat Little Theorem, and Euclidean algorithm modular inverse.",
    recommendedStage: "Specialist",
    verificationStatus: "Verified"
  },
  {
    title: "USACO Guide — Bitmask Dynamic Programming",
    type: "Article",
    author: "USACO Guide Team",
    url: "https://usaco.guide/gold/dp-bitmasks",
    topicSlug: "bitmask-dp-fundamentals",
    difficulty: "Intermediate-Advanced",
    description: "Iterating subsets, matching small vertex sets, and Hamiltonian paths.",
    recommendedStage: "Specialist",
    verificationStatus: "Verified"
  },

  // --- EXPERT RESOURCES ---
  {
    title: "CP-Algorithms: Lowest Common Ancestor — Binary Lifting",
    type: "Article",
    author: "cp-algorithms",
    url: "https://cp-algorithms.com/graph/lca_binary_lifting.html",
    topicSlug: "lowest-common-ancestor-binary-lifting",
    difficulty: "Advanced",
    description: "O(N log N) precomputation and O(log N) LCA queries using binary jumps.",
    recommendedStage: "Expert",
    verificationStatus: "Verified"
  },
  {
    title: "Tree DP and Rerooting Technique",
    type: "Article",
    author: "Bicsi",
    url: "https://codeforces.com/blog/entry/68758",
    topicSlug: "tree-dp-rerooting",
    difficulty: "Advanced",
    description: "Clean general framework for rerooting dynamic programming using prefix/suffix child merges.",
    recommendedStage: "Expert",
    verificationStatus: "Verified"
  },
  {
    title: "Codeforces EDU: Segment Tree Part 2 (Lazy Propagation)",
    type: "Course",
    author: "Pavel Mavrin (pashka)",
    url: "https://codeforces.com/edu/course/2/lesson/5",
    topicSlug: "segment-tree-lazy-propagation",
    difficulty: "Advanced",
    description: "Mastering range updates, lazy tags, pushing modifications down, and non-trivial tag combinations.",
    recommendedStage: "Expert",
    verificationStatus: "Verified"
  },
  {
    title: "CP-Algorithms: Finding Bridges in O(V + E)",
    type: "Article",
    author: "cp-algorithms",
    url: "https://cp-algorithms.com/graph/bridge-searching.html",
    topicSlug: "strongly-connected-components-bridges",
    difficulty: "Advanced",
    description: "Tarjan entry and low-link array logic for identifying bridge edges in undirected graphs.",
    recommendedStage: "Expert",
    verificationStatus: "Verified"
  },
  {
    title: "CP-Algorithms: Strongly Connected Components (Kosaraju & Tarjan)",
    type: "Article",
    author: "cp-algorithms",
    url: "https://cp-algorithms.com/graph/strongly-connected-components.html",
    topicSlug: "strongly-connected-components-bridges",
    difficulty: "Advanced",
    description: "Condensation graph construction and topological order of components.",
    recommendedStage: "Expert",
    verificationStatus: "Verified"
  },
  {
    title: "CP-Algorithms: String Hashing",
    type: "Article",
    author: "cp-algorithms",
    url: "https://cp-algorithms.com/string/string-hashing.html",
    topicSlug: "string-hashing-kmp-z",
    difficulty: "Advanced",
    description: "Polynomial rolling hash, base selection, double hashing, and O(1) substring equality.",
    recommendedStage: "Expert",
    verificationStatus: "Verified"
  },
  {
    title: "CP-Algorithms: Prefix Function — Knuth-Morris-Pratt (KMP)",
    type: "Article",
    author: "cp-algorithms",
    url: "https://cp-algorithms.com/string/prefix-func.html",
    topicSlug: "string-hashing-kmp-z",
    difficulty: "Advanced",
    description: "Automaton view, periodic prefixes, and string searching in linear time.",
    recommendedStage: "Expert",
    verificationStatus: "Verified"
  },
  {
    title: "CP-Algorithms: Z-Algorithm",
    type: "Article",
    author: "cp-algorithms",
    url: "https://cp-algorithms.com/string/z-function.html",
    topicSlug: "string-hashing-kmp-z",
    difficulty: "Advanced",
    description: "Linear time calculation of Z-box array for pattern matching and period analysis.",
    recommendedStage: "Expert",
    verificationStatus: "Verified"
  },
  {
    title: "USACO Guide — Digit DP Tutorial",
    type: "Article",
    author: "USACO Guide Team",
    url: "https://usaco.guide/gold/digit-dp",
    topicSlug: "advanced-dp-digit-interval",
    difficulty: "Advanced",
    description: "Counting integers with given digit constraints using recursion and tight boundaries.",
    recommendedStage: "Expert",
    verificationStatus: "Verified"
  },
  {
    title: "CP-Algorithms: Sprague-Grundy Theorem & Nim",
    type: "Article",
    author: "cp-algorithms",
    url: "https://cp-algorithms.com/game_theory/sprague-grundy-theorem.html",
    topicSlug: "game-theory-nim",
    difficulty: "Advanced",
    description: "Impartial games, Bouton's theorem on Nim, minimum excluded value (mex), and composite games.",
    recommendedStage: "Expert",
    verificationStatus: "Verified"
  },

  // --- CANDIDATE MASTER RESOURCES ---
  {
    title: "Centroid Decomposition of a Tree",
    type: "Article",
    author: "tanujkhattar",
    url: "https://codeforces.com/blog/entry/58311",
    topicSlug: "centroid-decomposition",
    difficulty: "Hard",
    description: "Comprehensive tutorial on tree centroid divide and conquer with distance queries.",
    recommendedStage: "Candidate Master",
    verificationStatus: "Verified"
  },
  {
    title: "Heavy-Light Decomposition (HLD) Tutorial",
    type: "Article",
    author: "Anudeep Nekkanti",
    url: "https://blog.anudeep2011.com/heavy-light-decomposition/",
    topicSlug: "heavy-light-decomposition",
    difficulty: "Hard",
    description: "Classic tutorial covering path partitioning, flattened array mapping, and segment tree updates.",
    recommendedStage: "Candidate Master",
    verificationStatus: "Verified"
  },
  {
    title: "Persistent Segment Trees Explained",
    type: "Article",
    author: "Anudeep Nekkanti",
    url: "https://blog.anudeep2011.com/persistent-segment-trees-explained-with-spoj-problems/",
    topicSlug: "persistent-segment-tree",
    difficulty: "Hard",
    description: "Node sharing, dynamic pointer updates, and range K-th smallest element query.",
    recommendedStage: "Candidate Master",
    verificationStatus: "Verified"
  },
  {
    title: "Mo's Algorithm (Query Square Root Decomposition)",
    type: "Article",
    author: "Anudeep Nekkanti",
    url: "https://blog.anudeep2011.com/mos-algorithm/",
    topicSlug: "mos-algorithm-offline-queries",
    difficulty: "Hard",
    description: "Offline sorting by blocks, expanding and shrinking range boundaries in O((N+Q)*sqrt(N)).",
    recommendedStage: "Candidate Master",
    verificationStatus: "Verified"
  },
  {
    title: "CP-Algorithms: Dinic Algorithm for Maximum Flow",
    type: "Article",
    author: "cp-algorithms",
    url: "https://cp-algorithms.com/graph/dinic.html",
    topicSlug: "max-flow-min-cut",
    difficulty: "Hard",
    description: "Level graphs with BFS, blocking flow with DFS work pointers, achieving O(V^2 E) flow.",
    recommendedStage: "Candidate Master",
    verificationStatus: "Verified"
  },
  {
    title: "CP-Algorithms: Suffix Array",
    type: "Article",
    author: "cp-algorithms",
    url: "https://cp-algorithms.com/string/suffix-array.html",
    topicSlug: "suffix-array-lcp",
    difficulty: "Hard",
    description: "O(N log N) prefix doubling suffix sorting, Kasai LCP algorithm, and distinct substring counting.",
    recommendedStage: "Candidate Master",
    verificationStatus: "Verified"
  },
  {
    title: "Convex Hull Trick & Li Chao Tree",
    type: "Article",
    author: "roboliq",
    url: "https://cp-algorithms.com/geometry/convex_hull_trick.html",
    topicSlug: "dp-optimizations-cht-lichao",
    difficulty: "Hard",
    description: "Optimizing DP transitions with linear envelope slopes and Li Chao tree point query.",
    recommendedStage: "Candidate Master",
    verificationStatus: "Verified"
  },

  // --- MASTER & GRANDMASTER RESOURCES ---
  {
    title: "CP-Algorithms: Fast Fourier Transform (FFT)",
    type: "Article",
    author: "cp-algorithms",
    url: "https://cp-algorithms.com/algebra/fft.html",
    topicSlug: "fft-ntt-polynomials",
    difficulty: "Expert",
    description: "Cooley-Tukey FFT, bit-reversal, NTT for mod 998244353, and polynomial convolutions.",
    recommendedStage: "Master",
    verificationStatus: "Verified"
  },
  {
    title: "CP-Algorithms: Convex Hull using Andrew's Monotone Chain",
    type: "Article",
    author: "cp-algorithms",
    url: "https://cp-algorithms.com/geometry/convex-hull.html",
    topicSlug: "computational-geometry-convex-hull",
    difficulty: "Expert",
    description: "Andrew's monotone chain convex hull construction in O(N log N) using 2D cross product.",
    recommendedStage: "Master",
    verificationStatus: "Verified"
  },
  {
    title: "CP-Algorithms: Minimum-Cost Maximum-Flow",
    type: "Article",
    author: "cp-algorithms",
    url: "https://cp-algorithms.com/graph/min_cost_flow.html",
    topicSlug: "min-cost-max-flow",
    difficulty: "Expert",
    description: "Successive shortest paths and Johnson potentials for dual-feasible cost graphs.",
    recommendedStage: "Master",
    verificationStatus: "Verified"
  },
  {
    title: "SOS Dynamic Programming (Sum Over Subsets)",
    type: "Article",
    author: "CF Blog by swap_nil",
    url: "https://codeforces.com/blog/entry/45223",
    topicSlug: "sos-dp-divide-conquer-dp",
    difficulty: "Expert",
    description: "Computing sums over all submasks in O(N * 2^N) time using dimensional DP.",
    recommendedStage: "Master",
    verificationStatus: "Verified"
  },
  {
    title: "Link-Cut Tree Tutorial",
    type: "Article",
    author: "Benq",
    url: "https://codeforces.com/blog/entry/80383",
    topicSlug: "link-cut-trees-advanced-ds",
    difficulty: "Expert",
    description: "Deep dive into splay tree access operations, dynamic tree cuts, and links in O(log N).",
    recommendedStage: "Master",
    verificationStatus: "Verified"
  },
  {
    title: "CP-Algorithms: Suffix Automaton",
    type: "Article",
    author: "cp-algorithms",
    url: "https://cp-algorithms.com/string/suffix-automaton.html",
    topicSlug: "suffix-automaton",
    difficulty: "Grandmaster",
    description: "Linear time online construction of the directed acyclic word graph (DAWG).",
    recommendedStage: "International Master",
    verificationStatus: "Verified"
  },
  {
    title: "Formal Power Series and Generating Functions in CP",
    type: "Article",
    author: "maroonrk",
    url: "https://codeforces.com/blog/entry/82150",
    topicSlug: "advanced-combinatorics-burnside-gf",
    difficulty: "Grandmaster",
    description: "Taylor series, polynomial inversion, ln, exp, and Burnside's Lemma.",
    recommendedStage: "International Master",
    verificationStatus: "Verified"
  },
  {
    title: "KTH Algorithm Competition Template Library (KACTL)",
    type: "Reference",
    author: "KTH Royal Institute of Technology",
    url: "https://github.com/kth-competitive-programming/kactl",
    topicSlug: "grandmaster-multi-concept",
    difficulty: "Grandmaster",
    description: "Ultra-compact, battle-tested 25-page ICPC codebook with formal time bounds.",
    recommendedStage: "Grandmaster",
    verificationStatus: "Verified"
  }
];
