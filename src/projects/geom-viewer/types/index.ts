export interface Vector2 {
  x: number;
  y: number;
}

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface Vector4 extends Vector3 {
  w: number;
}

export interface ProjectedPoint extends Vector2 {
  scale: number;
}

export interface Glow {
  vertexIdx: number;
  radius: number;
  stops: { offset: number; color: string }[];
}

export interface FaceStyle {
  composite?: GlobalCompositeOperation;
}

export interface Geometry {
  vertices: Vector3[];
  faces: number[][];
  vertices4D?: Vector4[];
  faceColors?: (string | null)[];
  edgeColors?: string[];
  faceStyles?: FaceStyle[];
  glows?: Glow[];
  hideVertices?: boolean;
  hideEdges?: boolean;
  nodeIndices?: number[];
}

export interface ShapeFormula {
  label: string;
  eq: string;
}

export interface ShapeDefinition {
  id: string;
  title: string;
  desc: string[];
  formulas?: ShapeFormula[];
  is4D?: boolean;
  isDynamic?: boolean;
  step?: number;
  limit?: number;
  hideVertices?: boolean;
  hideEdges?: boolean;
  generate: (counter: number, state?: any) => Geometry;
}

export interface DisciplineGroup {
  name: string;
  shapes: string[];
  desc?: string;
}

export interface Discipline {
  id: string;
  name: string;
  desc: string;
  groups: DisciplineGroup[];
}
