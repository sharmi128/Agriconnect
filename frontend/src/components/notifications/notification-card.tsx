import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AgriRadius, AgriTypography } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import type { FarmNotification } from '@/models/notifications';

type NotificationCardProps = {
  notification: FarmNotification;
  /** Read notifications fade back so the unread ones stand out. */
  isRead: boolean;
  onPress: (notification: FarmNotification) => void;
};

/**
 * One alert, reminder or update.
 *
 * The whole card is the tap target, and tapping toggles whether the farmer has
 * read it. Unread items get a bolder title, a dot and a stronger border, so the
 * list can be scanned without reading every line. Urgent items are tinted, but
 * the "Urgent" badge is written out too, so colour is never the only signal.
 */
export function NotificationCard({ notification, isRead, onPress }: NotificationCardProps) {
  const colors = useAgriTheme();
  const isUrgent = notification.priority === 'urgent';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: !isRead }}
      accessibilityLabel={[
        notification.title,
        notification.detail,
        notification.timeAgo,
        isUrgent ? 'Urgent' : null,
        isRead ? 'Read' : 'Unread',
      ]
        .filter(Boolean)
        .join('. ')}
      accessibilityHint={`Tap to mark as ${isRead ? 'unread' : 'read'}`}
      onPress={() => onPress(notification)}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: isRead ? colors.background : colors.surface,
          borderColor: isUrgent ? colors.warning : isRead ? colors.border : colors.borderStrong,
        },
        pressed && styles.pressed,
      ]}>
      <View
        style={[
          styles.iconCircle,
          {
            backgroundColor: isUrgent ? colors.warningSoft : colors.primarySoft,
          },
        ]}>
        <Text style={styles.emoji}>{notification.emoji}</Text>
      </View>

      <View style={styles.text}>
        <View style={styles.headerRow}>
          <Text
            style={[
              styles.title,
              {
                color: colors.text,
                fontWeight: isRead ? '500' : '700',
              },
            ]}
            numberOfLines={2}>
            {notification.title}
          </Text>

          {isRead ? null : (
            <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />
          )}
        </View>

        <Text style={[styles.detail, { color: colors.textSecondary }]} numberOfLines={3}>
          {notification.detail}
        </Text>

        <View style={styles.metaRow}>
          <Text style={[styles.time, { color: colors.textSecondary }]} numberOfLines={1}>
            {notification.timeAgo}
          </Text>

          {notification.crop ? (
            <View style={[styles.cropChip, { backgroundColor: colors.primarySoft }]}>
              <Text style={[styles.cropText, { color: colors.primaryDark }]}>
                {notification.crop}
              </Text>
            </View>
          ) : null}

          {isUrgent ? (
            <View style={[styles.urgentChip, { backgroundColor: colors.warningSoft }]}>
              <Text style={[styles.urgentText, { color: colors.warning }]}>Urgent</Text>
            </View>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: AgriRadius.large,
    borderWidth: 1,
  },
  pressed: {
    opacity: 0.7,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 20,
    lineHeight: 26,
  },
  text: {
    flex: 1,
    gap: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.two,
  },
  title: {
    flex: 1,
    ...AgriTypography.label,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
  },
  detail: {
    ...AgriTypography.caption,
    fontWeight: '400',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 2,
  },
  time: {
    ...AgriTypography.caption,
    fontSize: 12,
  },
  cropChip: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: AgriRadius.pill,
  },
  cropText: {
    ...AgriTypography.caption,
    fontSize: 11,
    fontWeight: '700',
  },
  urgentChip: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: AgriRadius.pill,
  },
  urgentText: {
    ...AgriTypography.caption,
    fontSize: 11,
    fontWeight: '700',
  },
});
