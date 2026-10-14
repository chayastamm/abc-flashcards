import { useEffect, useState } from 'react';
import { Animated, Text, View } from 'react-native';
import { GlowPressable } from '../components/GlowPressable';
import { HomeIconButton } from '../components/HomeIconButton';
import { SubjectLogo } from '../components/SubjectLogo';
import { SubjectMenu } from '../components/SubjectMenu';
import { ToggleRow } from '../components/ToggleRow';
import { DeckType, Subject } from '../constants/decks';
import { commonStyles } from '../styles/common.styles';
import { homeIconButtonStyles } from '../styles/homeIconButton.styles';
import { startScreenStyles } from '../styles/startScreen.styles';
import { getSubjectOption, getTextColorOn } from '../utils';

const LOGO_PULSE_SCALE = 1.06;
const LOGO_PULSE_DURATION_MS = 800;

export function StartScreen({
  onHome,
  subject,
  onSubjectChange,
  onSelectDeck,
  isTimedModeEnabled,
  onTimedModeChange,
  isAutoRedoEnabled,
  onAutoRedoChange,
}: {
  onHome: () => void;
  subject: Subject;
  onSubjectChange: (subject: Subject) => void;
  onSelectDeck: (deckType: DeckType) => void;
  isTimedModeEnabled: boolean;
  onTimedModeChange: (isEnabled: boolean) => void;
  isAutoRedoEnabled: boolean;
  onAutoRedoChange: (isEnabled: boolean) => void;
}) {
  const { cardNoun, deckOptions } = getSubjectOption(subject);
  const capitalizedCardNoun = cardNoun.charAt(0).toUpperCase() + cardNoun.slice(1);
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
      <Animated.View style={{ transform: [{ scale: logoScale }] }}>
        <SubjectLogo subject={subject} style={startScreenStyles.logo} />
      </Animated.View>
      <View style={startScreenStyles.deckButtonRow}>
        {deckOptions.map(({ deckType, label, caption, accessibilityLabel, color }) => (
          <GlowPressable
            key={deckType}
            onPress={() => onSelectDeck(deckType)}
            accessibilityRole="button"
            accessibilityLabel={accessibilityLabel}
            glowColor={color}
            style={[startScreenStyles.deckButton, { backgroundColor: color }]}
          >
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              style={[
                startScreenStyles.deckButtonLabel,
                !caption && startScreenStyles.wordDeckButtonLabel,
                !caption && deckOptions.length >= 3 && startScreenStyles.narrowWordDeckButtonLabel,
                { color: getTextColorOn(color) },
              ]}
            >
              {label}
            </Text>
            {caption && (
              <Text style={[startScreenStyles.deckButtonCaption, { color: getTextColorOn(color) }]}>{caption}</Text>
            )}
          </GlowPressable>
        ))}
      </View>
      <ToggleRow
        iconName="repeat"
        label={`Automatically Redo Missed ${capitalizedCardNoun}`}
        isEnabled={isAutoRedoEnabled}
        onChange={onAutoRedoChange}
        style={startScreenStyles.firstToggleRow}
      />
      <ToggleRow
        iconName="stopwatch"
        label="Timed Mode"
        isEnabled={isTimedModeEnabled}
        onChange={onTimedModeChange}
      />
      <HomeIconButton onPress={onHome} style={homeIconButtonStyles.topLeftCorner} />
      <SubjectMenu selectedSubject={subject} onSelectSubject={onSubjectChange} />
    </View>
  );
}
