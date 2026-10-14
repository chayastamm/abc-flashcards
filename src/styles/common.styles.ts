import { StyleSheet, ViewStyle } from 'react-native';
import { COLORS } from '../constants/theme';

export const commonStyles = StyleSheet.create({
  appRoot: { flex: 1, backgroundColor: COLORS.background },
  fill: { flex: 1 },
  centeredContent: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  roundButton: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },
});

const PRESSED_GLOW_RING_ALPHA = '66'; // ~40% opacity
const PRESSED_GLOW_BLUR_ALPHA = '4D'; // ~30% opacity

// A soft ring in the button's own color while it's held down.
// boxShadow sits outside the button's edge and doesn't affect layout, so nothing shifts.
export function getPressedGlowStyle(buttonColor: string): ViewStyle {
  return {
    boxShadow: `0 0 0 3px ${buttonColor}${PRESSED_GLOW_RING_ALPHA}, 0 0 10px 3px ${buttonColor}${PRESSED_GLOW_BLUR_ALPHA}`,
    transform: [{ scale: 0.97 }],
  };
}
