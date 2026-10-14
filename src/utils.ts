import { DeckType, UPPERCASE_LETTERS } from './constants/decks';
import { CARD_COLORS, COLORS } from './constants/theme';

export function getLettersForDeck(deckType: DeckType): string[] {
  const lowercaseLetters = UPPERCASE_LETTERS.map((letter) => letter.toLowerCase());
  if (deckType === 'upper') return UPPERCASE_LETTERS;
  if (deckType === 'lower') return lowercaseLetters;
  return [...UPPERCASE_LETTERS, ...lowercaseLetters];
}

// Keeps the round's alphabet order so a retry deck matches the results grid.
export function getMissedLettersInOrder(roundLetters: string[], missedLetters: string[]): string[] {
  return roundLetters.filter((letter) => missedLetters.includes(letter));
}

export function shuffled<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// White reads poorly on the light yellow and green, so those get dark ink.
export function getTextColorOn(backgroundColor: string): string {
  return backgroundColor === COLORS.yellow || backgroundColor === COLORS.green ? COLORS.ink : COLORS.white;
}

// Keyed on the capital so "A" and "a" share a color.
export function getCardColor(letter: string): string {
  return CARD_COLORS[letter.toUpperCase().charCodeAt(0) % CARD_COLORS.length];
}

// Clock display for the play screen, e.g. "3:05".
export function formatElapsedClock(elapsedMs: number): string {
  const totalSeconds = Math.floor(elapsedMs / 1000);
  return `${Math.floor(totalSeconds / 60)}:${String(totalSeconds % 60).padStart(2, '0')}`;
}

// Spoken-style duration for the finish screen, e.g. "3 minutes and 20 seconds".
export function formatElapsedDuration(elapsedMs: number): string {
  const totalSeconds = Math.floor(elapsedMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const pluralize = (count: number, unit: string) => `${count} ${unit}${count === 1 ? '' : 's'}`;
  if (minutes === 0) return pluralize(seconds, 'second');
  if (seconds === 0) return pluralize(minutes, 'minute');
  return `${pluralize(minutes, 'minute')} and ${pluralize(seconds, 'second')}`;
}

const PLAY_HEADER_HEIGHT = 80;
const PLAY_FOOTER_HEIGHT = 200;
const MAX_CARD_WIDTH = 360;
const CARD_ASPECT_RATIO = 0.72; // width / height

// Fit the card between the header and footer buttons on any screen size.
export function getCardSize(
  windowWidth: number,
  windowHeight: number,
  safeAreaInsets: { top: number; bottom: number },
): { width: number; height: number } {
  const availableHeight =
    windowHeight - safeAreaInsets.top - safeAreaInsets.bottom - PLAY_HEADER_HEIGHT - PLAY_FOOTER_HEIGHT;
  const width = Math.min(windowWidth * 0.85, MAX_CARD_WIDTH, availableHeight * 0.9 * CARD_ASPECT_RATIO);
  return { width, height: width / CARD_ASPECT_RATIO };
}

export type ConfettiPieceSettings = {
  left: number;
  horizontalDrift: number;
  size: number;
  color: string;
  delayMs: number;
  durationMs: number;
  spinDirection: 1 | -1;
};

export function createConfettiPieceSettings(count: number, screenWidth: number): ConfettiPieceSettings[] {
  return Array.from({ length: count }, (_, index) => ({
    left: Math.random() * screenWidth,
    horizontalDrift: (Math.random() - 0.5) * 120,
    size: 8 + Math.random() * 10,
    color: CARD_COLORS[index % CARD_COLORS.length],
    delayMs: Math.random() * 1500,
    durationMs: 2500 + Math.random() * 2000,
    spinDirection: Math.random() > 0.5 ? 1 : -1,
  }));
}
