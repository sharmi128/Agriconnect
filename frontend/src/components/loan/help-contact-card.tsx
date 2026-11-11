import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { SectionCard } from '@/components/ui/section-card';
import { AgriRadius, AgriTypography } from '@/constants/agri-theme';
import { Spacing } from '@/constants/theme';
import { useAgriTheme } from '@/hooks/use-agri-theme';
import {
  DEMO_HELP_CONTACTS,
  DEMO_HELP_DESK,
  contactUrl,
  type HelpContact,
} from '@/models/loan-support';

type HelpContactCardProps = {
  contacts?: readonly HelpContact[];
};

/**
 * 📞 Help & Contact.
 *
 * Four ways to reach a person, and a note about which counter to walk into. The
 * phone, SMS and email rows open the real dialler or mail app rather than showing
 * a number the farmer has to copy, which is the whole point of putting them here.
 * On a phone with no SIM or no mail app the tap simply does nothing, which is
 * better than an error a farmer cannot act on.
 *
 * The help desk is shown first because for many farmers it is the only one of
 * these they can use: it is the one that needs no phone balance and no data.
 */
export function HelpContactCard({ contacts = DEMO_HELP_CONTACTS }: HelpContactCardProps) {
  const colors = useAgriTheme();

  return (
    <SectionCard
      title="\u{1F4DE} Help & Contact"
      subtitle="A person, not a form. All numbers below are demo data."
      testID="help-contact-card">
      <View style={styles.body}>
        <View
          style={[
            styles.desk,
            { backgroundColor: colors.primarySoft, borderColor: colors.primary },
          ]}>
          <Text style={styles.deskEmoji}>{'\u{1F3E2}'}</Text>

          <View style={styles.deskCopy}>
            <Text style={[styles.deskTitle, { color: colors.primaryDark }]}>
              {DEMO_HELP_DESK.officeName}
            </Text>
            <Text style={[styles.deskLine, { color: colors.textSecondary }]}>
              {DEMO_HELP_DESK.location}
            </Text>
            <Text style={[styles.deskLine, { color: colors.textSecondary }]}>
              {DEMO_HELP_DESK.hours}
            </Text>
          </View>
        </View>

        <Text style={[styles.deskNote, { color: colors.textSecondary }]}>
          {DEMO_HELP_DESK.note}
        </Text>

        <View style={styles.contacts}>
          {contacts.map((contact) => (
            <Pressable
              key={contact.id}
              testID={`help-contact-${contact.id}`}
              accessibilityRole="link"
              accessibilityLabel={`${contact.label}, ${contact.value}`}
              onPress={() => {
                Linking.openURL(contactUrl(contact)).catch(() => undefined);
              }}
              style={({ pressed }) => [
                styles.contact,
                { backgroundColor: colors.background, borderColor: colors.border },
                pressed && styles.pressed,
              ]}>
              <Text style={styles.contactEmoji}>{contact.emoji}</Text>

              <View style={styles.contactCopy}>
                <Text style={[styles.contactLabel, { color: colors.text }]} numberOfLines={1}>
                  {contact.label}
                </Text>
                <Text style={[styles.contactValue, { color: colors.primary }]} numberOfLines={1}>
                  {contact.value}
                </Text>
                <Text style={[styles.contactNote, { color: colors.textSecondary }]}>
                  {contact.note}
                </Text>
              </View>

              <Text style={[styles.chevron, { color: colors.primary }]}>{'\u203A'}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  body: {
    gap: Spacing.three,
  },
  desk: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.three,
    borderWidth: 1,
    borderRadius: AgriRadius.medium,
    padding: Spacing.three,
  },
  deskEmoji: {
    fontSize: 20,
    lineHeight: 26,
  },
  deskCopy: {
    flex: 1,
    gap: 3,
  },
  deskTitle: {
    ...AgriTypography.label,
    fontWeight: '700',
  },
  deskLine: {
    ...AgriTypography.caption,
    fontWeight: '400',
  },
  deskNote: {
    ...AgriTypography.caption,
    fontWeight: '400',
    lineHeight: 19,
  },
  contacts: {
    gap: Spacing.two,
  },
  contact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    borderWidth: 1,
    borderRadius: AgriRadius.medium,
    padding: Spacing.three,
  },
  pressed: {
    opacity: 0.7,
  },
  contactEmoji: {
    fontSize: 19,
    lineHeight: 25,
  },
  contactCopy: {
    flex: 1,
    gap: 2,
  },
  contactLabel: {
    ...AgriTypography.label,
  },
  contactValue: {
    ...AgriTypography.body,
    fontWeight: '600',
  },
  contactNote: {
    ...AgriTypography.caption,
    fontWeight: '400',
  },
  chevron: {
    fontSize: 22,
    lineHeight: 26,
  },
});
