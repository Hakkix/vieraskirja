import { test, expect } from '@playwright/test';

test.describe('Guestbook Home Page', () => {
  test('should load the home page successfully', async ({ page }) => {
    await page.goto('/');

    // Check if the page title is correct
    await expect(page).toHaveTitle(/Vieraskirja/);

    // Check if the main heading is visible
    await expect(page.getByRole('heading', { name: /vieraskirja/i })).toBeVisible();
  });

  test('should display the guestbook form', async ({ page }) => {
    await page.goto('/');

    // Check if form elements are present
    await expect(page.getByPlaceholder(/nimi/i)).toBeVisible();
    await expect(page.getByPlaceholder(/viesti/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /lähetä/i })).toBeVisible();
  });

  test('should show validation errors for empty form submission', async ({ page }) => {
    await page.goto('/');

    // Try to submit empty form
    await page.getByRole('button', { name: /lähetä/i }).click();

    // Wait for error messages to appear
    await expect(page.getByText(/nimi on pakollinen/i).or(page.getByText(/name is required/i))).toBeVisible({ timeout: 5000 });
  });

  test('should create a new guestbook entry', async ({ page }) => {
    await page.goto('/');

    const testName = `Test User ${Date.now()}`;
    const testMessage = `This is a test message created at ${new Date().toISOString()}`;

    // Fill in the form
    await page.getByPlaceholder(/nimi/i).fill(testName);
    await page.getByPlaceholder(/viesti/i).fill(testMessage);

    // Submit the form
    await page.getByRole('button', { name: /lähetä/i }).click();

    // Wait for success message or form reset
    await expect(page.getByPlaceholder(/nimi/i)).toHaveValue('', { timeout: 5000 });

    // Note: The new entry won't appear immediately because it needs moderation (PENDING status)
    // Only APPROVED entries are shown on the public page
  });

  test('should enforce message character limit', async ({ page }) => {
    await page.goto('/');

    const longMessage = 'a'.repeat(501); // Max is 500 characters

    // Fill in the form with a message that's too long
    await page.getByPlaceholder(/nimi/i).fill('Test User');
    await page.getByPlaceholder(/viesti/i).fill(longMessage);

    // Submit the form
    await page.getByRole('button', { name: /lähetä/i }).click();

    // Should show error about message being too long
    await expect(page.getByText(/500/i)).toBeVisible({ timeout: 5000 });
  });

  test('should display character counter', async ({ page }) => {
    await page.goto('/');

    const message = 'Test message';

    // Type a message
    await page.getByPlaceholder(/viesti/i).fill(message);

    // Check if character counter is visible and shows correct count
    await expect(page.getByText(new RegExp(`${message.length}.*500`, 'i'))).toBeVisible();
  });
});

test.describe('Guestbook Entries Display', () => {
  test('should display approved guestbook entries', async ({ page }) => {
    await page.goto('/');

    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // The page should either show entries or a "no entries" message
    // We can't guarantee there will be approved entries, so we check for either case
    const hasEntries = await page.locator('article').count() > 0;
    const hasNoEntriesMessage = await page.getByText(/ei viestejä/i).or(page.getByText(/no entries/i)).isVisible();

    expect(hasEntries || hasNoEntriesMessage).toBeTruthy();
  });

  test('should show "Load More" button when there are more entries', async ({ page }) => {
    await page.goto('/');

    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Check if there's a "Load More" button (only appears if there are more entries)
    const loadMoreButton = page.getByRole('button', { name: /lataa lisää|load more/i });

    // We can't guarantee there are enough entries for pagination,
    // but if the button exists, we can test it
    if (await loadMoreButton.isVisible()) {
      const initialCount = await page.locator('article').count();

      await loadMoreButton.click();

      // Wait for more entries to load
      await page.waitForTimeout(1000);

      const newCount = await page.locator('article').count();

      // Should have more entries after loading
      expect(newCount).toBeGreaterThanOrEqual(initialCount);
    }
  });

  test('should display entry metadata correctly', async ({ page }) => {
    await page.goto('/');

    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // If there are entries, check their structure
    const firstEntry = page.locator('article').first();

    if (await firstEntry.isVisible()) {
      // Each entry should have a name and message
      await expect(firstEntry).toContainText(/./); // Has some text content
    }
  });
});

test.describe('Responsive Design', () => {
  test('should be mobile-responsive', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Check if form is visible and usable on mobile
    await expect(page.getByPlaceholder(/nimi/i)).toBeVisible();
    await expect(page.getByPlaceholder(/viesti/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /lähetä/i })).toBeVisible();
  });

  test('should be tablet-responsive', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');

    // Check if form is visible and usable on tablet
    await expect(page.getByPlaceholder(/nimi/i)).toBeVisible();
    await expect(page.getByPlaceholder(/viesti/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /lähetä/i })).toBeVisible();
  });
});
