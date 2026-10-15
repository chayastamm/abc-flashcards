import { ImageSourcePropType } from 'react-native';
import { COLORS } from './theme';

export const UPPERCASE_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

// What the flashcards teach, picked from the home-screen menu.
export type Subject = 'letters' | 'numbers' | 'shapes' | 'colors' | 'sightWords';

export type DeckType =
  | 'upper'
  | 'lower'
  | 'mixed'
  | 'numbers1to10'
  | 'numbers11to20'
  | 'numbers1to20'
  | 'shapesEasy'
  | 'shapesHard'
  | 'colorsBasic'
  | 'colorsOther'
  | 'sightWordsEasy'
  | 'sightWordsMedium'
  | 'sightWordsHard';

export type DeckOption = {
  deckType: DeckType;
  label: string;
  // Shown under the label; only letter decks have one.
  caption?: string;
  accessibilityLabel: string;
  color: string;
};

export type SubjectOption = {
  subject: Subject;
  menuLabel: string;
  // Plural noun used in on-screen text, e.g. "You did all 26 letters!".
  cardNoun: string;
  // Null when the logo is drawn in code instead (see SubjectLogo).
  logo: ImageSourcePropType | null;
  deckOptions: DeckOption[];
  // Decks with a toggle on the card that shows and hides its name.
  answerToggleDeckTypes?: DeckType[];
};

// Non-breaking spaces around the dash keep each range on one line.
const rangeLabel = (first: number, last: number) => `${first}\u00A0-\u00A0${last}`;

export const SUBJECT_OPTIONS: SubjectOption[] = [
  {
    subject: 'letters',
    menuLabel: 'Letters',
    cardNoun: 'letters',
    logo: require('../../assets/abc-logo.png'),
    deckOptions: [
      {
        deckType: 'upper',
        label: 'ABC',
        caption: 'Uppercase Letters',
        accessibilityLabel: 'Uppercase Letters',
        color: COLORS.red,
      },
      {
        deckType: 'lower',
        label: 'abc',
        caption: 'Lowercase Letters',
        accessibilityLabel: 'Lowercase Letters',
        color: COLORS.blue,
      },
      {
        deckType: 'mixed',
        label: 'Aa',
        caption: 'Uppercase and Lowercase Letters',
        accessibilityLabel: 'Uppercase and Lowercase Letters',
        color: COLORS.yellow,
      },
    ],
  },
  {
    subject: 'numbers',
    menuLabel: 'Numbers',
    cardNoun: 'numbers',
    logo: require('../../assets/123-logo.png'),
    deckOptions: [
      {
        deckType: 'numbers1to10',
        label: rangeLabel(1, 10),
        accessibilityLabel: 'Numbers 1 to 10',
        color: COLORS.red,
      },
      {
        deckType: 'numbers11to20',
        label: rangeLabel(11, 20),
        accessibilityLabel: 'Numbers 11 to 20',
        color: COLORS.blue,
      },
      {
        deckType: 'numbers1to20',
        label: rangeLabel(1, 20),
        accessibilityLabel: 'Numbers 1 to 20',
        color: COLORS.yellow,
      },
    ],
  },
  {
    subject: 'shapes',
    menuLabel: 'Shapes',
    cardNoun: 'shapes',
    logo: null,
    deckOptions: [
      { deckType: 'shapesEasy', label: 'Easy', accessibilityLabel: 'Easy shapes', color: COLORS.red },
      { deckType: 'shapesHard', label: 'Hard', accessibilityLabel: 'Hard shapes', color: COLORS.blue },
    ],
    answerToggleDeckTypes: ['shapesHard'],
  },
  {
    subject: 'colors',
    menuLabel: 'Colors',
    cardNoun: 'colors',
    logo: null,
    deckOptions: [
      { deckType: 'colorsBasic', label: 'Basic', accessibilityLabel: 'Basic colors', color: COLORS.red },
      { deckType: 'colorsOther', label: 'Other', accessibilityLabel: 'Other colors', color: COLORS.blue },
    ],
  },
  {
    subject: 'sightWords',
    menuLabel: 'Sight Words',
    cardNoun: 'words',
    logo: null,
    deckOptions: [
      { deckType: 'sightWordsEasy', label: 'Easy', accessibilityLabel: 'Easy sight words', color: COLORS.red },
      { deckType: 'sightWordsMedium', label: 'Medium', accessibilityLabel: 'Medium sight words', color: COLORS.blue },
      { deckType: 'sightWordsHard', label: 'Hard', accessibilityLabel: 'Hard sight words', color: COLORS.yellow },
    ],
  },
];
