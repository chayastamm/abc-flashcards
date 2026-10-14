// High-contrast primary toy palette.
export const COLORS = {
  red: '#FF4B4B',
  yellow: '#FFD166',
  green: '#06D6A0',
  blue: '#118AB2',
  background: '#F8F9FA',
  ink: '#073B4C', // dark text/outlines
  white: '#FFFFFF',
  switchTrackOff: '#CED4DA',
  progressTrack: '#E2E6EA',
  pressGlow: '#4CC9F0', // lit-up ring around a pressed button
} as const;

// Cards and confetti cycle through these.
export const CARD_COLORS = [COLORS.red, COLORS.yellow, COLORS.green, COLORS.blue];

// Andika is designed for early readers: distinct I/l and the a/g shapes kids learn to write.
export const READER_FONT_FAMILY = 'Andika_700Bold';
