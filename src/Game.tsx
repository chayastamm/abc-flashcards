import { useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SubjectMenu } from './components/SubjectMenu';
import { DeckType, Subject } from './constants/decks';
import { FinishScreen } from './screens/FinishScreen';
import { PlayScreen } from './screens/PlayScreen';
import { StartScreen } from './screens/StartScreen';
import { commonStyles } from './styles/common.styles';
import {
  doesDeckHaveAnswerToggle,
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

  const goHome = () => setCurrentScreen('start');

  // Picking a subject from any screen ends the round and shows that subject's decks.
  const selectSubject = (selectedSubject: Subject) => {
    setSubject(selectedSubject);
    goHome();
  };

  return (
    <View
      style={[commonStyles.appRoot, { paddingTop: safeAreaInsets.top, paddingBottom: safeAreaInsets.bottom }]}
    >
      {/* Positions the screens and the corner menu inside the safe area. */}
      <View style={commonStyles.fill}>
        {currentScreen === 'start' && (
          <StartScreen
            onHome={goHome}
            subject={subject}
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
            hasAnswerToggle={doesDeckHaveAnswerToggle(deckType)}
            onGotIt={removeTopCard}
            onTryAgain={missTopCard}
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
        <SubjectMenu selectedSubject={subject} onSelectSubject={selectSubject} />
      </View>
    </View>
  );
}
