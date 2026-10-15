import { DeckType, Subject, SUBJECT_OPTIONS, SubjectOption, UPPERCASE_LETTERS } from './constants/decks';
import { COLOR_CARD_FILLS, ColorCardName, OTHER_COLOR_CARDS, BASIC_COLOR_CARDS } from './constants/colorCards';
import { EASY_SHAPES, HARD_SHAPES, ShapeName } from './constants/shapes';
import { EASY_SIGHT_WORDS, HARD_SIGHT_WORDS, MEDIUM_SIGHT_WORDS } from './constants/sightWords';
import { CARD_COLORS, COLORS } from './constants/theme';

export function getSubjectOption(subject: Subject): SubjectOption {
  return SUBJECT_OPTIONS.find((option) => option.subject === subject)!;
}

// Whole numbers from first to last, inclusive, as card labels.
function numberCards(first: number, last: number): string[] {
  return Array.from({ length: last - first + 1 }, (_, index) => String(first + index));
}

export function getCardsForDeck(deckType: DeckType): string[] {
  const lowercaseLetters = UPPERCASE_LETTERS.map((letter) => letter.toLowerCase());
  switch (deckType) {
    case 'upper':
      return UPPERCASE_LETTERS;
    case 'lower':
      return lowercaseLetters;
    case 'mixed':
      return [...UPPERCASE_LETTERS, ...lowercaseLetters];
    case 'numbers1to10':
      return numberCards(1, 10);
    case 'numbers11to20':
      return numberCards(11, 20);
    case 'numbers1to20':
      return numberCards(1, 20);
    case 'shapesEasy':
      return EASY_SHAPES;
    case 'shapesHard':
      return HARD_SHAPES;
    case 'colorsBasic':
      return BASIC_COLOR_CARDS;
    case 'colorsOther':
      return OTHER_COLOR_CARDS;
    case 'sightWordsEasy':
      return EASY_SIGHT_WORDS;
    case 'sightWordsMedium':
      return MEDIUM_SIGHT_WORDS;
    case 'sightWordsHard':
      return HARD_SIGHT_WORDS;
  }
}

const ALL_SHAPES = new Set<string>([...EASY_SHAPES, ...HARD_SHAPES]);

// Shape cards are stored by shape name, e.g. "circle"; every other card is the text it shows.
export function isShapeCard(card: string): card is ShapeName {
  return ALL_SHAPES.has(card);
}

// Color cards are stored by color name, e.g. "purple".
export function isColorCard(card: string): card is ColorCardName {
  return Object.hasOwn(COLOR_CARD_FILLS, card);
}

// The name shown for a card in labels and results, e.g. "Circle" or "Purple"; letters and numbers show as-is.
export function getCardDisplayName(card: string): string {
  return isShapeCard(card) || isColorCard(card) ? card.charAt(0).toUpperCase() + card.slice(1) : card;
}

// Whether cards in this deck have a toggle that shows and hides their name.
export function doesDeckHaveAnswerToggle(deckType: DeckType): boolean {
  return SUBJECT_OPTIONS.some((option) => option.answerToggleDeckTypes?.includes(deckType));
}

// Keeps the round's deck order so a retry deck matches the results grid.
export function getMissedCardsInOrder(roundCards: string[], missedCards: string[]): string[] {
  return roundCards.filter((card) => missedCards.includes(card));
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

// Numbers are keyed on their value; letters and shape names on their characters,
// uppercased so "A" and "a" share a color.
export function getCardColor(card: string): string {
  // A color card is filled with the color it teaches.
  if (isColorCard(card)) return COLOR_CARD_FILLS[card].color;
  const colorKey = /^\d+$/.test(card)
    ? Number(card)
    : [...card.toUpperCase()].reduce((sum, character) => sum + character.charCodeAt(0), 0);
  return CARD_COLORS[colorKey % CARD_COLORS.length];
}

// SVG "points" for a regular polygon centered at (centerX, centerY), rotated by rotationDegrees.
export function getRegularPolygonPoints(
  sideCount: number,
  centerX: number,
  centerY: number,
  radius: number,
  rotationDegrees: number,
): string {
  return Array.from({ length: sideCount }, (_, index) => {
    const angle = ((rotationDegrees + (360 / sideCount) * index - 90) * Math.PI) / 180;
    return `${(centerX + radius * Math.cos(angle)).toFixed(1)},${(centerY + radius * Math.sin(angle)).toFixed(1)}`;
  }).join(' ');
}

// SVG "points" for a five-pointed star, point up.
export function getStarPoints(centerX: number, centerY: number, outerRadius: number, innerRadius: number): string {
  return Array.from({ length: 10 }, (_, index) => {
    const radius = index % 2 === 0 ? outerRadius : innerRadius;
    const angle = ((36 * index - 90) * Math.PI) / 180;
    return `${(centerX + radius * Math.cos(angle)).toFixed(1)},${(centerY + radius * Math.sin(angle)).toFixed(1)}`;
  }).join(' ');
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

const SINGLE_CHARACTER_FONT_SIZE_TO_CARD_WIDTH = 0.85;
const TWO_CHARACTER_FONT_SIZE_TO_CARD_WIDTH = 0.55;
// Longer words share the card's width among their letters, up to this size.
const MAX_WORD_FONT_SIZE_TO_CARD_WIDTH = 0.42;
const WORD_WIDTH_TO_CARD_WIDTH_PER_LETTER = 1.3;
const CARD_LINE_HEIGHT_TO_FONT_SIZE = 1.35;

// Fills the card with a single letter or digit; longer cards (two-digit numbers, words) shrink so they fit across.
export function getCardTextSize(card: string, cardWidth: number): { fontSize: number; lineHeight: number } {
  let fontSizeToCardWidth = SINGLE_CHARACTER_FONT_SIZE_TO_CARD_WIDTH;
  if (card.length === 2) fontSizeToCardWidth = TWO_CHARACTER_FONT_SIZE_TO_CARD_WIDTH;
  if (card.length > 2) {
    fontSizeToCardWidth = Math.min(MAX_WORD_FONT_SIZE_TO_CARD_WIDTH, WORD_WIDTH_TO_CARD_WIDTH_PER_LETTER / card.length);
  }
  const fontSize = cardWidth * fontSizeToCardWidth;
  return { fontSize, lineHeight: fontSize * CARD_LINE_HEIGHT_TO_FONT_SIZE };
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
