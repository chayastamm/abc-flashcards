import { StyleSheet } from 'react-native';
import { COLORS, READER_FONT_FAMILY } from '../constants/theme';
import { MENU_ICON_CLEARANCE } from './subjectMenu.styles';

export const playScreenStyles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  headerSide: { flex: 1 },
  // The subject menu icon sits in the top-right corner, so the timer goes just left of it.
  headerRightSide: { alignItems: 'flex-end', paddingRight: MENU_ICON_CLEARANCE },
  progressText: { fontSize: 22, fontWeight: '800', color: COLORS.ink },
  progressTrack: {
    height: 10,
    marginHorizontal: 20,
    marginTop: 12,
    borderRadius: 5,
    backgroundColor: COLORS.progressTrack,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: COLORS.green, borderRadius: 5 },

  card: {
    borderRadius: 32,
    // Keeps full-card fills (like the gold and silver shine) inside the rounded corners.
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
    borderWidth: 4,
    borderColor: COLORS.ink,
  },
  cardText: { fontFamily: READER_FONT_FAMILY, includeFontPadding: false },
  // Pinned to the bottom of the card so the drawing above it doesn't move when the name appears.
  revealedCardName: { position: 'absolute', bottom: 16, fontFamily: READER_FONT_FAMILY },
  answerToggle: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.ink,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  footerItem: { alignItems: 'center' },
  footerLabel: { fontSize: 22, fontWeight: '900', marginBottom: 8 },
  tryAgainLabel: { color: COLORS.red },
  gotItLabel: { color: COLORS.ink },
  tryAgainButton: { backgroundColor: COLORS.red },
  gotItButton: { backgroundColor: COLORS.green },
});
