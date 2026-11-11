import { StyleSheet, Text, View } from 'react-native';

import { SectionCard } from '@/components/ui/section-card';
import { AgriRadius, AgriTypography } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import {
  DEMO_RAINFALL,
  DEMO_RAINFALL_EXPECTED,
  expectedRainMm,
  wettestDay,
  type RainfallExpectation,
  type RainfallRecord,
} from '@/models/water-management';

type RainfallCardProps = {
  records?: readonly RainfallRecord[];
  expectations?: readonly RainfallExpectation[];
};

/**
 * 🌧️ Rainfall Information: what has fallen, and what is coming.
 *
 * The two halves answer the same question from opposite ends, and the number a
 * farmer plans around is the wettest day ahead rather than the total. That is
 * called out at the top, so the 60 mm on Wednesday is read as "do not irrigate
 * Wednesday" before the daily list is read at all.
 */
export function RainfallCard({
  records = DEMO_RAINFALL,
  expectations = DEMO_RAINFALL_EXPECTED,
}: RainfallCardProps) {
  const colors = useAgriTheme();
  const wettest = wettestDay(expectations);
  const total = expectedRainMm(expectations);

  return (
    <SectionCard
      title="🌧️ Rainfall Information"
      subtitle="What has fallen on the farm, and what the next five days hold"
      testID="rainfall-card">
      <View style={styles.body}>
        {wettest && wettest.expectedMm !== null ? (
          <View
            style={[
              styles.headline,
              { backgroundColor: colors.warningSoft, borderColor: colors.warning },
            ]}>
            <Text style={[styles.headlineEmoji, { color: colors.warning }]}>{wettest.emoji}</Text>

            <View style={styles.headlineText}>
              <Text style={[styles.headlineTitle, { color: colors.warning }]} numberOfLines={1}>
                {`${wettest.expectedMm} mm expected ${wettest.day}`}
              </Text>
              <Text style={[styles.headlineBody, { color: colors.textSecondary }]}>
                {`${total} mm in the next five days. Hold off irrigating ${wettest.day} and open the field drains instead.`}
              </Text>
            </View>
          </View>
        ) : null}

        <View style={styles.records}>
          {records.map((record, index) => (
            <View
              key={record.id}
              style={[
                styles.record,
                // A hairline between rows, but not above the first one.
                index > 0 && { borderTopColor: colors.border, borderTopWidth: 1 },
              ]}>
              <View style={styles.recordHeader}>
                <Text style={[styles.recordLabel, { color: colors.text }]} numberOfLines={1}>
                  {record.label}
                </Text>
                <Text style={[styles.recordTotal, { color: colors.primaryDark }]} numberOfLines={1}>
                  {`${record.totalMm} mm`}
                </Text>
              </View>

              <Text style={[styles.recordNote, { color: colors.textSecondary }]}>
                {record.note}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.forecast}>
          {expectations.map((day) => (
            <View
              key={day.day}
              style={[
                styles.day,
                { backgroundColor: colors.background, borderColor: colors.border },
              ]}>
              <Text style={styles.dayName} numberOfLines={1}>
                {day.day}
              </Text>
              <Text style={styles.dayEmoji}>{day.emoji}</Text>
              <Text
                style={[
                  styles.dayRain,
                  { color: day.expectedMm ? colors.water : colors.textSecondary },
                ]}
                numberOfLines={1}>
                {day.expectedMm === null ? day.rainChance : `${day.expectedMm} mm`}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  body: {
    gap: Spacing.three,
  },
  headline: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.two,
    borderWidth: 1,
    borderRadius: AgriRadius.medium,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  headlineEmoji: {
    fontSize: 20,
    lineHeight: 26,
  },
  headlineText: {
    flex: 1,
    gap: 4,
  },
  headlineTitle: {
    ...AgriTypography.label,
    fontWeight: '700',
  },
  headlineBody: {
    ...AgriTypography.caption,
    fontWeight: '400',
  },
  records: {
    gap: 0,
  },
  record: {
    paddingVertical: Spacing.two,
    gap: 4,
  },
  recordHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  recordLabel: {
    ...AgriTypography.label,
    fontWeight: '700',
    flex: 1,
  },
  recordTotal: {
    ...AgriTypography.label,
    fontWeight: '700',
  },
  recordNote: {
    ...AgriTypography.caption,
    fontWeight: '400',
  },
  forecast: {
    flexDirection: 'row',
    gap: 6,
  },
  day: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
    paddingVertical: Spacing.two,
    paddingHorizontal: 4,
    borderRadius: AgriRadius.medium,
    borderWidth: 1,
  },
  dayName: {
    ...AgriTypography.caption,
    fontSize: 11,
    fontWeight: '700',
  },
  dayEmoji: {
    fontSize: 17,
    lineHeight: 23,
  },
  dayRain: {
    ...AgriTypography.caption,
    fontSize: 11,
    fontWeight: '700',
  },
});
