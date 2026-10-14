import { StyleSheet } from 'react-native';

// Matches the play screen header's padding so the icon sits in the same spot on every screen.
export const SCREEN_EDGE_INSET = 20;
export const SCREEN_TOP_INSET = 12;
export const HOME_ICON_SIZE = 30;

export const homeIconButtonStyles = StyleSheet.create({
  // Padding gives the pressed glow a round shape; the negative margin keeps the icon where it was.
  button: { alignSelf: 'flex-start', padding: 6, margin: -6, borderRadius: 24 },
  // For screens without a header row: pin the icon to the top-left corner, above the content.
  topLeftCorner: { position: 'absolute', top: SCREEN_TOP_INSET, left: SCREEN_EDGE_INSET, zIndex: 9 },
});
