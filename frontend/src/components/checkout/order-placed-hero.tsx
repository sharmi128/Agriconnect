import { StyleSheet, Text, View } from 'react-native';

import { AgriRadius, AgriTypography } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';

type OrderPlacedHeroProps = {
  /** Order id, drawn large so it can be read out over a phone. */
  orderId: string;
  /** One line under the order id, for example "3 items · Paddy seed". */
  headline: string;
  testID?: string;
};

/**
 * ✅ The green panel at the top of the confirmation: the tick, the words, and the
 * order id.
 *
 * The order id is the biggest thing on the screen after the title, because it is
 * the only part of this page a farmer will ever need to quote to anyone — a
 * seller, a delivery agent, or the farmer themselves a week later trying to
 * remember what they sent.
 *
 * It is drawn in the pale green wash rather than on the filled primary, so the
 * page still reads as light and spacious and the two buttons below it stay the
 * things a thumb is aimed at.
 */
export function OrderPlacedHero({ orderId, headline, testID }: OrderPlacedHeroProps) {
  const colors = useAgriTheme();

  return (
    <View
      testID={testID ?? 'order-confirmation-hero'}
      style={[
        styles.card,
        {
          backgroundColor: colors.primarySoft,
          borderColor: colors.primary,
        },
      ]}>
      <View style={[styles.tick, { backgroundColor: colors.primary }]}>
        <Text style={styles.tickMark}>{'\u2713'}</Text>
      </View>

      <Text style={[styles.title, { color: colors.primaryDark }]}>Order Placed Successfully!</Text>
      <Text style={[styles.headline, { color: colors.text }]} numberOfLines={2}>
        {headline}
      </Text>

      <View style={[styles.idBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.idLabel, { color: colors.textSecondary }]}>Order ID</Text>
        <Text style={[styles.idValue, { color: colors.text }]} selectable>
          {orderId}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    gap: 6,
    paddingVertical: Spacing.four,
    paddingHorizontal: Spacing.three,
    borderRadius: AgriRadius.large,
    borderWidth: 1,
    width: '100%',
  },
  tick: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    marginBottom: Spacing.two,
  },
  tickMark: {
    color: '#FFFFFF',
    fontSize: 30,
    lineHeight: 38,
    fontWeight: '700',
  },
  title: {
    ...AgriTypography.title,
    fontSize: 22,
    lineHeight: 30,
    textAlign: 'center',
  },
  headline: {
    ...AgriTypography.body,
    textAlign: 'center',
  },
  idBox: {
    alignItems: 'center',
    gap: 2,
    marginTop: Spacing.three,
    paddingVertical: Spacing.two + 2,
    paddingHorizontal: Spacing.four,
    borderRadius: AgriRadius.medium,
    borderWidth: 1,
  },
  idLabel: {
    ...AgriTypography.caption,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  idValue: {
    ...AgriTypography.subtitle,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
  },
});
