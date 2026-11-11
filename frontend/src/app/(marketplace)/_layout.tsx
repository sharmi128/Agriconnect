import { Stack } from 'expo-router';

/**
 * Stack navigator for the two screens a farmer reaches from Marketplace home:
 * a category page and a product details page.
 *
 * The group name is not part of the URL, so the routes stay short —
 * `/category/machinery` and `/product/mkt-mach-tractor`.
 *
 * Headers are hidden because both screens draw their own title, subtitle and
 * back button, which keeps the top of every marketplace screen identical.
 */
export default function MarketplaceLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
