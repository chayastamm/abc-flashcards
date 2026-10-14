import { StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';

export const elapsedTimerStyles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  text: { fontSize: 22, fontWeight: '800', color: COLORS.ink, fontVariant: ['tabular-nums'] },
});
