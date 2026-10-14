import { StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';

export const commonStyles = StyleSheet.create({
  appRoot: { flex: 1, backgroundColor: COLORS.background },
  fill: { flex: 1 },
  centeredContent: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  // A lit-up ring outside the button's edge; boxShadow doesn't affect layout, so nothing shifts.
  pressed: {
    boxShadow: `0 0 0 3px ${COLORS.pressGlow}, 0 0 12px 4px ${COLORS.pressGlow}`,
    transform: [{ scale: 0.97 }],
  },
  roundButton: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },
});
