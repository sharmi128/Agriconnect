import { StyleSheet, Text, View } from 'react-native';

import { AgriRadius, AgriTypography } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAppSettings } from '@/context/app-settings-context';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import type { LandAreaUnit } from '@/models/app-settings';
import {
  CROP_OPTIONS,
  IRRIGATION_OPTIONS,
  formatLandArea,
  getOptionLabel,
  type FarmerProfile,
} from '@/models/farmer-profile';

type FarmInfoRow = {
  label: string;
  value: string;
  /** Emoji shown to the left of the label. */
  icon: string;
};

type FarmInfoCardProps = {
  profile: FarmerProfile;
};

/**
 * Builds the five rows from the profile, formatted for reading.
 *
 * The 📐 land size is written in the unit the farmer picked in 🌐 Language &
 * Region. The value is still stored in acres, so switching the unit only changes
 * this line and nothing else in the app.
 */
function buildRows(profile: FarmerProfile, landAreaUnit: LandAreaUnit): FarmInfoRow[] {
  return [
    {
      label: 'Farm Location',
      value: profile.location || 'Not set',
      icon: '\u{1F4CD}',
    },
    {
      label: 'Land Area',
      value: profile.landArea ? formatLandArea(profile.landArea, landAreaUnit) : 'Not set',
      icon: '\u{1F4D0}',
    },
    {
      label: 'Main Crop',
      value: profile.mainCrop ? getOptionLabel(CROP_OPTIONS, profile.mainCrop) : 'Not set',
      icon: '\u{1F33E}',
    },
    {
      label: 'Irrigation',
      value: profile.irrigationType
        ? getOptionLabel(IRRIGATION_OPTIONS, profile.irrigationType)
        : 'Not set',
      icon: '\u{1F4A7}',
    },
    {
      label: 'Fields',
      value: profile.fieldCount || 'Not set',
      icon: '\u{1F5FA}\uFE0F',
    },
  ];
}

/**
 * The "Farm Information" card of the Profile screen: 📍 farm location, 📐 land
 * area, 🌾 main crop, 💧 irrigation type and the number of 🗺️ fields.
 */
export function FarmInfoCard({ profile }: FarmInfoCardProps) {
  const colors = useAgriTheme();
  const { settings } = useAppSettings();
  const rows = buildRows(profile, settings.landAreaUnit);

  return (
    <View
      testID="farm-info-card"
      style={[
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}>
      <Text style={[styles.cardTitle, { color: colors.text }]}>Farm Information</Text>

      <View>
        {rows.map((row, index) => (
          <View
            key={row.label}
            style={[
              styles.row,
              // A hairline between rows, but not above the first one.
              index > 0 && { borderTopColor: colors.border, borderTopWidth: 1 },
            ]}>
            <Text style={styles.rowIcon}>{row.icon}</Text>

            <Text style={[styles.rowLabel, { color: colors.textSecondary }]}>{row.label}</Text>

            <Text
              style={[styles.rowValue, { color: colors.text }]}
              numberOfLines={2}>
              {row.value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
    borderRadius: AgriRadius.large,
    borderWidth: 1,
  },
  cardTitle: {
    ...AgriTypography.subtitle,
    fontWeight: '700',
    marginBottom: Spacing.two,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.three,
  },
  rowIcon: {
    fontSize: 16,
    width: 24,
    textAlign: 'center',
  },
  rowLabel: {
    ...AgriTypography.body,
    flex: 1,
  },
  rowValue: {
    ...AgriTypography.body,
    fontWeight: '700',
    flexShrink: 1,
    textAlign: 'right',
  },
});
