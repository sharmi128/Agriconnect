/**
 * Fertilizer Guide model and demo content.
 *
 * The Fertilizer Guide screen is built from the tables below: an overview, a note
 * for the chosen crop, a note for the chosen growth stage, soil and water
 * considerations, the four fertilizer types, general guidance, safety tips, and a
 * flat search index built from all of them.
 *
 * ── What this file deliberately does not contain ────────────────────────────
 *
 * There are no quantities anywhere in this content: no kilograms per acre, no
 * grams per plant, no bag sizes, no dilutions and no NPK grades written as
 * numbers. AgriConnect explains what each input does and when a crop is likely
 * to need it, and stops there. The exact product and quantity for a given field
 * depends on the soil test, the variety, the season and the region, so it belongs
 * to a local agricultural officer or to the product label, not to an app.
 * `FERTILIZER_DISCLAIMER` is the note that says this to the farmer, and
 * `SAFETY_TIPS` repeats the handling advice.
 *
 * All content is local demo data. There is no API call, and the shapes below are
 * what a content endpoint is expected to return later.
 */

/** The four groups of fertilizer information the guide covers. */
export type FertilizerTypeId = 'organic' | 'compost' | 'biofertilizer' | 'nutrients';

/** One fertilizer type, shown as its own expandable card. */
export type FertilizerType = {
  id: FertilizerTypeId;
  emoji: string;
  title: string;
  /** One or two lines on what it is, shown collapsed. */
  summary: string;
  /** Where this kind of input earns its place. */
  bestFor: string;
  /** The substance of the card, three to five short lines. */
  points: string[];
  /** The one thing that goes wrong most often with this input. */
  caution: string;
  /** Extra words the 🔎 search should match for this card. */
  keywords: string[];
};

/** A soil type and what it changes about feeding. */
export type SoilNote = {
  id: string;
  emoji: string;
  title: string;
  detail: string;
  keywords: string[];
};

/** The state of the soil's moisture, which decides whether feeding is wasted. */
export type WaterNote = {
  id: string;
  emoji: string;
  title: string;
  detail: string;
  keywords: string[];
};

/** What a crop generally needs attention to at one growth stage. */
export type GrowthStageNote = {
  stage: string;
  /** Short phrase shown as the heading of the note. */
  focus: string;
  note: string;
};

/** One numbered line of the 📋 general guidance list. */
export type GuidanceTip = {
  id: string;
  title: string;
  detail: string;
  keywords: string[];
};

/** One ⚠️ safety rule. These are the lines that protect the person applying. */
export type SafetyTip = {
  id: string;
  title: string;
  detail: string;
  keywords: string[];
};

/** One crop's general feeding character, with no quantities attached. */
export type CropNote = {
  crop: string;
  note: string;
};

/**
 * The note shown when the chosen crop has no entry below, which happens when the
 * farmer picks a crop from the profile that this demo content does not cover.
 */
export const GENERAL_CROP_NOTE =
  'Every field is different. What one crop needs on one soil can be wrong on the next, which is exactly why a soil test and your local expert\u2019s advice are worth more than any general rule. Treat this as a starting point for the conversation, not as the answer.';

/**
 * The standing note about what this app does and does not say.
 *
 * It sits under the page title and is repeated on the 🌿 growth stage card, so it
 * is the first thing a farmer reads and the last thing they see before the
 * guidance list.
 */
export const FERTILIZER_DISCLAIMER =
  'AgriConnect shares general farming knowledge only. It does not recommend fertilizer or chemical dosages. For actual application, follow your local agricultural officer or extension agent, and always read the product label.';

/** 🧪 The four fertilizer types, in the order they appear on the screen. */
export const FERTILIZER_TYPES: readonly FertilizerType[] = [
  {
    id: 'organic',
    emoji: '\u{1F33F}',
    title: 'Organic fertilizers',
    summary:
      'Made from plant and animal material. They feed the soil as well as the crop, and release their nutrients slowly.',
    bestFor: 'Building soil that stays in good heart across seasons.',
    points: [
      'Improve soil structure, so roots can push through the soil more easily.',
      'Hold moisture in sandy soil and let heavy clay soil drain and breathe.',
      'Release nutrients slowly, which is gentler on young roots than a strong single addition.',
      'Add organic matter, which helps the next crop as much as this one.',
      'Act slowly, so they belong before sowing rather than in the middle of a season.',
    ],
    caution:
      'Poorly made material can carry weed seeds, pests or plant disease. Only use it once it has properly finished.',
    keywords: [
      'organic',
      'manure',
      'farmyard',
      'cow dung',
      'vermicompost',
      'green manure',
      'mulch',
      'natural',
    ],
  },
  {
    id: 'compost',
    emoji: '\u{1F504}',
    title: 'Compost',
    summary:
      'Farm waste, dung and kitchen waste turned into a dark, crumbly soil improver over a couple of months.',
    bestFor: 'Fields that have been cropped for years and are losing their dark colour.',
    points: [
      'Built from crop residue, dung, kitchen waste and dry leaves.',
      'Added before sowing and mixed into the top layer of soil.',
      'Feeds the soil life that keeps nutrients available to roots.',
      'Helps sandy soil hold water and helps heavy clay soil drain.',
      'Doubles as a slow release store, so roots can draw from it across the season.',
    ],
    caution:
      'Raw or half-finished compost can burn roots and carry disease. Wait until it is dark, crumbly and smells of earth.',
    keywords: ['compost', 'composting', 'waste', 'residue', 'decompose', 'humus', 'organic matter'],
  },
  {
    id: 'biofertilizer',
    emoji: '\u{1F9A0}',
    title: 'Bio-fertilizers',
    summary:
      'Living microorganisms that help a crop get more out of the nutrients already sitting in the soil.',
    bestFor: 'Fields where nutrients are being lost, or where roots struggle in hot soil.',
    points: [
      'Some strains help certain crops fix nitrogen from the air.',
      'Others help roots take up nutrients that are already present in the soil.',
      'Can improve germination and early root growth.',
      'They need living roots nearby, so they are applied close to the seed or the plant.',
      'They work alongside other inputs rather than replacing them.',
    ],
    caution:
      'These are living organisms. Heat, dryness and a bag left in direct sun can kill them before they ever reach your field.',
    keywords: [
      'bio-fertilizer',
      'biofertilizer',
      'bio',
      'bacteria',
      'fungus',
      'rhizobium',
      'psb',
      'azotobacter',
      'microorganism',
      'inoculant',
      'nitrogen fixing',
    ],
  },
  {
    id: 'nutrients',
    emoji: '\u{1F9EC}',
    title: 'General nutrient information',
    summary:
      'What the main nutrients do inside a plant, and why the balance between them matters more than the total.',
    bestFor: 'Reading a fertilizer label and telling products apart.',
    points: [
      'Nitrogen (N) drives leaf and stem growth. Plants usually want most of it early.',
      'Phosphorus (P) builds roots and is involved in flowering and seed formation.',
      'Potassium (K) helps fruit and grain filling, and helps the plant hold up against disease and dry spells.',
      'Plants also need secondary nutrients and micronutrients, but in much smaller amounts.',
      'More is not better. An excess of one nutrient can block the uptake of another.',
    ],
    caution:
      'Labels list nutrients as percentages, and the three numbers on any fertilizer bag are always in the order nitrogen, phosphorus, potassium.',
    keywords: [
      'npk',
      'nutrient',
      'nitrogen',
      'phosphorus',
      'potassium',
      'label',
      'grade',
      'micronutrient',
      'deficiency',
      'leaf',
      'roots',
      'flowering',
    ],
  },
];

/** 💧 How the soil type changes the way nutrients behave. */
export const SOIL_NOTES: readonly SoilNote[] = [
  {
    id: 'clay',
    emoji: '\u{1F7E4}',
    title: 'Clay soil',
    detail:
      'Holds water and nutrients well, but drains slowly and turns hard when it bakes. Nutrients stay available for longer here, so watch for waterlogging around the roots.',
    keywords: ['clay', 'heavy', 'black soil', 'sticky', 'drainage'],
  },
  {
    id: 'sandy',
    emoji: '\u{1F7E1}',
    title: 'Sandy soil',
    detail:
      'Drains fast and holds few nutrients, so water and feeding both need to be more regular. Organic matter is the single biggest improvement you can make.',
    keywords: ['sandy', 'sand', 'light soil', 'dry', 'leaching', 'red soil'],
  },
  {
    id: 'loam',
    emoji: '\u{1F7E5}',
    title: 'Loam soil',
    detail:
      'The easiest soil to work with. It holds moisture, drains well and gives roots room to spread, so crops on loam usually need the least correction.',
    keywords: ['loam', 'loamy', 'balanced soil', 'alluvial'],
  },
  {
    id: 'laterite',
    emoji: '\u{1F7E0}',
    title: 'Red and laterite soil',
    detail:
      'Common in coastal and hilly areas. Usually acidic, and it hardens into a crust when it bakes in the sun. Organic matter and keeping the surface covered help most.',
    keywords: ['red soil', 'laterite', 'coastal', 'acidic', 'hill', 'coastal clay'],
  },
  {
    id: 'peaty',
    emoji: '\u{1F332}',
    title: 'Peaty and black soil',
    detail:
      'Very dark and rich in organic matter, and it holds moisture well. It turns sticky when wet, so avoid working it or driving over it while it is wet.',
    keywords: ['peaty', 'black', 'organic soil', 'humus', 'fertile'],
  },
];

/** 💧 The state of the soil's moisture, which decides whether feeding lands. */
export const WATER_NOTES: readonly WaterNote[] = [
  {
    id: 'waterlogged',
    emoji: '\u{1F30A}',
    title: 'Waterlogged soil',
    detail:
      'Roots cannot breathe in standing water, and nutrients wash below the root zone where nothing can reach them. Open the drains and let the field breathe before you feed it.',
    keywords: ['waterlogged', 'flooded', 'standing water', 'waterlogging', 'drainage', 'drains'],
  },
  {
    id: 'dry',
    emoji: '\u{1F3E1}',
    title: 'Dry soil',
    detail:
      'Nutrients travel to the roots with water. Feeding a dry field wastes most of what you apply and can scorch the roots, so irrigate first and feed into the moisture that is already there.',
    keywords: ['dry', 'dry soil', 'drought', 'irrigate', 'moisture', 'scorch'],
  },
  {
    id: 'just-rained',
    emoji: '\u{1F327}\uFE0F',
    title: 'Straight after heavy rain',
    detail:
      'Feeding or working soil that is already saturated carries nutrients away with the runoff and damages the structure. Give the field a day or two to settle.',
    keywords: ['rain', 'after rain', 'runoff', 'saturated', 'monsoon', 'washed away'],
  },
  {
    id: 'even',
    emoji: '\u{1F4A7}',
    title: 'Evenly moist soil',
    detail:
      'This is the condition you are aiming for when you feed. Roots can take up what is dissolved, and a steady supply beats a heavy single application.',
    keywords: ['moist', 'even moisture', 'ideal', 'drip', 'canal', 'consistent water'],
  },
];

/**
 * 🌿 What a crop generally needs attention to at each growth stage.
 *
 * The `stage` values are the `CropStage` names already used by the crop journal,
 * so the stage dropdown on this screen offers the same list the farmer already
 * sees on the 🌾 Harvest screen.
 */
export const GROWTH_STAGE_NOTES: readonly GrowthStageNote[] = [
  {
    stage: 'Sowing',
    focus: 'The seed has only what it carries',
    note: 'Roots have not formed yet, so nothing you add can be reached. What matters at sowing is seed quality, good soil contact and a soft, moist seedbed.',
  },
  {
    stage: 'Germination',
    focus: 'Keep it soft and moist, not rich',
    note: 'The first root is delicate. Concentrated or fresh material in the seed zone holds growth back, so keep the soil loose and evenly moist instead.',
  },
  {
    stage: 'Vegetative',
    focus: 'Building leaves, stems and roots',
    note: 'The plant is making leaf area, and it draws most heavily on nitrogen now. Anything given at this stage shows up in plant size within a couple of weeks.',
  },
  {
    stage: 'Flowering',
    focus: 'Shifting from growing to producing',
    note: 'Phosphorus and potassium matter more than nitrogen from here. Too much nitrogen pushes leaves instead of flowers, and flowers that never set are flowers that never earn anything.',
  },
  {
    stage: 'Fruiting',
    focus: 'Filling what will be harvested',
    note: 'The crop is pulling heavily on potassium and calcium while it fills. Steady moisture matters most now, because a dry spell at this stage shows directly in the size of the harvest.',
  },
  {
    stage: 'Maturity',
    focus: 'Slowing down on purpose',
    note: 'Growth is winding up. Extra nitrogen keeps the plant green and delays an even ripening, which makes the harvest harder to time and the grain plumper to store.',
  },
  {
    stage: 'Harvested',
    focus: 'The field is resting',
    note: 'This is the natural time to add compost or farmyard manure. The field that gets organic matter now is the field that starts the next crop on soil already in good heart.',
  },
];

/** 📋 General guidance. The order is deliberate: read top to bottom. */
export const GUIDANCE_TIPS: readonly GuidanceTip[] = [
  {
    id: 'feed-the-soil',
    title: 'Feed the soil, not just the plant',
    detail:
      'A crop grows on what the soil can release, not on what came in a bag. Soil that is dark, crumbly and full of life returns the most for the least spent.',
    keywords: ['soil health', 'organic matter', 'soil life', 'basal', 'foundation'],
  },
  {
    id: 'test-first',
    title: 'Test the soil before you buy anything',
    detail:
      'A soil test from your local agriculture office tells you what is already there. Without one you are guessing, and guessing is the easiest way to waste money on a field that did not need it.',
    keywords: ['soil test', 'lab', 'testing', 'analysis', 'deficiency', 'baseline'],
  },
  {
    id: 'split-applications',
    title: 'Split the feeding across the season',
    detail:
      'Most crops do better from two or three smaller additions spread through the season than from one large one at sowing. The later additions match the crop as it changes, which is the whole point.',
    keywords: ['split', 'top dressing', 'split application', 'staggered', 'multiple'],
  },
  {
    id: 'never-dry',
    title: 'Never feed a dry plant',
    detail:
      'Nutrients move to the roots with water. Applying onto dry soil wastes most of the input and can scorch roots, so irrigate first and feed into moisture that is already there.',
    keywords: ['dry', 'moisture', 'irrigate before', 'scorch', 'timing'],
  },
  {
    id: 'match-crop',
    title: 'Match the input to the crop',
    detail:
      'A leafy vegetable and a grain crop want different things, and the same crop can want different things in a different season. When a crop is new to your field, ask before you buy.',
    keywords: ['crop requirement', 'match', 'rotation', 'new crop', 'right input'],
  },
  {
    id: 'keep-records',
    title: 'Keep a simple record',
    detail:
      'Write down what you applied, on which field and on what date. It is the fastest way to find out what actually worked on your land, instead of remembering it wrong.',
    keywords: ['record', 'diary', 'log', 'notebook', 'track', 'history'],
  },
  {
    id: 'plan-the-spend',
    title: 'Buy against a plan, not a hunch',
    detail:
      'Fertilizer is the input farmers most often over-buy. Deciding the plan first, then the quantity, keeps the cost predictable and the season on budget.',
    keywords: ['cost', 'budget', 'price', 'expensive', 'plan', 'money', 'spend'],
  },
];

/** ⚠️ Handling rules. These protect the person applying, not just the crop. */
export const SAFETY_TIPS: readonly SafetyTip[] = [
  {
    id: 'read-the-label',
    title: 'Read the label before you open the bag',
    detail:
      'Every product carries a label saying what it is, what it contains, and how it must be handled. The label is the instruction. A guess from the shop counter is not.',
    keywords: ['label', 'instructions', 'read', 'manual', 'safety sheet', 'msds'],
  },
  {
    id: 'protect-yourself',
    title: 'Wear basic protection',
    detail:
      'Gloves and a mask when handling powders, closed shoes rather than sandals, and sleeves over the arms. Wash hands and face before you eat, drink or smoke.',
    keywords: ['gloves', 'mask', 'protection', 'ppe', 'safety', 'hands', 'shoes'],
  },
  {
    id: 'keep-away-from-water',
    title: 'Keep it away from wells, ponds and canals',
    detail:
      'Never mix, dump or wash fertilizer in a water source. Runoff carries nutrients and chemicals into water that people, livestock and fish depend on.',
    keywords: ['water', 'canal', 'well', 'pond', 'runoff', 'pollution', 'drinking water', 'fish'],
  },
  {
    id: 'not-midday',
    title: 'Do not apply in strong sun or wind',
    detail:
      'Midday heat and wind carry the product off target, into the air and away from where you put it. Early morning or late evening is safer, wastes less and is more comfortable to work in.',
    keywords: ['wind', 'sun', 'midday', 'heat', 'timing', 'drift', 'evaporation'],
  },
  {
    id: 'store-safely',
    title: 'Store it where children and animals cannot reach',
    detail:
      'Keep it dry, off the ground, and locked or in a place only adults open. Never keep fertilizer in a food or water container, even an empty one.',
    keywords: ['storage', 'store', 'locked', 'children', 'animals', 'container', 'dry'],
  },
  {
    id: 'do-not-mix',
    title: 'Do not mix products unless the label allows it',
    detail:
      'Some materials react badly together and give off heat or gas. Never combine two products in one tank to save a trip, unless the label for both of them says it is fine.',
    keywords: ['mix', 'mixing', 'tank', 'combine', 'react', 'gas', 'incompatible'],
  },
];

/**
 * Crop notes, keyed by the crop names already used in the farmer profile.
 *
 * Each one describes how a crop generally behaves, so the farmer can recognise
 * their own field in it. None of them name a product or a quantity.
 */
export const CROP_NOTES: readonly CropNote[] = [
  {
    crop: 'Paddy',
    note: 'Paddy grows in flooded soil, and that changes how nutrients behave. Nitrogen is used up quickly under standing water and is easy to lose into the air and into drainage, so draining and re-flooding in rotation helps the field hold what it is given.',
  },
  {
    crop: 'Wheat',
    note: 'Wheat is a short-duration crop with a deep rooting habit, so it relies more on soil that releases nutrients steadily than on any single heavy addition. A firm, level seedbed and even moisture at grain filling matter as much as the feeding does.',
  },
  {
    crop: 'Maize',
    note: 'Maize is a tall, heavy-feeding crop that needs a steady supply from sowing until the cob is filling. Because its roots sit close to the surface, a mulch or surface crust keeps the nutrients from washing away between rows.',
  },
  {
    crop: 'Sugarcane',
    note: 'Sugarcane occupies its field for many months and puts out a great deal of biomass, so it draws on nutrients steadily all year rather than in a rush. Organic matter and green manure are especially useful here, building the soil between each ratoon.',
  },
  {
    crop: 'Cotton',
    note: 'Cotton is sensitive to how it is fed. Too much nitrogen early gives big leaves and delays the bolls, while too little around flowering drops them. Watch the plant rather than the calendar, and keep water steady through squaring and bolling.',
  },
  {
    crop: 'Groundnut',
    note: 'Groundnut fixes its own nitrogen through bacteria in the root nodules, so it needs far less nitrogen input than most crops. It responds well to phosphorus and potassium, and to calcium for the pods that are forming below ground.',
  },
  {
    crop: 'Soybean',
    note: 'Like other legumes, soybean fixes its own nitrogen through root nodules, so it is rarely the crop that needs most of it. It is grown for that and for the residue it leaves behind, which feeds the next crop in the rotation.',
  },
  {
    crop: 'Millets',
    note: 'Millets are short and drought tolerant, and they grow well in poorer soils than most cereals. They need less feeding than rice or maize, and are often grown precisely because the field is not generous.',
  },
  {
    crop: 'Banana',
    note: 'Banana is a very heavy feeder whose shallow roots sit close to the surface, so feeding is split into several rounds through the year and kept clear of the stem. Organic manure is the traditional base underneath all of it.',
  },
  {
    crop: 'Vegetables',
    note: 'Vegetables are short-duration, high-value and quick to show a mistake. Feed gently and often, and prefer well-rotted organic material, because shallow roots are easily scorched by anything fresh or concentrated.',
  },
];

/** One row in the 🔎 search results, built from every table above. */
export type FertilizerSearchEntry = {
  id: string;
  emoji: string;
  title: string;
  /** The line shown under the title. */
  detail: string;
  /** Which card on the screen this result belongs to. */
  section: string;
  /** Extra words that should also match, such as a crop or a nutrient name. */
  keywords: string[];
};

/**
 * The Fertilizer Guide content, ready for the screen.
 *
 * This is the seam for a real content endpoint. Today the screen reads the tables
 * above; when the backend is ready, replace this with a fetch and return the same
 * shape.
 */
export function getFertilizerGuide() {
  return {
    overview: FERTILIZER_DISCLAIMER,
    fertilizerTypes: FERTILIZER_TYPES,
    soilNotes: SOIL_NOTES,
    waterNotes: WATER_NOTES,
    growthStages: GROWTH_STAGE_NOTES,
    guidance: GUIDANCE_TIPS,
    safety: SAFETY_TIPS,
    cropNotes: CROP_NOTES,
  };
}

/** The 🌿 note for a growth stage, falling back to the general wording. */
export function noteForStage(stage: string): GrowthStageNote | undefined {
  return GROWTH_STAGE_NOTES.find((note) => note.stage === stage);
}

/**
 * The note for a crop.
 *
 * The crop names here are matched loosely, so "Paddy" in the profile still finds
 * its note if the wording is later changed to "Rice". Anything with no entry gets
 * `GENERAL_CROP_NOTE`, so the card is never empty.
 */
export function noteForCrop(crop: string): string {
  const needle = crop.trim().toLowerCase();

  if (needle === '') {
    return GENERAL_CROP_NOTE;
  }

  const match = CROP_NOTES.find(
    (entry) => entry.crop.toLowerCase() === needle || entry.crop.toLowerCase().includes(needle)
  );

  return match?.note ?? GENERAL_CROP_NOTE;
}

/** Every crop that has its own note, for the empty-search hint on the screen. */
export function cropNamesWithNotes(): string[] {
  return CROP_NOTES.map((entry) => entry.crop);
}

/**
 * Flattens every table into one list the 🔎 search can look through.
 *
 * The list is built once per screen render and is small enough that a plain
 * `includes` over the joined text is fast. A backend would do the searching, and
 * would return the same `FertilizerSearchEntry` shape.
 */
export function buildFertilizerSearchIndex(): FertilizerSearchEntry[] {
  const entries: FertilizerSearchEntry[] = [
    ...FERTILIZER_TYPES.map((type) => ({
      id: `type-${type.id}`,
      emoji: type.emoji,
      title: type.title,
      detail: `${type.summary} Best for: ${type.bestFor}`,
      section: 'Fertilizer Types',
      keywords: [...type.keywords, ...type.points],
    })),
    ...SOIL_NOTES.map((soil) => ({
      id: `soil-${soil.id}`,
      emoji: soil.emoji,
      title: soil.title,
      detail: soil.detail,
      section: 'Soil Considerations',
      keywords: soil.keywords,
    })),
    ...WATER_NOTES.map((water) => ({
      id: `water-${water.id}`,
      emoji: water.emoji,
      title: water.title,
      detail: water.detail,
      section: 'Water Considerations',
      keywords: water.keywords,
    })),
    ...GROWTH_STAGE_NOTES.map((stage) => ({
      id: `stage-${stage.stage}`,
      emoji: '\u{1F33F}',
      title: `${stage.stage} stage`,
      detail: `${stage.focus}. ${stage.note}`,
      section: 'Growth Stages',
      keywords: [stage.stage, stage.focus],
    })),
    ...GUIDANCE_TIPS.map((tip) => ({
      id: `guidance-${tip.id}`,
      emoji: '\u{1F4CB}',
      title: tip.title,
      detail: tip.detail,
      section: 'General Guidance',
      keywords: tip.keywords,
    })),
    ...SAFETY_TIPS.map((tip) => ({
      id: `safety-${tip.id}`,
      emoji: '\u26A0\uFE0F',
      title: tip.title,
      detail: tip.detail,
      section: 'Safety Tips',
      keywords: tip.keywords,
    })),
    ...CROP_NOTES.map((crop) => ({
      id: `crop-${crop.crop}`,
      emoji: '\u{1F331}',
      title: crop.crop,
      detail: crop.note,
      section: 'Crops',
      keywords: [crop.crop, 'fertilizer', 'manure', 'compost', 'nutrient', 'soil'],
    })),
  ];

  return entries;
}

/**
 * Searches the guide by crop, fertilizer, soil, water, stage or safety topic.
 *
 * A blank query returns nothing, which lets the screen show its sections instead
 * of a result list, the same way the Farming Guide tab does.
 */
export function searchFertilizerContent(
  query: string,
  index: readonly FertilizerSearchEntry[] = buildFertilizerSearchIndex()
): FertilizerSearchEntry[] {
  const needle = query.trim().toLowerCase();

  if (needle === '') {
    return [];
  }

  return index.filter((entry) =>
    [entry.title, entry.detail, entry.section, ...entry.keywords]
      .join(' ')
      .toLowerCase()
      .includes(needle)
  );
}
