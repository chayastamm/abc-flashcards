import { useEffect, useMemo } from 'react';
import { Animated, Easing, StyleSheet, useWindowDimensions, View } from 'react-native';
import { CONFETTI_START_OFFSET, confettiStyles } from '../styles/confetti.styles';
import { createConfettiPieceSettings } from '../utils';

const CONFETTI_PIECE_COUNT = 60;
const PIECE_HEIGHT_TO_WIDTH = 1.6;
const SPIN_DEGREES = 720;

export function Confetti() {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const pieces = useMemo(
    () =>
      createConfettiPieceSettings(CONFETTI_PIECE_COUNT, screenWidth).map((settings) => ({
        ...settings,
        fallProgress: new Animated.Value(0),
      })),
    [screenWidth],
  );

  useEffect(() => {
    const fallLoops = pieces.map((piece) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(piece.delayMs),
          Animated.timing(piece.fallProgress, {
            toValue: 1,
            duration: piece.durationMs,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ]),
      ),
    );
    fallLoops.forEach((fallLoop) => fallLoop.start());
    return () => fallLoops.forEach((fallLoop) => fallLoop.stop());
  }, [pieces]);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {pieces.map((piece, index) => (
        <Animated.View
          key={index}
          style={[
            confettiStyles.piece,
            {
              left: piece.left,
              width: piece.size,
              height: piece.size * PIECE_HEIGHT_TO_WIDTH,
              backgroundColor: piece.color,
              transform: [
                {
                  translateY: piece.fallProgress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, screenHeight + CONFETTI_START_OFFSET * 2],
                  }),
                },
                {
                  translateX: piece.fallProgress.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0, piece.horizontalDrift, 0],
                  }),
                },
                {
                  rotate: piece.fallProgress.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', `${piece.spinDirection * SPIN_DEGREES}deg`],
                  }),
                },
              ],
            },
          ]}
        />
      ))}
    </View>
  );
}
