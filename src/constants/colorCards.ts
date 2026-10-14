export type ColorCardName =
  | 'red'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'blue'
  | 'purple'
  | 'pink'
  | 'gold'
  | 'silver'
  | 'black'
  | 'brown'
  | 'grey'
  | 'white';

export const BASIC_COLOR_CARDS: ColorCardName[] = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];

export const OTHER_COLOR_CARDS: ColorCardName[] = ['pink', 'gold', 'silver', 'black', 'brown', 'grey', 'white'];

// What each color card is filled with. Gold and silver use a shine so they read as metals, not yellow and grey.
export const COLOR_CARD_FILLS: Record<ColorCardName, { color: string; shineColor?: string }> = {
  red: { color: '#E53935' },
  orange: { color: '#FB8C00' },
  yellow: { color: '#FDD835' },
  green: { color: '#43A047' },
  blue: { color: '#1E88E5' },
  purple: { color: '#8E24AA' },
  pink: { color: '#F48FB1' },
  gold: { color: '#C9A227', shineColor: '#FFF1A8' },
  silver: { color: '#A7ADB2', shineColor: '#F4F6F7' },
  black: { color: '#111111' },
  brown: { color: '#795548' },
  grey: { color: '#8C8C8C' },
  white: { color: '#FFFFFF' },
};
