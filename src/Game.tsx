import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DeckType, MISSED_CARD_NAME_REVEAL_MS, Subject } from './constants/decks';
import { FinishScreen } from './screens/FinishScreen';
import { PlayScreen } from './screens/PlayScreen';
import { StartScreen } from './screens/StartScreen';
import { commonStyles } from './styles/common.styles';
import {
  doesDeckRevealNameOnMiss,
  getCardsForDeck,
  getMissedCardsInOrder,
  getSubjectOption,
  shuffled,
} from './utils';

type ScreenName = 'start' | 'play' | 'finish';

export function Game() {
  const safeAreaInsets = useSafeAreaInsets();
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('start');
  const [subject, setSubject] = useState<Subject>('letters');
  const [deckType, setDeckType] = useState<DeckType>('upper');
  const [remainingCards, setRemainingCards] = useState<string[]>([]);
  // Both options are off each time the app opens; they aren't persisted.
  const [isTimedModeEnabled, setIsTimedModeEnabled] = useState(false);
  // On: missed cards go to the back of the deck. Off: each card shows once and the score is tallied.
  const [isAutoRedoEnabled, setIsAutoRedoEnabled] = useState(false);
  // The cards in this round, in deck order, and the ones missed when auto-redo is off.
  const [roundCards, setRoundCards] = useState<string[]>([]);
  const [missedCards, setMissedCards] = useState<string[]>([]);
  const [roundStartTime, setRoundStartTime] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);
  // While true, the current card shows its name and the answer buttons wait.
  const [isCardNameRevealed, setIsCardNameRevealed] = useState(false);
  const revealTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelNameReveal = () => {
    if (revealTimeout.current) clearTimeout(revealTimeout.current);
    revealTimeout.current = null;
    setIsCardNameRevealed(false);
  };

  useEffect(() => () => {
    if (revealTimeout.current) clearTimeout(revealTimeout.current);
  }, []);

  // Plays the full deck, or just the given cards (e.g. a retry of missed ones).
  const startRound = (selectedDeckType: DeckType, cards = getCardsForDeck(selectedDeckType)) => {
    setDeckType(selectedDeckType);
    setRoundCards(cards);
    setRemainingCards(shuffled(cards));
    setMissedCards([]);
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
  const missTopCard = () => {
    const [topCard, ...cardsAfterTop] = remainingCards;
    if (!isAutoRedoEnabled) {
      setMissedCards([...missedCards, topCard]);
      removeTopCard();
      return;
    }
    setRemainingCards([...cardsAfterTop, topCard]);
  };

  // In decks that name missed cards (hard shapes), show the name for a few seconds before moving on.
  const handleTryAgain = () => {
    if (!doesDeckRevealNameOnMiss(deckType)) {
      missTopCard();
      return;
    }
    setIsCardNameRevealed(true);
    revealTimeout.current = setTimeout(() => {
      revealTimeout.current = null;
      setIsCardNameRevealed(false);
      missTopCard();
    }, MISSED_CARD_NAME_REVEAL_MS);
  };

  const goHome = () => {
    cancelNameReveal();
    setCurrentScreen('start');
  };

  return (
    <View
      style={[commonStyles.appRoot, { paddingTop: safeAreaInsets.top, paddingBottom: safeAreaInsets.bottom }]}
    >
      {currentScreen === 'start' && (
        <StartScreen
          onHome={goHome}
          subject={subject}
          onSubjectChange={setSubject}
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
          totalCardCount={roundCards.length}
          roundStartTime={isTimedModeEnabled ? roundStartTime : null}
          isCardNameRevealed={isCardNameRevealed}
          doesRevealNameOnMiss={doesDeckRevealNameOnMiss(deckType)}
          onGotIt={removeTopCard}
          onTryAgain={handleTryAgain}
          onHome={goHome}
        />
      )}
      {currentScreen === 'finish' && (
        <FinishScreen
          cardNoun={getSubjectOption(subject).cardNoun}
          roundCards={roundCards}
          deckCards={getCardsForDeck(deckType)}
          missedCards={isAutoRedoEnabled ? null : missedCards}
          elapsedMs={isTimedModeEnabled ? elapsedMs : null}
          onPlayAgain={() => startRound(deckType)}
          onPracticeMissed={() => startRound(deckType, getMissedCardsInOrder(roundCards, missedCards))}
          onHome={goHome}
        />
      )}
    </View>
  );
}
