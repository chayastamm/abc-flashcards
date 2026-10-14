import { COLORS } from './theme';

export const UPPERCASE_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export type DeckType = 'upper' | 'lower' | 'mixed';

export type DeckOption = { deckType: DeckType; label: string; caption: string; color: string };

export const DECK_OPTIONS: DeckOption[] = [
  { deckType: 'upper', label: 'ABC', caption: 'Uppercase Letters', color: COLORS.red },
  { deckType: 'lower', label: 'abc', caption: 'Lowercase Letters', color: COLORS.blue },
  { deckType: 'mixed', label: 'Aa', caption: 'Uppercase and Lowercase Letters', color: COLORS.yellow },
];
