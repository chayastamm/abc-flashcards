import { useEffect, useState } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
import { ToggleRow } from '../components/ToggleRow';
import { DECK_OPTIONS, DeckType } from '../constants/decks';
import { commonStyles } from '../styles/common.styles';
import { startScreenStyles } from '../styles/startScreen.styles';
import { getTextColorOn } from '../utils';

const LOGO_PULSE_SCALE = 1.06;
const LOGO_PULSE_DURATION_MS = 800;

export function StartScreen({
  onSelectDeck,
  isTimedModeEnabled,
  onTimedModeChange,
  isRepeatMissedEnabled,
  onRepeatMissedChange,
}: {
  onSelectDeck: (deckType: DeckType) => void;
  isTimedModeEnabled: boolean;
  onTimedModeChange: (isEnabled: boolean) => void;
  isRepeatMissedEnabled: boolean;
  onRepeatMissedChange: (isEnabled: boolean) => void;
}) {
  const logoScale = useState(() => new Animated.Value(1))[0];

  useEffect(() => {
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(logoScale, {
          toValue: LOGO_PULSE_SCALE,
          duration: LOGO_PULSE_DURATION_MS,
          useNativeDriver: true,
        }),
        Animated.timing(logoScale, { toValue: 1, duration: LOGO_PULSE_DURATION_MS, useNativeDriver: true }),
      ]),
    );
    pulseLoop.start();
    return () => pulseLoop.stop();
  }, [logoScale]);

  return (
    <View style={commonStyles.centeredContent}>
      <Text style={startScreenStyles.welcomeTitle}>WELCOME!</Text>
      <Text style={startScreenStyles.subtitle}>Select a deck of flashcards to begin.</Text>
      <Animated.Image
        source={require('../../assets/abc-logo.png')}
        resizeMode="contain"
        style={[startScreenStyles.logo, { transform: [{ scale: logoScale }] }]}
      />
      <View style={startScreenStyles.deckButtonRow}>
        {DECK_OPTIONS.map(({ deckType, label, caption, color }) => (
          <Pressable
            key={deckType}
            onPress={() => onSelectDeck(deckType)}
            accessibilityRole="button"
            accessibilityLabel={caption}
            style={({ pressed: isPressed }) => [
              startScreenStyles.deckButton,
              { backgroundColor: color },
              isPressed && commonStyles.pressed,
            ]}
          >
            <Text style={[startScreenStyles.deckButtonLabel, { color: getTextColorOn(color) }]}>{label}</Text>
            <Text style={[startScreenStyles.deckButtonCaption, { color: getTextColorOn(color) }]}>{caption}</Text>
          </Pressable>
        ))}
      </View>
      <ToggleRow
        iconName="stopwatch"
        label="Timed Mode"
        isEnabled={isTimedModeEnabled}
        onChange={onTimedModeChange}
        style={startScreenStyles.firstToggleRow}
      />
      <ToggleRow
        iconName="repeat"
        label="Repeat Missed Letters"
        isEnabled={isRepeatMissedEnabled}
        onChange={onRepeatMissedChange}
      />
    </View>
  );
}
