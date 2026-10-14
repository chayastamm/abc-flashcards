import { useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DeckType } from './constants/decks';
import { FinishScreen } from './screens/FinishScreen';
import { PlayScreen } from './screens/PlayScreen';
import { StartScreen } from './screens/StartScreen';
import { commonStyles } from './styles/common.styles';
import { getLettersForDeck, getMissedLettersInOrder, shuffled } from './utils';

type ScreenName = 'start' | 'play' | 'finish';

export function Game() {
  const safeAreaInsets = useSafeAreaInsets();
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('start');
  const [deckType, setDeckType] = useState<DeckType>('upper');
  const [remainingCards, setRemainingCards] = useState<string[]>([]);
  // Both options are off each time the app opens; they aren't persisted.
  const [isTimedModeEnabled, setIsTimedModeEnabled] = useState(false);
  // On: missed cards go to the back of the deck. Off: each card shows once and the score is tallied.
  const [isAutoRedoEnabled, setIsAutoRedoEnabled] = useState(false);
  // The letters in this round, in alphabet order, and the ones missed when auto-redo is off.
  const [roundLetters, setRoundLetters] = useState<string[]>([]);
  const [missedLetters, setMissedLetters] = useState<string[]>([]);
  const [roundStartTime, setRoundStartTime] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);

  // Plays the full deck, or just the given letters (e.g. a retry of missed ones).
  const startRound = (selectedDeckType: DeckType, letters = getLettersForDeck(selectedDeckType)) => {
    setDeckType(selectedDeckType);
    setRoundLetters(letters);
    setRemainingCards(shuffled(letters));
    setMissedLetters([]);
    setRoundStartTime(Date.now());
    setCurrentScreen('play');
  };

  // Remove the top card, finishing the round if it was the last.
  const removeTopCard = () => {
    const cardsAfterTop = remainingCards.slice(1);
    if (cardsAfterTop.length === 0) {
      setElapsedMs(Date.now() - roundStartTime);
      setCurrentScreen('finish');
    }
    setRemainingCards(cardsAfterTop);
  };

  // Send the card to the back of the deck so it repeats, or record the miss and move on if auto-redo is off.
  const handleTryAgain = () => {
    const [topCard, ...cardsAfterTop] = remainingCards;
    if (!isAutoRedoEnabled) {
      setMissedLetters([...missedLetters, topCard]);
      removeTopCard();
      return;
    }
    setRemainingCards([...cardsAfterTop, topCard]);
  };

  const goHome = () => setCurrentScreen('start');

  return (
    <View
      style={[commonStyles.appRoot, { paddingTop: safeAreaInsets.top, paddingBottom: safeAreaInsets.bottom }]}
    >
      {currentScreen === 'start' && (
        <StartScreen
          onSelectDeck={startRound}
          isTimedModeEnabled={isTimedModeEnabled}
          onTimedModeChange={setIsTimedModeEnabled}
          isAutoRedoEnabled={isAutoRedoEnabled}
          onAutoRedoChange={setIsAutoRedoEnabled}
        />
      )}
      {currentScreen === 'play' && remainingCards.length > 0 && (
        <PlayScreen
          remainingCards={remainingCards}
          totalCardCount={roundLetters.length}
          roundStartTime={isTimedModeEnabled ? roundStartTime : null}
          onGotIt={removeTopCard}
          onTryAgain={handleTryAgain}
          onHome={goHome}
        />
      )}
      {currentScreen === 'finish' && (
        <FinishScreen
          roundLetters={roundLetters}
          deckLetters={getLettersForDeck(deckType)}
          missedLetters={isAutoRedoEnabled ? null : missedLetters}
          elapsedMs={isTimedModeEnabled ? elapsedMs : null}
          onPlayAgain={() => startRound(deckType)}
          onPracticeMissed={() => startRound(deckType, getMissedLettersInOrder(roundLetters, missedLetters))}
          onHome={goHome}
        />
      )}
    </View>
  );
}
