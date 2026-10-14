import { useEffect, useState } from 'react';
import { Animated, Text, useWindowDimensions, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ColorCardFill } from '../components/ColorCardFill';
import { ElapsedTimer } from '../components/ElapsedTimer';
import { GlowPressable } from '../components/GlowPressable';
import { HomeIconButton } from '../components/HomeIconButton';
import { ShapeDrawing } from '../components/ShapeDrawing';
import { COLORS } from '../constants/theme';
import { commonStyles } from '../styles/common.styles';
import { playScreenStyles } from '../styles/playScreen.styles';
import {
  getCardColor,
  getCardDisplayName,
  getCardSize,
  getCardTextSize,
  getTextColorOn,
  isColorCard,
  isShapeCard,
} from '../utils';

const SHAPE_SIZE_TO_CARD_WIDTH = 0.78;
const REVEALED_NAME_SIZE_TO_CARD_WIDTH = 0.14;

export function PlayScreen({
  remainingCards,
  totalCardCount,
  roundStartTime,
  isCardNameRevealed,
  doesRevealNameOnMiss,
  onGotIt,
  onTryAgain,
  onHome,
}: {
  remainingCards: string[];
  totalCardCount: number;
  // Null when timed mode is off.
  roundStartTime: number | null;
  // True while a missed card's name is shown; the answer buttons wait until it's done.
  isCardNameRevealed: boolean;
  // In decks that name missed cards, the left button asks to be shown instead of to try again.
  doesRevealNameOnMiss: boolean;
  onGotIt: () => void;
  onTryAgain: () => void;
  onHome: () => void;
}) {
  const currentCard = remainingCards[0];
  const cardColor = getCardColor(currentCard);
  const cardTextColor = getTextColorOn(cardColor);
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
        <HomeIconButton onPress={onHome} style={playScreenStyles.headerSide} />
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
          {isColorCard(currentCard) ? (
            <ColorCardFill colorCard={currentCard} />
          ) : isShapeCard(currentCard) ? (
            <ShapeDrawing shape={currentCard} size={cardSize.width * SHAPE_SIZE_TO_CARD_WIDTH} />
          ) : (
            <Text
              style={[
                playScreenStyles.cardText,
                { color: cardTextColor, ...getCardTextSize(currentCard, cardSize.width) },
              ]}
            >
              {currentCard}
            </Text>
          )}
          {isCardNameRevealed && (
            <Text
              style={[
                playScreenStyles.revealedCardName,
                { color: cardTextColor, fontSize: cardSize.width * REVEALED_NAME_SIZE_TO_CARD_WIDTH },
              ]}
            >
              {getCardDisplayName(currentCard)}
            </Text>
          )}
        </Animated.View>
      </View>

      <View style={playScreenStyles.footer}>
        <View style={playScreenStyles.footerItem}>
          <Text style={[playScreenStyles.footerLabel, playScreenStyles.tryAgainLabel]}>
            {doesRevealNameOnMiss ? 'Show me!' : 'Try Again!'}
          </Text>
          <GlowPressable
            onPress={onTryAgain}
            disabled={isCardNameRevealed}
            accessibilityLabel={doesRevealNameOnMiss ? 'Show me' : 'Try again'}
            glowColor={COLORS.red}
            style={[
              commonStyles.roundButton,
              playScreenStyles.tryAgainButton,
              isCardNameRevealed && playScreenStyles.waitingButton,
            ]}
          >
            <Ionicons name="close" size={56} color={COLORS.white} />
          </GlowPressable>
        </View>
        <View style={playScreenStyles.footerItem}>
          <Text style={[playScreenStyles.footerLabel, playScreenStyles.gotItLabel]}>Got it!</Text>
          <GlowPressable
            onPress={onGotIt}
            disabled={isCardNameRevealed}
            accessibilityLabel="Got it"
            glowColor={COLORS.green}
            style={[
              commonStyles.roundButton,
              playScreenStyles.gotItButton,
              isCardNameRevealed && playScreenStyles.waitingButton,
            ]}
          >
            <Ionicons name="checkmark" size={56} color={getTextColorOn(COLORS.green)} />
          </GlowPressable>
        </View>
      </View>
    </View>
  );
}
