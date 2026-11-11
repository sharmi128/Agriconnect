import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AgriRadius, AgriTypography } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import type { Buyer } from '@/models/buyer-connection';

type ContactBuyerCardProps = {
  buyer: Buyer;
  onPress: (buyer: Buyer) => void;
};

/**
 * 📞 One buyer in the contact list.
 *
 * The 📞 Contact Buyer section is deliberately a plain list of names and numbers:
 * once the rate has been decided the farmer wants the phone, not the offer
 * breakdown a second time. Tapping a row opens the same contact options the buyer
 * cards open, so there is only one place that knows how to reach somebody.
 */
export function ContactBuyerCard({ buyer, onPress }: ContactBuyerCardProps) {
  const colors = useAgriTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Call or message ${buyer.name}. ${buyer.contactName}, ${buyer.phone}.`}
      onPress={() => onPress(buyer)}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.border },
        pressed && styles.pressed,
      ]}>
      <View style={[styles.iconCircle, { backgroundColor: colors.primarySoft }]}>
        <Text style={styles.icon}>{buyer.emoji}</Text>
      </View>

      <View style={styles.text}>
        <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
          {buyer.name}
        </Text>
        <Text style={[styles.contact, { color: colors.textSecondary }]} numberOfLines={1}>
          {`${buyer.contactName} · ${buyer.phone}`}
        </Text>
        <Text style={[styles.hint, { color: colors.primary }]} numberOfLines={1}>
          {'📞 Tap for call, WhatsApp or SMS ›'}
        </Text>
      </View>

      <Text style={[styles.distance, { color: colors.textSecondary }]} numberOfLines={1}>
        {`${buyer.distanceKm} km`}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: AgriRadius.large,
    borderWidth: 1,
  },
  pressed: {
    opacity: 0.85,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 18,
    lineHeight: 24,
  },
  text: {
    flex: 1,
    gap: 2,
  },
  name: {
    ...AgriTypography.label,
    fontWeight: '700',
  },
  contact: {
    ...AgriTypography.caption,
    fontSize: 12,
  },
  hint: {
    ...AgriTypography.caption,
    fontSize: 12,
    fontWeight: '700',
  },
  distance: {
    ...AgriTypography.caption,
    fontSize: 12,
    flexShrink: 1,
    textAlign: 'right',
  },
});
