import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AgriRadius, AgriTypography } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import {
  countUnreadInFilter,
  NOTIFICATION_FILTERS,
  type FarmNotification,
  type NotificationFilter,
} from '@/models/notifications';

type NotificationFilterTabsProps = {
  value: NotificationFilter;
  onChange: (value: NotificationFilter) => void;
  notifications: readonly FarmNotification[];
  /** Already-read ids, used to badge each pill with what it is hiding. */
  readIds: ReadonlySet<string>;
};

/**
 * Filter pills for the alerts list: All Notifications, then one per category.
 *
 * The row scrolls sideways so all seven stay reachable on a small phone, and
 * each pill shows how many unread items it holds, so the farmer can see where
 * the new messages are before switching.
 */
export function NotificationFilterTabs({
  value,
  onChange,
  notifications,
  readIds,
}: NotificationFilterTabsProps) {
  const colors = useAgriTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}>
      {NOTIFICATION_FILTERS.map((option) => {
        const isActive = option.key === value;
        const unread = countUnreadInFilter(notifications, readIds, option.key);

        return (
          <Pressable
            key={option.key}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={
              unread > 0 ? `${option.label}, ${unread} unread` : `${option.label}, none unread`
            }
            onPress={() => onChange(option.key)}
            style={({ pressed }) => [
              styles.pill,
              isActive
                ? { backgroundColor: colors.primary, borderColor: colors.primary }
                : { backgroundColor: colors.surface, borderColor: colors.border },
              pressed && styles.pillPressed,
            ]}>
            <Text style={styles.emoji}>{option.emoji}</Text>

            <Text
              style={[
                styles.label,
                { color: isActive ? colors.onPrimary : colors.textSecondary },
              ]}
              numberOfLines={1}>
              {option.label}
            </Text>

            {unread > 0 ? (
              <View
                style={[
                  styles.unreadBadge,
                  {
                    backgroundColor: isActive ? colors.onPrimary : colors.primary,
                  },
                ]}>
                <Text
                  style={[
                    styles.unreadText,
                    { color: isActive ? colors.primary : colors.onPrimary },
                  ]}>
                  {unread}
                </Text>
              </View>
            ) : null}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: Spacing.two,
    paddingVertical: Spacing.one,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: AgriRadius.pill,
    borderWidth: 1,
  },
  pillPressed: {
    opacity: 0.8,
  },
  emoji: {
    fontSize: 14,
    lineHeight: 20,
  },
  label: {
    ...AgriTypography.label,
    fontWeight: '700',
  },
  unreadBadge: {
    minWidth: 20,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: AgriRadius.pill,
    alignItems: 'center',
  },
  unreadText: {
    ...AgriTypography.caption,
    fontSize: 11,
    fontWeight: '700',
  },
});
