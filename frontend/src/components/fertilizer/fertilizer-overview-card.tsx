import { StyleSheet, Text, View } from 'react-native';

import { SectionCard } from '@/components/ui/section-card';
import { AgriTypography } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import { FERTILIZER_DISCLAIMER, FERTILIZER_TYPES } from '@/models/fertilizer-guide';

/**
 * 🧪 The top of the Fertilizer Guide: what the page covers, and what it will not
 * tell you.
 *
 * The amber notice is the most important thing on the screen and sits above
 * everything else. AgriConnect explains what each input does and when a crop is
 * likely to need it, but it never names a product or a quantity, so the farmer
 * is pointed at the people who can: the local agricultural officer and the label
 * on the bag. The note is repeated on the growth stage card, because that is
 * where a farmer is most likely to be looking for a number.
 */
export function FertilizerOverviewCard() {
  const colors = useAgriTheme();

  const topics = [
    '\u{1F331} Pick a crop to see how it generally feeds',
    '\u{1F33F} Learn what each growth stage is doing',
    '\u{1F7E4} Compare soils, and how water changes things',
    '\u{1F9EA} Read organic, compost and bio-fertilizers',
  ];

  return (
    <SectionCard
      title="\u{1F9EA} Fertilizer Guide"
      subtitle="Feed the soil, feed the crop, and keep the cost down"
      testID="fertilizer-overview-card">
      <View style={styles.body}>
        <View style={[styles.notice, { backgroundColor: colors.warningSoft, borderColor: colors.warning }]}>
          <Text style={[styles.noticeTitle, { color: colors.warning }]}>
            {'\u26A0\uFE0F  No dosages in this guide'}
          </Text>
          <Text style={[styles.noticeBody, { color: colors.warning }]}>{FERTILIZER_DISCLAIMER}</Text>
        </View>

        <Text style={[styles.intro, { color: colors.textSecondary }]}>
          Fertilizer is not one thing. It is a family of materials, each doing a
          different job in the soil and in the plant. This guide explains what each
          one does, so you can tell your local expert what you have seen in the
          field and get an answer that fits your land.
        </Text>

        <View style={styles.topics}>
          {topics.map((topic) => (
            <View key={topic} style={styles.topicRow}>
              <Text style={[styles.topicText, { color: colors.text }]}>{topic}</Text>
            </View>
          ))}
        </View>

        <Text style={[styles.count, { color: colors.textSecondary }]}>
          {FERTILIZER_TYPES.length} fertilizer types, explained in plain language
        </Text>
      </View>
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  body: {
    gap: Spacing.three,
  },
  notice: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 6,
  },
  noticeTitle: {
    ...AgriTypography.label,
  },
  noticeBody: {
    ...AgriTypography.caption,
    fontWeight: '400',
  },
  intro: {
    ...AgriTypography.body,
  },
  topics: {
    gap: Spacing.two,
  },
  topicRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  topicText: {
    ...AgriTypography.caption,
    fontWeight: '400',
    flex: 1,
    lineHeight: 22,
  },
  count: {
    ...AgriTypography.caption,
    fontWeight: '400',
  },
});
