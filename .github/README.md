# GitHub Workflows and CI/CD

This directory contains GitHub Actions workflows and configurations for continuous integration and deployment.

## Workflows

### CI (`ci.yml`)
Main continuous integration workflow that runs on every push and pull request to `main` and `develop` branches.

**Jobs:**
1. **Lint and Type Check** - Runs ESLint, TypeScript type checking, and Prettier formatting checks
2. **Unit Tests** - Executes Vitest unit tests with coverage reporting
3. **E2E Tests** - Runs Playwright end-to-end tests (Chromium only for speed)
4. **Build** - Verifies the application builds successfully
5. **All Checks Passed** - Final status check that ensures all jobs succeeded

**Features:**
- Dependency caching for faster builds
- Coverage reports uploaded to Codecov
- Playwright test reports saved as artifacts
- Build artifacts retained for 7 days

### Dependency Review (`dependency-review.yml`)
Runs on pull requests to review dependency changes and identify security vulnerabilities.

**Features:**
- Fails on moderate or higher severity vulnerabilities
- Posts summary comments on pull requests
- Helps prevent introducing vulnerable dependencies

### CodeQL Analysis (`codeql-analysis.yml`)
Security scanning workflow that analyzes code for vulnerabilities and code quality issues.

**Schedule:**
- Runs on every push to `main` and `develop`
- Runs on all pull requests
- Runs weekly on Mondays at 6:00 AM UTC

**Features:**
- Scans both JavaScript and TypeScript code
- Uses security-and-quality query suite
- Results available in GitHub Security tab

## Dependabot Configuration

Automated dependency updates configured in `dependabot.yml`.

**Configuration:**
- **npm dependencies**: Checks weekly on Mondays
  - Groups minor/patch updates for dev dependencies
  - Groups minor/patch updates for production dependencies
  - Limits to 10 open PRs at a time

- **GitHub Actions**: Checks weekly on Mondays
  - Keeps workflow actions up to date

**Labels:**
- All Dependabot PRs are labeled with `dependencies` and `automated`
- GitHub Actions updates also get `github-actions` label

## Setting Up CI/CD in Your Repository

### Required Secrets
No secrets are required for basic CI functionality. The workflows use default GitHub tokens.

### Optional: Codecov Integration
To enable code coverage reporting:

1. Sign up at [codecov.io](https://codecov.io)
2. Install the Codecov GitHub App
3. No additional configuration needed - the workflow will automatically upload coverage

### Branch Protection Rules (Recommended)

To enforce CI checks before merging, configure branch protection rules:

1. Go to repository Settings → Branches
2. Add rule for `main` branch:
   - ✅ Require status checks to pass before merging
   - Select required checks:
     - `Lint and Type Check`
     - `Unit Tests`
     - `E2E Tests`
     - `Build Application`
   - ✅ Require branches to be up to date before merging
   - ✅ Require linear history (optional)

## Running Workflows Locally

### Testing the CI Pipeline Locally
You can use [act](https://github.com/nektos/act) to run GitHub Actions locally:

```bash
# Install act
brew install act  # macOS
# or
choco install act-cli  # Windows

# Run all CI jobs
act push

# Run specific job
act push -j lint-and-typecheck
```

### Manual Workflow Testing
Run the same commands that CI runs:

```bash
# Lint and type check
npm run lint
npm run typecheck
npm run format:check

# Unit tests
npm run test
npm run test:coverage

# E2E tests
npm run test:e2e

# Build
npm run build
```

## Troubleshooting

### E2E Tests Failing
- E2E tests require a database. The workflow sets up SQLite for testing.
- Tests run only on Chromium in CI for speed. Run full suite locally with `npm run test:e2e`.

### Build Failures
- Ensure `DATABASE_URL` is set (even if it's a dummy value for build)
- Check that Prisma client is generated (`npx prisma generate`)
- Environment validation can be skipped in CI with `SKIP_ENV_VALIDATION=true`

### Dependabot PRs
- Review and merge regularly to keep dependencies updated
- Grouped PRs combine multiple related updates
- Test locally before merging if concerned about breaking changes

## Workflow Badges

Add these badges to your README.md to display CI status:

```markdown
![CI](https://github.com/Hakkix/vieraskirja/workflows/CI/badge.svg)
![CodeQL](https://github.com/Hakkix/vieraskirja/workflows/CodeQL%20Security%20Analysis/badge.svg)
```

## Future Enhancements

Potential additions to the CI/CD pipeline:

- [ ] Deployment workflows (Vercel, Docker, etc.)
- [ ] Performance testing
- [ ] Visual regression testing
- [ ] Automated release creation
- [ ] Docker image building and publishing
- [ ] Database migration validation
- [ ] Lighthouse CI for performance metrics
