import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { AgriRadius, AgriTypography } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import {
  KG_PER_QUINTAL,
  formatQuintals,
  proposedQuantityKg,
  type ContactChannel,
  type ContactTarget,
} from '@/models/buyer-connection';
import { findCrop, type JournalCrop } from '@/models/crop-journal';
import { formatRupees } from '@/models/expenses';

type ContactBuyerSheetProps = {
  /** The buyer being contacted, or `null` when the sheet is closed. */
  target: ContactTarget | null;
  crops: readonly JournalCrop[];
  onClose: () => void;
  onContact: (target: ContactTarget, channel: ContactChannel) => void;
};

/** The three ways to reach a buyer, in the order the buttons are listed. */
const CHANNELS: readonly ContactChannel[] = ['Call', 'WhatsApp', 'SMS'];

const CHANNEL_LABELS: Record<ContactChannel, string> = {
  Call: '📞 Call now',
  WhatsApp: '💬 WhatsApp',
  SMS: '✉️ Send SMS',
};

/**
 * 📞 Contact Buyer, built from React Native's own `Modal`.
 *
 * Written by hand rather than pulled from a package, for the same reasons the
 * shared dropdown is: no native module, it works in Expo Go, and it looks the
 * same on iOS, Android and the web.
 *
 * The sheet repeats the facts the farmer is about to act on — who they are
 * ringing, at what rate, for which crop, and how much of it — so the deal is on
 * screen at the moment the button is pressed. Nothing is really dialled in demo
 * mode: the button records a request instead, which is what the 📋 section at the
 * bottom of the screen then lists.
 */
export function ContactBuyerSheet({ target, crops, onClose, onContact }: ContactBuyerSheetProps) {
  const colors = useAgriTheme();

  // With no buyer there is nothing to show, so the sheet is left out of the tree
  // rather than rendered empty. The hook above still runs on every render, so the
  // order of hooks never changes.
  if (!target) {
    return null;
  }

  const { buyer, offer, lot } = target;
  const cropName = findCrop(crops, offer.cropId)?.name ?? 'your crop';
  const quantityKg = proposedQuantityKg(target);
  const dealValue = Math.round((quantityKg / KG_PER_QUINTAL) * offer.pricePerQuintal);

  const pitch = lot
    ? `You would offer ${formatQuintals(quantityKg)} from your ${cropName} lot, worth about ${formatRupees(
        dealValue
      )} at this rate. ${formatQuintals(lot.availableKg)} is ready so far.`
    : `You would offer ${formatQuintals(quantityKg)} of ${cropName}, worth about ${formatRupees(
        dealValue
      )} at this rate.`;

  return (
    <Modal
      visible
      transparent
      animationType="fade"
      // Required on Android, otherwise the hardware back button leaves the screen
      // instead of just closing the sheet.
      onRequestClose={onClose}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Close contact options"
        style={styles.backdrop}
        onPress={onClose}>
        {/* Stops a tap on the sheet from bubbling up to the backdrop. */}
        <Pressable
          style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={(event) => event.stopPropagation()}>
          <ScrollView contentContainerStyle={styles.content}>
            <Text style={[styles.title, { color: colors.text }]}>{`📞 Contact ${buyer.name}`}</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              {`${buyer.kind} · ${buyer.location} · ${buyer.distanceKm} km away`}
            </Text>

            <View
              style={[
                styles.detail,
                { backgroundColor: colors.background, borderColor: colors.border },
              ]}>
              <DetailLine label="Contact person" value={buyer.contactName} />
              <DetailLine label="Phone" value={buyer.phone} />
              <DetailLine
                label="Offer"
                value={`${formatRupees(offer.pricePerQuintal)} / quintal, ${cropName}`}
              />
              <DetailLine label="They can take" value={formatQuintals(offer.neededKg)} />
              <DetailLine label="Pickup" value={buyer.pickup} />
              <DetailLine label="Payment" value={buyer.payment} />
            </View>

            <Text style={[styles.pitch, { color: colors.text }]}>{pitch}</Text>

            {CHANNELS.map((channel, index) => (
              <Button
                key={channel}
                label={CHANNEL_LABELS[channel]}
                variant={index === 0 ? 'primary' : 'secondary'}
                onPress={() => onContact(target, channel)}
                testID={`contact-buyer-${channel.toLowerCase()}`}
              />
            ))}

            <Text style={[styles.demoNote, { color: colors.textSecondary }]}>
              Demo mode: nothing is dialled or sent yet. Contacting a buyer records the request in
              the 📋 list further down the screen.
            </Text>

            <Pressable
              accessibilityRole="button"
              onPress={onClose}
              style={({ pressed }) => [
                styles.cancel,
                { borderTopColor: colors.border },
                pressed && styles.pressed,
              ]}>
              <Text style={[styles.cancelLabel, { color: colors.textSecondary }]}>Close</Text>
            </Pressable>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

type DetailLineProps = {
  label: string;
  value: string;
};

/** One labelled fact in the sheet, so the values line up down the right edge. */
function DetailLine({ label, value }: DetailLineProps) {
  const colors = useAgriTheme();

  return (
    <View style={styles.detailLine}>
      <Text style={[styles.detailLabel, { color: colors.textSecondary }]} numberOfLines={1}>
        {label}
      </Text>
      <Text style={[styles.detailValue, { color: colors.text }]} numberOfLines={2}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 30, 15, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.four,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    borderRadius: AgriRadius.large,
    borderWidth: 1,
    overflow: 'hidden',
  },
  content: {
    padding: 18,
    gap: 12,
  },
  title: {
    ...AgriTypography.subtitle,
    fontWeight: '700',
  },
  subtitle: {
    ...AgriTypography.caption,
    marginTop: -8,
  },
  detail: {
    borderRadius: AgriRadius.medium,
    borderWidth: 1,
    padding: Spacing.three,
    gap: 6,
  },
  detailLine: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.two,
  },
  detailLabel: {
    ...AgriTypography.caption,
    fontSize: 12,
    width: 104,
  },
  detailValue: {
    ...AgriTypography.label,
    fontWeight: '700',
    flex: 1,
    textAlign: 'right',
  },
  pitch: {
    ...AgriTypography.body,
  },
  demoNote: {
    ...AgriTypography.caption,
    fontSize: 12,
    textAlign: 'center',
  },
  cancel: {
    borderTopWidth: 1,
    paddingTop: Spacing.two,
    alignItems: 'center',
  },
  cancelLabel: {
    ...AgriTypography.label,
  },
  pressed: {
    opacity: 0.7,
  },
});
