interface TaskNode {
  id: string;
}

interface Dependency {
  taskId: string;
  dependsOnId: string;
}

interface AdjacencyResult {
  adj: Record<string, string[]>;
  inDegree: Record<string, number>;
}

interface CriticalPathResult {
  length: number;
  path: string[];
}

interface BottleneckResult {
  taskId: string;
  dependentCount: number;
}

/**
 * Graph utility class for Task Dependency operations.
 */
class GraphUtil {
  /**
   * Build adjacency list from dependencies.
   * Directed edge: A -> B means A MUST FINISH BEFORE B CAN START.
   */
  static buildAdjacencyList(tasks: TaskNode[], dependencies: Dependency[]): AdjacencyResult {
    const adj: Record<string, string[]> = {};
    const inDegree: Record<string, number> = {};

    tasks.forEach((t) => {
      adj[t.id] = [];
      inDegree[t.id] = 0;
    });

    dependencies.forEach((dep) => {
      const u = dep.dependsOnId;
      const v = dep.taskId;

      if (adj[u]) {
        adj[u].push(v);
      }
      if (inDegree[v] !== undefined) {
        inDegree[v]++;
      }
    });

    return { adj, inDegree };
  }

  /**
   * Detect cycle in a directed graph using DFS.
   */
  static detectCycle(adj: Record<string, string[]>): boolean {
    const visited = new Set<string>();
    const recStack = new Set<string>();

    const dfs = (node: string): boolean => {
      if (recStack.has(node)) return true;
      if (visited.has(node)) return false;

      visited.add(node);
      recStack.add(node);

      if (adj[node]) {
        for (const neighbor of adj[node]) {
          if (dfs(neighbor)) return true;
        }
      }

      recStack.delete(node);
      return false;
    };

    for (const node of Object.keys(adj)) {
      if (!visited.has(node)) {
        if (dfs(node)) return true;
      }
    }

    return false;
  }

  /**
   * Implement Topological Sort using Kahn's algorithm.
   */
  static topologicalSort(adj: Record<string, string[]>, inDegree: Record<string, number>): string[] {
    const queue: string[] = [];
    const sorted: string[] = [];

    for (const node of Object.keys(inDegree)) {
      if (inDegree[node] === 0) queue.push(node);
    }

    while (queue.length > 0) {
      const u = queue.shift()!;
      sorted.push(u);

      if (adj[u]) {
        for (const v of adj[u]) {
          inDegree[v]--;
          if (inDegree[v] === 0) queue.push(v);
        }
      }
    }

    if (sorted.length !== Object.keys(adj).length) {
      throw new Error("Graph has a cycle! Topological sort is not possible.");
    }

    return sorted;
  }

  /**
   * Compute Critical Path using longest-path analysis.
   */
  static computeCriticalPath(adj: Record<string, string[]>, sortedNodes: string[]): CriticalPathResult {
    const dist: Record<string, number> = {};
    const parent: Record<string, string | null> = {};

    sortedNodes.forEach((node) => {
      dist[node] = 1;
      parent[node] = null;
    });

    for (const u of sortedNodes) {
      if (adj[u]) {
        for (const v of adj[u]) {
          if (dist[v] < dist[u] + 1) {
            dist[v] = dist[u] + 1;
            parent[v] = u;
          }
        }
      }
    }

    let maxDist = 0;
    let endNode: string | null = null;
    for (const node of sortedNodes) {
      if (dist[node] > maxDist) {
        maxDist = dist[node];
        endNode = node;
      }
    }

    const criticalPath: string[] = [];
    let curr: string | null = endNode;
    while (curr) {
      criticalPath.unshift(curr);
      curr = parent[curr];
    }

    return { length: maxDist, path: criticalPath };
  }

  /**
   * Return bottleneck tasks — highest out-degree (most dependents).
   */
  static computeBottlenecks(adj: Record<string, string[]>): BottleneckResult[] {
    const outDegree: Record<string, number> = {};
    Object.keys(adj).forEach((node) => {
      outDegree[node] = adj[node].length;
    });

    const sortedByOutDegree = Object.entries(outDegree)
      .sort((a, b) => b[1] - a[1])
      .map(([node, degree]) => ({ taskId: node, dependentCount: degree }));

    return sortedByOutDegree.slice(0, 3);
  }
}

export default GraphUtil;
