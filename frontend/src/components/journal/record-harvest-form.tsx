import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { SelectField } from '@/components/ui/select-field';
import { TextField } from '@/components/ui/text-field';
import { AgriRadius, AgriTypography } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import {
  HARVEST_UNIT_OPTIONS,
  cropOptionsFor,
  formatHarvestQuantity,
  isHarvestUnit,
  toKilograms,
  type HarvestUnit,
  type JournalCrop,
} from '@/models/crop-journal';
import { formatToday } from '@/models/expenses';
import { validateHarvestForm, type HarvestFormValues } from '@/utils/journal-validation';
import { hasErrors, type FieldErrors } from '@/utils/validation';

/** What the form hands back once a valid harvest has been recorded. */
export type HarvestDraft = {
  cropId: string;
  /** Already converted to kilograms, so the totals stay correct. */
  quantityKg: number;
  unit: HarvestUnit;
  value: number;
};

type RecordHarvestFormProps = {
  crops: JournalCrop[];
  /** The crop selected on the My Crops list, which the form starts on. */
  selectedCropId: string;
  /** Called when the crop changes here, so the timeline above follows along. */
  onCropChange: (cropId: string) => void;
  onSubmit: (draft: HarvestDraft) => void;
};

/**
 * 🌾 Record a harvest: ⚖️ the quantity and 💰 the value.
 *
 * The unit is a dropdown because a farmer may weigh in kilograms or in quintals,
 * and everything is converted to kilograms before it leaves the form. When a
 * quintal amount is typed, the converted total is shown underneath, so the
 * figure that gets saved is never a surprise.
 *
 * Recording a harvest does not change the crop's stage. A tomato patch is picked
 * several times while it is still fruiting, so only the farmer saying so in a
 * growth update should mark a crop as harvested.
 */
export function RecordHarvestForm({
  crops,
  selectedCropId,
  onCropChange,
  onSubmit,
}: RecordHarvestFormProps) {
  const colors = useAgriTheme();

  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('kg');
  const [value, setValue] = useState('');
  const [errors, setErrors] = useState<FieldErrors<HarvestFormValues>>({});

  const quantityNumber = Number(quantity.trim());
  // Only shown when a conversion actually changes the number.
  const convertedQuantityKg =
    unit === 'quintal' && Number.isFinite(quantityNumber) && quantityNumber > 0
      ? toKilograms(quantityNumber, 'quintal')
      : null;

  function handleSubmit() {
    const nextErrors = validateHarvestForm({ cropId: selectedCropId, quantity, unit, value });

    if (hasErrors(nextErrors)) {
      setErrors(nextErrors);
      return;
    }

    // Validation above guarantees this, and the guard keeps the cast out.
    if (!isHarvestUnit(unit)) {
      return;
    }

    onSubmit({
      cropId: selectedCropId,
      quantityKg: toKilograms(quantityNumber, unit),
      unit,
      value: Number(value.trim()),
    });

    // Clear the form, so the next harvest starts blank. The unit is left as it
    // was, because a farmer usually records the whole season in one unit.
    setQuantity('');
    setValue('');
    setErrors({});
  }

  return (
    <View
      testID="record-harvest-form"
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Text style={[styles.hint, { color: colors.textSecondary }]}>
        Recorded with today&apos;s date, {formatToday()}.
      </Text>

      <SelectField
        label="Crop"
        value={selectedCropId}
        options={cropOptionsFor(crops)}
        onChange={onCropChange}
        placeholder="Select a crop"
        error={errors.cropId}
        testID="journal-harvest-crop"
      />

      <TextField
        label="⚖️ Harvest Quantity"
        value={quantity}
        onChangeText={(next) => {
          setQuantity(next);
          setErrors((current) => ({ ...current, quantity: undefined }));
        }}
        placeholder="For example 60"
        error={errors.quantity}
        keyboardType="decimal-pad"
        testID="journal-harvest-quantity"
      />

      <SelectField
        label="Unit"
        value={unit}
        options={HARVEST_UNIT_OPTIONS}
        onChange={(next) => {
          setUnit(next);
          setErrors((current) => ({ ...current, unit: undefined }));
        }}
        error={errors.unit}
        testID="journal-harvest-unit"
      />

      {convertedQuantityKg !== null ? (
        <Text style={[styles.converted, { color: colors.textSecondary }]}>
          Saved as {formatHarvestQuantity(convertedQuantityKg)}
        </Text>
      ) : null}

      <TextField
        label="💰 Harvest Value (₹)"
        value={value}
        onChangeText={(next) => {
          setValue(next);
          setErrors((current) => ({ ...current, value: undefined }));
        }}
        placeholder="For example 1800"
        error={errors.value}
        keyboardType="number-pad"
        testID="journal-harvest-value"
      />

      <Button label="Save Harvest" onPress={handleSubmit} testID="journal-save-harvest" />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.three,
    borderRadius: AgriRadius.large,
    borderWidth: 1,
    gap: Spacing.three,
  },
  hint: {
    ...AgriTypography.caption,
    fontWeight: '400',
  },
  converted: {
    ...AgriTypography.caption,
    fontSize: 12,
    marginTop: -Spacing.two,
  },
});
