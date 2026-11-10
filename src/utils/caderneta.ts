export const CHECKOUT_URL = 'https://pay.clickpayon.com/352e944e-6076-454a-9b0a-c77062facb6c';

/**
 * Returns the checkout URL, optionally appending URL search params.
 */
export function getCheckoutUrl(params?: Record<string, string>): string {
  if (!params || Object.keys(params).length === 0) {
    return CHECKOUT_URL;
  }
  const url = new URL(CHECKOUT_URL);
  for (const [key, value] of Object.entries(params)) {
    if (value) {
      url.searchParams.set(key, value);
    }
  }
  return url.toString();
}

/**
 * Accordion state helper: toggles an item or closes it if already open.
 */
export function toggleFaqItem(currentOpenId: string | null, clickedId: string): string | null {
  return currentOpenId === clickedId ? null : clickedId;
}

/**
 * Checks whether the mobile sticky CTA should be visible.
 * Appears when user scrolled past hero, and disappears once final CTA comes into view.
 */
export function calculateStickyCtaVisibility(
  scrollY: number,
  heroHeight: number,
  finalCtaTop: number,
  windowHeight: number
): boolean {
  const pastHero = scrollY > Math.max(0, heroHeight - 120);
  const beforeFinal = finalCtaTop > windowHeight - 40;
  return pastHero && beforeFinal;
}

/**
 * Checks whether header should show blurred background & shadow.
 */
export function isHeaderScrolled(scrollY: number, threshold = 20): boolean {
  return scrollY > threshold;
}
