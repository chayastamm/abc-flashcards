import { useEffect, useState } from 'react';
import { Animated, BackHandler, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Subject, SUBJECT_OPTIONS } from '../constants/decks';
import { COLORS } from '../constants/theme';
import { MENU_ICON_SQUARE_COLORS, subjectMenuStyles } from '../styles/subjectMenu.styles';
import { GlowPressable } from './GlowPressable';
import { SubjectLogo } from './SubjectLogo';

const MENU_OPEN_DURATION_MS = 160;

// The four-square icon in the top-right corner of every screen, and the menu of flashcard subjects it opens.
export function SubjectMenu({
  selectedSubject,
  onSelectSubject,
}: {
  selectedSubject: Subject;
  onSelectSubject: (subject: Subject) => void;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const safeAreaInsets = useSafeAreaInsets();
  const menuOpenProgress = useState(() => new Animated.Value(0))[0];

  // Grow the menu out of the icon each time it opens.
  useEffect(() => {
    if (!isMenuOpen) return;
    menuOpenProgress.setValue(0);
    Animated.timing(menuOpenProgress, {
      toValue: 1,
      duration: MENU_OPEN_DURATION_MS,
      useNativeDriver: true,
    }).start();
  }, [isMenuOpen, menuOpenProgress]);

  // Android's back button closes the open menu instead of leaving the app.
  useEffect(() => {
    if (!isMenuOpen) return;
    const backPressSubscription = BackHandler.addEventListener('hardwareBackPress', () => {
      setIsMenuOpen(false);
      return true;
    });
    return () => backPressSubscription.remove();
  }, [isMenuOpen]);

  const selectSubject = (subject: Subject) => {
    setIsMenuOpen(false);
    onSelectSubject(subject);
  };

  return (
    <>
      {isMenuOpen && (
        <Pressable
          // Reach past the safe-area padding so taps near the notch or home bar also close the menu.
          style={[subjectMenuStyles.backdrop, { top: -safeAreaInsets.top, bottom: -safeAreaInsets.bottom }]}
          onPress={() => setIsMenuOpen(false)}
          accessibilityLabel="Close menu"
        />
      )}
      <View style={subjectMenuStyles.anchor}>
        <GlowPressable
          onPress={() => setIsMenuOpen(!isMenuOpen)}
          accessibilityRole="button"
          accessibilityLabel="Choose flashcards"
          accessibilityState={{ expanded: isMenuOpen }}
          hitSlop={8}
          glowColor={COLORS.ink}
          style={subjectMenuStyles.iconButton}
        >
          <View style={subjectMenuStyles.iconGrid}>
            {MENU_ICON_SQUARE_COLORS.map((color) => (
              <View key={color} style={[subjectMenuStyles.iconSquare, { backgroundColor: color }]} />
            ))}
          </View>
        </GlowPressable>
        {isMenuOpen && (
          <Animated.View
            accessibilityRole="menu"
            style={[
              subjectMenuStyles.menu,
              {
                opacity: menuOpenProgress,
                transform: [{ scale: menuOpenProgress.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) }],
              },
            ]}
          >
            {SUBJECT_OPTIONS.map(({ subject, menuLabel }) => {
              const isSelected = subject === selectedSubject;
              return (
                <GlowPressable
                  key={subject}
                  onPress={() => selectSubject(subject)}
                  accessibilityRole="menuitem"
                  accessibilityLabel={menuLabel}
                  accessibilityState={{ selected: isSelected }}
                  glowColor={COLORS.blue}
                  style={[subjectMenuStyles.menuItem, isSelected && subjectMenuStyles.selectedMenuItem]}
                >
                  <SubjectLogo subject={subject} style={subjectMenuStyles.menuItemLogo} />
                  <Text style={subjectMenuStyles.menuItemLabel}>{menuLabel}</Text>
                </GlowPressable>
              );
            })}
          </Animated.View>
        )}
      </View>
    </>
  );
}
