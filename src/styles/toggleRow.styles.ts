import { StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';

export const toggleRowStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 16 },
  label: { fontSize: 20, fontWeight: '800', color: COLORS.ink },
});

// The "on" color matches the label text.
export const SWITCH_TRACK_COLORS = { false: COLORS.switchTrackOff, true: COLORS.ink };
