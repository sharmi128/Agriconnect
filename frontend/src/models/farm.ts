/**
 * My Farm data model and demo data.
 *
 * All of this is local placeholder data. When the Spring Boot backend is ready,
 * `DEMO_FARM` becomes a fetch and the shapes can stay the same, so the components
 * below do not have to change.
 */

/** How far along a crop is. */
export type CropStage =
  | 'Sowing'
  | 'Germination'
  | 'Vegetative'
  | 'Flowering'
  | 'Fruiting'
  | 'Maturity'
  | 'Harvested';

/** How well a crop is doing, shown as a coloured badge. */
export type CropHealth = 'Good' | 'Watch' | 'Action needed';

/** The crop growing in one field. */
export type FieldCrop = {
  name: string;
  /** Seed variety, for example "IR-64". */
  variety?: string;
  stage?: CropStage;
  /** Date the crop was sown, for example "12 Jun 2026". */
  sownOn?: string;
  /** Expected harvest date, for example "20 Oct 2026". */
  expectedHarvest?: string;
  health?: CropHealth;
};

/** One field, or plot, on the farm. */
export type FarmField = {
  id: string;
  name: string;
  /** Size in acres, for example "0.8". */
  areaAcres: string;
  /** `null` when the field is left fallow, meaning nothing is planted. */
  crop: FieldCrop | null;
  /** Short note about the field, for example the soil condition. */
  note?: string;
  /** Where the field is, added when the farmer records it in Add Field. */
  location?: string;
  /** How the field is watered, added when the farmer records it. */
  irrigation?: string;
  /** What the field grows in, added when the farmer records it. */
  soil?: string;
};

/**
 * Demo farm. The three field sizes add up to 2.00 acres, which matches the
 * default land area on the farmer profile.
 */
export const DEMO_FARM: {
  name: string;
  fields: FarmField[];
} = {
  name: 'Kamau Farm',
  fields: [
    {
      id: 'field-north',
      name: 'North Field',
      areaAcres: '0.8',
      crop: {
        name: 'Paddy',
        variety: 'IR-64',
        stage: 'Maturity',
        sownOn: '12 Jun 2026',
        expectedHarvest: '20 Oct 2026',
        health: 'Good',
      },
      note: 'Low-lying, holds water well',
    },
    {
      id: 'field-east',
      name: 'East Field',
      areaAcres: '0.7',
      crop: {
        name: 'Tomato',
        variety: 'Roma',
        stage: 'Fruiting',
        sownOn: '02 Aug 2026',
        expectedHarvest: '05 Oct 2026',
        health: 'Watch',
      },
      note: 'Check for leaf spot this week',
    },
    {
      id: 'field-south',
      name: 'South Field',
      areaAcres: '0.5',
      crop: null,
      note: 'Fallow, improved with compost',
    },
  ],
};

/**
 * Adds up the field sizes, so the overview total always matches the fields
 * listed underneath it. Returns a number, not text, so callers can format it.
 */
export function totalAreaAcres(fields: FarmField[]): number {
  return fields.reduce((total, field) => total + (Number(field.areaAcres) || 0), 0);
}

/**
 * Formats a total for display, for example "2 Acres" or "2.5 Acres".
 * Trailing zeros are dropped so whole numbers stay clean.
 */
export function formatAcres(acres: number): string {
  const rounded = Math.round(acres * 100) / 100;
  return `${rounded} ${rounded === 1 ? 'Acre' : 'Acres'}`;
}

/** The names of the crops currently growing, without duplicates. */
export function growingCrops(fields: FarmField[]): string[] {
  const names = fields
    .map((field) => field.crop?.name)
    .filter((name): name is string => Boolean(name));

  return Array.from(new Set(names));
}

/** How many fields are not planted. */
export function fallowFieldCount(fields: FarmField[]): number {
  return fields.filter((field) => field.crop === null).length;
}

/** How many fields have a crop planted in them. */
export function plantedFieldCount(fields: FarmField[]): number {
  return fields.length - fallowFieldCount(fields);
}

/** Everything the overview card and the dashboard card report about the farm. */
export type FarmSummary = {
  fieldCount: number;
  fallowCount: number;
  plantedCount: number;
  totalAcres: number;
  crops: string[];
};

/**
 * Adds up the farm in one place.
 *
 * The My Farm overview and the Home dashboard both need the same handful of
 * numbers, and both must agree. Working them out once here means a field added
 * or deleted cannot make the two screens tell different stories.
 */
export function summarizeFarm(fields: FarmField[]): FarmSummary {
  return {
    fieldCount: fields.length,
    fallowCount: fallowFieldCount(fields),
    plantedCount: plantedFieldCount(fields),
    totalAcres: totalAreaAcres(fields),
    crops: growingCrops(fields),
  };
}
