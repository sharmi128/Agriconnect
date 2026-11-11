import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { cartHref, wishlistHref } from '@/components/marketplace/routes';
import { AgriRadius, AgriTypography } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useMarketplaceSaved } from '@/context/marketplace-context';
import { useAgriTheme } from '@/hooks/use-agri-theme';

type MarketplaceHeaderBarProps = {
  /**
   * `onPrimary` sits on the green band at the top of the Marketplace tab, so
   * the icons are drawn in white on a translucent white circle. `surface` sits
   * on the page itself, and is what the pushed screens use.
   */
  tone?: 'onPrimary' | 'surface';
  title?: string;
  /** One line under the title, for the count on the saved lists. */
  subtitle?: string;
  /** Renders a back arrow. The Marketplace tab has none, the pushed screens do. */
  onBack?: () => void;
  testID?: string;
};

/**
 * The row across the top of the marketplace: the screen's name on the left, and
 * the farmer's wishlist and cart on the right.
 *
 * The two saved lists are the only way back to something a farmer has already
 * decided on, so they sit in the top band of every marketplace screen rather
 * than at the foot of a list. The cart carries a count badge because "is it in
 * there?" is the question a farmer asks of a cart, and the wishlist does not:
 * one glance tells them whether anything is saved at all.
 *
 * Adding a listing to the cart from anywhere in the marketplace is therefore
 * never more than one tap from the cart itself, which is what makes the cart
 * worth having on the wishlist screen as well as on the tab.
 */
export function MarketplaceHeaderBar({
  tone = 'surface',
  title = 'Marketplace',
  subtitle,
  onBack,
  testID,
}: MarketplaceHeaderBarProps) {
  const colors = useAgriTheme();
  const { wishlistCount, cartItemCount } = useMarketplaceSaved();
  const isOnPrimary = tone === 'onPrimary';

  const iconColor = isOnPrimary ? colors.onPrimary : colors.text;
  const titleColor = isOnPrimary ? colors.onPrimary : colors.text;
  const subtitleColor = isOnPrimary ? colors.onPrimary : colors.textSecondary;
  const chipBackground = isOnPrimary ? 'rgba(255, 255, 255, 0.18)' : colors.surface;
  const chipBorder = isOnPrimary ? 'rgba(255, 255, 255, 0.28)' : colors.border;

  return (
    <View style={styles.header} testID={testID}>
      <View style={styles.row}>
        <View style={styles.titles}>
          {onBack ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Go back"
              hitSlop={8}
              onPress={onBack}
              style={({ pressed }) => [styles.back, pressed && styles.pressed]}>
              <Text style={[styles.backChevron, { color: iconColor }]}>{'\u2039'}</Text>
              <Text style={[styles.backLabel, { color: iconColor }]}>Back</Text>
            </Pressable>
          ) : null}

          <Text style={[styles.title, { color: titleColor }]} numberOfLines={1}>
            {title}
          </Text>
        </View>

        <View style={styles.actions}>
          <HeaderIcon
            emoji={'\u{1F49B}'}
            accessibilityLabel={
              wishlistCount > 0
                ? `Wishlist, ${wishlistCount} saved`
                : 'Wishlist, nothing saved'
            }
            onPress={() => router.push(wishlistHref())}
            iconColor={iconColor}
            chipBackground={chipBackground}
            chipBorder={chipBorder}
            testID="marketplace-header-wishlist"
          />

          <HeaderIcon
            emoji={'\u{1F6D2}'}
            accessibilityLabel={
              cartItemCount > 0 ? `Cart, ${cartItemCount} items` : 'Cart, empty'
            }
            onPress={() => router.push(cartHref())}
            iconColor={iconColor}
            chipBackground={chipBackground}
            chipBorder={chipBorder}
            badge={cartItemCount}
            badgeColor={colors.onPrimary}
            badgeBorder={chipBackground}
            testID="marketplace-header-cart"
          />
        </View>
      </View>

      {subtitle ? (
        <Text
          style={[
            styles.subtitle,
            { color: subtitleColor },
            isOnPrimary && styles.subtitleOnPrimary,
          ]}
          numberOfLines={2}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

type HeaderIconProps = {
  emoji: string;
  accessibilityLabel: string;
  onPress: () => void;
  iconColor: string;
  chipBackground: string;
  chipBorder: string;
  /** The count drawn on the corner, for the cart. */
  badge?: number;
  badgeColor?: string;
  badgeBorder?: string;
  testID?: string;
};

/** One round icon button, with an optional count badge on its corner. */
function HeaderIcon({
  emoji,
  accessibilityLabel,
  onPress,
  iconColor,
  chipBackground,
  chipBorder,
  badge,
  badgeColor,
  badgeBorder,
  testID,
}: HeaderIconProps) {
  const colors = useAgriTheme();

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={6}
      onPress={onPress}
      style={({ pressed }) => [
        styles.iconChip,
        { backgroundColor: chipBackground, borderColor: chipBorder },
        pressed && styles.pressed,
      ]}>
      <Text style={[styles.icon, { color: iconColor }]}>{emoji}</Text>

      {badge && badge > 0 ? (
        <View
          style={[
            styles.badge,
            {
              backgroundColor: colors.harvest,
              borderColor: badgeBorder ?? colors.surface,
            },
          ]}>
          <Text style={styles.badgeText}>{badge > 99 ? '99+' : badge}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: Spacing.one,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  titles: {
    flexShrink: 1,
    gap: 2,
  },
  back: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    alignSelf: 'flex-start',
  },
  backChevron: {
    fontSize: 26,
    lineHeight: 28,
    marginTop: -4,
  },
  backLabel: {
    ...AgriTypography.label,
  },
  title: {
    ...AgriTypography.title,
    fontSize: 24,
    lineHeight: 32,
  },
  subtitle: {
    ...AgriTypography.body,
    fontSize: 14,
  },
  /** The green band needs the subtitle dimmed rather than the default weight. */
  subtitleOnPrimary: {
    opacity: 0.9,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  iconChip: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: AgriRadius.pill,
    borderWidth: 1,
  },
  icon: {
    fontSize: 19,
    lineHeight: 24,
  },
  /** Sits on the top-right corner of the icon, half outside it. */
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: AgriRadius.pill,
    borderWidth: 2,
  },
  badgeText: {
    ...AgriTypography.caption,
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '700',
    color: '#1A1A17',
  },
  pressed: {
    opacity: 0.7,
  },
});
