import { StyleSheet, Text, View } from 'react-native';

import { SectionCard } from '@/components/ui/section-card';
import { AgriRadius, AgriTypography } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import { IRRIGATION_OPTIONS, getOptionLabel } from '@/models/farmer-profile';
import { IRRIGATION_TYPE_NOTES, type IrrigationTypeNote } from '@/models/water-management';

type IrrigationTypeCardProps = {
  /** The value saved on the farmer profile, for example "Well". */
  value: string;
};

/**
 * 🚿 Irrigation Type, and what it means for the water.
 *
 * The type shown is the one saved on the farmer's profile, so editing the profile
 * changes this card. The notes underneath cover every option rather than just the
 * chosen one, because a farmer reading about irrigation is often comparing, and
 * the line that decides it is usually the one about a different method.
 */
export function IrrigationTypeCard({ value }: IrrigationTypeCardProps) {
  const colors = useAgriTheme();
  const label = getOptionLabel(IRRIGATION_OPTIONS, value);

  return (
    <SectionCard
      title="🚿 Irrigation Type"
      subtitle="How water reaches your fields, taken from your profile"
      testID="irrigation-type-card">
      <View style={styles.body}>
        <View style={[styles.current, { backgroundColor: colors.primarySoft, borderColor: colors.border }]}>
          <Text style={styles.currentEmoji}>{'\u{1F6B1}'}</Text>

          <View style={styles.currentText}>
            <Text style={[styles.currentLabel, { color: colors.primaryDark }]}>Your farm uses</Text>
            <Text style={[styles.currentValue, { color: colors.text }]} numberOfLines={2}>
              {label}
            </Text>
          </View>

          <Text style={[styles.currentHint, { color: colors.textSecondary }]}>
            {'Change this on the Profile tab.'}
          </Text>
        </View>

        <View style={styles.list}>
          {IRRIGATION_TYPE_NOTES.map((note: IrrigationTypeNote, index) => {
            const isCurrent = note.name === label;

            return (
              <View
                key={note.id}
                style={[
                  styles.row,
                  // A hairline between rows, but not above the first one.
                  index > 0 && { borderTopColor: colors.border, borderTopWidth: 1 },
                ]}>
                <View style={styles.header}>
                  <Text style={styles.rowEmoji}>{note.emoji}</Text>
                  <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
                    {note.name}
                  </Text>

                  {isCurrent ? (
                    <View style={[styles.badge, { backgroundColor: colors.primarySoft }]}>
                      <Text style={[styles.badgeText, { color: colors.primaryDark }]}>✓ Yours</Text>
                    </View>
                  ) : null}
                </View>

                <Text style={[styles.detail, { color: colors.textSecondary }]}>{note.detail}</Text>
                <Text style={[styles.tradeoff, { color: colors.textSecondary }]}>
                  {note.tradeoff}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  body: {
    gap: Spacing.three,
  },
  current: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: AgriRadius.medium,
    borderWidth: 1,
  },
  currentEmoji: {
    fontSize: 20,
    lineHeight: 26,
  },
  currentText: {
    flex: 1,
    gap: 2,
  },
  currentLabel: {
    ...AgriTypography.caption,
    fontSize: 12,
  },
  currentValue: {
    ...AgriTypography.subtitle,
    fontWeight: '700',
  },
  currentHint: {
    ...AgriTypography.caption,
    fontSize: 12,
    textAlign: 'right',
    flexShrink: 1,
  },
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
    gap: 6,
  },
  rowEmoji: {
    fontSize: 15,
    lineHeight: 21,
  },
  name: {
    ...AgriTypography.label,
    fontWeight: '700',
    flex: 1,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: AgriRadius.pill,
  },
  badgeText: {
    ...AgriTypography.caption,
    fontSize: 12,
    fontWeight: '700',
  },
  detail: {
    ...AgriTypography.caption,
    fontWeight: '400',
  },
  tradeoff: {
    ...AgriTypography.caption,
    fontSize: 12,
  },
});
