/**
 * Alerts and notifications model, plus the demo content for the screen.
 *
 * This file is the single place the Alerts screen reads from, the same way
 * `models/weather.ts` works. The screen never builds its own data, so swapping
 * the demo list for a real notifications endpoint is a change to
 * `getNotifications()` only.
 *
 * Read state is deliberately not stored here. It is per-device, changes as the
 * farmer taps things, and belongs in the screen until there is an account to
 * sync it with. The demo data therefore starts with everything unread.
 */

/** The kind of update a notification belongs to. */
export type NotificationCategory =
  | 'weather'
  | 'crop'
  | 'water'
  | 'harvest'
  | 'machinery'
  | 'update';

/** Which slice of the list the farmer is looking at. `all` shows everything. */
export type NotificationFilter = 'all' | NotificationCategory;

/** How pressing a notification is. */
export type NotificationPriority = 'urgent' | 'normal';

/** One alert, reminder or update in the list. */
export type FarmNotification = {
  id: string;
  category: NotificationCategory;
  /** Shown in the round badge on the left of the card. */
  emoji: string;
  title: string;
  /** Two lines at most, so a card never grows taller than its neighbours. */
  detail: string;
  /** How long ago it was raised, for example "2 hours ago". */
  timeAgo: string;
  priority: NotificationPriority;
  /** The crop or field it concerns, shown as a chip. Absent for news. */
  crop?: string;
};

/** One pill in the filter row. */
export type NotificationFilterOption = {
  key: NotificationFilter;
  emoji: string;
  label: string;
};

/**
 * The filter row: All Notifications first, then one per category in the order
 * they appear on the screen.
 */
export const NOTIFICATION_FILTERS: readonly NotificationFilterOption[] = [
  { key: 'all', emoji: '\u{1F514}', label: 'All Notifications' },
  { key: 'weather', emoji: '\u{1F327}\uFE0F', label: 'Weather Alerts' },
  { key: 'crop', emoji: '\u{1F331}', label: 'Crop Updates' },
  { key: 'water', emoji: '\u{1F4A7}', label: 'Water Reminders' },
  { key: 'harvest', emoji: '\u{1F33E}', label: 'Harvest Reminders' },
  { key: 'machinery', emoji: '\u{1F69C}', label: 'Machinery Updates' },
  { key: 'update', emoji: '\u{1F4E2}', label: 'Important Updates' },
];

/**
 * Demo notifications for a coastal farming area, newest first.
 *
 * Crops and fields match `DEMO_FARM` and the weather model, so a farmer reading
 * the alerts sees the same paddy, tomato and coconut they see everywhere else.
 */
export const DEMO_NOTIFICATIONS: readonly FarmNotification[] = [
  {
    id: 'harvest-window-paddy',
    category: 'harvest',
    emoji: '\u{1F33E}',
    title: 'Paddy harvest window opens in 3 weeks',
    detail:
      'Grain is at 68% maturity on North Field. Book a thresher and confirm labour before the window opens.',
    timeAgo: '30 minutes ago',
    priority: 'urgent',
    crop: 'Paddy',
  },
  {
    id: 'paddy-irrigation-due',
    category: 'water',
    emoji: '\u{1F4A7}',
    title: 'Irrigate North Field paddy today',
    detail:
      'It has been 4 days since the last irrigation. Keep standing water at 5 cm to slow down weeds.',
    timeAgo: '6 hours ago',
    priority: 'normal',
    crop: 'Paddy',
  },
  {
    id: 'paddy-tillering',
    category: 'crop',
    emoji: '\u{1F331}',
    title: 'Paddy has finished tillering',
    detail:
      'Your North Field paddy is 45 days old and has finished tillering. Expect panicles in about 10 days.',
    timeAgo: '2 hours ago',
    priority: 'normal',
    crop: 'Paddy',
  },
  {
    id: 'heavy-rain-warning',
    category: 'weather',
    emoji: '\u{1F327}\uFE0F',
    title: 'Heavy rain expected tomorrow',
    detail:
      'Around 60 mm is forecast for Wednesday. Open the field drains today so water does not stand against the bunds.',
    timeAgo: '1 hour ago',
    priority: 'urgent',
    crop: 'Paddy',
  },
  {
    id: 'tomato-picking',
    category: 'harvest',
    emoji: '\u{1F345}',
    title: 'Tomato picking round due tomorrow',
    detail:
      'Fruit on the first plants has ripened. Pick early in the morning and keep the crates in shade.',
    timeAgo: '4 hours ago',
    priority: 'normal',
    crop: 'Tomato',
  },
  {
    id: 'wind-advisory',
    category: 'weather',
    emoji: '\u{1F32C}\uFE0F',
    title: 'Strong winds on Thursday',
    detail:
      'Gusts up to 40 km/h. Stake tall crops and secure any stored sacks and covers.',
    timeAgo: '3 hours ago',
    priority: 'normal',
  },
  {
    id: 'tomato-blight-watch',
    category: 'crop',
    emoji: '\u{1F331}',
    title: 'Watch for early blight on tomato',
    detail:
      'Humidity has stayed above 80% for two nights. Check lower leaves on East Field for brown spots with yellow halos.',
    timeAgo: '7 hours ago',
    priority: 'urgent',
    crop: 'Tomato',
  },
  {
    id: 'spray-window',
    category: 'weather',
    emoji: '\u{1F4A1}',
    title: 'Good spraying window today',
    detail:
      'No rain and low wind until 2 PM. Best time to spray the tomato field.',
    timeAgo: '5 hours ago',
    priority: 'normal',
    crop: 'Tomato',
  },
  {
    id: 'canal-maintenance',
    category: 'water',
    emoji: '\u{1F6E0}\uFE0F',
    title: 'Canal cleaning is scheduled for Friday',
    detail:
      'The south canal closes from Friday to Sunday. Store enough water for the coconut field before then.',
    timeAgo: '1 day ago',
    priority: 'urgent',
    crop: 'Coconut',
  },
  {
    id: 'subsidy-scheme',
    category: 'update',
    emoji: '\u{1F4E2}',
    title: 'Fertilizer subsidy applications open Friday',
    detail:
      'Applications for the fertilizer subsidy scheme open on Friday and close in two weeks. Submit at the block office.',
    timeAgo: '1 day ago',
    priority: 'normal',
  },
  {
    id: 'pump-repair',
    category: 'machinery',
    emoji: '\u{1F6E0}\uFE0F',
    title: 'Water pump is out of service',
    detail:
      'The 5 HP pump at the north borewell has stopped. The coconut field has no irrigation until it is repaired.',
    timeAgo: '2 days ago',
    priority: 'urgent',
  },
  {
    id: 'market-price',
    category: 'update',
    emoji: '\u{1F4E2}',
    title: 'Paddy price up 6% this week',
    detail:
      'The local market rate moved to ₹25.50 per kg. A good time to talk to the buyers on your list.',
    timeAgo: '2 days ago',
    priority: 'normal',
    crop: 'Paddy',
  },
  {
    id: 'tiller-service-due',
    category: 'machinery',
    emoji: '\u{1F69C}',
    title: 'Tiller service due in 50 hours',
    detail:
      'The tiller on hire has run 310 hours. Book the service before the next round of land preparation.',
    timeAgo: '8 hours ago',
    priority: 'normal',
  },
];

/**
 * Returns everything the Alerts screen needs.
 *
 * This is the seam for a real notifications endpoint. Today it returns
 * `DEMO_NOTIFICATIONS`; when the backend is ready, replace the body with a call
 * to a service such as `fetchNotifications()` and return its response, which is
 * expected to match the `FarmNotification` type above.
 */
export function getNotifications(): readonly FarmNotification[] {
  return DEMO_NOTIFICATIONS;
}

/** The pills for one filter, looked up by key. */
export function filterOptionFor(key: NotificationFilter): NotificationFilterOption {
  return (
    NOTIFICATION_FILTERS.find((option) => option.key === key) ?? NOTIFICATION_FILTERS[0]
  );
}

/** The notifications a filter shows. `all` keeps the demo order as-is. */
export function notificationsInCategory(
  notifications: readonly FarmNotification[],
  filter: NotificationFilter,
): FarmNotification[] {
  if (filter === 'all') {
    return [...notifications];
  }

  return notifications.filter((notification) => notification.category === filter);
}

/** How many notifications the farmer has not read yet, in total. */
export function countUnread(
  notifications: readonly FarmNotification[],
  readIds: ReadonlySet<string>,
): number {
  return notifications.filter((notification) => !readIds.has(notification.id)).length;
}

/** How many unread notifications a single filter pill is hiding. */
export function countUnreadInFilter(
  notifications: readonly FarmNotification[],
  readIds: ReadonlySet<string>,
  filter: NotificationFilter,
): number {
  return countUnread(notificationsInCategory(notifications, filter), readIds);
}
