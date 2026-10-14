import { useId } from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { COLOR_CARD_FILLS, ColorCardName } from '../constants/colorCards';

// Fills the whole card with the card's color. Flat colors come from the card's background;
// metallic ones (gold, silver) add a diagonal shine on top.
export function ColorCardFill({ colorCard }: { colorCard: ColorCardName }) {
  const gradientId = `shine-${useId().replace(/:/g, '')}`;
  const { color, shineColor } = COLOR_CARD_FILLS[colorCard];
  if (!shineColor) return null;

  return (
    <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
      <Defs>
        <LinearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={color} />
          <Stop offset="0.45" stopColor={shineColor} />
          <Stop offset="0.55" stopColor={shineColor} />
          <Stop offset="1" stopColor={color} />
        </LinearGradient>
      </Defs>
      <Rect x="0" y="0" width="100%" height="100%" fill={`url(#${gradientId})`} />
    </Svg>
  );
}
