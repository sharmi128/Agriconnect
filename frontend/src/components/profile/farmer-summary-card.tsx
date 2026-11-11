import { StyleSheet, Text, View } from 'react-native';

import { AgriRadius, AgriTypography } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import type { FarmerProfile } from '@/models/farmer-profile';

type FarmerSummaryCardProps = {
  profile: FarmerProfile;
  /** Emoji shown as the avatar. */
  emoji?: string;
};

/**
 * The top card of the Profile screen: avatar, farmer name and location.
 *
 * The 👨‍🌾 avatar stands in for a photo, since there is no image picker on the
 * profile yet. The 🗺️ farm name and the ✅ "Farmer" chip underneath it tell the
 * farmer at a glance which account they are looking at, which matters once
 * several farmers share a phone.
 */
export function FarmerSummaryCard({ profile, emoji = '\u{1F468}\u200D\u{1F33E}' }: FarmerSummaryCardProps) {
  const colors = useAgriTheme();

  return (
    <View
      testID="farmer-summary-card"
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View
        accessibilityRole="image"
        accessibilityLabel="Farmer avatar"
        style={[styles.avatar, { backgroundColor: colors.primarySoft, borderColor: colors.border }]}>
        <Text style={styles.avatarEmoji}>{emoji}</Text>
      </View>

      <Text style={[styles.name, { color: colors.text }]} numberOfLines={2}>
        {profile.name || 'Your name'}
      </Text>

      <View style={styles.locationRow}>
        <Text style={styles.locationPin}>{'\u{1F4CD}'}</Text>
        <Text style={[styles.location, { color: colors.textSecondary }]} numberOfLines={2}>
          {profile.location || 'Add your location'}
        </Text>
      </View>

      <View
        style={[
          styles.chips,
          { backgroundColor: colors.primarySoft, borderColor: colors.border },
        ]}>
        <Text style={[styles.chip, { color: colors.primaryDark }]}>
          {'\u2705  Farmer'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.four,
    paddingHorizontal: Spacing.three,
    borderRadius: AgriRadius.large,
    borderWidth: 1,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.two,
  },
  avatarEmoji: {
    fontSize: 44,
    lineHeight: 52,
  },
  name: {
    ...AgriTypography.title,
    textAlign: 'center',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locationPin: {
    fontSize: 14,
  },
  location: {
    ...AgriTypography.body,
    flexShrink: 1,
  },
  chips: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: AgriRadius.pill,
    borderWidth: 1,
    paddingHorizontal: Spacing.three,
    paddingVertical: 6,
    marginTop: Spacing.two,
  },
  chip: {
    ...AgriTypography.caption,
    fontWeight: '700',
  },
});
