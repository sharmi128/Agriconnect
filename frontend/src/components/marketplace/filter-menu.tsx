import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AgriRadius, AgriShadows, AgriTypography } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import { ALL_FILTERS, type MarketplaceFilter } from '@/models/marketplace';

type FilterMenuProps = {
  /** The options this category offers, without "All". */
  options: readonly MarketplaceFilter[];
  value: MarketplaceFilter;
  onChange: (value: MarketplaceFilter) => void;
  testID?: string;
};

/**
 * The 🎛️ filter button and the sheet it opens.
 *
 * A filter button that opened a screen would be one tap too many, so the
 * options arrive in a sheet that slides over the bottom of the page. There is
 * always an "All" option first, because every category can be widened again and
 * a farmer who filters by mistake should not have to guess how to undo it.
 *
 * The button itself says which filter is active, so the state is visible without
 * the sheet being open.
 */
export function FilterMenu({ options, value, onChange, testID }: FilterMenuProps) {
  const colors = useAgriTheme();
  const insets = useSafeAreaInsets();
  const [isOpen, setIsOpen] = useState(false);

  const isFiltered = value !== ALL_FILTERS;
  const choices = [ALL_FILTERS, ...options];

  /** Applies the choice and closes the sheet in one tap. */
  function choose(next: MarketplaceFilter) {
    onChange(next);
    setIsOpen(false);
  }

  return (
    <>
      <Pressable
        testID={testID}
        accessibilityRole="button"
        accessibilityLabel={isFiltered ? `Filter: ${value}` : 'Filter'}
        accessibilityState={{ expanded: isOpen }}
        onPress={() => setIsOpen(true)}
        style={({ pressed }) => [
          styles.button,
          isFiltered
            ? { backgroundColor: colors.primarySoft, borderColor: colors.primary }
            : { backgroundColor: colors.surface, borderColor: colors.border },
          pressed && styles.pressed,
        ]}>
        <Text
          style={[
            styles.buttonLabel,
            { color: isFiltered ? colors.primaryDark : colors.textSecondary },
          ]}
          numberOfLines={1}>
          {isFiltered ? value : 'Filter'}
        </Text>
      </Pressable>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}>
        <Pressable
          style={styles.backdrop}
          accessibilityRole="button"
          accessibilityLabel="Close filters"
          onPress={() => setIsOpen(false)}>
          {/* Stops a tap inside the sheet from closing it. */}
          <Pressable
            style={[
              styles.sheet,
              AgriShadows.raised,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                paddingBottom: insets.bottom + Spacing.three,
              },
            ]}
            onPress={() => undefined}>
            <View style={[styles.grabber, { backgroundColor: colors.border }]} />

            <Text style={[styles.sheetTitle, { color: colors.text }]}>Filter by</Text>

            <ScrollView
              style={styles.sheetBody}
              contentContainerStyle={styles.choiceList}
              showsVerticalScrollIndicator={false}>
              {choices.map((choice) => {
                const isActive = choice === value;

                return (
                  <Pressable
                    key={choice}
                    testID={`marketplace-filter-${choice}`}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isActive }}
                    accessibilityLabel={choice}
                    onPress={() => choose(choice)}
                    style={({ pressed }) => [
                      styles.choice,
                      isActive
                        ? { backgroundColor: colors.primarySoft, borderColor: colors.primary }
                        : { backgroundColor: colors.background, borderColor: colors.border },
                      pressed && styles.pressed,
                    ]}>
                    <Text
                      style={[
                        styles.choiceLabel,
                        { color: isActive ? colors.primaryDark : colors.text },
                      ]}
                      numberOfLines={1}>
                      {choice}
                    </Text>

                    {isActive ? (
                      <Text style={[styles.tick, { color: colors.primary }]}>{'\u2713'}</Text>
                    ) : null}
                  </Pressable>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: Spacing.three,
    justifyContent: 'center',
    borderRadius: AgriRadius.large,
    borderWidth: 1,
    // Matches the search field's height so the two line up as one row.
    minHeight: 46,
  },
  buttonLabel: {
    ...AgriTypography.label,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.75,
  },
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(26, 26, 23, 0.45)',
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderBottomWidth: 0,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
    gap: 2,
  },
  grabber: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: Spacing.three,
  },
  sheetTitle: {
    ...AgriTypography.subtitle,
    fontWeight: '700',
    marginBottom: Spacing.two,
  },
  sheetBody: {
    maxHeight: 320,
  },
  choiceList: {
    gap: Spacing.two,
    paddingBottom: Spacing.two,
  },
  choice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    borderRadius: AgriRadius.medium,
    borderWidth: 1,
  },
  choiceLabel: {
    ...AgriTypography.body,
    fontWeight: '600',
  },
  tick: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '700',
  },
});
