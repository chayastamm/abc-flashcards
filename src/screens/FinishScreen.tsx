import { useEffect, useState } from 'react';
import { Animated, Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Confetti } from '../components/Confetti';
import { COLORS } from '../constants/theme';
import { commonStyles } from '../styles/common.styles';
import { finishScreenStyles } from '../styles/finishScreen.styles';
import { formatElapsedDuration, getTextColorOn } from '../utils';

export function FinishScreen({
  roundLetters,
  deckLetters,
  missedLetters,
  elapsedMs,
  onPlayAgain,
  onPracticeMissed,
  onHome,
}: {
  roundLetters: string[];
  // The deck's full letter set. On a retry round, letters outside it were already right in an earlier round.
  deckLetters: string[];
  // Null when missed letters repeat, since every letter ends up correct.
  missedLetters: string[] | null;
  // Null when timed mode is off.
  elapsedMs: number | null;
  onPlayAgain: () => void;
  onPracticeMissed: () => void;
  onHome: () => void;
}) {
  const roundLetterCount = roundLetters.length;
  const hasMissedLetters = missedLetters !== null && missedLetters.length > 0;
  const trophyEntrance = useState(() => new Animated.Value(0))[0];

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Animated.spring(trophyEntrance, { toValue: 1, friction: 4, tension: 60, useNativeDriver: true }).start();
  }, [trophyEntrance]);

  return (
    <View style={commonStyles.fill}>
      <Confetti />
      <ScrollView contentContainerStyle={finishScreenStyles.scrollContent}>
        <Animated.Text
          style={[
            finishScreenStyles.trophy,
            hasMissedLetters && finishScreenStyles.trophySmall,
            { transform: [{ scale: trophyEntrance.interpolate({ inputRange: [0, 1], outputRange: [0.2, 1] }) }] },
          ]}
        >
          🏆
        </Animated.Text>
        <Text style={finishScreenStyles.title}>Great job!</Text>
        <Text style={finishScreenStyles.scoreText}>
          {missedLetters === null
            ? `You did all ${roundLetterCount} letters!`
            : `You got ${roundLetterCount - missedLetters.length}/${roundLetterCount} right!`}
        </Text>
        {elapsedMs !== null && (
          <Text style={finishScreenStyles.finishTimeText}>You finished in {formatElapsedDuration(elapsedMs)}!</Text>
        )}
        {hasMissedLetters && (
          <>
            <View style={finishScreenStyles.letterResults}>
              {deckLetters.map((letter) => {
                const isMissed = missedLetters.includes(letter);
                const chipTextColor = getTextColorOn(isMissed ? COLORS.red : COLORS.green);
                return (
                  <View
                    key={letter}
                    accessibilityLabel={`${letter}, ${isMissed ? 'wrong' : 'right'}`}
                    style={[
                      finishScreenStyles.letterResultChip,
                      isMissed ? finishScreenStyles.missedChip : finishScreenStyles.correctChip,
                    ]}
                  >
                    <Text style={[finishScreenStyles.letterResultText, { color: chipTextColor }]}>{letter}</Text>
                    <Ionicons name={isMissed ? 'close' : 'checkmark'} size={16} color={chipTextColor} />
                  </View>
                );
              })}
            </View>
            <Pressable
              onPress={onPracticeMissed}
              accessibilityRole="button"
              style={({ pressed: isPressed }) => [
                finishScreenStyles.practiceMissedButton,
                isPressed && commonStyles.pressed,
              ]}
            >
              <Ionicons name="repeat" size={28} color={COLORS.white} />
              <Text style={finishScreenStyles.practiceMissedLabel}>
                Practice the {missedLetters.length} I missed
              </Text>
            </Pressable>
          </>
        )}
        <View style={finishScreenStyles.navigationButtons}>
          <Pressable
            onPress={onHome}
            accessibilityLabel="Home"
            style={({ pressed: isPressed }) => [
              commonStyles.roundButton,
              finishScreenStyles.homeButton,
              isPressed && commonStyles.pressed,
            ]}
          >
            <Ionicons name="home" size={44} color={getTextColorOn(COLORS.yellow)} />
          </Pressable>
          <Pressable
            onPress={onPlayAgain}
            accessibilityLabel="Play again"
            style={({ pressed: isPressed }) => [
              commonStyles.roundButton,
              finishScreenStyles.playAgainButton,
              isPressed && commonStyles.pressed,
            ]}
          >
            <Ionicons name="refresh" size={52} color={COLORS.white} />
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
