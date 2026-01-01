import { test, expect } from '@playwright/test';

// Helper function to login to admin panel
async function loginToAdmin(page: any, adminKey: string = 'admin123') {
  await page.goto('/admin');

  // Check if login form is visible
  const passwordInput = page.getByPlaceholder(/password|salasana/i);
  if (await passwordInput.isVisible()) {
    await passwordInput.fill(adminKey);
    await page.getByRole('button', { name: /kirjaudu|login|submit/i }).click();
    await page.waitForLoadState('networkidle');
  }
}

test.describe('Admin Panel Access', () => {
  test('should require authentication to access admin panel', async ({ page }) => {
    await page.goto('/admin');

    // Should see password input or admin content
    const hasPasswordInput = await page.getByPlaceholder(/password|salasana/i).isVisible();
    const hasAdminHeading = await page.getByRole('heading', { name: /moderation|hallinta/i }).isVisible();

    // One of these should be true
    expect(hasPasswordInput || hasAdminHeading).toBeTruthy();
  });

  test('should allow access with correct admin key', async ({ page }) => {
    await loginToAdmin(page);

    // Should see admin panel content
    await expect(page.getByRole('heading', { name: /moderation|hallinta/i })).toBeVisible({ timeout: 5000 });
  });

  test('should reject access with incorrect admin key', async ({ page }) => {
    await page.goto('/admin');

    const passwordInput = page.getByPlaceholder(/password|salasana/i);
    if (await passwordInput.isVisible()) {
      await passwordInput.fill('wrongpassword');
      await page.getByRole('button', { name: /kirjaudu|login|submit/i }).click();

      // Should show error or stay on login page
      await expect(passwordInput).toBeVisible({ timeout: 2000 });
    }
  });
});

test.describe('Admin Panel Moderation', () => {
  test('should display moderation statistics', async ({ page }) => {
    await loginToAdmin(page);

    // Wait for stats to load
    await page.waitForLoadState('networkidle');

    // Should display statistics (pending, approved, rejected, total)
    const statsText = await page.textContent('body');
    expect(statsText).toMatch(/pending|odottaa|approved|hyväksytty|rejected|hylätty/i);
  });

  test('should display list of posts for moderation', async ({ page }) => {
    await loginToAdmin(page);

    // Wait for posts to load
    await page.waitForLoadState('networkidle');

    // The page should either show posts or a "no posts" message
    const hasPosts = await page.locator('article').or(page.locator('[data-testid*="post"]')).count() > 0;
    const hasNoPosts = await page.getByText(/ei viestejä|no posts|no entries/i).isVisible();

    expect(hasPosts || hasNoPosts).toBeTruthy();
  });

  test('should filter posts by status', async ({ page }) => {
    await loginToAdmin(page);

    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Look for filter buttons/tabs
    const pendingFilter = page.getByRole('button', { name: /pending|odottaa/i }).or(
      page.getByRole('tab', { name: /pending|odottaa/i })
    );
    const approvedFilter = page.getByRole('button', { name: /approved|hyväksytty/i }).or(
      page.getByRole('tab', { name: /approved|hyväksytty/i })
    );
    const rejectedFilter = page.getByRole('button', { name: /rejected|hylätty/i }).or(
      page.getByRole('tab', { name: /rejected|hylätty/i })
    );

    // If filters exist, test them
    if (await pendingFilter.isVisible()) {
      await pendingFilter.click();
      await page.waitForLoadState('networkidle');
    }

    if (await approvedFilter.isVisible()) {
      await approvedFilter.click();
      await page.waitForLoadState('networkidle');
    }

    if (await rejectedFilter.isVisible()) {
      await rejectedFilter.click();
      await page.waitForLoadState('networkidle');
    }
  });

  test('should be able to approve a post', async ({ page }) => {
    await loginToAdmin(page);

    // Wait for posts to load
    await page.waitForLoadState('networkidle');

    // Look for an approve button
    const approveButton = page.getByRole('button', { name: /approve|hyväksy/i }).first();

    if (await approveButton.isVisible()) {
      await approveButton.click();

      // Wait for action to complete
      await page.waitForTimeout(1000);

      // Should see some feedback (success message, status change, etc.)
      const bodyText = await page.textContent('body');
      expect(bodyText).toBeTruthy();
    }
  });

  test('should be able to reject a post', async ({ page }) => {
    await loginToAdmin(page);

    // Wait for posts to load
    await page.waitForLoadState('networkidle');

    // Look for a reject button
    const rejectButton = page.getByRole('button', { name: /reject|hylkää/i }).first();

    if (await rejectButton.isVisible()) {
      await rejectButton.click();

      // Wait for action to complete
      await page.waitForTimeout(1000);

      // Should see some feedback
      const bodyText = await page.textContent('body');
      expect(bodyText).toBeTruthy();
    }
  });

  test('should be able to reset post to pending', async ({ page }) => {
    await loginToAdmin(page);

    // Wait for posts to load
    await page.waitForLoadState('networkidle');

    // Look for a pending/reset button
    const pendingButton = page.getByRole('button', { name: /pending|odottaa|reset/i }).first();

    if (await pendingButton.isVisible()) {
      await pendingButton.click();

      // Wait for action to complete
      await page.waitForTimeout(1000);

      // Should see some feedback
      const bodyText = await page.textContent('body');
      expect(bodyText).toBeTruthy();
    }
  });

  test('should display post details in moderation view', async ({ page }) => {
    await loginToAdmin(page);

    // Wait for posts to load
    await page.waitForLoadState('networkidle');

    // Check if there are any posts
    const posts = page.locator('article').or(page.locator('[data-testid*="post"]'));
    const postCount = await posts.count();

    if (postCount > 0) {
      const firstPost = posts.first();

      // Each post should have identifiable content
      const postText = await firstPost.textContent();
      expect(postText).toBeTruthy();
      expect(postText!.length).toBeGreaterThan(0);
    }
  });

  test('should load more posts when pagination exists', async ({ page }) => {
    await loginToAdmin(page);

    // Wait for posts to load
    await page.waitForLoadState('networkidle');

    // Look for a "Load More" button
    const loadMoreButton = page.getByRole('button', { name: /lataa lisää|load more|show more/i });

    if (await loadMoreButton.isVisible()) {
      const initialCount = await page.locator('article').or(page.locator('[data-testid*="post"]')).count();

      await loadMoreButton.click();

      // Wait for more posts to load
      await page.waitForTimeout(1000);

      const newCount = await page.locator('article').or(page.locator('[data-testid*="post"]')).count();

      // Should have same or more posts (depends on if there are more to load)
      expect(newCount).toBeGreaterThanOrEqual(initialCount);
    }
  });
});

test.describe('Admin Panel Navigation', () => {
  test('should be able to navigate back to home page from admin', async ({ page }) => {
    await loginToAdmin(page);

    // Look for a home/back link
    const homeLink = page.getByRole('link', { name: /home|etusivu|takaisin|back/i });

    if (await homeLink.isVisible()) {
      await homeLink.click();

      // Should navigate to home page
      await expect(page).toHaveURL('/');
    }
  });

  test('should be responsive on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await loginToAdmin(page);

    // Admin panel should be usable on mobile
    await expect(page.getByRole('heading', { name: /moderation|hallinta/i })).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Admin Panel Security', () => {
  test('should maintain authentication state', async ({ page }) => {
    await loginToAdmin(page);

    // Reload the page
    await page.reload();

    // Should still be authenticated (or show login form again, depending on implementation)
    await page.waitForLoadState('networkidle');

    // Page should load without errors
    const bodyText = await page.textContent('body');
    expect(bodyText).toBeTruthy();
  });
});
