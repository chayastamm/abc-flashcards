import { StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';

export const commonStyles = StyleSheet.create({
  appRoot: { flex: 1, backgroundColor: COLORS.background },
  fill: { flex: 1 },
  centeredContent: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  pressed: { opacity: 0.8, transform: [{ scale: 0.95 }] },
  roundButton: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },
});
