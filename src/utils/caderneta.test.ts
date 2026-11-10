import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CHECKOUT_URL,
  getCheckoutUrl,
  toggleFaqItem,
  calculateStickyCtaVisibility,
  isHeaderScrolled,
} from './caderneta';

test('getCheckoutUrl returns base url when no params provided', () => {
  assert.equal(getCheckoutUrl(), CHECKOUT_URL);
  assert.equal(getCheckoutUrl({}), CHECKOUT_URL);
});

test('getCheckoutUrl appends UTM and tracking query parameters', () => {
  const url = getCheckoutUrl({ utm_source: 'hero', utm_medium: 'button' });
  assert.ok(url.startsWith(CHECKOUT_URL));
  assert.ok(url.includes('utm_source=hero'));
  assert.ok(url.includes('utm_medium=button'));
});

test('toggleFaqItem opens when null and closes when clicked again', () => {
  assert.equal(toggleFaqItem(null, 'faq-1'), 'faq-1');
  assert.equal(toggleFaqItem('faq-1', 'faq-1'), null);
  assert.equal(toggleFaqItem('faq-1', 'faq-2'), 'faq-2');
});

test('calculateStickyCtaVisibility handles scroll positions correctly', () => {
  const heroHeight = 600;
  const windowHeight = 800;

  // Not past hero yet
  assert.equal(calculateStickyCtaVisibility(200, heroHeight, 1500, windowHeight), false);

  // Past hero, final CTA far below
  assert.equal(calculateStickyCtaVisibility(550, heroHeight, 1500, windowHeight), true);

  // Past hero, but final CTA is already visible in viewport
  assert.equal(calculateStickyCtaVisibility(2000, heroHeight, 700, windowHeight), false);
});

test('isHeaderScrolled toggles at threshold', () => {
  assert.equal(isHeaderScrolled(10), false);
  assert.equal(isHeaderScrolled(21), true);
  assert.equal(isHeaderScrolled(50, 40), true);
});
