import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AgriRadius, AgriTypography, type AgriPalette } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import type { CropHealth, FarmField } from '@/models/farm';

type FieldCardProps = {
  field: FarmField;
  /** Opens the Field Details screen for this field. */
  onPress: () => void;
  /** Opens Edit Field for this field. */
  onEdit?: () => void;
  /** Asks the screen to show the delete confirmation for this field. */
  onDelete?: () => void;
};

/**
 * One field on the My Farm page, with the crop details for that field.
 *
 * A field with no crop shows a clear "fallow" message instead of an empty
 * details block, so it is obvious the field exists and is simply unplanted.
 *
 * The body opens Field Details, and the ✏️ Edit and 🗑 Delete buttons underneath
 * act on the field directly, so a farmer can correct a typo or drop a plot they
 * entered twice without opening it first. Delete is a button of its own and is
 * always followed by a confirmation, because a field that is gone takes its crop
 * and its size out of the farm totals with it.
 */
export function FieldCard({ field, onPress, onEdit, onDelete }: FieldCardProps) {
  const colors = useAgriTheme();
  const { crop } = field;

  // A field added without a note shows the details it was recorded with, so
  // the location, irrigation and soil the farmer just typed are not invisible.
  const recordedDetails = [field.location, field.irrigation, field.soil]
    .filter(Boolean)
    .join(' · ');

  const showActions = Boolean(onEdit || onDelete);

  return (
    <View
      testID={`field-card-${field.id}`}
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${field.name}, ${field.areaAcres} acres. Open field details.`}
        onPress={onPress}
        style={({ pressed }) => [styles.body, pressed && styles.pressed]}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={[styles.fieldName, { color: colors.text }]} numberOfLines={1}>
              {field.name}
            </Text>

            {field.note ? (
              <Text style={[styles.note, { color: colors.textSecondary }]} numberOfLines={2}>
                {field.note}
              </Text>
            ) : recordedDetails ? (
              <Text style={[styles.note, { color: colors.textSecondary }]} numberOfLines={2}>
                {recordedDetails}
              </Text>
            ) : null}
          </View>

          <View style={[styles.areaBadge, { backgroundColor: colors.primarySoft }]}>
            <Text style={[styles.areaText, { color: colors.primaryDark }]}>
              {field.areaAcres} ac
            </Text>
          </View>
        </View>

        {crop ? (
          <View style={[styles.cropBlock, { borderTopColor: colors.border }]}>
            <View style={styles.cropHeader}>
              <Text style={styles.cropEmoji}>{'\u{1F33F}'}</Text>

              <View style={styles.cropNameGroup}>
                <Text style={[styles.cropName, { color: colors.text }]} numberOfLines={1}>
                  {crop.name}
                </Text>
                {crop.variety ? (
                  <Text style={[styles.variety, { color: colors.textSecondary }]} numberOfLines={1}>
                    {crop.variety}
                  </Text>
                ) : null}
              </View>

              {crop.health ? <HealthBadge health={crop.health} /> : null}
            </View>

            {crop.stage && crop.sownOn && crop.expectedHarvest ? (
              <View style={styles.detailsRow}>
                <Detail label="Stage" value={crop.stage} />
                <Detail label="Sown" value={crop.sownOn} />
                <Detail label="Harvest" value={crop.expectedHarvest} />
              </View>
            ) : (
              <Text style={[styles.pendingDetails, { color: colors.textSecondary }]}>
                Growing details not added yet
              </Text>
            )}
          </View>
        ) : (
          <View style={[styles.cropBlock, { borderTopColor: colors.border }]}>
            <View style={styles.fallowRow}>
              <Text style={styles.cropEmoji}>{'\u{1F331}'}</Text>
              <View style={styles.cropNameGroup}>
                <Text style={[styles.cropName, { color: colors.text }]}>Fallow</Text>
                <Text style={[styles.variety, { color: colors.textSecondary }]}>
                  Nothing planted in this field
                </Text>
              </View>
            </View>
          </View>
        )}
      </Pressable>

      {showActions ? (
        <View style={[styles.actions, { borderTopColor: colors.border }]}>
          {onEdit ? (
            <Pressable
              testID={`field-edit-${field.id}`}
              accessibilityRole="button"
              accessibilityLabel={`Edit ${field.name}`}
              onPress={onEdit}
              style={({ pressed }) => [styles.action, pressed && styles.pressed]}>
              <Text style={[styles.actionLabel, { color: colors.primary }]}>
                {'\u270F\uFE0F  Edit'}
              </Text>
            </Pressable>
          ) : null}

          {onDelete ? (
            <Pressable
              testID={`field-delete-${field.id}`}
              accessibilityRole="button"
              accessibilityLabel={`Delete ${field.name}`}
              onPress={onDelete}
              style={({ pressed }) => [styles.action, pressed && styles.pressed]}>
              <Text style={[styles.actionLabel, { color: colors.danger }]}>
                {'\u{1F5D1}\uFE0F  Delete'}
              </Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

type HealthBadgeProps = {
  health: CropHealth;
};

/**
 * Coloured badge showing how a crop is doing. The colour comes from the theme so
 * it stays readable in dark mode.
 */
function HealthBadge({ health }: HealthBadgeProps) {
  const colors = useAgriTheme();

  const { background, text } = getHealthColors(health, colors);

  return (
    <View style={[styles.badge, { backgroundColor: background }]}>
      <View style={[styles.badgeDot, { backgroundColor: text }]} />
      <Text style={[styles.badgeText, { color: text }]} numberOfLines={1}>
        {health}
      </Text>
    </View>
  );
}

type DetailProps = {
  label: string;
  value: string;
};

/** One labelled crop detail, such as the sowing date. */
function Detail({ label, value }: DetailProps) {
  const colors = useAgriTheme();

  return (
    <View style={styles.detail}>
      <Text style={[styles.detailLabel, { color: colors.textSecondary }]} numberOfLines={1}>
        {label}
      </Text>
      <Text style={[styles.detailValue, { color: colors.text }]} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

/** Maps a crop health to the background and text colour of its badge. */
function getHealthColors(
  health: CropHealth,
  colors: AgriPalette
): { background: string; text: string } {
  if (health === 'Action needed') {
    return { background: colors.dangerSoft, text: colors.danger };
  }
  if (health === 'Watch') {
    return { background: colors.warningSoft, text: colors.warning };
  }
  return { background: colors.primarySoft, text: colors.primaryDark };
}

const styles = StyleSheet.create({
  card: {
    borderRadius: AgriRadius.large,
    borderWidth: 1,
    overflow: 'hidden',
  },
  body: {
    padding: Spacing.three,
  },
  pressed: {
    opacity: 0.85,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.two,
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  fieldName: {
    ...AgriTypography.subtitle,
    fontWeight: '700',
  },
  note: {
    ...AgriTypography.caption,
  },
  areaBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: AgriRadius.pill,
  },
  areaText: {
    ...AgriTypography.caption,
    fontWeight: '700',
  },
  cropBlock: {
    borderTopWidth: 1,
    marginTop: Spacing.three,
    paddingTop: Spacing.three,
    gap: Spacing.three,
  },
  cropHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  fallowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  cropEmoji: {
    fontSize: 20,
    lineHeight: 26,
  },
  cropNameGroup: {
    flex: 1,
  },
  cropName: {
    ...AgriTypography.body,
    fontWeight: '700',
  },
  variety: {
    ...AgriTypography.caption,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: AgriRadius.pill,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  badgeText: {
    ...AgriTypography.caption,
    fontSize: 12,
    fontWeight: '700',
  },
  detailsRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  detail: {
    flex: 1,
    gap: 2,
  },
  detailLabel: {
    ...AgriTypography.caption,
    fontSize: 12,
  },
  detailValue: {
    ...AgriTypography.caption,
    fontWeight: '700',
  },
  pendingDetails: {
    ...AgriTypography.caption,
    fontWeight: '400',
  },
  actions: {
    flexDirection: 'row',
    borderTopWidth: 1,
  },
  action: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.two,
  },
  actionLabel: {
    ...AgriTypography.caption,
    fontWeight: '700',
  },
});
