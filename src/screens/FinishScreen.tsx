import { useEffect, useState } from 'react';
import { Animated, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Confetti } from '../components/Confetti';
import { GlowPressable } from '../components/GlowPressable';
import { HomeIconButton } from '../components/HomeIconButton';
import { COLORS } from '../constants/theme';
import { commonStyles } from '../styles/common.styles';
import { finishScreenStyles } from '../styles/finishScreen.styles';
import { homeIconButtonStyles } from '../styles/homeIconButton.styles';
import { formatElapsedDuration, getCardDisplayName, getTextColorOn } from '../utils';

export function FinishScreen({
  cardNoun,
  roundCards,
  deckCards,
  missedCards,
  elapsedMs,
  onPlayAgain,
  onPracticeMissed,
  onHome,
}: {
  // Plural word for the cards, e.g. "letters" or "numbers".
  cardNoun: string;
  roundCards: string[];
  // The deck's full card set. On a retry round, cards outside it were already right in an earlier round.
  deckCards: string[];
  // Null when auto-redo is on, since every card ends up correct.
  missedCards: string[] | null;
  // Null when timed mode is off.
  elapsedMs: number | null;
  onPlayAgain: () => void;
  onPracticeMissed: () => void;
  onHome: () => void;
}) {
  const roundCardCount = roundCards.length;
  const hasMissedCards = missedCards !== null && missedCards.length > 0;
  const trophyEntrance = useState(() => new Animated.Value(0))[0];

  useEffect(() => {
    Animated.spring(trophyEntrance, { toValue: 1, friction: 4, tension: 60, useNativeDriver: true }).start();
  }, [trophyEntrance]);

  return (
    <View style={commonStyles.fill}>
      <Confetti />
      <HomeIconButton onPress={onHome} style={homeIconButtonStyles.topLeftCorner} />
      <ScrollView contentContainerStyle={finishScreenStyles.scrollContent}>
        <Animated.Text
          style={[
            finishScreenStyles.trophy,
            hasMissedCards && finishScreenStyles.trophySmall,
            { transform: [{ scale: trophyEntrance.interpolate({ inputRange: [0, 1], outputRange: [0.2, 1] }) }] },
          ]}
        >
          🏆
        </Animated.Text>
        <Text style={finishScreenStyles.title}>Great job!</Text>
        <Text style={finishScreenStyles.scoreText}>
          {missedCards === null
            ? `You did all ${roundCardCount} ${cardNoun}!`
            : `You got ${roundCardCount - missedCards.length}/${roundCardCount} right!`}
        </Text>
        {elapsedMs !== null && (
          <Text style={finishScreenStyles.finishTimeText}>You finished in {formatElapsedDuration(elapsedMs)}!</Text>
        )}
        {hasMissedCards && (
          <>
            <View style={finishScreenStyles.cardResults}>
              {deckCards.map((card) => {
                const isMissed = missedCards.includes(card);
                const chipTextColor = getTextColorOn(isMissed ? COLORS.red : COLORS.green);
                return (
                  <View
                    key={card}
                    accessibilityLabel={`${getCardDisplayName(card)}, ${isMissed ? 'wrong' : 'right'}`}
                    style={[
                      finishScreenStyles.cardResultChip,
                      isMissed ? finishScreenStyles.missedChip : finishScreenStyles.correctChip,
                    ]}
                  >
                    <Text style={[finishScreenStyles.cardResultText, { color: chipTextColor }]}>
                      {getCardDisplayName(card)}
                    </Text>
                    <Ionicons name={isMissed ? 'close' : 'checkmark'} size={16} color={chipTextColor} />
                  </View>
                );
              })}
            </View>
            <GlowPressable
              onPress={onPracticeMissed}
              accessibilityRole="button"
              glowColor={COLORS.red}
              style={finishScreenStyles.practiceMissedButton}
            >
              <Ionicons name="repeat" size={28} color={COLORS.white} />
              <Text style={finishScreenStyles.practiceMissedLabel}>
                Practice the {missedCards.length} I missed
              </Text>
            </GlowPressable>
          </>
        )}
        <View style={finishScreenStyles.navigationButtons}>
          <GlowPressable
            onPress={onHome}
            accessibilityLabel="Home"
            glowColor={COLORS.yellow}
            style={[commonStyles.roundButton, finishScreenStyles.homeButton]}
          >
            <Ionicons name="home" size={44} color={getTextColorOn(COLORS.yellow)} />
          </GlowPressable>
          <GlowPressable
            onPress={onPlayAgain}
            accessibilityLabel="Play again"
            glowColor={COLORS.blue}
            style={[commonStyles.roundButton, finishScreenStyles.playAgainButton]}
          >
            <Ionicons name="refresh" size={52} color={COLORS.white} />
          </GlowPressable>
        </View>
      </ScrollView>
    </View>
  );
}
