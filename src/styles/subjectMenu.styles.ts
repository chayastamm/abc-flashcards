import { StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';
import { HOME_ICON_SIZE, SCREEN_EDGE_INSET, SCREEN_TOP_INSET } from './homeIconButton.styles';

const GRID_SQUARE_SIZE = 12;
const GRID_GAP = 4;
const ICON_BUTTON_PADDING = 8;
const ICON_BUTTON_SIZE = GRID_SQUARE_SIZE * 2 + GRID_GAP + ICON_BUTTON_PADDING * 2;

// Four squares in the main button colors, read left-to-right, top-to-bottom.
export const MENU_ICON_SQUARE_COLORS = [COLORS.red, COLORS.blue, COLORS.yellow, COLORS.green];

export const subjectMenuStyles = StyleSheet.create({
  // Covers the screen behind the open menu so a tap anywhere else closes it.
  backdrop: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, zIndex: 10 },
  // Top-right corner, lined up with the home icon on the left.
  anchor: {
    position: 'absolute',
    top: SCREEN_TOP_INSET + (HOME_ICON_SIZE - ICON_BUTTON_SIZE) / 2,
    right: SCREEN_EDGE_INSET - ICON_BUTTON_PADDING,
    zIndex: 11,
    alignItems: 'flex-end',
  },

  iconButton: { padding: ICON_BUTTON_PADDING, borderRadius: 12 },
  iconGrid: {
    width: GRID_SQUARE_SIZE * 2 + GRID_GAP,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GRID_GAP,
  },
  iconSquare: { width: GRID_SQUARE_SIZE, height: GRID_SQUARE_SIZE, borderRadius: 3 },

  menu: {
    marginTop: 6,
    paddingVertical: 6,
    minWidth: 200,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.ink,
    elevation: 8,
    boxShadow: '0 6px 16px rgba(7, 59, 76, 0.18)',
    transformOrigin: 'top right',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  selectedMenuItem: { backgroundColor: COLORS.background },
  menuItemLogo: { width: 56, height: 47 },
  menuItemLabel: { fontSize: 20, fontWeight: '800', color: COLORS.ink },
});
