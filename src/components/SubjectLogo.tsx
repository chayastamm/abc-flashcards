import { Image, ImageStyle, StyleProp, View, ViewStyle } from 'react-native';
import Svg, { Circle, G, Line, Path, Polygon, Rect, Text as SvgText } from 'react-native-svg';
import { COLOR_CARD_FILLS } from '../constants/colorCards';
import { Subject } from '../constants/decks';
import { COLORS, READER_FONT_FAMILY } from '../constants/theme';
import { getStarPoints, getSubjectOption } from '../utils';

// Same canvas as abc-logo.png and 123-logo.png, so all logos line up and scale alike.
const LOGO_WIDTH = 872;
const LOGO_HEIGHT = 734;
const OUTLINE_WIDTH = 14;
const SHADOW_COLOR = 'rgba(7, 59, 76, 0.22)';
const SHADOW_OFFSET = { x: 7, y: 9 };

// The picture for a subject: the saved logo image, or a logo drawn in code.
export function SubjectLogo({ subject, style }: { subject: Subject; style?: StyleProp<ImageStyle> }) {
  const { logo } = getSubjectOption(subject);
  if (logo) return <Image source={logo} resizeMode="contain" style={style} />;
  return (
    <View style={style as StyleProp<ViewStyle>}>
      <DrawnLogo subject={subject} />
    </View>
  );
}

function DrawnLogo({ subject }: { subject: Subject }) {
  if (subject === 'colors') return <PaletteLogo />;
  if (subject === 'sightWords') return <IndexCardsLogo />;
  return <ShapesLogo />;
}

// A circle, triangle, and square in the ABC logo's style: tilted, outlined, with a soft drop shadow and stars.
function ShapesLogo() {
  const outline = { stroke: COLORS.ink, strokeWidth: OUTLINE_WIDTH, strokeLinejoin: 'round' as const };
  const shapes = (fills: { circle: string; triangle: string; square: string }, extraProps: object) => (
    <>
      <Circle cx={200} cy={400} r={150} fill={fills.circle} {...extraProps} />
      <Polygon points="440,170 600,520 280,520" fill={fills.triangle} transform="rotate(4 440 400)" {...extraProps} />
      <Rect
        x={560}
        y={250}
        width={280}
        height={280}
        rx={10}
        fill={fills.square}
        transform="rotate(-6 700 390)"
        {...extraProps}
      />
    </>
  );

  return (
    <Svg width="100%" height="100%" viewBox={`0 0 ${LOGO_WIDTH} ${LOGO_HEIGHT}`}>
      <Polygon points={getStarPoints(136, 50, 46, 21)} fill={COLORS.green} />
      <Polygon points={getStarPoints(757, 72, 38, 17)} fill={COLORS.red} />
      <Polygon points={getStarPoints(422, 700, 33, 15)} fill={COLORS.blue} />
      <G transform={`translate(${SHADOW_OFFSET.x} ${SHADOW_OFFSET.y})`}>
        {shapes(
          { circle: SHADOW_COLOR, triangle: SHADOW_COLOR, square: SHADOW_COLOR },
          { stroke: SHADOW_COLOR, strokeWidth: OUTLINE_WIDTH, strokeLinejoin: 'round' },
        )}
      </G>
      {shapes({ circle: COLORS.red, triangle: COLORS.yellow, square: COLORS.blue }, outline)}
    </Svg>
  );
}

const PALETTE_FILL = '#F3D9A4';
// Drawn around (0, 0), then moved to the middle of the logo and tilted slightly.
const PALETTE_TRANSFORM = 'translate(436 390) rotate(-8)';
// The board, with a thumb hole cut out (evenodd fill turns the second loop into a hole).
const PALETTE_PATH = [
  'M-300,-40 C-300,-200 -120,-230 40,-220 C220,-210 320,-120 320,10 C320,140 200,210 60,200',
  'C-10,195 -20,150 -60,140 C-110,128 -150,190 -220,170 C-290,150 -300,60 -300,-40 Z',
  'M-212,40 a42,34 0 1,0 84,0 a42,34 0 1,0 -84,0 Z',
].join(' ');
const PALETTE_PAINT_DOTS = [
  { colorCard: 'red', x: -165, y: -90 },
  { colorCard: 'yellow', x: -25, y: -145 },
  { colorCard: 'green', x: 120, y: -135 },
  { colorCard: 'blue', x: 225, y: -35 },
  { colorCard: 'purple', x: 185, y: 95 },
] as const;
const PAINT_DOT_RADIUS = 48;

// A painter's palette with dabs of paint, in the same outlined, shadowed style as the other logos.
function PaletteLogo() {
  return (
    <Svg width="100%" height="100%" viewBox={`0 0 ${LOGO_WIDTH} ${LOGO_HEIGHT}`}>
      <Polygon points={getStarPoints(136, 50, 46, 21)} fill={COLORS.green} />
      <Polygon points={getStarPoints(757, 72, 38, 17)} fill={COLORS.red} />
      <Polygon points={getStarPoints(422, 700, 33, 15)} fill={COLORS.blue} />
      <G transform={`translate(${SHADOW_OFFSET.x} ${SHADOW_OFFSET.y})`}>
        <Path
          d={PALETTE_PATH}
          transform={PALETTE_TRANSFORM}
          fillRule="evenodd"
          fill={SHADOW_COLOR}
          stroke={SHADOW_COLOR}
          strokeWidth={OUTLINE_WIDTH}
          strokeLinejoin="round"
        />
      </G>
      <G transform={PALETTE_TRANSFORM}>
        <Path
          d={PALETTE_PATH}
          fillRule="evenodd"
          fill={PALETTE_FILL}
          stroke={COLORS.ink}
          strokeWidth={OUTLINE_WIDTH}
          strokeLinejoin="round"
        />
        {PALETTE_PAINT_DOTS.map(({ colorCard, x, y }) => (
          <Circle
            key={colorCard}
            cx={x}
            cy={y}
            r={PAINT_DOT_RADIUS}
            fill={COLOR_CARD_FILLS[colorCard].color}
            stroke={COLORS.ink}
            strokeWidth={OUTLINE_WIDTH * 0.7}
          />
        ))}
      </G>
    </Svg>
  );
}

const INDEX_CARD_WIDTH = 480;
const INDEX_CARD_HEIGHT = 310;
const INDEX_CARD_CENTER = { x: 436, y: 380 };
// Back to front: two colored cards fanned out behind a white one.
const INDEX_CARD_STACK = [
  { fill: COLORS.blue, rotationDegrees: -12, offset: { x: -24, y: 24 } },
  { fill: COLORS.yellow, rotationDegrees: 8, offset: { x: 26, y: 12 } },
  { fill: COLORS.white, rotationDegrees: -3, offset: { x: 0, y: -6 } },
];
const INDEX_CARD_HEADER_LINE_Y = 70;
const INDEX_CARD_HEADER_LINE_COLOR = '#E53935';

// One index card drawn around (0, 0), moved and turned into place in the stack.
function getIndexCardTransform(rotationDegrees: number, offset: { x: number; y: number }): string {
  return `translate(${INDEX_CARD_CENTER.x + offset.x} ${INDEX_CARD_CENTER.y + offset.y}) rotate(${rotationDegrees})`;
}

// A fanned stack of index cards with "the" on the top one, in the same outlined, shadowed style as the other logos.
function IndexCardsLogo() {
  const outline = { stroke: COLORS.ink, strokeWidth: OUTLINE_WIDTH, strokeLinejoin: 'round' as const };
  const cardRect = {
    x: -INDEX_CARD_WIDTH / 2,
    y: -INDEX_CARD_HEIGHT / 2,
    width: INDEX_CARD_WIDTH,
    height: INDEX_CARD_HEIGHT,
    rx: 18,
  };
  const topCard = INDEX_CARD_STACK[INDEX_CARD_STACK.length - 1];

  return (
    <Svg width="100%" height="100%" viewBox={`0 0 ${LOGO_WIDTH} ${LOGO_HEIGHT}`}>
      <Polygon points={getStarPoints(136, 50, 46, 21)} fill={COLORS.green} />
      <Polygon points={getStarPoints(757, 72, 38, 17)} fill={COLORS.red} />
      <Polygon points={getStarPoints(422, 700, 33, 15)} fill={COLORS.blue} />
      {INDEX_CARD_STACK.map(({ fill, rotationDegrees, offset }) => (
        <G key={fill}>
          <G transform={`translate(${SHADOW_OFFSET.x} ${SHADOW_OFFSET.y})`}>
            <G transform={getIndexCardTransform(rotationDegrees, offset)}>
              <Rect {...cardRect} fill={SHADOW_COLOR} />
            </G>
          </G>
          <G transform={getIndexCardTransform(rotationDegrees, offset)}>
            <Rect {...cardRect} fill={fill} {...outline} />
          </G>
        </G>
      ))}
      <G transform={getIndexCardTransform(topCard.rotationDegrees, topCard.offset)}>
        <Line
          x1={-INDEX_CARD_WIDTH / 2 + OUTLINE_WIDTH}
          y1={-INDEX_CARD_HEIGHT / 2 + INDEX_CARD_HEADER_LINE_Y}
          x2={INDEX_CARD_WIDTH / 2 - OUTLINE_WIDTH}
          y2={-INDEX_CARD_HEIGHT / 2 + INDEX_CARD_HEADER_LINE_Y}
          stroke={INDEX_CARD_HEADER_LINE_COLOR}
          strokeWidth={6}
        />
        <SvgText
          x={0}
          y={78}
          textAnchor="middle"
          fontFamily={READER_FONT_FAMILY}
          fontWeight="bold"
          fontSize={190}
          fill={COLORS.ink}
        >
          the
        </SvgText>
      </G>
    </Svg>
  );
}
