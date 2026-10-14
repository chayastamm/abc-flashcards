import { StyleSheet } from 'react-native';
import { COLORS, READER_FONT_FAMILY } from '../constants/theme';

export const startScreenStyles = StyleSheet.create({
  welcomeTitle: { fontSize: 54, fontWeight: '900', color: COLORS.red, letterSpacing: 2 },
  subtitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.ink,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 32,
  },
  logo: { width: 280, height: 160 },
  deckButtonRow: { flexDirection: 'row', width: '100%', maxWidth: 460, gap: 10, marginTop: 36 },
  deckButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 6,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },
  deckButtonLabel: { fontSize: 32, fontFamily: READER_FONT_FAMILY },
  // Word labels like "Easy" or "11 - 20" are wider than "ABC", so they're smaller to stay on one line.
  wordDeckButtonLabel: { fontSize: 26 },
  // Three word labels share the row's width, so "Medium" and "11 - 20" need a little less.
  narrowWordDeckButtonLabel: { fontSize: 22 },
  deckButtonCaption: { fontSize: 15, fontWeight: '800', textAlign: 'center', marginTop: 4 },
  firstToggleRow: { marginTop: 34 },
});
