import { StyleSheet, Text, View } from 'react-native';

import { SectionCard } from '@/components/ui/section-card';
import { SelectField } from '@/components/ui/select-field';
import { AgriTypography } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAppSettings } from '@/context/app-settings-context';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import {
  LAND_AREA_UNIT_OPTIONS,
  LANGUAGE_OPTIONS,
  type LandAreaUnit,
} from '@/models/app-settings';

/**
 * 🌐 Language and Region.
 *
 * The 🌐 language picker reuses the same dropdown as the forms, so choosing a
 * language behaves exactly like choosing a crop in Edit Profile. The 📐 unit
 * picker is here because the land size is the one number on the profile that is
 * written in two ways, and it changes the 🏠 Farm Information card straight away.
 *
 * The language choice is saved, but the screens are still in English until the
 * translations land, which the note under the picker says plainly.
 */
export function LanguageSettingsCard() {
  const colors = useAgriTheme();
  const { settings, setLanguage, setLandAreaUnit } = useAppSettings();

  return (
    <SectionCard
      title="\u{1F310} Language & Region"
      subtitle="How AgriConnect talks to you and writes your farm size"
      testID="language-settings-card">
      <View style={styles.form}>
        <SelectField
          label="App language"
          value={settings.language}
          options={LANGUAGE_OPTIONS}
          onChange={setLanguage}
          placeholder="Choose a language"
          testID="select-language"
        />

        <SelectField
          label="Land area unit"
          value={settings.landAreaUnit}
          options={LAND_AREA_UNIT_OPTIONS}
          onChange={(value) => setLandAreaUnit(value as LandAreaUnit)}
          placeholder="Choose a unit"
          testID="select-land-area-unit"
        />

        <Text style={[styles.hint, { color: colors.textSecondary }]}>
          Your choice is remembered on this device. The screens stay in English until
          translations are added.
        </Text>
      </View>
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: Spacing.three,
  },
  hint: {
    ...AgriTypography.caption,
    fontWeight: '400',
  },
});
