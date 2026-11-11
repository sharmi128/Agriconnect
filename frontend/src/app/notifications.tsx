import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PaddyBackground } from '@/components/agri/paddy-background';
import { AuthHeader } from '@/components/auth/auth-header';
import { NotificationCard } from '@/components/notifications/notification-card';
import { NotificationFilterTabs } from '@/components/notifications/notification-filter-tabs';
import { Button } from '@/components/ui/button';
import { AgriTypography } from '@/constants/agri-theme';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import {
  countUnread,
  filterOptionFor,
  getNotifications,
  notificationsInCategory,
  type FarmNotification,
  type NotificationFilter,
} from '@/models/notifications';

/**
 * Alerts & Notifications, opened from the Alerts card on the Home dashboard.
 *
 * The farmer can filter the list by category with the pills, and tap any
 * notification to mark it read or unread. The header counts what is left, and
 * the button clears the lot in one go.
 *
 * All content is local demo data. Read state lives in this screen rather than
 * the model, because it is per-device and has nowhere to be stored yet.
 */
export default function NotificationsScreen() {
  const colors = useAgriTheme();
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<NotificationFilter>('all');
  const [readIds, setReadIds] = useState<ReadonlySet<string>>(() => new Set<string>());

  const notifications = getNotifications();
  const unreadTotal = countUnread(notifications, readIds);
  const visible = notificationsInCategory(notifications, filter);
  const activeOption = filterOptionFor(filter);

  /** Taps flip a single notification between read and unread. */
  function handleNotificationPress(notification: FarmNotification) {
    setReadIds((current) => {
      const next = new Set(current);

      if (next.has(notification.id)) {
        next.delete(notification.id);
      } else {
        next.add(notification.id);
      }

      return next;
    });
  }

  /** Marks the whole list read, whichever filter is showing. */
  function handleMarkAllRead() {
    setReadIds(new Set(notifications.map((notification) => notification.id)));
  }

  return (
    <PaddyBackground>
      <View style={styles.flex}>
        <View style={[styles.header, { paddingTop: insets.top + Spacing.two }]}>
          <View style={styles.inner}>
            <AuthHeader
              title="Alerts & Notifications"
              subtitle={
                unreadTotal > 0
                  ? `${unreadTotal} unread of ${notifications.length}`
                  : `You are all caught up, ${notifications.length} total`
              }
              onBack={() => router.back()}
            />
          </View>
        </View>

        <ScrollView
          testID="notifications-screen"
          style={styles.flex}
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.four }]}>
          <View style={styles.inner}>
            {/* ✅ Clears the unread badge on every filter at once. */}
            <Button
              label={'✅  Mark all as read'}
              variant="secondary"
              onPress={handleMarkAllRead}
              disabled={unreadTotal === 0}
              testID="mark-all-read"
            />

            <NotificationFilterTabs
              value={filter}
              onChange={setFilter}
              notifications={notifications}
              readIds={readIds}
            />

            <Text style={[styles.resultCount, { color: colors.textSecondary }]}>
              {visible.length === 0
                ? 'Nothing to show'
                : `${visible.length} ${activeOption.label.toLowerCase()}`}
            </Text>

            {visible.length === 0 ? (
              <View style={[styles.empty, { borderColor: colors.border }]}>
                <Text style={styles.emptyEmoji}>{'\u{1F514}'}</Text>
                <Text style={[styles.emptyTitle, { color: colors.text }]}>
                  {filter === 'all' ? 'No notifications' : `No ${activeOption.label.toLowerCase()}`}
                </Text>
                <Text style={[styles.emptyBody, { color: colors.textSecondary }]}>
                  {filter === 'all'
                    ? 'New alerts and reminders will show up here.'
                    : 'Nothing new in this category right now.'}
                </Text>
              </View>
            ) : (
              visible.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  isRead={readIds.has(notification.id)}
                  onPress={handleNotificationPress}
                />
              ))
            )}
          </View>
        </ScrollView>
      </View>
    </PaddyBackground>
  );
}


const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.three,
  },
  inner: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    gap: Spacing.three,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
  },
  resultCount: {
    ...AgriTypography.caption,
  },
  empty: {
    alignItems: 'center',
    gap: 6,
    paddingVertical: Spacing.five,
    paddingHorizontal: Spacing.three,
    borderRadius: 20,
    borderWidth: 1,
  },
  emptyEmoji: {
    fontSize: 28,
    lineHeight: 36,
  },
  emptyTitle: {
    ...AgriTypography.subtitle,
    fontWeight: '700',
    textAlign: 'center',
  },
  emptyBody: {
    ...AgriTypography.caption,
    fontWeight: '400',
    textAlign: 'center',
  },
});
