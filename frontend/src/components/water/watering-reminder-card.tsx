import { Pressable, StyleSheet, Text, View } from 'react-native';

import { SectionCard } from '@/components/ui/section-card';
import { AgriRadius, AgriTypography } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import type { ReminderPriority, WateringReminder } from '@/models/water-management';

type WateringReminderCardProps = {
  /** The reminders, already ordered by `remindersInOrder`. */
  reminders: readonly WateringReminder[];
  /** Which reminders the farmer has ticked off this session. */
  doneIds: readonly string[];
  onToggle: (reminder: WateringReminder) => void;
};

/**
 * 📅 Watering Reminder, one row per field still waiting.
 *
 * This is the one card on the screen the farmer acts on rather than reads, so each
 * row is a single tap target: tapping marks the field watered and moves it to the
 * bottom. Nothing is scheduled anywhere — a ticked row is only ticked for this
 * visit, because a reminder that quietly resets is worse than one that admits it
 * is local.
 */
export function WateringReminderCard({ reminders, doneIds, onToggle }: WateringReminderCardProps) {
  const colors = useAgriTheme();
  const allDone = reminders.length > 0 && reminders.every((r) => doneIds.includes(r.id));

  return (
    <SectionCard
      title="📅 Watering Reminder"
      subtitle="Tap a field when it has been watered. Nothing is sent — this list resets next time you open the app."
      testID="watering-reminder-card">
      {allDone ? (
        <View
          testID="watering-reminder-all-done"
          style={[
            styles.allDone,
            { backgroundColor: colors.primarySoft, borderColor: colors.primary },
          ]}>
          <Text style={styles.allDoneEmoji}>{'\u2705'}</Text>

          <View style={styles.copy}>
            <Text style={[styles.allDoneTitle, { color: colors.primaryDark }]}>
              Every field is watered
            </Text>
            <Text style={[styles.instruction, { color: colors.textSecondary }]}>
              Nothing left for today. Check back tomorrow, or after it rains.
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.list}>
        {reminders.map((reminder, index) => {
          const isDone = doneIds.includes(reminder.id);
          const tone = priorityTone(reminder.priority, colors);

          return (
            <Pressable
              key={reminder.id}
              testID={`water-reminder-${reminder.id}`}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: isDone }}
              accessibilityLabel={`${reminder.fieldName}, ${reminder.crop}, due ${reminder.dueLabel}`}
              onPress={() => onToggle(reminder)}
              style={({ pressed }) => [
                styles.row,
                // A hairline between rows, but not above the first one.
                index > 0 && { borderTopColor: colors.border, borderTopWidth: 1 },
                pressed && styles.pressed,
              ]}>
              <View
                style={[
                  styles.check,
                  isDone
                    ? { backgroundColor: colors.primary, borderColor: colors.primary }
                    : { backgroundColor: colors.surface, borderColor: colors.borderStrong },
                ]}>
                {isDone ? (
                  <Text style={[styles.checkMark, { color: colors.onPrimary }]}>{'\u2713'}</Text>
                ) : null}
              </View>

              <View style={styles.copy}>
                <View style={styles.header}>
                  <Text style={styles.emoji}>{reminder.emoji}</Text>
                  <Text
                    style={[
                      styles.field,
                      { color: colors.text },
                      isDone && styles.fieldDone,
                    ]}
                    numberOfLines={1}>
                    {reminder.fieldName}
                  </Text>

                  {!isDone ? (
                    <View style={[styles.badge, { backgroundColor: tone.soft, borderColor: tone.solid }]}>
                      <Text style={[styles.badgeText, { color: tone.text }]} numberOfLines={1}>
                        {reminder.dueLabel}
                      </Text>
                    </View>
                  ) : null}
                </View>

                <Text
                  style={[
                    styles.instruction,
                    { color: colors.textSecondary },
                    isDone && styles.instructionDone,
                  ]}>
                  {isDone ? `Watered today. ${reminder.instruction}` : reminder.instruction}
                </Text>
                <Text style={[styles.meta, { color: colors.textSecondary }]}>
                  {`${reminder.crop} · due ${reminder.dueOn}`}
                </Text>
              </View>
            </Pressable>
          );
        })}
        </View>
      )}
    </SectionCard>
  );
}

type Tone = {
  soft: string;
  solid: string;
  text: string;
};

/**
 * How urgent a reminder looks.
 *
 * Only "today" gets the warning amber, because that is the one row where waiting
 * costs the crop. A reminder due in five days does not need to look like an
 * emergency, or the farmer stops treating the amber as meaning something.
 */
function priorityTone(priority: ReminderPriority, colors: ReturnType<typeof useAgriTheme>): Tone {
  if (priority === 'today') {
    return { soft: colors.warningSoft, solid: colors.warning, text: colors.warning };
  }

  if (priority === 'soon') {
    return { soft: colors.primarySoft, solid: colors.primary, text: colors.primaryDark };
  }

  return { soft: colors.background, solid: colors.border, text: colors.textSecondary };
}

const styles = StyleSheet.create({
  list: {
    gap: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.three,
    paddingVertical: Spacing.three,
  },
  allDone: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.three,
    borderWidth: 1,
    borderRadius: AgriRadius.medium,
    padding: Spacing.three,
  },
  allDoneEmoji: {
    fontSize: 20,
    lineHeight: 26,
  },
  allDoneTitle: {
    ...AgriTypography.label,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.7,
  },
  check: {
    width: 24,
    height: 24,
    borderRadius: AgriRadius.pill,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: {
    ...AgriTypography.caption,
    fontWeight: '700',
  },
  copy: {
    flex: 1,
    gap: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  emoji: {
    fontSize: 15,
    lineHeight: 21,
  },
  field: {
    ...AgriTypography.label,
    fontWeight: '700',
    flex: 1,
  },
  fieldDone: {
    textDecorationLine: 'line-through',
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
  instruction: {
    ...AgriTypography.caption,
    fontWeight: '400',
    lineHeight: 21,
  },
  instructionDone: {
    fontSize: 12,
  },
  meta: {
    ...AgriTypography.caption,
    fontSize: 12,
  },
});
