/**
 * Farming Guide model and demo content.
 *
 * The guide is organised into seven categories. Each category has a set of
 * short articles, and every article lists the crops it applies to so the search
 * bar can answer "how do I grow paddy?" as well as "show me water articles".
 *
 * All content is local demo data. There is no API call, and the article shape
 * is what a content endpoint is expected to return later.
 */

export type GuideCategoryId =
  | 'crop-guides'
  | 'growing-tips'
  | 'growth-stages'
  | 'water'
  | 'fertilizer'
  | 'crop-health'
  | 'weather'
  | 'farming-tips';

/**
 * The one category that is a screen of its own.
 *
 * Every other category expands in place and shows a list of articles. The
 * Fertilizer Guide is too long for that, so it has its own route and this id is
 * what the Farming Guide tab checks to decide between expanding and pushing.
 */
export const FERTILIZER_CATEGORY_ID: GuideCategoryId = 'fertilizer';

/**
 * The second category that is a screen of its own.
 *
 * The Crop Disease & Pest Guide is a page of problem cards, a pest section, a
 * disease section and two lists, which is far more than a row of articles can
 * hold, so it opens its own route the same way the Fertilizer Guide does.
 */
export const CROP_HEALTH_CATEGORY_ID: GuideCategoryId = 'crop-health';

export type GuideCategory = {
  id: GuideCategoryId;
  emoji: string;
  title: string;
  subtitle: string;
};

export type GuideArticle = {
  id: string;
  category: GuideCategoryId;
  /** Crops this article applies to. Used by the crop search. */
  crops: string[];
  title: string;
  /** One or two line summary shown on the search result card. */
  summary: string;
  /** Approximate reading time, so a farmer can judge before opening it. */
  readMinutes: number;
};

/** The eight guide sections, in the order they appear on the screen. */
export const GUIDE_CATEGORIES: readonly GuideCategory[] = [
  {
    id: 'crop-guides',
    emoji: '\u{1F331}',
    title: 'Crop Guides',
    subtitle: 'Start right for each crop',
  },
  {
    id: 'growing-tips',
    emoji: '\u{1F33F}',
    title: 'Growing Tips',
    subtitle: 'Small tricks that help plants',
  },
  {
    id: 'growth-stages',
    emoji: '\u{1F33E}',
    title: 'Crop Growth Stages',
    subtitle: 'Know what to expect and when',
  },
  {
    id: 'water',
    emoji: '\u{1F4A7}',
    title: 'Water Management',
    subtitle: 'Irrigate less, grow more',
  },
  {
    id: 'fertilizer',
    emoji: '\u{1F9EA}',
    title: 'Fertilizer Guide',
    subtitle: 'Feed the soil, feed the crop',
  },
  {
    id: 'crop-health',
    emoji: '\u{1F41B}',
    title: 'Disease & Pest Guide',
    subtitle: 'Spot problems early, act calmly',
  },
  {
    id: 'weather',
    emoji: '\u{1F324}',
    title: 'Weather Tips',
    subtitle: 'Work with the forecast',
  },
  {
    id: 'farming-tips',
    emoji: '\u{1F4DA}',
    title: 'Farming Tips',
    subtitle: 'Everyday practice that pays off',
  },
];

/** Every article in the guide, grouped by category in display order. */
export const GUIDE_ARTICLES: readonly GuideArticle[] = [
  // ── 🌱 Crop Guides ───────────────────────────────────────────────────────
  {
    id: 'paddy-coastal-clay',
    category: 'crop-guides',
    crops: ['Paddy'],
    title: 'Growing Paddy in Coastal Clay',
    summary: 'Land prep, seed rate and standing water depth for clay soil.',
    readMinutes: 6,
  },
  {
    id: 'tomato-hot-climate',
    category: 'crop-guides',
    crops: ['Tomato'],
    title: 'Tomato Varieties for Hot Climates',
    summary: 'Heat tolerant varieties that keep setting fruit above 32°C.',
    readMinutes: 5,
  },
  {
    id: 'banana-planting',
    category: 'crop-guides',
    crops: ['Banana'],
    title: 'Banana Planting Basics',
    summary: 'Sucker selection, spacing and the first month after planting.',
    readMinutes: 7,
  },

  // ── 🌿 Growing Tips ──────────────────────────────────────────────────────
  {
    id: 'mulching-moisture',
    category: 'growing-tips',
    crops: ['Paddy', 'Tomato', 'Banana'],
    title: 'Mulching to Hold Soil Moisture',
    summary: 'Cut evaporation and keep roots cool with a 5 cm mulch layer.',
    readMinutes: 4,
  },
  {
    id: 'staking-tomato',
    category: 'growing-tips',
    crops: ['Tomato'],
    title: 'Staking Tomato Plants',
    summary: 'Support plants early so fruit does not rot on damp soil.',
    readMinutes: 3,
  },
  {
    id: 'intercropping-pulses',
    category: 'growing-tips',
    crops: ['Paddy', 'Millet'],
    title: 'Intercropping Paddy with Pulses',
    summary: 'Use the gap between paddy rows for an extra harvest.',
    readMinutes: 6,
  },

  // ── 🌾 Crop Growth Stages ────────────────────────────────────────────────
  {
    id: 'paddy-five-stages',
    category: 'growth-stages',
    crops: ['Paddy'],
    title: 'The Five Stages of Paddy',
    summary: 'Nursery, tillering, panicle, flowering and grain filling.',
    readMinutes: 5,
  },
  {
    id: 'chili-seed-to-harvest',
    category: 'growth-stages',
    crops: ['Chili'],
    title: 'Watching Chili From Seed to Harvest',
    summary: 'What each stage looks like and how long it should take.',
    readMinutes: 6,
  },
  {
    id: 'tomato-flower-set',
    category: 'growth-stages',
    crops: ['Tomato'],
    title: 'Spotting Tomato Flower and Fruit Set',
    summary: 'How to tell a good flower from one that will drop.',
    readMinutes: 4,
  },

  // ── 💧 Water Management ──────────────────────────────────────────────────
  {
    id: 'irrigation-soil-type',
    category: 'water',
    crops: ['Paddy', 'Millet'],
    title: 'Irrigation Scheduling by Soil Type',
    summary: 'Clay, loam and sand each hold water for a different time.',
    readMinutes: 7,
  },
  {
    id: 'drip-setup',
    category: 'water',
    crops: ['Tomato', 'Banana'],
    title: 'Drip Irrigation Setup',
    summary: 'Lay out laterals, filters and emitters for a small plot.',
    readMinutes: 8,
  },
  {
    id: 'paddy-water-saving',
    category: 'water',
    crops: ['Paddy'],
    title: 'Saving Water in Paddy Fields',
    summary: 'Alternate wetting and drying cuts water use by about a quarter.',
    readMinutes: 5,
  },

  // ── 🧪 Fertilizer Guide ──────────────────────────────────────────────────
  {
    id: 'npk-basics',
    category: 'fertilizer',
    crops: ['Paddy', 'Tomato', 'Chili'],
    title: 'NPK Basics: What Each Number Does',
    summary: 'Leaf growth, roots and flowering, and how to read the label.',
    readMinutes: 6,
  },
  {
    id: 'composting-waste',
    category: 'fertilizer',
    crops: ['Banana', 'Coconut'],
    title: 'Composting Farm Waste',
    summary: 'Turn crop residue into compost in about eight weeks.',
    readMinutes: 5,
  },
  {
    id: 'fertilizer-safety',
    category: 'fertilizer',
    crops: ['Paddy', 'Millet', 'Groundnut'],
    title: 'Applying Fertilizer Safely',
    summary: 'Keep it away from canal water and wear basic protection.',
    readMinutes: 4,
  },

  // ── 🐛 Disease & Pest Guide ──────────────────────────────────────────────
  {
    id: 'field-walk-basics',
    category: 'crop-health',
    crops: ['Paddy', 'Tomato', 'Coconut', 'Banana', 'Vegetables'],
    title: 'Walking Your Field Twice a Week',
    summary: 'What to look at, and the five minutes an acre that pay for themselves.',
    readMinutes: 4,
  },
  {
    id: 'pest-or-disease',
    category: 'crop-health',
    crops: ['Paddy', 'Tomato', 'Banana'],
    title: 'Telling a Pest from a Disease',
    summary: 'Chewed, bored and sucked on one side; spots, wilts and rots on the other.',
    readMinutes: 5,
  },

  // ── 🌤️ Weather Tips ──────────────────────────────────────────────────────
  {
    id: 'monsoon-forecast',
    category: 'weather',
    crops: ['Paddy', 'Groundnut'],
    title: 'Reading the Monsoon Forecast',
    summary: 'Rain chance, onset date and when to sow each crop.',
    readMinutes: 4,
  },
  {
    id: 'heavy-rain-protection',
    category: 'weather',
    crops: ['Paddy', 'Chili'],
    title: 'Protecting Crops from Heavy Rain',
    summary: 'Drainage, staking and what to do after a downpour.',
    readMinutes: 5,
  },
  {
    id: 'heat-irrigation-timing',
    category: 'weather',
    crops: ['Tomato', 'Millet'],
    title: 'Using Heat Warnings to Time Irrigation',
    summary: 'Irrigate early morning or late evening, never at midday.',
    readMinutes: 3,
  },

  // ── 📚 Farming Tips ──────────────────────────────────────────────────────
  {
    id: 'farm-records',
    category: 'farming-tips',
    crops: ['Paddy', 'Tomato', 'Banana'],
    title: 'Keeping Simple Farm Records',
    summary: 'A notebook of sowing, inputs and harvests pays for itself.',
    readMinutes: 5,
  },
  {
    id: 'seed-storage',
    category: 'farming-tips',
    crops: ['Paddy', 'Millet', 'Groundnut'],
    title: 'Storing Seeds After Harvest',
    summary: 'Dry, cool and airtight keeps next season viable.',
    readMinutes: 4,
  },
  {
    id: 'healthy-soil',
    category: 'farming-tips',
    crops: ['Paddy', 'Coconut'],
    title: 'Recognising Healthy Soil',
    summary: 'Colour, smell and a handful test on your own field.',
    readMinutes: 4,
  },
];

/** Every crop name mentioned in the guide, deduplicated and sorted. */
export function guideCropNames(articles: readonly GuideArticle[] = GUIDE_ARTICLES): string[] {
  const names = new Set<string>();

  for (const article of articles) {
    for (const crop of article.crops) {
      names.add(crop);
    }
  }

  return [...names].sort((a, b) => a.localeCompare(b));
}

/** Articles in one category, used for the count on each category card. */
export function articlesInCategory(
  articles: readonly GuideArticle[],
  category: GuideCategoryId,
): GuideArticle[] {
  return articles.filter((article) => article.category === category);
}

/**
 * Searches the guide by crop, article title, summary and category title, so a
 * farmer can type a crop name or a topic like "irrigation".
 *
 * A blank query returns nothing, which lets the screen show the category cards
 * instead of a result list.
 */
export function searchGuideArticles(
  query: string,
  articles: readonly GuideArticle[] = GUIDE_ARTICLES,
): GuideArticle[] {
  const needle = query.trim().toLowerCase();

  if (needle === '') {
    return [];
  }

  return articles.filter((article) => {
    const category = GUIDE_CATEGORIES.find((entry) => entry.id === article.category);
    const haystack = [
      article.title,
      article.summary,
      category?.title ?? '',
      ...article.crops,
    ]
      .join(' ')
      .toLowerCase();

    return haystack.includes(needle);
  });
}
