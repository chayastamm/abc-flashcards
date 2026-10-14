export type ShapeName =
  | 'circle'
  | 'star'
  | 'heart'
  | 'square'
  | 'rectangle'
  | 'triangle'
  | 'diamond'
  | 'oval'
  | 'cube'
  | 'sphere'
  | 'cone'
  | 'cylinder'
  | 'trapezoid'
  | 'rhombus'
  | 'octagon'
  | 'hexagon';

export const EASY_SHAPES: ShapeName[] = [
  'circle',
  'star',
  'heart',
  'square',
  'rectangle',
  'triangle',
  'diamond',
  'oval',
];

export const HARD_SHAPES: ShapeName[] = [
  'square',
  'rectangle',
  'cube',
  'sphere',
  'cone',
  'cylinder',
  'trapezoid',
  'rhombus',
  'octagon',
  'hexagon',
];
