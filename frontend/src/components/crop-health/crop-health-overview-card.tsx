import { StyleSheet, Text, View } from 'react-native';

import { SectionCard } from '@/components/ui/section-card';
import { AgriTypography } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import {
  CROP_HEALTH_CROPS,
  CROP_HEALTH_DISCLAIMER,
  CROP_PROBLEMS,
  PREVENTION_TIPS,
  WARNING_SIGNS,
} from '@/models/crop-health';

/**
 * 🌱 The top of the Crop Disease & Pest Guide: what the page covers, and what it
 * will not tell you.
 *
 * The amber notice is the most important thing on the screen and sits above
 * everything else. AgriConnect explains what each problem looks like and what
 * reduces it, but it never names a product, a mixture or an amount, so the
 * farmer is pointed at the people who can: the local agricultural officer and the
 * label on the tin.
 */
export function CropHealthOverviewCard() {
  const colors = useAgriTheme();

  const topics = [
    '\u{1F331} Pick a crop and see what usually troubles it',
    '\u{1F41B} Learn what a pest does to a plant, and how to find it',
    '\u{1F343} Learn what a disease does, and why it follows wet weather',
    '\u26A0\uFE0F Read the signs worth a walk through the field',
    '\u{1F4A1} Build the habits that prevent most of it',
  ];

  return (
    <SectionCard
      title={'\u{1F331} Crop Disease & Pest Guide'}
      subtitle="Spot the problem early, then decide calmly"
      testID="crop-health-overview-card">
      <View style={styles.body}>
        <View
          style={[
            styles.notice,
            { backgroundColor: colors.warningSoft, borderColor: colors.warning },
          ]}>
          <Text style={[styles.noticeTitle, { color: colors.warning }]}>
            {'\u26A0\uFE0F  No sprays, chemicals or dosages'}
          </Text>
          <Text style={[styles.noticeBody, { color: colors.warning }]}>
            {CROP_HEALTH_DISCLAIMER}
          </Text>
        </View>

        <Text style={[styles.intro, { color: colors.textSecondary }]}>
          Most crop trouble is easier to live with than to cure. This guide helps you name what
          you are looking at, catch the warning signs while they are still a patch, and build
          the habits that stop a small problem from becoming a lost season.
        </Text>

        <View style={styles.topics}>
          {topics.map((topic) => (
            <Text key={topic} style={[styles.topicText, { color: colors.text }]}>
              {topic}
            </Text>
          ))}
        </View>

        <Text style={[styles.count, { color: colors.textSecondary }]}>
          {CROP_PROBLEMS.length} common problems across {CROP_HEALTH_CROPS.length} crops, with{' '}
          {WARNING_SIGNS.length} warning signs and {PREVENTION_TIPS.length} prevention habits
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
    lineHeight: 20,
  },
  intro: {
    ...AgriTypography.body,
  },
  topics: {
    gap: Spacing.two,
  },
  topicText: {
    ...AgriTypography.caption,
    fontWeight: '400',
    lineHeight: 22,
  },
  count: {
    ...AgriTypography.caption,
    fontWeight: '400',
  },
});