import { NativeTabs } from 'expo-router/unstable-native-tabs';

import { AgriColors } from '@/constants/agri-theme';

/**
 * The tab bar, on iOS and Android.
 *
 * It takes the app's own palette rather than following the phone: the bar sits
 * on the cream page background, the selected label is paddy green, and the
 * pill behind the selected icon is a soft green. There is no dark variant,
 * because the rest of the app does not have one either.
 */
export default function AppTabs() {
  return (
    <NativeTabs
      backgroundColor={AgriColors.background}
      indicatorColor={AgriColors.primarySoft}
      labelStyle={{ selected: { color: AgriColors.primary } }}>
      <NativeTabs.Trigger name="home">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require('@/assets/images/tabIcons/home.png')}
          renderingMode="template"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="guide">
        <NativeTabs.Trigger.Label>Farming Guide</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="book.fill" md="menu_book" />
      </NativeTabs.Trigger>

      {/* Uses built-in SF Symbols / Material Symbols, so no icon file is needed. */}
      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="person.crop.circle" md="account_circle" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="farm">
        <NativeTabs.Trigger.Label>My Farm</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="leaf.fill" md="eco" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="marketplace">
        <NativeTabs.Trigger.Label>Marketplace</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="cart.fill" md="shopping_cart" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
