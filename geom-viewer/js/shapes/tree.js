/**
 * js/shapes/tree.js
 * 構造の説明: 3D二分木 (3D Binary Tree)
 */

import { vec, normalize } from "../utils.js";

export const binaryTree = {
  title: "3D Binary Tree",
  isDynamic: true,
  desc: [
    "The binary tree is a foundational recursive structure in both biology and computer science. Historically, its formal geometric study was popularized by Aristid Lindenmayer in 1968 through L-systems (Lindenmayer systems), a mathematical formalization used to model the growth processes of plant development and branching structures.",
    "In computer science, the tree represents the quintessential hierarchical data structure, serving as the basis for Binary Search Trees (BST), heaps, and space-partitioning algorithms like BSP or k-d trees. Its power lies in its O(log n) efficiency for searching and organizing data, making complex systems manageable through recursive subdivision.",
    "As a fractal, the 3D binary tree exhibits self-similarity across scales. By alternating the branching plane, it achieves a high fractal dimension, allowing it to efficiently fill volume—a principle observed in the architecture of lungs, vascular systems, and river basins for optimal resource distribution.",
  ],
  formulas: [
    { label: "Total Nodes", eq: "N = 2^{h+1} - 1" },
    { label: "Search Complexity", eq: "O(\log N)" },
    { label: "Tree Height", eq: "h \\approx \log_2 N" },
  ],
  generate: (counter = 0) => {
    const vertices = [];
    const faces = [];

    // Animation parameters
    const maxDepth = 9;
    const cycle = 500;
    const phase = (counter % cycle) / cycle;
    
    // Grow from depth 0 to maxDepth
    let progress;
    if (phase < 0.8) {
      progress = (phase / 0.8) * (maxDepth + 1);
    } else {
      progress = maxDepth + 1;
    }

    /**
     * Rotates a vector around an orthogonal axis.
     */
    const rotate = (v, axis, angle) => {
      const cross = vec.cross(axis, v);
      return vec.add(
        vec.mul(v, Math.cos(angle)),
        vec.mul(cross, Math.sin(angle))
      );
    };

    const addBranch = (startIndex, frame, length, depth) => {
      if (depth > progress) return;

      const start = vertices[startIndex];
      const localProgress = Math.min(1, progress - depth);
      const currentLength = length * localProgress;

      const end = vec.add(start, vec.mul(frame.dir, currentLength));
      const endIndex = vertices.length;
      vertices.push(end);
      faces.push([startIndex, endIndex]);

      // Only branch if the current segment is fully grown
      if (localProgress < 1.0 || depth >= maxDepth) return;

      const nextLength = length * 0.75;
      const ang = 0.6; // Branching angle (~35 degrees)

      // Alternate branching axis based on depth to fill 3D space consistently
      const axis = (depth % 2 === 0) ? frame.right : frame.forward;

      const d1 = rotate(frame.dir, axis, ang);
      const d2 = rotate(frame.dir, axis, -ang);

      // Propagate frames to children: keep them orthogonal and consistent
      const buildNextFrame = (newDir) => {
        const newRight = normalize(vec.cross(newDir, axis));
        const newForward = normalize(vec.cross(newRight, newDir));
        return { dir: newDir, right: newRight, forward: newForward };
      };

      addBranch(endIndex, buildNextFrame(d1), nextLength, depth + 1);
      addBranch(endIndex, buildNextFrame(d2), nextLength, depth + 1);
    };

    // Initial root frame
    const initialFrame = {
      dir: { x: 0, y: 1, z: 0 },
      right: { x: 1, y: 0, z: 0 },
      forward: { x: 0, y: 0, z: 1 }
    };

    vertices.push({ x: 0, y: -0.8, z: 0 });
    addBranch(0, initialFrame, 0.5, 0);

    return { 
      vertices, 
      faces,
      hideVertices: false
    };
  }
};



