import { ComponentProps } from 'react';
import { StyleProp, Switch, Text, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { SWITCH_THUMB_ON_COLOR, SWITCH_TRACK_COLORS, toggleRowStyles } from '../styles/toggleRow.styles';

// An icon, a tappable label, and a switch, used for the home-screen options.
export function ToggleRow({
  iconName,
  label,
  isEnabled,
  onChange,
  style,
}: {
  iconName: ComponentProps<typeof Ionicons>['name'];
  label: string;
  isEnabled: boolean;
  onChange: (isEnabled: boolean) => void;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[toggleRowStyles.row, style]}>
      <Ionicons name={iconName} size={28} color={COLORS.ink} />
      <Text style={toggleRowStyles.label} onPress={() => onChange(!isEnabled)}>
        {label}
      </Text>
      <Switch
        value={isEnabled}
        onValueChange={onChange}
        accessibilityLabel={label}
        trackColor={SWITCH_TRACK_COLORS}
        thumbColor={isEnabled ? SWITCH_THUMB_ON_COLOR : COLORS.white}
        // Web ignores thumbColor when on and falls back to a default green; this prop isn't in the native types.
        {...{ activeThumbColor: SWITCH_THUMB_ON_COLOR }}
      />
    </View>
  );
}
