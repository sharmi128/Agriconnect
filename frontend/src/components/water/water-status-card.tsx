import { StyleSheet, Text, View } from 'react-native';

import { SectionCard } from '@/components/ui/section-card';
import { AgriRadius, AgriTypography } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import type { LandAreaUnit } from '@/models/app-settings';
import { DEMO_FARM } from '@/models/farm';
import {
  fieldAreaLabel,
  WATER_LEVEL_LABELS,
  type FieldWaterStatus,
  type WaterLevel,
} from '@/models/water-management';

type WaterStatusCardProps = {
  statuses: readonly FieldWaterStatus[];
  /** The 📐 unit the farmer picked on the Profile tab. */
  unit: LandAreaUnit;
};

/**
 * 💧 Water Status, one row per field.
 *
 * The reading and the action sit on the same row on purpose. A status a farmer
 * cannot act on is just information, so the line that matters most is the one
 * saying what to do about it today.
 *
 * The field name, size and crop are read from `models/farm.ts` rather than
 * repeated here, so this card and the My Farm screen cannot drift apart.
 */
export function WaterStatusCard({ statuses, unit }: WaterStatusCardProps) {
  const colors = useAgriTheme();

  return (
    <SectionCard
      title="💧 Water Status"
      subtitle="What each field is holding right now, and what to do about it"
      testID="water-status-card">
      <View style={styles.list}>
        {statuses.map((status, index) => {
          const field = DEMO_FARM.fields.find((entry) => entry.id === status.fieldId);
          const tone = levelTone(status.level, colors);

          return (
            <View
              key={status.fieldId}
              style={[
                styles.row,
                // A hairline between rows, but not above the first one.
                index > 0 && { borderTopColor: colors.border, borderTopWidth: 1 },
              ]}>
              <View style={styles.header}>
                <Text style={styles.emoji}>{field?.crop ? '\u{1F331}' : '\u{1F33E}'}</Text>

                <View style={styles.headerText}>
                  <Text style={[styles.field, { color: colors.text }]} numberOfLines={1}>
                    {field?.name ?? 'Field'}
                  </Text>
                  <Text style={[styles.subfield, { color: colors.textSecondary }]} numberOfLines={1}>
                    {`${field?.crop?.name ?? 'Fallow'} · ${fieldAreaLabel(
                      field?.areaAcres ?? '0',
                      unit
                    )}`}
                  </Text>
                </View>

                <View
                  style={[
                    styles.badge,
                    { backgroundColor: tone.soft, borderColor: tone.solid },
                  ]}>
                  <Text style={[styles.badgeText, { color: tone.text }]} numberOfLines={1}>
                    {WATER_LEVEL_LABELS[status.level]}
                  </Text>
                </View>
              </View>

              <Text style={[styles.reading, { color: colors.text }]}>{status.reading}</Text>
              <Text style={[styles.action, { color: colors.textSecondary }]}>{status.action}</Text>

              {status.daysSinceIrrigation !== null ? (
                <Text style={[styles.meta, { color: colors.textSecondary }]}>
                  {`Last watered ${status.daysSinceIrrigation} ${
                    status.daysSinceIrrigation === 1 ? 'day' : 'days'
                  } ago`}
                </Text>
              ) : null}
            </View>
          );
        })}
      </View>
    </SectionCard>
  );
}

type Tone = {
  soft: string;
  solid: string;
  text: string;
};

/**
 * The colour a level is shown in, read from the theme at render time.
 *
 * `adequate` stays green, `due` uses the warning amber because it wants an action
 * today, and `not-needed` drops to plain grey so a fallow field does not look
 * like it needs attention.
 */
function levelTone(level: WaterLevel, colors: ReturnType<typeof useAgriTheme>): Tone {
  switch (level) {
    case 'adequate':
      return { soft: colors.primarySoft, solid: colors.primary, text: colors.primaryDark };
    case 'low':
    case 'due':
      return { soft: colors.warningSoft, solid: colors.warning, text: colors.warning };
    case 'not-needed':
    default:
      return { soft: colors.background, solid: colors.border, text: colors.textSecondary };
  }
}

const styles = StyleSheet.create({
  list: {
    gap: 0,
  },
  row: {
    paddingVertical: Spacing.three,
    gap: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  emoji: {
    fontSize: 18,
    lineHeight: 24,
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  field: {
    ...AgriTypography.label,
    fontWeight: '700',
  },
  subfield: {
    ...AgriTypography.caption,
    fontSize: 12,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: AgriRadius.pill,
    borderWidth: 1,
  },
  badgeText: {
    ...AgriTypography.caption,
    fontSize: 12,
    fontWeight: '700',
  },
  reading: {
    ...AgriTypography.body,
  },
  action: {
    ...AgriTypography.caption,
    fontWeight: '400',
  },
  meta: {
    ...AgriTypography.caption,
    fontSize: 12,
  },
});
