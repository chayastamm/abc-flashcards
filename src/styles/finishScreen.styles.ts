import { StyleSheet } from 'react-native';
import { COLORS, READER_FONT_FAMILY } from '../constants/theme';

export const finishScreenStyles = StyleSheet.create({
  scrollContent: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  trophy: { fontSize: 140 },
  trophySmall: { fontSize: 80 },
  title: { fontSize: 44, fontWeight: '900', color: COLORS.red, marginTop: 8 },
  scoreText: { fontSize: 22, fontWeight: '700', color: COLORS.ink, marginTop: 8 },
  finishTimeText: { fontSize: 22, fontWeight: '800', color: COLORS.blue, marginTop: 8, textAlign: 'center' },

  letterResults: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    maxWidth: 460,
    marginTop: 24,
  },
  letterResultChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  correctChip: { backgroundColor: COLORS.green },
  missedChip: { backgroundColor: COLORS.red },
  letterResultText: { fontSize: 22, fontFamily: READER_FONT_FAMILY },

  practiceMissedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 24,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 32,
    backgroundColor: COLORS.red,
    elevation: 6,
  },
  practiceMissedLabel: { fontSize: 20, fontWeight: '900', color: COLORS.white },

  navigationButtons: { flexDirection: 'row', alignItems: 'center', gap: 24, marginTop: 40 },
  homeButton: { width: 90, height: 90, backgroundColor: COLORS.yellow },
  playAgainButton: { backgroundColor: COLORS.blue },
});
