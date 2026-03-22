// @ts-check
const { test, expect } = require('/opt/node22/lib/node_modules/playwright/test');
const path = require('path');

const base = 'file://' + path.resolve(__dirname, '..');

// Externa CDN-anrop blockeras så att DOMContentLoaded inte hänger sig.
const gotoOpts = { waitUntil: 'domcontentloaded', timeout: 10000 };

// Blockera externa nätverksanrop omedelbart
test.beforeEach(async ({ page }) => {
  await page.route('**', route => {
    const url = route.request().url();
    if (url.startsWith('file://')) return route.continue();
    route.abort();
  });
});

// ---------------------------------------------------------------------------
// index.html
// ---------------------------------------------------------------------------
test.describe('index.html', () => {
  test('har rätt title', async ({ page }) => {
    await page.goto(`${base}/index.html`, gotoOpts);
    await expect(page).toHaveTitle(/Henrik Norlin Frisemo/);
  });

  test('visar Henrik i innehållet', async ({ page }) => {
    await page.goto(`${base}/index.html`, gotoOpts);
    const content = await page.content();
    expect(content).toMatch(/Henrik/);
  });

  test('har länk till experience.html', async ({ page }) => {
    await page.goto(`${base}/index.html`, gotoOpts);
    const links = await page.locator('a[href*="experience.html"]').count();
    expect(links).toBeGreaterThan(0);
  });

  test('har länk till skills.html', async ({ page }) => {
    await page.goto(`${base}/index.html`, gotoOpts);
    const links = await page.locator('a[href*="skills.html"]').count();
    expect(links).toBeGreaterThan(0);
  });

  test('har länk till contact.html', async ({ page }) => {
    await page.goto(`${base}/index.html`, gotoOpts);
    const links = await page.locator('a[href*="contact.html"]').count();
    expect(links).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// experience.html
// ---------------------------------------------------------------------------
test.describe('experience.html', () => {
  test('har rätt title', async ({ page }) => {
    await page.goto(`${base}/experience.html`, gotoOpts);
    await expect(page).toHaveTitle(/Henrik/);
  });

  test('innehåller Comrod', async ({ page }) => {
    await page.goto(`${base}/experience.html`, gotoOpts);
    const content = await page.content();
    expect(content).toMatch(/Comrod/);
  });

  test('innehåller Academic Work', async ({ page }) => {
    await page.goto(`${base}/experience.html`, gotoOpts);
    const content = await page.content();
    expect(content).toMatch(/Academic Work/);
  });

  test('inga JS-fel vid load', async ({ page }) => {
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(`${base}/experience.html`, gotoOpts);
    // Ge JS en kort stund att köra
    await page.waitForTimeout(500);
    expect(errors.filter(e => !e.includes('Failed to load resource'))).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// skills.html
// ---------------------------------------------------------------------------
test.describe('skills.html', () => {
  test('har rätt title', async ({ page }) => {
    await page.goto(`${base}/skills.html`, gotoOpts);
    await expect(page).toHaveTitle(/Henrik/);
  });

  test('nämner C# eller .NET', async ({ page }) => {
    await page.goto(`${base}/skills.html`, gotoOpts);
    const content = await page.content();
    expect(content).toMatch(/C#|\.NET/);
  });

  test('nämner SQL', async ({ page }) => {
    await page.goto(`${base}/skills.html`, gotoOpts);
    const content = await page.content();
    expect(content).toMatch(/SQL/);
  });

  test('inga JS-fel vid load', async ({ page }) => {
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(`${base}/skills.html`, gotoOpts);
    await page.waitForTimeout(500);
    expect(errors.filter(e => !e.includes('Failed to load resource'))).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// contact.html
// ---------------------------------------------------------------------------
test.describe('contact.html', () => {
  test('har rätt title', async ({ page }) => {
    await page.goto(`${base}/contact.html`, gotoOpts);
    await expect(page).toHaveTitle(/Henrik/);
  });

  test('har mailto-länk', async ({ page }) => {
    await page.goto(`${base}/contact.html`, gotoOpts);
    const html = await page.content();
    expect(html).toMatch(/mailto:/);
  });

  test('har LinkedIn-länk', async ({ page }) => {
    await page.goto(`${base}/contact.html`, gotoOpts);
    const html = await page.content();
    expect(html).toMatch(/linkedin/i);
  });

  test('inga JS-fel vid load', async ({ page }) => {
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(`${base}/contact.html`, gotoOpts);
    await page.waitForTimeout(500);
    expect(errors.filter(e => !e.includes('Failed to load resource'))).toHaveLength(0);
  });
});
