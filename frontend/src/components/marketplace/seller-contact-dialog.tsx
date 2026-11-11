import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { ListingImage } from '@/components/marketplace/listing-image';
import { Button } from '@/components/ui/button';
import { AgriRadius, AgriShadows, AgriTypography } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import { marketplaceCategory, type MarketplaceListing } from '@/models/marketplace';
import { listingImageKey } from '@/models/marketplace-images';

type SellerContactDialogProps = {
  listing: MarketplaceListing;
  visible: boolean;
  onClose: () => void;
  testID?: string;
};

/**
 * The seller's card, shown as a sheet over the product details page.
 *
 * A farmer's next step after reading a listing is to speak to whoever posted it,
 * so the sheet carries the three things that step needs: who they are, where
 * they are, and the number to use. The listing is repeated at the top of the
 * sheet so the number is never shown next to a title that has scrolled away.
 *
 * Call and Message are deliberately inert. There is no backend and no messaging
 * service behind the marketplace yet, and the numbers in the demo data are not
 * anyone's real line, so the buttons confirm the intent on the sheet itself
 * rather than opening a dialler that would ring a stranger. When the backend is
 * ready, the two handlers become the API calls and nothing else here has to
 * change.
 */
export function SellerContactDialog({
  listing,
  visible,
  onClose,
  testID,
}: SellerContactDialogProps) {
  const colors = useAgriTheme();
  const category = marketplaceCategory(listing.category);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      testID={testID ?? 'marketplace-seller-contact-dialog'}>
      <View style={styles.backdrop}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close contact details"
          onPress={onClose}
          style={StyleSheet.absoluteFill}
        />

        <View
          style={[
            styles.sheet,
            AgriShadows.raised,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>Contact Seller</Text>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close"
              hitSlop={8}
              onPress={onClose}
              style={({ pressed }) => [styles.close, pressed && styles.pressed]}>
              <Text style={[styles.closeText, { color: colors.textSecondary }]}>
                {'\u2715'}
              </Text>
            </Pressable>
          </View>

          <View style={[styles.listingRow, { borderColor: colors.border }]}>
            <View style={styles.listingThumbnail}>
              <ListingImage image={listingImageKey(listing.id)} tone={listing.tone} height={48} />
            </View>

            <View style={styles.listingText}>
              <Text style={[styles.listingTitle, { color: colors.text }]} numberOfLines={2}>
                {listing.title}
              </Text>
              <Text style={[styles.listingMeta, { color: colors.textSecondary }]}>
                {category.title}
              </Text>
            </View>
          </View>

          <View style={styles.rows}>
            <ContactRow label="Seller" value={listing.postedBy} />
            <ContactRow label="Location" value={listing.location} />
            <ContactRow label="Phone" value={listing.phone} />
          </View>

          <View style={styles.actions}>
            <Button
              label={'\u{1F4DE}  Call Seller'}
              onPress={() => undefined}
              testID="marketplace-contact-call"
            />
            <Button
              label={'\u{1F4AC}  Message Seller'}
              variant="secondary"
              onPress={() => undefined}
              testID="marketplace-contact-message"
            />
          </View>

          <Text style={[styles.note, { color: colors.textSecondary }]}>
            Calling and messaging are not connected yet. This is a demo listing, so
            the number above is not a real line.
          </Text>
        </View>
      </View>
    </Modal>
  );
}

/** One labelled value in the sheet, matching the rows on the details page. */
function ContactRow({ label, value }: { label: string; value: string }) {
  const colors = useAgriTheme();

  return (
    <View style={[styles.row, { borderTopColor: colors.border }]}>
      <Text style={[styles.rowLabel, { color: colors.textSecondary }]}>{label}</Text>
      <Text style={[styles.rowValue, { color: colors.text }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(26, 26, 23, 0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    padding: Spacing.four,
    paddingBottom: Spacing.five,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    gap: Spacing.three,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  title: {
    ...AgriTypography.title,
    fontSize: 20,
    lineHeight: 28,
  },
  close: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: AgriRadius.pill,
  },
  closeText: {
    fontSize: 16,
    lineHeight: 20,
  },
  listingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingBottom: Spacing.three,
    borderBottomWidth: 1,
  },
  listingThumbnail: {
    width: 48,
    borderRadius: 10,
    overflow: 'hidden',
  },
  listingText: {
    flex: 1,
    gap: 2,
  },
  listingTitle: {
    ...AgriTypography.subtitle,
    fontWeight: '700',
  },
  listingMeta: {
    ...AgriTypography.caption,
    fontWeight: '400',
  },
  rows: {
    gap: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.three,
    paddingVertical: Spacing.two + 2,
    borderTopWidth: 1,
  },
  rowLabel: {
    ...AgriTypography.body,
    fontWeight: '400',
  },
  rowValue: {
    ...AgriTypography.body,
    fontWeight: '700',
    flexShrink: 1,
    textAlign: 'right',
  },
  actions: {
    gap: Spacing.two,
  },
  note: {
    ...AgriTypography.caption,
    fontSize: 12,
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.6,
  },
});
