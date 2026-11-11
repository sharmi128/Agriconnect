/**
 * Weather and crop condition model.
 *
 * This file is the single place the Weather screen reads from. The screen never
 * builds its own data, so replacing the demo values with a real call is a change
 * to `getWeatherReport()` only. See the note on that function for the shape a
 * weather endpoint is expected to return.
 *
 * Crop names and field names line up with `DEMO_FARM`, so the conditions on this
 * screen match the crops the farmer actually has on the My Farm page.
 */

/** How urgent a weather alert is. */
export type WeatherSeverity = 'info' | 'warning' | 'severe';

/** Simple label describing how a crop is doing. */
export type CropStatus = 'Excellent' | 'Good' | 'Watch' | 'At risk';

/** One reading in the metrics row, such as humidity. */
export type WeatherMetric = {
  /** Matches the emoji the screen shows, and gives the card a stable key. */
  key: string;
  emoji: string;
  label: string;
  value: string;
  /** Plain-language meaning of the reading, so a farmer can act on it. */
  note: string;
};

/** What the weather is doing right now. */
export type CurrentWeather = {
  location: string;
  condition: string;
  emoji: string;
  temperature: string;
  feelsLike: string;
  high: string;
  low: string;
  /** When this reading was taken, shown under the hero card. */
  updatedAt: string;
  /** Temperature, humidity and rain chance, in the order they are shown. */
  metrics: WeatherMetric[];
};

/** How one crop in one field is doing, given the weather. */
export type CropCondition = {
  id: string;
  emoji: string;
  crop: string;
  field: string;
  status: CropStatus;
  /** Why it has that status. */
  note: string;
};

/** One warning worth acting on. */
export type WeatherAlert = {
  id: string;
  severity: WeatherSeverity;
  emoji: string;
  title: string;
  detail: string;
  /** When it applies, for example "Today, 2 PM to 6 PM". */
  validFor: string;
};

/** One day of the five day forecast. */
export type DailyForecast = {
  day: string;
  date: string;
  emoji: string;
  condition: string;
  high: string;
  low: string;
  rainChance: string;
};

/** Everything the Weather screen needs, in one object. */
export type WeatherReport = {
  current: CurrentWeather;
  crops: CropCondition[];
  alerts: WeatherAlert[];
  forecast: DailyForecast[];
};

/**
 * Demo weather for a coastal farming area, with crops that match `DEMO_FARM`.
 */
export const DEMO_WEATHER_REPORT: WeatherReport = {
  current: {
    location: 'Nagercoil',
    condition: 'Partly Cloudy',
    emoji: '\u{1F324}\uFE0F',
    temperature: '28°C',
    feelsLike: '30°C',
    high: '30°C',
    low: '24°C',
    updatedAt: 'Updated 8:15 AM',
    metrics: [
      {
        key: 'temperature',
        emoji: '\u{1F321}\uFE0F',
        label: 'Temperature',
        value: '28°C',
        note: 'Feels like 30°C. Warm enough for field work before 11 AM.',
      },
      {
        key: 'humidity',
        emoji: '\u{1F4A7}',
        label: 'Humidity',
        value: '65%',
        note: 'Good for paddy. Watch for fungal spots on tomato.',
      },
      {
        key: 'rainChance',
        emoji: '\u{1F327}\uFE0F',
        label: 'Rain Chance',
        value: '20%',
        note: 'Low for now. Rain likely on Wednesday.',
      },
    ],
  },

  crops: [
    {
      id: 'condition-paddy-north',
      emoji: '\u{1F33E}',
      crop: 'Paddy',
      field: 'North Field',
      status: 'Excellent',
      note: 'Standing water is at the right level and rain is on the way.',
    },
    {
      id: 'condition-tomato-east',
      emoji: '\u{1F345}',
      crop: 'Tomato',
      field: 'East Field',
      status: 'Watch',
      note: 'High humidity after rain. Check leaves for early blight.',
    },
    {
      id: 'condition-paddy-whole',
      emoji: '\u{1F33F}',
      crop: 'Paddy',
      field: 'East Field edge',
      status: 'Good',
      note: 'Tillering well. No action needed this week.',
    },
    {
      id: 'condition-coconut-south',
      emoji: '\u{1F965}',
      crop: 'Coconut',
      field: 'South Field',
      status: 'At risk',
      note: 'Strong winds expected. Tie young fronds to the trunk.',
    },
  ],

  alerts: [
    {
      id: 'alert-heavy-rain',
      severity: 'severe',
      emoji: '\u{26A0}\uFE0F',
      title: 'Heavy rain expected Wednesday',
      detail:
        'Around 60 mm is forecast. Open the field drains today so water does not stand against the paddy bunds.',
      validFor: 'Wednesday, 6 AM to 8 PM',
    },
    {
      id: 'alert-wind',
      severity: 'warning',
      emoji: '\u{1F32C}\uFE0F',
      title: 'Strong winds on Thursday',
      detail:
        'Gusts up to 40 km/h. Stake tall crops and secure any stored sacks and sheets.',
      validFor: 'Thursday, 12 PM to 6 PM',
    },
    {
      id: 'alert-spray',
      severity: 'info',
      emoji: '\u{1F4A1}',
      title: 'Good spraying window today',
      detail: 'No rain and low wind until 2 PM. Best time to spray the tomato field.',
      validFor: 'Today, until 2 PM',
    },
  ],

  forecast: [
    {
      day: 'Today',
      date: '28 Sep',
      emoji: '\u{1F324}\uFE0F',
      condition: 'Partly Cloudy',
      high: '30°',
      low: '24°',
      rainChance: '20%',
    },
    {
      day: 'Tue',
      date: '29 Sep',
      emoji: '\u{1F326}\uFE0F',
      condition: 'Sunny',
      high: '31°',
      low: '25°',
      rainChance: '10%',
    },
    {
      day: 'Wed',
      date: '30 Sep',
      emoji: '\u{1F327}\uFE0F',
      condition: 'Heavy Rain',
      high: '27°',
      low: '23°',
      rainChance: '90%',
    },
    {
      day: 'Thu',
      date: '1 Oct',
      emoji: '\u{1F32C}\uFE0F',
      condition: 'Windy',
      high: '28°',
      low: '24°',
      rainChance: '45%',
    },
    {
      day: 'Fri',
      date: '2 Oct',
      emoji: '\u{1F326}\uFE0F',
      condition: 'Sunny',
      high: '30°',
      low: '24°',
      rainChance: '15%',
    },
  ],
};

/**
 * Returns everything the Weather screen needs.
 *
 * This is the seam for a real weather API. Today it returns
 * `DEMO_WEATHER_REPORT`; when the backend is ready, replace the body with a
 * call to a service such as `fetchWeatherReport()` and return its response,
 * which is expected to match the `WeatherReport` type above. The screen and its
 * cards do not need to change.
 */
export function getWeatherReport(): WeatherReport {
  return DEMO_WEATHER_REPORT;
}
