/**
 * Crop Disease & Pest Guide model and demo content.
 *
 * The Crop Disease & Pest Guide screen is built from the tables below: an
 * overview, a note for the chosen crop, every common problem for the crops this
 * guide covers, a page of 🐛 pest information, a page of 🍃 disease
 * information, the ⚠️ warning signs worth walking the field for, the 💡 general
 * prevention habits, and a flat search index built from all of them.
 *
 * ── What this file deliberately does not contain ────────────────────────────
 *
 * There are no chemical names, no mixtures, no quantities and no instruction to
 * spray or apply anything anywhere in this content. AgriConnect explains what
 * each problem looks like and how to make it less likely in the first place, and
 * stops there. Which product to use, if any, depends on the pest or pathogen,
 * the crop stage, the weather and the rules of the area, so it is a decision for
 * a local agricultural officer or extension agent.
 * `CROP_HEALTH_DISCLAIMER` is the note that says this to the farmer.
 *
 * All content is local demo data. There is no API call, and the shapes below are
 * what a content endpoint is expected to return later.
 */

import type { SelectOption } from '@/models/farmer-profile';

/** The two kinds of problem this guide covers. */
export type CropProblemKind = 'pest' | 'disease';

/** One problem — a pest or a disease — shown as its own clickable card. */
export type CropProblem = {
  id: string;
  /** The name a farmer would use in the field, not a scientific name. */
  name: string;
  emoji: string;
  /** The crop this entry belongs to, spelled the way the rest of the app does. */
  crop: string;
  kind: CropProblemKind;
  /** One or two lines on what the problem is, shown while the card is closed. */
  summary: string;
  /** ⚠️ What the farmer actually sees, in the order it usually shows up. */
  warningSigns: string[];
  /** 💡 General practice that makes the problem less likely in the first place. */
  preventionTips: string[];
  /** Extra words the 🔎 search should match for this card. */
  keywords: string[];
};

/**
 * 🐛 or 🍃 — the plain explanation of what a pest is and what a disease is.
 *
 * Every problem card tells a farmer what one problem looks like. This tells them
 * how to tell the two families apart before they start, which is the step that
 * decides whether pulling up a plant, drying the leaves or doing nothing is the
 * right move.
 */
export type ProblemKindInfo = {
  kind: CropProblemKind;
  emoji: string;
  title: string;
  summary: string;
  /** How to tell this kind of problem from the other one. */
  tells: string[];
  /** How it gets from one plant to the next. */
  spread: string;
  /** The one thing that goes wrong most often with this kind of problem. */
  caution: string;
  keywords: string[];
};

/** One ⚠️ early warning sign, general enough to check on any crop. */
export type WarningSign = {
  id: string;
  emoji: string;
  title: string;
  detail: string;
  keywords: string[];
};

/** One numbered line of the 💡 general prevention list. */
export type PreventionTip = {
  id: string;
  title: string;
  detail: string;
  keywords: string[];
};

/** One crop's short note on where trouble usually starts in it. */
export type CropWatchNote = {
  crop: string;
  note: string;
};

/**
 * The standing note about what this app does and does not say.
 *
 * It sits in the overview card at the top of the page, and it is the one thing
 * that must not be trimmed: a farmer who reads a problem list needs to know that
 * the app stops at recognition and prevention.
 */
export const CROP_HEALTH_DISCLAIMER =
  'AgriConnect shares general farming knowledge only. It does not recommend pesticides, chemicals, mixtures or dosages, and it does not tell you to apply anything. Confirm what you are looking at with your local agricultural officer or extension agent before you treat a field, and always read the product label.';

/** The crops this demo content covers, in the order they appear on the page. */
export const CROP_HEALTH_CROPS: readonly string[] = [
  'Paddy',
  'Tomato',
  'Coconut',
  'Banana',
  'Vegetables',
];

/** The label of the crop filter that clears every crop at once. */
export const ALL_CROPS_LABEL = 'All crops';

/** 🐛🍃 The plain explanation of each kind of problem, shown on its own card. */
export const PROBLEM_KIND_INFORMATION: readonly ProblemKindInfo[] = [
  {
    kind: 'pest',
    emoji: '\u{1F41B}',
    title: 'Pest Information',
    summary:
      'A pest is a living animal — an insect, a mite, a snail or a rodent — feeding on the plant. Something is being eaten, bored or sucked, and the pest itself is usually somewhere on the plant.',
    tells: [
      'The plant is damaged, not discoloured: chewed edges, holes, tunneled stems, twisted new growth or sucked-out leaves.',
      'The pest, its young, its eggs or its droppings can usually be found on the plant, under a leaf or in the soil below it.',
      'Damage starts in a patch and grows outwards from where the infestation began.',
      'New growth is attacked as readily as old growth, because the pest chooses the softest, sweetest part.',
    ],
    spread:
      'Pests move into a field on their own wings and legs, and arrive carried by wind, water, planting material, tools and sacks. They multiply fastest in warm weather, so the numbers can double in a week.',
    caution:
      'The helpful insects — ladybirds, spiders, dragonflies, parasitic wasps — are what kept the pest down until now. A broad spray kills them first, and the pest comes back stronger than before. Find out what the pest is and ask before treating anything.',
    keywords: [
      'pest',
      'insect',
      'insects',
      'bug',
      'bugs',
      'borer',
      'caterpillar',
      'beetle',
      'aphid',
      'whitefly',
      'hopper',
      'mite',
      'chewing',
      'sucking',
      'damage',
      'identify',
    ],
  },
  {
    kind: 'disease',
    emoji: '\u{1F343}',
    title: 'Disease Information',
    summary:
      'A disease is a fungus, a bacterium or a virus growing inside the plant. There is nothing to pick off, because the problem is in the plant\u2019s own tissue.',
    tells: [
      'The plant itself changes: spots, streaks, wilts, rots, powder or a sudden collapse.',
      'It often shows up first on the oldest, lowest leaves and moves upwards through the plant.',
      'It usually follows wet, cloudy, dew-heavy weather, or a wound made by a pest, a tool or the wind.',
      'Removing the affected part does not chase the problem away, because the infection is already in the tissue around it.',
    ],
    spread:
      'Fungal disease spreads as spores carried on the wind, in splashing rain and on tools and hands, and it needs leaves that stay wet. Bacterial disease travels mostly in water — rain splash, irrigation, flood water and cuttings. Virus disease needs a sap-sucking insect, a cutting or a seed to move it from plant to plant.',
    caution:
      'Disease is decided long before it is visible. Clean planting material, air and light through the canopy, dry leaves and a rotation break prevent far more than any treatment applied after the spots appear.',
    keywords: [
      'disease',
      'fungus',
      'fungal',
      'bacteria',
      'bacterial',
      'virus',
      'viral',
      'blight',
      'wilt',
      'rot',
      'spot',
      'mildew',
      'streak',
      'infection',
      'identify',
    ],
  },
];

/**
 * 🌾🍅🥥🍌🥬 The problems this guide covers, in the order they appear on the page.
 *
 * Every entry is written the way a farmer would describe it in the field, and
 * every entry is handled the same way: what it is, what you actually see, and
 * what makes it less likely next time. Nothing here says what to spray, how much,
 * or how often.
 */
export const CROP_PROBLEMS: readonly CropProblem[] = [
  // ── 🌾 Paddy ─────────────────────────────────────────────────────────────
  {
    id: 'paddy-stem-borer',
    name: 'Paddy Stem Borer',
    emoji: '\u{1F41B}',
    crop: 'Paddy',
    kind: 'pest',
    summary:
      'A pale caterpillar that enters the stem and eats the middle out of it, so the shoot above the hole dies while the rest of the plant stays green.',
    warningSigns: [
      'Young tillers where the centre shoot has dried and yellowed, and pulls out of the stem with almost no resistance.',
      'Small round holes in the stem near the base, with fine, sawdust-like droppings pushed out of them.',
      'Tillers that reach flowering but carry an empty, whitened earhead while the stem underneath is still green.',
      'Seedling tips cut off in the nursery bed, and a patchy stand after transplanting.',
      'Last season\u2019s stubble still standing in the field or on the bund, holding the caterpillars through the dry weeks.',
    ],
    preventionTips: [
      'Cut the stubble down near the soil and let the field dry after harvest, so the caterpillars have nowhere to sit out the off-season.',
      'Keep the bunds and channels clear of grass, which is where the moths shelter between crops.',
      'Sow on time and evenly, so the whole area is at the same stage and the moth has no bridge from one field to the next.',
      'Choose a variety with a season length that suits the area, which shortens the window the borer has to work in.',
      'Leave the field\u2019s spiders, dragonflies and wasps alone. They take a large share of the eggs and the young larvae.',
      'Leave a flowering strip on the bund, so the helpful insects always have somewhere to feed.',
    ],
    keywords: ['stem borer', 'borer', 'caterpillar', 'tiller', 'stubble', 'paddy pest'],
  },
  {
    id: 'paddy-blast',
    name: 'Paddy Blast',
    emoji: '\u{1F342}',
    crop: 'Paddy',
    kind: 'disease',
    summary:
      'A fungus that marks the leaves with spindle-shaped spots and then blackens the neck below the earhead, so the ear bends over before it fills.',
    warningSigns: [
      'Diamond or spindle-shaped spots on the leaves, grey in the middle with a dark brown edge.',
      'Spots that join together until a whole leaf dries from the tip downwards.',
      'A dark band at the neck of the earhead, with the earhead bending over or snapping off.',
      'Earheads that whiten and stay mostly empty while the leaves around them still look green.',
      'The spots appearing a week or two after cloudy days, drizzle and heavy night dew.',
    ],
    preventionTips: [
      'Use certified seed of a variety that is known to stand up to blast in your area.',
      'Sow at the usual time for the area, because a late crop meets the cloudy, dew-heavy weather at the worst stage.',
      'Keep nitrogen moderate and split across the season; a very heavy early dose makes soft leaf growth the fungus finds easy.',
      'In a cloudy week, avoid leaving the leaves wet overnight, and drain the field for a short spell where you can.',
      'Burn or plough in infected stubble and the straw raked off the bund after harvest.',
      'Plant or transplant at the recommended spacing, so air moves between the plants and the leaves dry after dew.',
    ],
    keywords: ['blast', 'neck blast', 'fungus', 'spindle spot', 'leaf spot', 'fungal disease'],
  },
  {
    id: 'paddy-bacterial-leaf-blight',
    name: 'Paddy Bacterial Leaf Blight',
    emoji: '\u{1F9A0}',
    crop: 'Paddy',
    kind: 'disease',
    summary:
      'A bacterium that sends pale, water-soaked streaks down from the leaf tip, and can dry whole patches of the field after a windy, rainy spell.',
    warningSigns: [
      'Yellow or straw-coloured streaks starting at the leaf tip and running down along the leaf edge.',
      'Leaves that dry from the tip backwards with a wavy edge, while the base of the leaf stays green.',
      'A milky or yellow drop of sap forming on the cut edge of a leaf early in the morning.',
      'Whole patches of the field drying and lying flat together, usually a week or two after heavy rain and wind.',
      'The worst damage in the part of the field that received the most nitrogen.',
    ],
    preventionTips: [
      'Drain the field for a few days as soon as the streaks appear, so the water stops carrying the bacterium between plants.',
      'Keep nitrogen moderate and split, and avoid a single heavy dose early in the season.',
      'Never move water from an affected patch into a healthy part of the field or into a neighbour\u2019s plot.',
      'Do not clip the tips of the seedlings before transplanting; a cut tip is the easiest way in for the bacterium.',
      'Use clean, certified seed and a variety that has stood up well in your area.',
      'Let the field dry between irrigation cycles wherever the water supply allows it.',
    ],
    keywords: ['bacterial leaf blight', 'blight', 'bacteria', 'leaf streak', 'water soaked'],
  },

  // ── 🍅 Tomato ────────────────────────────────────────────────────────────
  {
    id: 'tomato-whitefly-leaf-curl',
    name: 'Whitefly and Tomato Leaf Curl',
    emoji: '\u{1F997}',
    crop: 'Tomato',
    kind: 'pest',
    summary:
      'A cloud of tiny white flies feeds under the leaves and carries the leaf curl virus from plant to plant, curling and stunting the newest growth.',
    warningSigns: [
      'Tiny white flies rising in a cloud when you walk the rows and shake a plant.',
      'Sticky honeydew on the lower leaves, with black sooty mould growing on top of it.',
      'Leaves curling upwards, thickening, and turning yellow along the edges.',
      'New leaves much smaller than the older ones, with the plant staying short and setting very little fruit.',
      'Ants running up and down the stems, farming the whitefly for its honeydew.',
    ],
    preventionTips: [
      'Start with healthy seedlings from a nursery you trust, and never raise seedlings beside an old tomato crop.',
      'Keep the plot and the bunds free of weeds, because the whitefly shelters in them between crops.',
      'Hang yellow sticky traps to see how many flies are about, and to catch some of them early.',
      'Leave a flowering trap row such as marigold along the edge of the plot, which draws the adults away from the crop.',
      'Pull up and destroy badly curled plants early; a plant that is already stunted is a source of virus for the whole plot.',
      'Keep the plants evenly watered and in good heart, because a strong plant holds up better against a virus attack.',
    ],
    keywords: ['whitefly', 'leaf curl', 'virus', 'curl', 'sooty mould', 'honeydew'],
  },
  {
    id: 'tomato-early-blight',
    name: 'Tomato Early Blight',
    emoji: '\u{1F342}',
    crop: 'Tomato',
    kind: 'disease',
    summary:
      'A fungus that starts on the oldest leaves with dark rings inside each spot, then moves up the plant and marks the fruit near the stalk.',
    warningSigns: [
      'Dark brown spots with rings inside them, like a target board, on the lowest and oldest leaves first.',
      'A yellow halo around each spot, with the leaves yellowing and dropping from the bottom of the plant upwards.',
      'Dark, sunken patches at the stalk end of the fruit, usually on the fruit closest to the soil.',
      'The trouble moving up the plant after a warm, humid week, or after the leaves stayed wet for a day or two.',
      'Bare lower stems with the fruit left open to the sun, which then scalds.',
    ],
    preventionTips: [
      'Stake and prune so the leaves are not lying on the soil and air can move through the plant.',
      'Water at the base, in the morning, and keep the leaves dry; splashing water is what carries the spores up.',
      'Mulch the soil surface so rain cannot splash spores from the soil onto the lowest leaves.',
      'Rotate away from tomato, potato and chilli for two seasons, because the fungus lives on in the crop residue.',
      'Pick off the first affected lower leaves and carry them out of the plot rather than dropping them between the rows.',
      'Clear and destroy the crop residue after the last harvest, and turn the soil before the next season.',
    ],
    keywords: ['early blight', 'blight', 'fungus', 'target spot', 'leaf spot', 'fruit rot'],
  },
  {
    id: 'tomato-fruit-borer',
    name: 'Tomato Fruit Borer',
    emoji: '\u{1F41B}',
    crop: 'Tomato',
    kind: 'pest',
    summary:
      'A green or brown caterpillar that enters the fruit near the stalk, feeds inside it, and moves from one fruit to the next.',
    warningSigns: [
      'Round holes in the fruit near the stalk, often on the fruit that is starting to colour.',
      'Brown droppings pushed out of the hole, and the inside of the fruit turning brown and rotten.',
      'Flowers and small buds dropping in the affected rows, with chewed edges on the young leaves.',
      'Caterpillars curled up in the soil or just inside the fruit during the heat of the day.',
      'A group of damaged fruits in one part of the plot, spreading outwards week by week.',
    ],
    preventionTips: [
      'Walk the plot at dusk with the light behind you, when the caterpillars come out to feed and are easiest to find.',
      'Pick and destroy every damaged fruit; one left lying in the plot only finishes the caterpillar off and drops it to the soil.',
      'Grow a flowering trap border such as marigold, which draws the egg-laying moths away from the tomato.',
      'Hand-pick the first caterpillars you find, before the numbers build up beyond what hand-picking can handle.',
      'Use a light or pheromone trap to know when the moth flight starts, so you know when to look more closely.',
      'Keep the plot and the ground next to it free of weeds, because the moths shelter and breed on several common ones.',
    ],
    keywords: ['fruit borer', 'borer', 'caterpillar', 'fruit worm', 'hole in fruit'],
  },

  // ── 🥥 Coconut ───────────────────────────────────────────────────────────
  {
    id: 'coconut-rhinoceros-beetle',
    name: 'Coconut Rhinoceros Beetle',
    emoji: '\u{1FAB2}',
    crop: 'Coconut',
    kind: 'pest',
    summary:
      'A large black beetle that bores into the crown of the palm at night. The wound it leaves is also the door through which rot gets in.',
    warningSigns: [
      'Clean, V-shaped or fan-shaped cuts on the opening fronds, as though they were trimmed with a knife.',
      'A hole at the base of a frond with a chewed, fibrous edge and a bundle of fibre pushed out of it.',
      'The growing point damaged, with the youngest fronds wilting and the crown tilting to one side.',
      'Young palms in the same row affected one after another over several weeks.',
      'Beetles and their white grubs found in old coconut logs, manure heaps or rotting compost near the plot.',
    ],
    preventionTips: [
      'Keep the base of the palm and the crown clean of rotting fibre, husk and old frond material, which is where the beetle breeds.',
      'Check old, felled coconut trunks, sawdust heaps and manure pits on the plot, and clear them out.',
      'Avoid cutting green fronds, and harvest carefully, because a cut surface attracts the beetle.',
      'Walk the young palms once a week through the wet season, when the damage is easiest to catch early.',
      'Keep a legume cover on the floor and shade at the base, which keeps the soil conditions less suited to the grubs.',
      'Note which palms were attacked, and clear the beetles out of the surrounding breeding material before the next season.',
    ],
    keywords: ['rhinoceros beetle', 'beetle', 'crown', 'palm', 'borer', 'frond cut'],
  },
  {
    id: 'coconut-bud-rot',
    name: 'Coconut Bud Rot',
    emoji: '\u{1F9A0}',
    crop: 'Coconut',
    kind: 'disease',
    summary:
      'A rot that settles in the crown after a long wet spell or a wound, killing the young spear leaf and then the whole growing point.',
    warningSigns: [
      'The spear leaf, the central frond that has not yet opened, yellowing and then wilting and bending over.',
      'A brown, bad-smelling rotten patch at the base of the spear when the wilted frond is pulled gently.',
      'Fronds in the crown collapsing inwards to outwards, each one drooping a little lower than the last.',
      'The whole crown falling away in the final stage, leaving a bare trunk.',
      'A wound on the crown from the beetle, from climbing or from harvesting, a week or two before the wilting starts.',
    ],
    preventionTips: [
      'Climb and harvest with clean tools, and avoid wounding the crown or the base of the frond.',
      'Keep the base of the palm free of standing water, and keep the plot drained through the wet weeks.',
      'Keep the rhinoceros beetle under control, because the wound it makes is the way in for the rot.',
      'Check the crown of every palm after a long wet spell, and again a few days later.',
      'Remove an affected crown and carry it out of the plantation rather than leaving it between the palms.',
      'Keep the palm strong with husk, compost and a cover crop, because a palm in good heart resists longer.',
    ],
    keywords: ['bud rot', 'rot', 'crown', 'spear leaf', 'fungus', 'phytophthora'],
  },
  {
    id: 'coconut-leaf-blight',
    name: 'Coconut Leaf Blight',
    emoji: '\u{1F342}',
    crop: 'Coconut',
    kind: 'disease',
    summary:
      'A leaf disease of the wet weeks that dries the leaflets from the tip of the frond downwards, leaving the crown thin and bare.',
    warningSigns: [
      'Dark brown, water-soaked patches on the leaflets that dry out to a grey centre with a yellow margin.',
      'Whole fronds turning dry and brown from the tip downwards, as though scorched.',
      'The damage starting on the older, lower fronds and moving up the crown.',
      'A crown that looks thin and bare, with fewer green fronds than the palms around it.',
      'The trouble spreading through the plot during a spell of continuous rain.',
    ],
    preventionTips: [
      'Remove the badly affected lower fronds and take them out of the plot.',
      'Space and manage the plantation so wind can move through and dry the crown.',
      'Keep the palm well supplied with husk, compost and a cover crop, which keeps the frond strong.',
      'Avoid unnecessary wounding of the fronds during harvest.',
      'Check every palm after a long wet spell, and again a week later to see whether it is spreading.',
      'Record which rows were affected, so the next planting and spacing decisions are made with that in mind.',
    ],
    keywords: ['leaf blight', 'blight', 'frond', 'leaf spot', 'fungus', 'crown'],
  },

  // ── 🍌 Banana ────────────────────────────────────────────────────────────
  {
    id: 'banana-pseudostem-weevil',
    name: 'Banana Pseudostem Weevil',
    emoji: '\u{1FAB2}',
    crop: 'Banana',
    kind: 'pest',
    summary:
      'A black weevil that lays in the stem and whose grubs tunnel through it, so the plant weakens and often topples before the bunch is ready.',
    warningSigns: [
      'Small holes on the pseudostem with a gummy, sticky sap oozing out of them, which turns black and dries.',
      'A stem that gives way or splits when you push it gently, before the bunch has filled.',
      'Dark, hollow tunnels inside the stem when an affected plant is cut across.',
      'The outer sheath of the stem withering and pulling away from the ones under it.',
      'Bunches that fill poorly, or plants that topple in the row next to one you already removed.',
    ],
    preventionTips: [
      'Plant clean suckers from a plot with no history of the weevil, and cut the sucker surface neatly with a clean blade.',
      'Remove an affected pseudostem whole and carry it out of the plantation, rather than leaving it in the row.',
      'Keep the field free of old dried sheaths, cut stems and crop residue, which is where the weevil breeds.',
      'Avoid water standing at the base of the plants, and keep the plot drained.',
      'Check the stem at the leaf axil once a week, when the sap and the holes are easiest to see early.',
      'Keep a note of which rows were affected, so the next planting can start from clean material.',
    ],
    keywords: ['weevil', 'pseudostem', 'stem borer', 'banana pest', 'gummy sap', 'toppling'],
  },
  {
    id: 'banana-panama-wilt',
    name: 'Banana Panama Wilt',
    emoji: '\u{1F940}',
    crop: 'Banana',
    kind: 'disease',
    summary:
      'A soil fungus that blocks the plant from the inside, so the leaves collapse around the stem and the plant never recovers. It stays in the soil for years.',
    warningSigns: [
      'The older, lower leaves yellowing from the edge inwards and collapsing around the stem like a skirt.',
      'Leaves that stay green but droop and hang down against the pseudostem instead of standing out.',
      'A lengthways split at the base of the pseudostem.',
      'A cut pseudostem showing brown or red-brown streaks inside, with a hollow feel.',
      'One dead plant after another along the line the water runs down the plot.',
    ],
    preventionTips: [
      'Do not plant in a patch where the disease has been seen, and never move suckers or soil out of that patch.',
      'Use clean, certified or tissue-culture suckers, which is the single most important step.',
      'Keep the plot well drained, because standing water moves the fungus along the plot.',
      'Remove an affected plant with its corm and burn it away from the plantation. Do not leave it in the row.',
      'Grow a different crop in the infested patch for a few seasons before planting banana there again.',
      'Clean tools and footwear between plots, and keep them off soil you know is infested.',
    ],
    keywords: ['panama wilt', 'wilt', 'fusarium', 'soil fungus', 'yellowing', 'corm'],
  },
  {
    id: 'banana-sigatoka-leaf-spot',
    name: 'Banana Sigatoka Leaf Spot',
    emoji: '\u{1F342}',
    crop: 'Banana',
    kind: 'disease',
    summary:
      'A leaf spot that begins as thin yellow streaks and ends with most of the leaf dried up, so the plant has less leaf area to fill the bunch with.',
    warningSigns: [
      'Narrow, pale yellow streaks on the leaf that widen into dark brown streaks with a grey centre.',
      'Spots joining together until a large part of the leaf dries from the edge inwards.',
      'Fewer, shorter leaves in the crown than on healthy plants in the same row.',
      'Bunches that fill poorly and ripen unevenly.',
      'The trouble spreading after a warm, wet, humid spell, especially in a crowded plot.',
    ],
    preventionTips: [
      'Keep the spacing wide enough for air to move and for leaves to dry.',
      'Remove badly infected leaves and carry them out of the plantation instead of dropping them in the row.',
      'Keep the plot free of weeds and surplus suckers, which hold the humidity that the disease needs.',
      'Return compost and crop residue to the soil, so the plant has the strength to grow through an attack.',
      'Check the leaves after every long wet spell, and again a week later.',
      'Keep drainage working on the plot, because a waterlogged plant loses leaves faster.',
    ],
    keywords: ['sigatoka', 'leaf spot', 'leaf streak', 'fungus', 'banana disease'],
  },

  // ── 🥬 Vegetables ────────────────────────────────────────────────────────
  {
    id: 'vegetables-aphids',
    name: 'Aphids on Vegetables',
    emoji: '\u{1F41C}',
    crop: 'Vegetables',
    kind: 'pest',
    summary:
      'Clusters of tiny soft insects that suck the sap from the youngest growth, curl it, and leave the honeydew that sooty mould grows on.',
    warningSigns: [
      'Clusters of tiny green, black or brown insects on the underside of the newest leaves and around the growing tip.',
      'Leaves twisting and curling, with the young growth crinkled and sticky to the touch.',
      'Black sooty mould growing on the honeydew left on the lower leaves.',
      'Ants running up and down the stems, which is a reliable sign there are aphids above them.',
      'Weak, pale young plants that stop growing for no reason you can see in the soil or the water.',
    ],
    preventionTips: [
      'Check the underside of the youngest leaves twice a week; that is where the first colony always starts.',
      'Keep the plot and the edges free of weeds, because most aphids move off weeds onto the crop.',
      'Leave a few flowering plants at the edge to keep ladybirds, hoverflies and lacewings about.',
      'Wash a light colony off with a strong jet of water before it builds up.',
      'Remove and carry out heavily infested leaves instead of dropping them on the plot.',
      'Avoid heavy nitrogen on leafy crops; soft, dark leaf growth is what aphids choose first.',
    ],
    keywords: ['aphid', 'aphids', 'sap sucking', 'curling', 'sooty mould', 'ants', 'greenfly'],
  },
  {
    id: 'vegetables-damping-off',
    name: 'Damping Off in the Nursery',
    emoji: '\u{1F9A0}',
    crop: 'Vegetables',
    kind: 'disease',
    summary:
      'A soil problem in the nursery bed that pinches the seedling off at soil level, so a patch of healthy seedlings falls over in a few days.',
    warningSigns: [
      'Seedlings falling over at soil level, usually in a small circle that gets wider each day.',
      'The stem at the soil line pinched, water-soaked and soft, with the root below it brown and rotting.',
      'A nursery patch that dies from one point outwards rather than evenly across the bed.',
      'The trouble appearing a few days after heavy watering, a cloudy spell, or sowing too thickly.',
      'Seedlings that come up well and then fail just as the first true leaves appear.',
    ],
    preventionTips: [
      'Keep the nursery bed well drained, and never let it stand in water.',
      'Water in the morning, so the surface dries through the day rather than staying wet overnight.',
      'Sow thinly and at the right time, using a light, well-rotted sowing medium.',
      'Raise the nursery in trays on a bench rather than on the soil floor, which keeps it away from the fungus.',
      'Keep the tools and the bed clear of old crop residue and re-used soil from a bed that failed.',
      'Move the nursery to a fresh site for the next season, rather than sowing the same bed again.',
    ],
    keywords: ['damping off', 'nursery', 'seedling', 'collapse', 'soil borne', 'seed rot'],
  },
  {
    id: 'vegetables-powdery-mildew',
    name: 'Powdery Mildew in Vegetables',
    emoji: '\u{1F342}',
    crop: 'Vegetables',
    kind: 'disease',
    summary:
      'A white powder on the upper surface of the leaves that takes the light away from the plant, so the leaves dry and the crop stops growing.',
    warningSigns: [
      'White, powdery patches on the upper surface of the leaves, as though flour has been dusted on.',
      'The leaf surface under the powder going yellow, with the edges curling upwards.',
      'The trouble starting on the shaded, crowded parts of the plot and moving outwards.',
      'Leaves drying from the edge inwards, until only the leaf stalks are left green.',
      'The powder appearing in weather with humid nights and dry, warm days.',
    ],
    preventionTips: [
      'Space the plants so air moves between them and the leaves dry quickly.',
      'Water at the base in the morning and keep the leaves dry.',
      'Remove the first affected leaves early, and take them out of the plot.',
      'Keep the plot free of weeds and crop residue, which keep the air still and damp around the plants.',
      'Rotate the bed to a different plant family next season, so the same crop is not in the same ground twice.',
      'Keep the plants evenly watered, because a plant that dries out between waterings suffers more.',
    ],
    keywords: ['powdery mildew', 'mildew', 'white powder', 'fungus', 'leaf drying'],
  },
];

/**
 * ⚠️ The signs worth a walk through the field, whatever the crop is.
 *
 * These are not symptoms of any one problem. They are the habits of looking that
 * catch a problem while it is still small enough to be handled by hand, which is
 * what the rest of this page assumes a farmer is doing.
 */
export const WARNING_SIGNS: readonly WarningSign[] = [
  {
    id: 'starts-in-a-patch',
    emoji: '\u{1F440}',
    title: 'It starts in a patch, not in the whole field',
    detail:
      'Pests and diseases almost always begin in one corner, one row or one plant. Walk the field from a different direction each time, and a problem is caught while it is still a patch.',
    keywords: ['patch', 'walk', 'scouting', 'one corner', 'early'],
  },
  {
    id: 'oldest-leaves-first',
    emoji: '\u{1F342}',
    title: 'The oldest leaves fail first',
    detail:
      'Yellowing, spotting or drying that begins on the lowest, oldest leaves usually points to a disease or to a shortage in the soil. Damage that begins on the newest growth usually points to a pest or to spray drift.',
    keywords: ['oldest leaves', 'lower leaves', 'new growth', 'yellowing', 'pattern'],
  },
  {
    id: 'turn-the-leaf-over',
    emoji: '\u{1F50D}',
    title: 'Turn the leaf over before you decide',
    detail:
      'Most insects, their young and their eggs live out of sight on the underside of a leaf or behind the stem. A plant looks clean from above long after it has stopped being clean.',
    keywords: ['underside', 'under the leaf', 'eggs', 'look closely', 'inspect'],
  },
  {
    id: 'walk-early-and-late',
    emoji: '\u{1F305}',
    title: 'Look early in the morning and again at dusk',
    detail:
      'Many caterpillars feed at dusk and at first light and hide in the soil during the heat of the day. A morning walk shows damage that a midday walk misses completely.',
    keywords: ['morning', 'evening', 'dusk', 'timing', 'caterpillar', 'hiding'],
  },
  {
    id: 'sticky-powdery-gummy',
    emoji: '\u{1F4A7}',
    title: 'Sticky, powdery or gummy',
    detail:
      'Honeydew and black sooty mould point to sap-sucking insects. A white powder points to a fungal problem. A gummy ooze running out of a stem points to a borer feeding inside it.',
    keywords: ['sticky', 'honeydew', 'sooty', 'powder', 'gum', 'sap'],
  },
  {
    id: 'empty-harvest',
    emoji: '\u{1F33E}',
    title: 'A harvest that comes in empty',
    detail:
      'Empty tillers, flowers that set nothing and fruit that stays small are the harvest-stage signs of something that began weeks earlier. Write them down, so next season is planned with what you learned.',
    keywords: ['empty', 'yield', 'flower drop', 'small fruit', 'record'],
  },
  {
    id: 'after-the-weather-turns',
    emoji: '\u{1F326}\uFE0F',
    title: 'Two or three days after the weather turns',
    detail:
      'Most fungal disease follows wet, cloudy, dew-heavy days. Walk the field two or three days afterwards, and again a week later, because that is when the first spots can be seen.',
    keywords: ['weather', 'rain', 'humidity', 'dew', 'cloudy', 'after rain'],
  },
];

/**
 * 💡 The prevention habits that apply to every crop on this page.
 *
 * Each one is numbered so the order is easy to remember, and each one is written
 * to hold on any soil. Nothing here names a product, because a habit is what a
 * farmer can act on today, while a product is a decision for an expert.
 */
export const PREVENTION_TIPS: readonly PreventionTip[] = [
  {
    id: 'clean-planting-material',
    title: 'Start with clean seed and healthy planting material',
    detail:
      'Most disease, and several pests, arrive with the seed, the seedling or the sucker. Certified seed and a nursery you trust cost a little more and can save the whole season.',
    keywords: ['seed', 'seedling', 'sucker', 'certified', 'clean material', 'nursery'],
  },
  {
    id: 'clear-field-edges',
    title: 'Keep the field and its edges clear',
    detail:
      'Weeds on the bund, old crop residue and a pile of cut stems are where pests and spores sit out the gap between crops. Clearing them is the cheapest step on this list.',
    keywords: ['weeds', 'residue', 'bund', 'field hygiene', 'clean up', 'stubble'],
  },
  {
    id: 'room-light-air',
    title: 'Give every plant room, light and air',
    detail:
      'A crowded plant stays wet longer, grows softer and is harder to inspect. Correct spacing is a disease-prevention measure, not only a layout choice.',
    keywords: ['spacing', 'air', 'light', 'crowding', 'pruning', 'canopy'],
  },
  {
    id: 'water-at-the-base',
    title: 'Water at the base, early in the day',
    detail:
      'Wet leaves are where fungal disease begins, and evening watering leaves them wet all night. Watering the soil in the morning keeps the leaf dry and the root happy.',
    keywords: ['watering', 'irrigation', 'wet leaves', 'base', 'morning', 'drip'],
  },
  {
    id: 'balanced-feeding',
    title: 'Feed for balance, not for size',
    detail:
      'A very heavy dose of nitrogen makes soft, dark, leafy growth that sap-sucking pests prefer and that fungal disease attacks more easily. Balanced feeding grows a tougher plant.',
    keywords: ['nitrogen', 'fertilizer', 'balance', 'soft growth', 'feeding', 'nutrition'],
  },
  {
    id: 'rotate-and-change',
    title: 'Change what you grow where, and when',
    detail:
      'Growing the same family in the same ground season after season lets soil disease and resting pests build up. A rotation break, and sowing at the usual time, both cut the risk.',
    keywords: ['rotation', 'crop change', 'season', 'sowing time', 'soil disease', 'break crop'],
  },
  {
    id: 'walk-twice-a-week',
    title: 'Walk the field twice a week and write down what you see',
    detail:
      'A notebook of dates, patches and what changed is what turns a guess into a decision. It also lets an agricultural officer help you from a distance, because you can describe the pattern.',
    keywords: ['walk', 'scouting', 'notebook', 'record', 'notes', 'monitor'],
  },
  {
    id: 'protect-the-helpers',
    title: 'Protect the insects that are already working for you',
    detail:
      'Ladybirds, spiders, dragonflies, ground beetles and parasitic wasps take a large share of the pests every day. Killing them off removes the control you already had for free.',
    keywords: ['predators', 'natural enemies', 'ladybird', 'spiders', 'helpful insects', 'biological'],
  },
];

/**
 * Where trouble usually starts in each crop.
 *
 * This is the note the 🌱 Select Crop card shows. It is short on purpose: a
 * farmer who has just chosen a crop should be told where to look first, not
 * given a second copy of the problem list below it.
 */
export const CROP_WATCH_NOTES: readonly CropWatchNote[] = [
  {
    crop: 'Paddy',
    note: 'Paddy is troubled most in the weeks of standing water and heavy night dew. Look at the base of the tillers, where borers enter, and at the leaf tips and the neck of the earhead, where blast and blight begin.',
  },
  {
    crop: 'Tomato',
    note: 'Tomato is troubled most when the leaves stay wet and the air cannot move through the plant. Stake early, water at the base, and turn the youngest leaves over to check for sap-sucking insects.',
  },
  {
    crop: 'Coconut',
    note: 'Coconut is troubled most at the crown, where the beetle bores and where rot settles in after a long wet spell. Keep the crown clean and check it once a week through the rains.',
  },
  {
    crop: 'Banana',
    note: 'Banana is troubled most at the base of the stem and in the soil itself. Clean, healthy suckers, a drained plot and a rotation break prevent more than anything applied afterwards.',
  },
  {
    crop: 'Vegetables',
    note: 'Vegetables are troubled most as seedlings, and again as soft leafy growth. A drained nursery bed, steady moisture and clear spacing prevent the worst of both.',
  },
];

/**
 * The note shown when the chosen crop has no entry above, which happens when the
 * farmer picks a crop from their profile that this demo content does not cover.
 */
export const GENERAL_CROP_WATCH_NOTE =
  'Every crop has its own habits, but the same three things protect all of them: clean planting material, air and light around the plant, and a field walk you do not skip. Once you have chosen a crop, ask your local agricultural officer which two or three problems matter most where you farm.';

/** One flat entry the 🔎 search can match, whatever table it came from. */
export type CropHealthSearchEntry = {
  id: string;
  emoji: string;
  title: string;
  detail: string;
  /** The heading of the section this entry came from. */
  section: string;
  /**
   * The crops the entry applies to. An empty list means it applies to every
   * crop, which is true of the 🐛🍃 information cards and the 💡 prevention list.
   */
  crops: string[];
  keywords: string[];
  /**
   * Set when the entry is a problem, so the screen can show the full clickable
   * problem card instead of a plain result line.
   */
  problemId?: string;
};

/** "🐛 Pest" or "🍃 Disease", for the badge on a problem card. */
export function problemKindLabel(kind: CropProblemKind): string {
  return kind === 'pest' ? 'Pest' : 'Disease';
}

/** The emoji that marks a whole family of problems. */
export function problemKindEmoji(kind: CropProblemKind): string {
  return kind === 'pest' ? '\u{1F41B}' : '\u{1F343}';
}

/**
 * Every problem for one crop, or every problem in the guide when the crop is
 * blank, which is what the "All crops" chip asks for.
 */
export function problemsForCrop(
  crop: string,
  problems: readonly CropProblem[] = CROP_PROBLEMS
): CropProblem[] {
  const needle = crop.trim().toLowerCase();

  if (needle === '') {
    return [...problems];
  }

  return problems.filter((problem) => problem.crop.toLowerCase() === needle);
}

/** Just the 🐛 pests for a crop, used by the Pest Information card. */
export function problemsOfKindForCrop(
  crop: string,
  kind: CropProblemKind,
  problems: readonly CropProblem[] = CROP_PROBLEMS
): CropProblem[] {
  return problemsForCrop(crop, problems).filter((problem) => problem.kind === kind);
}

/** Counts a crop's problems, for the badge on a filter chip. */
export function problemCountForCrop(
  crop: string,
  problems: readonly CropProblem[] = CROP_PROBLEMS
): number {
  return problemsForCrop(crop, problems).length;
}

/**
 * The crops that have at least one problem in this guide, so the picker can
 * never offer a crop that leads to an empty page.
 */
export function cropNamesWithProblems(
  problems: readonly CropProblem[] = CROP_PROBLEMS
): string[] {
  const names = new Set<string>();

  for (const problem of problems) {
    names.add(problem.crop);
  }

  return [...names];
}

/**
 * The 🌱 Select Crop dropdown, with a first row that clears the filter.
 *
 * The option values are the crop names themselves, and the first option uses an
 * empty value so `SelectField` shows its placeholder — "All crops" — exactly the
 * way an unset field looks everywhere else in the app.
 */
export function cropFilterOptions(
  crops: readonly string[] = cropNamesWithProblems()
): SelectOption[] {
  return [
    { label: ALL_CROPS_LABEL, value: '' },
    ...crops.map((crop) => ({ label: crop, value: crop })),
  ];
}

/** The note shown under the crop picker for the chosen crop. */
export function watchNoteForCrop(crop: string): string {
  const needle = crop.trim().toLowerCase();

  if (needle === '') {
    return GENERAL_CROP_WATCH_NOTE;
  }

  const match = CROP_WATCH_NOTES.find((entry) => entry.crop.toLowerCase() === needle);

  return match?.note ?? GENERAL_CROP_WATCH_NOTE;
}

/**
 * Flattens every table into one list the 🔎 search can look through.
 *
 * A problem entry carries its `problemId`, so a result that is a problem is
 * shown as the full clickable card, warning signs and prevention tips included.
 * The other entries are single lines of information and are shown as simple
 * result cards. The list is rebuilt once per screen render and is small enough
 * that a plain `includes` over the joined text is fast — a backend would do the
 * searching later and would return the same `CropHealthSearchEntry` shape.
 */
export function buildCropHealthSearchIndex(): CropHealthSearchEntry[] {
  return [
    ...CROP_PROBLEMS.map((problem) => ({
      id: `problem-${problem.id}`,
      emoji: problem.emoji,
      title: problem.name,
      detail: `${problem.crop} · ${problemKindLabel(problem.kind)}. ${problem.summary}`,
      section: 'Common Crop Problems',
      crops: [problem.crop],
      keywords: [...problem.keywords, ...problem.warningSigns, ...problem.preventionTips],
      problemId: problem.id,
    })),
    ...PROBLEM_KIND_INFORMATION.map((info) => ({
      id: `kind-${info.kind}`,
      emoji: info.emoji,
      title: info.title,
      detail: `${info.summary} ${info.spread}`,
      section: `${problemKindLabel(info.kind)} Information`,
      crops: [],
      keywords: [...info.keywords, ...info.tells],
    })),
    ...WARNING_SIGNS.map((sign) => ({
      id: `sign-${sign.id}`,
      emoji: sign.emoji,
      title: sign.title,
      detail: sign.detail,
      section: 'Warning Signs',
      crops: [],
      keywords: sign.keywords,
    })),
    ...PREVENTION_TIPS.map((tip) => ({
      id: `prevention-${tip.id}`,
      emoji: '\u{1F4A1}',
      title: tip.title,
      detail: tip.detail,
      section: 'General Prevention Tips',
      crops: [],
      keywords: tip.keywords,
    })),
    ...CROP_WATCH_NOTES.map((watch) => ({
      id: `crop-${watch.crop}`,
      emoji: '\u{1F331}',
      title: `${watch.crop}: where trouble starts`,
      detail: watch.note,
      section: 'Select Crop',
      crops: [watch.crop],
      keywords: [watch.crop, 'look first', 'watch', 'where to look'],
    })),
  ];
}

/**
 * Searches the guide by problem, sign, habit or crop, and honours the crop
 * filter at the same time.
 *
 * Entries that apply to every crop — the 🐛🍃 information cards and the 💡
 * prevention list — stay in the results whichever crop is chosen, because they
 * are never wrong for the crop on screen. A blank query returns nothing, which
 * lets the page show its sections instead of a result list.
 */
export function searchCropHealthContent(
  query: string,
  crop = '',
  index: readonly CropHealthSearchEntry[] = buildCropHealthSearchIndex()
): CropHealthSearchEntry[] {
  const needle = query.trim().toLowerCase();

  if (needle === '') {
    return [];
  }

  const cropNeedle = crop.trim().toLowerCase();

  return index.filter((entry) => {
    const matchesCrop =
      cropNeedle === '' ||
      entry.crops.length === 0 ||
      entry.crops.some((entryCrop) => entryCrop.toLowerCase() === cropNeedle);

    if (!matchesCrop) {
      return false;
    }

    return [entry.title, entry.detail, entry.section, ...entry.keywords]
      .join(' ')
      .toLowerCase()
      .includes(needle);
  });
}