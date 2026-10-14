import { StyleProp, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { HOME_ICON_SIZE, homeIconButtonStyles } from '../styles/homeIconButton.styles';
import { GlowPressable } from './GlowPressable';

// The small home icon shown in the top-left of every screen.
export function HomeIconButton({ onPress, style }: { onPress: () => void; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={style}>
      <GlowPressable
        onPress={onPress}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel="Home"
        glowColor={COLORS.ink}
        style={homeIconButtonStyles.button}
      >
        <Ionicons name="home" size={HOME_ICON_SIZE} color={COLORS.ink} />
      </GlowPressable>
    </View>
  );
}
