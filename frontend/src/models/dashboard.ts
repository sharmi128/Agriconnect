/**
 * Home Dashboard data model and demo data.
 *
 * Everything here is local placeholder data. When the Spring Boot backend is
 * ready, each block below becomes a fetch, and the shapes can stay the same so
 * the dashboard components do not have to change.
 */

import { DEMO_AGRI_PRODUCTS } from '@/models/agri-store';
import { DEMO_BUYERS } from '@/models/buyer-connection';
// The same helper the Expenses screen formats its totals with, so a rupee
// amount reads identically on the card and on the screen it opens.
import { formatRupees } from '@/models/expenses';
import { DEMO_LAND_LISTINGS } from '@/models/nearby-land';
import { DEMO_MACHINE_LISTINGS } from '@/models/machinery-marketplace';
import { DEMO_NOTIFICATIONS } from '@/models/notifications';

/** One day in the short weather forecast. */
export type ForecastDay = {
  day: string;
  icon: string;
  high: string;
  low: string;
};

/** The weather block at the top of the dashboard. */
export type WeatherSummary = {
  /** Big temperature, for example "28°C". */
  temperature: string;
  /** Short description, for example "Partly Cloudy". */
  condition: string;
  feelsLike: string;
  humidity: string;
  wind: string;
  rainChance: string;
  forecast: ForecastDay[];
};

/**
 * One tappable dashboard card.
 *
 * `href` records the screen the card opens. Every card has one, so a card can
 * never look tappable and do nothing.
 */
export type DashboardFeature = {
  id: string;
  emoji: string;
  title: string;
  /** The headline number or status, for example "4,250". */
  value: string;
  /** Small supporting line under the value. */
  caption: string;
  /** Intended future route, for example "/water". */
  href: string;
};

/** Demo weather for a coastal farming area. */
export const DEMO_WEATHER: WeatherSummary = {
  temperature: '28°C',
  condition: 'Partly Cloudy',
  feelsLike: '30°C',
  humidity: '65%',
  wind: '12 km/h',
  rainChance: '20%',
  forecast: [
    { day: 'Mon', icon: '🌤️', high: '30°', low: '24°' },
    { day: 'Tue', icon: '🌦️', high: '29°', low: '23°' },
    { day: 'Wed', icon: '🌧️', high: '27°', low: '22°' },
    { day: 'Thu', icon: '⛅', high: '31°', low: '24°' },
  ],
};

/**
 * The ten feature cards below the weather summary.
 *
 * Weather is not in this list because it gets its own larger card.
 */
const DEMO_FEATURES: DashboardFeature[] = [
  {
    id: 'currentCrop',
    emoji: '🌱',
    title: 'My Farm',
    value: 'Paddy',
    caption: 'Your fields and crops',
    href: '/farm',
  },
  {
    id: 'alerts',
    emoji: '🔔',
    title: 'Alerts',
    value: '13 Alerts',
    caption: 'Weather, water and harvest',
    href: '/notifications',
  },
  {
    id: 'waterStatus',
    emoji: '💧',
    title: 'Water Status',
    value: 'Adequate',
    caption: 'Next check in 2 days',
    href: '/water',
  },
  {
    id: 'machinery',
    emoji: '🚜',
    title: 'Machinery',
    value: '2 Available',
    caption: 'Rent or buy near you',
    href: '/machinery-marketplace',
  },
  {
    id: 'nearbyLand',
    emoji: '🏞️',
    title: 'Nearby Land',
    value: '3 Plots',
    caption: 'Rent or buy near you',
    href: '/nearby-land',
  },
  {
    id: 'guide',
    emoji: '📚',
    title: 'Farming Guide',
    value: '6 Articles',
    caption: 'Tips picked for your crop',
    href: '/guide',
  },
  {
    id: 'store',
    emoji: '🛒',
    title: 'Agri Store',
    value: '12 Offers',
    caption: 'Seeds, fertilizer and tools',
    href: '/agri-store',
  },
  {
    id: 'expenses',
    emoji: '💰',
    title: 'Expenses',
    value: '4,250',
    caption: 'Spent this month',
    href: '/expenses',
  },
  {
    id: 'harvest',
    emoji: '🌾',
    title: 'Harvest',
    value: '68% Ready',
    caption: 'Expected in 3 weeks',
    href: '/harvest',
  },
  {
    id: 'buyerConnection',
    emoji: '🤝',
    title: 'Buyer Connection',
    value: '5 Buyers',
    caption: 'Offers for your harvest',
    href: '/buyer-connection',
  },
];

/**
 * The figures the farmer's own records contribute to the dashboard.
 *
 * Both come from the shared contexts, which are saved to the device, so a card
 * keeps reporting the same number after the app is reopened. They are passed in
 * rather than read here, so this model stays free of React and of storage.
 */
export type DashboardRecords = {
  /** Names of the crops growing in the farmer's fields, without duplicates. */
  farmCrops: string[];
  /** Spending recorded in the current month, in rupees. */
  monthSpend: number;
  /** How many entries that monthly figure was worked out from. */
  monthEntryCount: number;
};

/**
 * Builds the card list for the dashboard.
 *
 * The My Farm card reads the crop from the farmer profile, falling back to the
 * first crop actually growing in their fields, so the card never promises a crop
 * the farm does not have. The Farming Guide card takes its count from the guide
 * itself, the Alerts card counts the notifications in `models/notifications.ts`,
 * and the Buyer Connection, Machinery, Nearby Land and Agri Store cards count the
 * listings in their own demo models, so no card can promise more than its screen
 * can show. The Expenses card reports the farmer's own recorded spending for the
 * current month, and says so when there is none yet. The other cards use the
 * demo values above.
 */
export function buildDashboardFeatures(
  mainCrop: string,
  guideArticleCount: number,
  records: DashboardRecords
): DashboardFeature[] {
  return DEMO_FEATURES.map((feature) => {
    if (feature.id === 'currentCrop') {
      return {
        ...feature,
        value: mainCrop || records.farmCrops[0] || feature.value,
        caption: records.farmCrops.length > 0 ? records.farmCrops.join(', ') : feature.caption,
      };
    }

    if (feature.id === 'guide') {
      return { ...feature, value: `${guideArticleCount} Articles` };
    }

    if (feature.id === 'alerts') {
      return { ...feature, value: `${DEMO_NOTIFICATIONS.length} Alerts` };
    }

    if (feature.id === 'buyerConnection') {
      return { ...feature, value: `${DEMO_BUYERS.length} Buyers` };
    }

    if (feature.id === 'machinery') {
      return { ...feature, value: `${DEMO_MACHINE_LISTINGS.length} Machines` };
    }

    if (feature.id === 'nearbyLand') {
      return { ...feature, value: `${DEMO_LAND_LISTINGS.length} Plots` };
    }

    if (feature.id === 'store') {
      return { ...feature, value: `${DEMO_AGRI_PRODUCTS.length} Products` };
    }

    if (feature.id === 'expenses') {
      const { monthEntryCount } = records;

      return {
        ...feature,
        value: monthEntryCount > 0 ? formatRupees(records.monthSpend) : '₹0',
        caption:
          monthEntryCount > 0
            ? `${monthEntryCount} ${
                monthEntryCount === 1 ? 'entry' : 'entries'
              } this month`
            : 'Nothing recorded this month',
      };
    }

    return feature;
  });
}

/**
 * Greets the farmer according to the time of day.
 * Morning is 5-11, afternoon is 12-17, and everything else is evening.
 */
export function getGreeting(date: Date = new Date()): string {
  const hour = date.getHours();

  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/**
 * Formats today as "Monday, 12 May".
 *
 * Uses plain arrays instead of `toLocaleDateString` so the output is the same on
 * every device and needs no locale data.
 */
export function formatToday(date: Date = new Date()): string {
  return `${WEEKDAYS[date.getDay()]}, ${date.getDate()} ${MONTHS[date.getMonth()]}`;
}

/**
 * Splits a flat list into rows of `size`, so a grid can be laid out with
 * flex rows instead of percentage widths, which overflow on narrow screens.
 */
export function chunk<T>(items: T[], size: number): T[][] {
  const rows: T[][] = [];

  for (let index = 0; index < items.length; index += size) {
    rows.push(items.slice(index, index + size));
  }

  return rows;
}
