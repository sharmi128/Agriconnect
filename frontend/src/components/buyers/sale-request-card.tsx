import { StyleSheet, Text, View } from 'react-native';

import { AgriRadius, AgriTypography, type AgriPalette } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import {
  formatQuintals,
  requestValue,
  type SaleRequest,
  type SaleRequestStatus,
} from '@/models/buyer-connection';
import { formatHarvestQuantity, type JournalCrop } from '@/models/crop-journal';
import { formatRupees } from '@/models/expenses';

type SaleRequestCardProps = {
  request: SaleRequest;
  /** The crop in the journal the request is for, for the name and emoji. */
  crop?: JournalCrop;
};

/**
 * 📋 One line of My Sales / Buyer Requests.
 *
 * The status sits on its own in the corner because that is what decides what
 * happens next: a request still waiting needs a phone call, an accepted one needs
 * bags ready for the lorry, and a completed one needs nothing at all. Quantity and
 * rate are shown as labelled figures, the same way the Harvest history is, so a
 * column of these stays easy to scan.
 */
export function SaleRequestCard({ request, crop }: SaleRequestCardProps) {
  const colors = useAgriTheme();
  const tone = getStatusTone(request.status, colors);

  const accessibilityLabel = `${crop?.name ?? 'Crop'} with ${request.buyerName}, ${
    request.status
  }, ${formatQuintals(request.quantityKg)} at ${formatRupees(
    request.pricePerQuintal
  )} a quintal, requested on ${request.requestedOn}`;

  return (
    <View
      accessibilityLabel={accessibilityLabel}
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.header}>
        <View style={[styles.iconCircle, { backgroundColor: colors.primarySoft }]}>
          <Text style={styles.icon}>{crop?.emoji ?? '🌾'}</Text>
        </View>

        <View style={styles.headerText}>
          <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
            {crop?.name ?? 'Crop'}
          </Text>
          <Text style={[styles.buyer, { color: colors.textSecondary }]} numberOfLines={1}>
            {request.buyerName}
          </Text>
        </View>

        <View style={[styles.statusChip, { backgroundColor: tone.background }]}>
          <Text style={[styles.statusText, { color: tone.text }]} numberOfLines={1}>
            {request.status}
          </Text>
        </View>
      </View>

      <Text style={[styles.date, { color: colors.textSecondary }]} numberOfLines={1}>
        {`📅 ${request.requestedOn}`}
      </Text>

      <View style={[styles.statsRow, { borderTopColor: colors.border }]}>
        <View style={styles.stat}>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>📦 Quantity</Text>
          <Text style={[styles.statValue, { color: colors.text }]} numberOfLines={1}>
            {formatQuintals(request.quantityKg)}
          </Text>
          <Text style={[styles.statHint, { color: colors.textSecondary }]} numberOfLines={1}>
            {formatHarvestQuantity(request.quantityKg)}
          </Text>
        </View>

        <View style={styles.stat}>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>💰 Rate</Text>
          <Text style={[styles.statValue, { color: colors.text }]} numberOfLines={1}>
            {`${formatRupees(request.pricePerQuintal)} / quintal`}
          </Text>
          <Text style={[styles.statHint, { color: colors.textSecondary }]} numberOfLines={1}>
            {`Worth ${formatRupees(requestValue(request))}`}
          </Text>
        </View>
      </View>

      {request.note ? (
        <Text style={[styles.note, { color: colors.textSecondary }]} numberOfLines={2}>
          {request.note}
        </Text>
      ) : null}
    </View>
  );
}

/** Blue once a sale is done, green while it is running, amber while it is only a request. */
function getStatusTone(
  status: SaleRequestStatus,
  colors: AgriPalette
): { background: string; text: string } {
  if (status === 'Completed') {
    return { background: colors.waterSoft, text: colors.water };
  }

  if (status === 'Declined') {
    return { background: colors.dangerSoft, text: colors.danger };
  }

  if (status === 'Requested') {
    return { background: colors.warningSoft, text: colors.warning };
  }

  return { background: colors.primarySoft, text: colors.primaryDark };
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.three,
    borderRadius: AgriRadius.large,
    borderWidth: 1,
    gap: Spacing.two,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 20,
    lineHeight: 26,
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  name: {
    ...AgriTypography.body,
    fontWeight: '700',
  },
  buyer: {
    ...AgriTypography.caption,
    fontSize: 12,
  },
  statusChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: AgriRadius.pill,
    flexShrink: 1,
  },
  statusText: {
    ...AgriTypography.caption,
    fontSize: 12,
    fontWeight: '700',
  },
  date: {
    ...AgriTypography.caption,
    fontSize: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    borderTopWidth: 1,
    paddingTop: Spacing.two,
  },
  stat: {
    flex: 1,
    gap: 2,
  },
  statLabel: {
    ...AgriTypography.caption,
    fontSize: 12,
  },
  statValue: {
    ...AgriTypography.label,
    fontWeight: '700',
  },
  statHint: {
    ...AgriTypography.caption,
    fontSize: 12,
  },
  note: {
    ...AgriTypography.caption,
    fontSize: 12,
    fontWeight: '400',
  },
});
