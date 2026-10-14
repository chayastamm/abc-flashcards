import { useEffect, useState } from 'react';
import { Animated, Text, useWindowDimensions, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ElapsedTimer } from '../components/ElapsedTimer';
import { GlowPressable } from '../components/GlowPressable';
import { COLORS } from '../constants/theme';
import { commonStyles } from '../styles/common.styles';
import { playScreenStyles } from '../styles/playScreen.styles';
import { getCardColor, getCardSize, getTextColorOn } from '../utils';

const LETTER_FONT_SIZE_TO_CARD_WIDTH = 0.85;
const LETTER_LINE_HEIGHT_TO_CARD_WIDTH = 1.15;

export function PlayScreen({
  remainingCards,
  totalCardCount,
  roundStartTime,
  onGotIt,
  onTryAgain,
  onHome,
}: {
  remainingCards: string[];
  totalCardCount: number;
  // Null when timed mode is off.
  roundStartTime: number | null;
  onGotIt: () => void;
  onTryAgain: () => void;
  onHome: () => void;
}) {
  const currentLetter = remainingCards[0];
  const cardColor = getCardColor(currentLetter);
  const letterColor = getTextColorOn(cardColor);
  const completedCardCount = totalCardCount - remainingCards.length;
  const cardEntrance = useState(() => new Animated.Value(0))[0];

  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const safeAreaInsets = useSafeAreaInsets();
  const cardSize = getCardSize(windowWidth, windowHeight, safeAreaInsets);

  // Animate each new card in. Keyed on the deck array (new on every tap), so a lone repeated card still animates.
  useEffect(() => {
    cardEntrance.setValue(0);
    Animated.spring(cardEntrance, { toValue: 1, friction: 6, tension: 80, useNativeDriver: true }).start();
  }, [remainingCards, cardEntrance]);

  return (
    <View style={commonStyles.fill}>
      <View style={playScreenStyles.header}>
        <View style={playScreenStyles.headerSide}>
          <GlowPressable
            onPress={onHome}
            hitSlop={12}
            accessibilityLabel="Home"
            glowColor={COLORS.ink}
            style={playScreenStyles.homeIconButton}
          >
            <Ionicons name="home" size={30} color={COLORS.ink} />
          </GlowPressable>
        </View>
        <Text style={playScreenStyles.progressText}>
          {completedCardCount + 1} / {totalCardCount}
        </Text>
        <View style={[playScreenStyles.headerSide, playScreenStyles.headerRightSide]}>
          {roundStartTime !== null && <ElapsedTimer roundStartTime={roundStartTime} />}
        </View>
      </View>
      <View style={playScreenStyles.progressTrack}>
        <View
          style={[playScreenStyles.progressFill, { width: `${(completedCardCount / totalCardCount) * 100}%` }]}
        />
      </View>

      <View style={commonStyles.centeredContent}>
        <Animated.View
          style={[
            playScreenStyles.card,
            {
              width: cardSize.width,
              height: cardSize.height,
              backgroundColor: cardColor,
              opacity: cardEntrance,
              transform: [
                { scale: cardEntrance.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) },
                { rotate: cardEntrance.interpolate({ inputRange: [0, 1], outputRange: ['-8deg', '0deg'] }) },
              ],
            },
          ]}
        >
          <Text
            style={[
              playScreenStyles.cardLetter,
              {
                color: letterColor,
                fontSize: cardSize.width * LETTER_FONT_SIZE_TO_CARD_WIDTH,
                lineHeight: cardSize.width * LETTER_LINE_HEIGHT_TO_CARD_WIDTH,
              },
            ]}
          >
            {currentLetter}
          </Text>
        </Animated.View>
      </View>

      <View style={playScreenStyles.footer}>
        <View style={playScreenStyles.footerItem}>
          <Text style={[playScreenStyles.footerLabel, playScreenStyles.tryAgainLabel]}>Try Again!</Text>
          <GlowPressable
            onPress={onTryAgain}
            accessibilityLabel="Try again"
            glowColor={COLORS.red}
            style={[commonStyles.roundButton, playScreenStyles.tryAgainButton]}
          >
            <Ionicons name="close" size={56} color={COLORS.white} />
          </GlowPressable>
        </View>
        <View style={playScreenStyles.footerItem}>
          <Text style={[playScreenStyles.footerLabel, playScreenStyles.gotItLabel]}>Got it!</Text>
          <GlowPressable
            onPress={onGotIt}
            accessibilityLabel="Got it"
            glowColor={COLORS.green}
            style={[commonStyles.roundButton, playScreenStyles.gotItButton]}
          >
            <Ionicons name="checkmark" size={56} color={getTextColorOn(COLORS.green)} />
          </GlowPressable>
        </View>
      </View>
    </View>
  );
}
