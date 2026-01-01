# E2E Tests - Vieraskirja

This directory contains end-to-end (E2E) tests for the Vieraskirja application using [Playwright](https://playwright.dev/).

## Test Files

- **guestbook.spec.ts** - Tests for the main guestbook functionality
  - Home page rendering
  - Form validation and submission
  - Entry display and pagination
  - Responsive design
  - Character limits and counters

- **admin.spec.ts** - Tests for the admin panel and moderation features
  - Admin authentication
  - Moderation statistics
  - Approving/rejecting posts
  - Filtering by status
  - Admin panel navigation

## Prerequisites

Before running E2E tests, you need to:

1. Install Playwright browsers:
   ```bash
   npx playwright install
   ```

2. Ensure you have a working database setup (see main README.md)

3. Make sure environment variables are configured in `.env`

## Running Tests

### Run all E2E tests
```bash
npm run test:e2e
```

### Run tests with UI mode (interactive)
```bash
npm run test:e2e:ui
```

### Run tests in headed mode (see browser)
```bash
npm run test:e2e:headed
```

### Run tests in debug mode
```bash
npm run test:e2e:debug
```

### Run specific test file
```bash
npx playwright test e2e/guestbook.spec.ts
```

### Run specific test
```bash
npx playwright test -g "should create a new guestbook entry"
```

## Configuration

Playwright configuration is in `playwright.config.ts` at the project root.

Key settings:
- **Base URL**: http://localhost:3000
- **Browsers**: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
- **Auto-start dev server**: Yes (runs `npm run dev` before tests)
- **Retry on CI**: 2 retries
- **Reporter**: HTML report

## Viewing Test Results

After running tests, view the HTML report:
```bash
npx playwright show-report
```

## Writing New Tests

Follow these patterns when adding new tests:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test('should do something', async ({ page }) => {
    await page.goto('/');

    // Interact with page
    await page.getByRole('button', { name: /submit/i }).click();

    // Assert results
    await expect(page.getByText(/success/i)).toBeVisible();
  });
});
```

## Best Practices

1. **Use semantic locators**: Prefer `getByRole()`, `getByLabel()`, `getByPlaceholder()` over CSS selectors
2. **Wait for states**: Use `waitForLoadState('networkidle')` for async operations
3. **Make tests resilient**: Don't assume specific data exists, handle both empty and populated states
4. **Use descriptive names**: Test names should clearly describe what they're testing
5. **Keep tests independent**: Each test should be able to run standalone
6. **Clean up**: Reset state between tests if needed

## CI/CD Integration

These tests are designed to run in CI/CD environments. The configuration automatically:
- Runs tests in parallel on CI (1 worker)
- Retries failed tests (2 retries on CI)
- Generates HTML reports
- Starts the dev server automatically

## Debugging

### Debug a specific test
```bash
npm run test:e2e:debug -- -g "test name"
```

### Generate trace for failed tests
Traces are automatically generated on first retry. View them:
```bash
npx playwright show-trace trace.zip
```

### Use Playwright Inspector
```bash
PWDEBUG=1 npx playwright test
```

## Common Issues

### Port already in use
If port 3000 is already in use, stop the dev server or change the port in `playwright.config.ts`.

### Browsers not installed
Run `npx playwright install` to install required browsers.

### Tests timeout
Increase timeout in test or config if tests are slow in your environment.

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Test Generator](https://playwright.dev/docs/codegen) - `npx playwright codegen`
