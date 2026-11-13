// Additional curated CompileX learning articles.
export const additionalArticlesData = [
  {
    "title": "Binary Search: The Complete Pattern",
    "slug": "binary-search-pattern",
    "category": "DSA",
    "topic": "Binary Search",
    "summary": "Search sorted data and monotonic answer spaces in logarithmic time.",
    "content": "## Core idea\nBinary search repeatedly halves a candidate interval. It applies to sorted arrays and to answer spaces where a feasibility predicate is monotonic.\n\n## Lower bound\nThe lower bound is the first index whose value is greater than or equal to the target. It may equal `n` when no such value exists. The upper bound is the first index strictly greater than the target.\n\n## Search on the answer\nFor a minimum-capacity problem, define `feasible(x)`. Prove that if `x` works, every larger value also works. Then search for the smallest feasible value.\n\n## Complexity\nA sorted-array search takes O(log n) time and O(1) iterative extra space.\n\n## Pitfalls\nUse a consistent interval convention, prove monotonicity before searching an answer space, and calculate mid as `low + (high-low)/2` to avoid overflow.",
    "codeExamples": [
      {
        "language": "cpp",
        "caption": "Lower bound",
        "code": "int lowerBound(const vector<int>& a, int target) {\n    int low = 0, high = (int)a.size();\n    while (low < high) {\n        int mid = low + (high - low) / 2;\n        if (a[mid] < target) low = mid + 1;\n        else high = mid;\n    }\n    return low;\n}"
      }
    ],
    "relatedProblemSlugs": []
  },
  {
    "title": "Linked Lists: Reversal and Cycle Detection",
    "slug": "linked-list-fundamentals",
    "category": "DSA",
    "topic": "Linked List",
    "summary": "Understand node traversal, in-place reversal, and Floyd's cycle detection.",
    "content": "## Structure\nA linked list stores nodes connected by pointers. Traversal follows `next` until null; random indexing is not O(1) as it is in an array.\n\n## Reversal\nMaintain `prev`, `curr`, and `nextNode`. Save the next pointer before reversing the current link, then advance all pointers. At completion, `prev` is the new head.\n\n## Cycle detection\nFloyd's algorithm advances a slow pointer by one and a fast pointer by two. A meeting proves a cycle; reaching null proves no cycle.\n\n## Complexity\nTraversal and reversal are O(n); iterative reversal and Floyd detection use O(1) auxiliary space.\n\n## Pitfalls\nDo not overwrite `curr->next` before saving it. Check `fast` and `fast->next` before advancing the fast pointer.",
    "codeExamples": [
      {
        "language": "cpp",
        "caption": "Iterative reversal",
        "code": "ListNode* reverseList(ListNode* head) {\n    ListNode* prev = nullptr;\n    ListNode* curr = head;\n    while (curr) {\n        ListNode* nextNode = curr->next;\n        curr->next = prev;\n        prev = curr;\n        curr = nextNode;\n    }\n    return prev;\n}"
      }
    ],
    "relatedProblemSlugs": []
  },
  {
    "title": "Stacks and Monotonic Stack",
    "slug": "stacks-monotonic-stack",
    "category": "DSA",
    "topic": "Stack",
    "summary": "Use LIFO processing and monotonic stacks for next-greater and boundary problems.",
    "content": "## Stack basics\nA stack follows Last In, First Out. Push and pop are O(1) amortized with a vector-backed implementation.\n\n## Monotonic stack\nMaintain elements in increasing or decreasing order. Pop while the new value violates the invariant. Each element is pushed once and popped at most once, giving O(n) total work.\n\n## Next greater element\nScan from right to left. Remove values less than or equal to the current value; the remaining top is the next strictly greater value.\n\n## Applications\nBalanced parentheses, expression evaluation, daily temperatures, histogram area, and nearest greater/smaller elements.\n\n## Pitfalls\nChoose strict versus non-strict comparisons deliberately. Store indices when distances or positions are needed, rather than only values.",
    "codeExamples": [
      {
        "language": "cpp",
        "caption": "Next greater value to the right",
        "code": "vector<int> nextGreater(const vector<int>& a) {\n    vector<int> ans(a.size(), -1);\n    stack<int> st;\n    for (int i = (int)a.size() - 1; i >= 0; --i) {\n        while (!st.empty() && st.top() <= a[i]) st.pop();\n        if (!st.empty()) ans[i] = st.top();\n        st.push(a[i]);\n    }\n    return ans;\n}"
      }
    ],
    "relatedProblemSlugs": []
  },
  {
    "title": "Graphs: BFS, DFS and Representations",
    "slug": "graphs-bfs-dfs",
    "category": "DSA",
    "topic": "Graphs",
    "summary": "Choose graph representations and traverse components using BFS and DFS.",
    "content": "## Representations\nAn adjacency list uses O(V+E) space and suits sparse graphs. An adjacency matrix uses O(V²) space and supports constant-time edge lookup.\n\n## BFS\nBreadth-first search uses a queue and explores vertices in layers. In an unweighted graph, it finds shortest path distances measured in edges.\n\n## DFS\nDepth-first search explores deeply before backtracking. It supports connected-component discovery, cycle analysis, and topological reasoning.\n\n## Disconnected graphs\nA traversal from one source only visits its reachable component. Start a traversal from each still-unvisited vertex to cover the entire graph.\n\n## Complexity and pitfalls\nWith adjacency lists, BFS and DFS take O(V+E). Mark vertices visited when enqueuing them, respect edge direction, and do not use ordinary BFS for arbitrary weighted shortest paths.",
    "codeExamples": [
      {
        "language": "cpp",
        "caption": "BFS distances from a source",
        "code": "vector<int> bfs(int n, const vector<vector<int>>& adj, int src) {\n    vector<int> dist(n, -1);\n    queue<int> q;\n    dist[src] = 0; q.push(src);\n    while (!q.empty()) {\n        int u = q.front(); q.pop();\n        for (int v : adj[u]) if (dist[v] == -1) {\n            dist[v] = dist[u] + 1;\n            q.push(v);\n        }\n    }\n    return dist;\n}"
      }
    ],
    "relatedProblemSlugs": []
  },
  {
    "title": "Greedy Algorithms and Exchange Arguments",
    "slug": "greedy-algorithms",
    "category": "DSA",
    "topic": "Greedy",
    "summary": "Learn how to justify locally optimal choices with an exchange argument.",
    "content": "## Greedy choice\nA greedy algorithm commits to a locally optimal choice. Local optimality alone does not prove global optimality.\n\n## Exchange argument\nStart with an optimal solution and show that its first choice can be replaced by the greedy choice without worsening the solution. Repeat the reasoning for the remaining subproblem.\n\n## Interval scheduling\nTo maximize the number of non-overlapping intervals, sort by finishing time and repeatedly choose the compatible interval that finishes earliest.\n\n## Complexity\nSorting generally costs O(n log n), followed by a linear scan.\n\n## When greedy fails\nFor arbitrary coin denominations, choosing the largest coin first can be suboptimal. Dynamic programming may be necessary when no safe-choice proof exists.",
    "codeExamples": [
      {
        "language": "cpp",
        "caption": "Maximum compatible intervals",
        "code": "int maxIntervals(vector<pair<int,int>> a) {\n    sort(a.begin(), a.end(), [](auto x, auto y) { return x.second < y.second; });\n    int count = 0, lastEnd = INT_MIN;\n    for (auto [start, finish] : a) if (start >= lastEnd) {\n        ++count; lastEnd = finish;\n    }\n    return count;\n}"
      }
    ],
    "relatedProblemSlugs": []
  },
  {
    "title": "SQL Joins: INNER, LEFT and RIGHT",
    "slug": "sql-joins",
    "category": "DBMS",
    "topic": "SQL",
    "summary": "Understand matching rows, unmatched records, NULLs, and join-filter behavior.",
    "content": "## Why joins?\nJoins combine related rows from normalized tables, often through primary-key and foreign-key relationships.\n\n## INNER JOIN\nReturns only rows with a match on both sides.\n\n## LEFT JOIN\nPreserves every row from the left table. Unmatched right-side columns become NULL. This is useful for finding entities with no related record.\n\n## RIGHT and FULL joins\nRIGHT JOIN preserves the right side. FULL OUTER JOIN preserves unmatched rows from both sides; database support varies (MySQL has no native FULL OUTER JOIN syntax).\n\n## ON versus WHERE\nON defines matching. WHERE filters the resulting rows. Filtering a nullable right-side column in WHERE can remove unmatched LEFT JOIN rows.\n\n## Pitfalls\nOne-to-many joins multiply rows. For unmatched-row counts, use COUNT(right_table.id), not COUNT(*).",
    "codeExamples": [
      {
        "language": "sql",
        "caption": "Customers with no orders",
        "code": "SELECT c.id, c.name\nFROM Customers AS c\nLEFT JOIN Orders AS o ON o.customer_id = c.id\nWHERE o.id IS NULL;"
      }
    ],
    "relatedProblemSlugs": []
  },
  {
    "title": "Database Normalization: 1NF to BCNF",
    "slug": "database-normalization",
    "category": "DBMS",
    "topic": "Normalization",
    "summary": "Reduce redundancy using functional dependencies and well-formed decompositions.",
    "content": "## Why normalize?\nPoor table design creates insertion, update, and deletion anomalies.\n\n## 1NF\nAttributes contain atomic values under the chosen relational model; avoid repeating groups and multivalued cells.\n\n## 2NF\nA relation is in 2NF when it is in 1NF and every non-prime attribute is fully dependent on every candidate key. Partial dependency on part of a composite candidate key violates 2NF.\n\n## 3NF\nFor each non-trivial dependency X → A, X is a superkey or A is prime.\n\n## BCNF\nFor every non-trivial dependency X → Y, X must be a superkey. BCNF is stricter than 3NF and may sacrifice dependency preservation.\n\n## Decomposition\nAim for losslessness so joining decomposed relations does not create spurious tuples. Dependency preservation is a separate property.",
    "codeExamples": [],
    "relatedProblemSlugs": []
  },
  {
    "title": "Transactions, Schedules and Serializability",
    "slug": "transactions-serializability",
    "category": "DBMS",
    "topic": "Transactions",
    "summary": "Use conflicts and precedence graphs to test conflict serializability.",
    "content": "## Conflicting operations\nOperations conflict when they belong to different transactions, access the same item, and at least one is a write. Read-read does not conflict.\n\n## Precedence graph\nCreate one node per transaction. Add Ti → Tj when an operation of Ti conflicts with and occurs before an operation of Tj on the same item.\n\n## Cycle test\nA schedule is conflict-serializable exactly when its precedence graph is acyclic. A topological order gives an equivalent serial order.\n\n## Recoverability\nRecoverable schedules constrain commit order after reads. Cascadeless schedules avoid reading uncommitted writes. Strict schedules prevent other transactions from reading or writing an item modified by an uncommitted transaction.\n\n## Pitfalls\nDo not add edges for read-read pairs, reverse edge direction, or confuse conflict serializability with view serializability.",
    "codeExamples": [],
    "relatedProblemSlugs": []
  },
  {
    "title": "Indexing in DBMS: B+ Trees and Hashes",
    "slug": "dbms-indexing",
    "category": "DBMS",
    "topic": "Indexing",
    "summary": "Compare tree and hash indexes, composite indexes, and the read-write trade-off.",
    "content": "## Index purpose\nAn index helps locate rows without scanning a full table. It speeds selected reads but costs storage and adds work to inserts, updates, and deletes.\n\n## B+ trees\nBalanced tree indexes support equality and ordered range queries. B+ tree leaves are commonly linked, making range scans efficient.\n\n## Hash indexes\nHash indexes can be effective for equality lookups but generally do not support ordered range scans naturally.\n\n## Composite indexes\nFor an index on (last_name, first_name), the leading column is important. Queries using the leftmost prefix are more likely to benefit than queries filtering only by the second column.\n\n## Index selection\nLow-selectivity columns, tiny tables, and write-heavy workloads may not benefit. Inspect query plans and measure representative queries rather than indexing every column.",
    "codeExamples": [
      {
        "language": "sql",
        "caption": "Inspect a query plan (syntax varies by DBMS)",
        "code": "EXPLAIN SELECT order_id, total FROM Orders WHERE customer_id = 42;"
      }
    ],
    "relatedProblemSlugs": []
  },
  {
    "title": "SQL GROUP BY, HAVING and Aggregates",
    "slug": "sql-group-by-having",
    "category": "DBMS",
    "topic": "SQL",
    "summary": "Summarize records correctly and distinguish row filters from group filters.",
    "content": "## Aggregates\nCOUNT, SUM, AVG, MIN, and MAX summarize values. COUNT(*) counts rows; COUNT(column) counts non-NULL values in that column.\n\n## GROUP BY\nGROUP BY partitions rows into groups and returns one result per group.\n\n## WHERE versus HAVING\nWHERE filters rows before grouping. HAVING filters groups after aggregation. Put aggregate conditions in HAVING.\n\n## NULL behavior\nMost aggregates ignore NULL values. Use IS NULL rather than `= NULL`.\n\n## Example\nTo find departments with at least five active employees, filter active rows, group by department, and use HAVING COUNT(*) >= 5.\n\n## Pitfalls\nDo not confuse COUNT(*) and COUNT(column), and remember that WHERE changes which rows contribute to aggregates.",
    "codeExamples": [
      {
        "language": "sql",
        "caption": "Departments with at least five active employees",
        "code": "SELECT department_id, COUNT(*) AS employee_count, AVG(salary) AS avg_salary\nFROM Employees\nWHERE status = 'ACTIVE'\nGROUP BY department_id\nHAVING COUNT(*) >= 5;"
      }
    ],
    "relatedProblemSlugs": []
  },
  {
    "title": "CPU Scheduling Algorithms",
    "slug": "os-cpu-scheduling",
    "category": "Operating Systems",
    "topic": "CPU Scheduling",
    "summary": "Compare FCFS, SJF, SRTF, Priority, and Round Robin using scheduling metrics.",
    "content": "## Metrics\nTurnaround = completion − arrival. Waiting = turnaround − CPU burst in the simple single-burst model. Response = first CPU start − arrival.\n\n## FCFS\nRuns in arrival order. It is simple but can suffer the convoy effect when short jobs wait behind a long job.\n\n## SJF and SRTF\nShortest Job First selects the smallest next CPU burst. Under ideal assumptions with all jobs available together, it minimizes average waiting time. SRTF is the preemptive version.\n\n## Priority\nRuns the highest-priority ready process. Aging can reduce starvation by gradually raising waiting processes' priorities.\n\n## Round Robin\nEach process receives a time quantum. A very large quantum approaches FCFS; a very small one increases context-switch overhead.\n\n## Exam method\nDraw a Gantt chart, record completion times, then calculate each metric. State preemption and tie-breaking assumptions.",
    "codeExamples": [],
    "relatedProblemSlugs": []
  },
  {
    "title": "Deadlocks: Conditions and Banker’s Algorithm",
    "slug": "os-deadlocks",
    "category": "Operating Systems",
    "topic": "Deadlocks",
    "summary": "Understand Coffman conditions and distinguish prevention, avoidance, detection, and recovery.",
    "content": "## Deadlock\nA set of processes is deadlocked when each waits for a resource or event that only another process in the set can provide.\n\n## Four necessary conditions\nMutual exclusion, hold and wait, no preemption, and circular wait must all hold for deadlock to be possible.\n\n## Prevention\nEnsure at least one necessary condition cannot hold. A global resource ordering, for example, prevents circular wait.\n\n## Avoidance\nGrant a request only if the resulting state remains safe. Banker's algorithm uses available resources, allocations, and maximum claims to find a safe sequence.\n\n## Detection and recovery\nA system may detect deadlocks and recover by terminating processes or preempting resources where feasible.\n\n## Safe is not the same as deadlocked\nAn unsafe state is not necessarily currently deadlocked; it means completion cannot be guaranteed under the stated claims.",
    "codeExamples": [],
    "relatedProblemSlugs": []
  },
  {
    "title": "Virtual Memory and Demand Paging",
    "slug": "os-virtual-memory",
    "category": "Operating Systems",
    "topic": "Memory Management",
    "summary": "Understand address translation, page tables, TLBs, page faults, and replacement.",
    "content": "## Virtual memory\nEach process sees a virtual address space. Hardware and the OS translate virtual addresses into physical addresses while providing isolation.\n\n## Paging\nA virtual address contains a virtual page number and an offset. The page table maps the page number to a physical frame; the offset is preserved.\n\n## TLB\nA Translation Lookaside Buffer caches recent translations. A hit avoids a page-table walk; a miss requires consulting page tables.\n\n## Page faults\nA fault occurs when the current mapping cannot complete the access. The page may need loading, or the access may be invalid.\n\n## Demand paging and replacement\nPages load when first accessed. FIFO, LRU, and Optimal are standard replacement models; Optimal is a theoretical benchmark because it requires future knowledge.\n\n## Pitfalls\nPage faults are not all invalid accesses. Page size determines offset bits, and excessive faults can cause thrashing.",
    "codeExamples": [],
    "relatedProblemSlugs": []
  },
  {
    "title": "Synchronization: Mutexes, Semaphores and Monitors",
    "slug": "os-synchronization",
    "category": "Operating Systems",
    "topic": "Concurrency",
    "summary": "Protect critical sections and coordinate threads without races or deadlocks.",
    "content": "## Race condition\nA race occurs when results depend on the timing or interleaving of concurrent operations on shared state.\n\n## Critical section\nA correct solution aims for mutual exclusion, progress, and bounded waiting under its assumptions.\n\n## Mutex\nA mutex provides exclusive ownership: one thread locks and later unlocks it. It is commonly used to protect shared data.\n\n## Semaphore\nA counting semaphore tracks permits and supports wait and signal operations. Ownership semantics need not be tied to the acquiring thread.\n\n## Monitor\nA monitor groups shared state and operations with mutual exclusion. Condition variables allow threads to wait for state changes.\n\n## Pitfalls\nSleep is not synchronization. Re-check a condition after waking, and distinguish mutual exclusion from signaling and ordering.",
    "codeExamples": [
      {
        "language": "cpp",
        "caption": "Mutex-protected counter (C++11+)",
        "code": "#include <mutex>\nstd::mutex m;\nint counter = 0;\nvoid increment() {\n    std::lock_guard<std::mutex> lock(m);\n    ++counter;\n}"
      }
    ],
    "relatedProblemSlugs": []
  },
  {
    "title": "File Systems: Inodes and Allocation",
    "slug": "os-file-systems",
    "category": "Operating Systems",
    "topic": "File Systems",
    "summary": "Learn file metadata, directories, block allocation, and free-space management.",
    "content": "## Responsibilities\nA file system names, stores, retrieves, and protects files. It manages metadata, directories, free space, and file-to-block mappings.\n\n## Inodes\nIn Unix-like systems, an inode stores metadata and data-block mapping information. A directory entry maps a filename to a file identifier; the filename is not stored in the inode itself.\n\n## Allocation methods\nContiguous allocation is simple but can fragment. Linked allocation avoids external fragmentation but makes random access costly. Indexed allocation stores block pointers in an index. Extents represent runs of contiguous blocks.\n\n## Free space\nBitmaps and free lists are common ways to track available blocks.\n\n## Journaling\nA journal records intended updates so recovery after a crash is more consistent. Exact guarantees depend on file system and journaling mode.\n\n## Pitfalls\nDistinguish hard links from symbolic links and consider sequential versus random access costs.",
    "codeExamples": [],
    "relatedProblemSlugs": []
  }
];
