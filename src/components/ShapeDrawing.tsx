import { useId } from 'react';
import Svg, { Circle, Defs, Ellipse, LinearGradient, Path, Polygon, RadialGradient, Rect, Stop } from 'react-native-svg';
import { ShapeName } from '../constants/shapes';
import { COLORS } from '../constants/theme';
import { getRegularPolygonPoints, getStarPoints } from '../utils';

const VIEWBOX_SIZE = 100;
const OUTLINE_WIDTH = 4;
// Darkest tone of the shading on 3D shapes, blended over the fill.
const SHADE_COLOR = '#B9C6CC';

// Draws one shape in a 100x100 box: filled, with a dark outline, and shaded if it's 3D.
export function ShapeDrawing({
  shape,
  size,
  fillColor = COLORS.white,
}: {
  shape: ShapeName;
  size: number;
  fillColor?: string;
}) {
  // Gradient ids must be unique on the page, so each drawing gets its own.
  const gradientId = `shade-${useId().replace(/:/g, '')}`;
  const outline = { stroke: COLORS.ink, strokeWidth: OUTLINE_WIDTH, strokeLinejoin: 'round' as const };
  const flatFill = { fill: fillColor, ...outline };
  const shadedFill = { fill: `url(#${gradientId})`, ...outline };

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`}>
      <Defs>
        {/* Lit from the left: used across round 3D surfaces. */}
        <LinearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor={fillColor} />
          <Stop offset="0.45" stopColor={fillColor} />
          <Stop offset="1" stopColor={SHADE_COLOR} />
        </LinearGradient>
        <RadialGradient id={`${gradientId}-sphere`} cx="0.38" cy="0.35" r="0.7">
          <Stop offset="0" stopColor={fillColor} />
          <Stop offset="0.5" stopColor={fillColor} />
          <Stop offset="1" stopColor={SHADE_COLOR} />
        </RadialGradient>
      </Defs>
      {drawShape(shape, { flatFill, shadedFill, sphereFill: `url(#${gradientId}-sphere)`, outline })}
    </Svg>
  );
}

function drawShape(
  shape: ShapeName,
  fills: {
    flatFill: object;
    shadedFill: object;
    sphereFill: string;
    outline: object;
  },
) {
  const { flatFill, shadedFill, sphereFill, outline } = fills;
  // Hidden edges of 3D shapes are drawn dashed and faint.
  const hiddenEdge = { ...outline, fill: 'none', strokeWidth: 2, strokeDasharray: '4 4', strokeOpacity: 0.5 };

  switch (shape) {
    case 'circle':
      return <Circle cx={50} cy={50} r={40} {...flatFill} />;
    case 'oval':
      return <Ellipse cx={50} cy={50} rx={44} ry={28} {...flatFill} />;
    case 'square':
      return <Rect x={14} y={14} width={72} height={72} rx={2} {...flatFill} />;
    case 'rectangle':
      return <Rect x={5} y={26} width={90} height={48} rx={2} {...flatFill} />;
    case 'triangle':
      return <Polygon points="50,10 93,86 7,86" {...flatFill} />;
    case 'diamond':
      return <Polygon points="50,5 82,50 50,95 18,50" {...flatFill} />;
    case 'rhombus':
      // Equal sides, slanted: a pushed-over square.
      return <Polygon points="8,74 34,26 89,26 63,74" {...flatFill} />;
    case 'trapezoid':
      return <Polygon points="30,26 70,26 94,76 6,76" {...flatFill} />;
    case 'star':
      return <Polygon points={getStarPoints(50, 53, 46, 19)} {...flatFill} />;
    case 'heart':
      return (
        <Path
          d="M50,88 C22,68 6,50 6,32 C6,17 17,8 30,8 C40,8 47,14 50,23 C53,14 60,8 70,8 C83,8 94,17 94,32 C94,50 78,68 50,88 Z"
          {...flatFill}
        />
      );
    case 'hexagon':
      return <Polygon points={getRegularPolygonPoints(6, 50, 50, 44, 0)} {...flatFill} />;
    case 'octagon':
      return <Polygon points={getRegularPolygonPoints(8, 50, 50, 44, 22.5)} {...flatFill} />;
    case 'cube':
      return (
        <>
          <Rect x={10} y={32} width={58} height={58} {...flatFill} />
          <Polygon points="10,32 32,10 90,10 68,32" {...flatFill} />
          <Polygon points="68,32 90,10 90,68 68,90" {...shadedFill} />
        </>
      );
    case 'sphere':
      return (
        <>
          <Circle cx={50} cy={50} r={42} {...outline} fill={sphereFill} />
          <Path d="M8,50 A42,12 0 0 0 92,50" {...outline} fill="none" strokeWidth={2} strokeOpacity={0.5} />
          <Path d="M8,50 A42,12 0 0 1 92,50" {...hiddenEdge} />
        </>
      );
    case 'cylinder':
      return (
        <>
          <Path d="M20,22 L20,80 A30,10 0 0 0 80,80 L80,22 Z" {...shadedFill} />
          <Path d="M20,80 A30,10 0 0 1 80,80" {...hiddenEdge} />
          <Ellipse cx={50} cy={22} rx={30} ry={10} {...flatFill} />
        </>
      );
    case 'cone':
      return (
        <>
          <Path d="M50,8 L14,82 A36,11 0 0 0 86,82 Z" {...shadedFill} />
          <Path d="M14,82 A36,11 0 0 1 86,82" {...hiddenEdge} />
        </>
      );
  }
}
