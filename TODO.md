# TODO - Vieraskirja

## Completed ✓

- [x] Add message field to Post model
- [x] Implement pagination for guestbook entries (cursor-based pagination via `getAll` endpoint)

## High Priority

- [x] Add form validation and error handling on the client side
- [x] Set up production database (PostgreSQL)
- [x] Display all guestbook entries with pagination UI

## Features

- [x] Add ability to edit/delete posts
- [x] Implement search/filter functionality
- [x] Add user avatars or profile pictures
- [x] Add email notification for new entries
- [x] Implement rate limiting to prevent spam
- [x] Add moderation/admin panel

## UI/UX Improvements

- [x] Add loading states and skeletons
- [x] Improve responsive design for mobile devices
- [x] Add animations for new post submissions
- [ ] Create custom 404 and error pages
- [ ] Add dark mode toggle

## Technical Debt

- [ ] Add unit tests for tRPC routers
- [ ] Add E2E tests with Playwright or Cypress
- [ ] Set up CI/CD pipeline
- [ ] Add error monitoring (Sentry)
- [ ] Implement proper logging
- [ ] Add API rate limiting
- [ ] Set up database migrations workflow

## Documentation

- [ ] Add API documentation
- [ ] Create contributing guidelines
- [ ] Add deployment guide
- [ ] Document environment variables

## Performance

- [ ] Implement caching strategy
- [ ] Optimize database queries with proper indexes
- [ ] Add image optimization if avatars are implemented
- [ ] Implement infinite scroll or virtual scrolling

## Security

- [ ] Add CSRF protection
- [ ] Implement input sanitization for XSS prevention
- [ ] Add content security policy (CSP)
- [ ] Set up security headers
- [ ] Add SQL injection prevention checks

## Nice to Have

- [ ] Export guestbook entries to PDF/CSV
- [ ] Add emoji reactions to posts
- [ ] Implement real-time updates with WebSockets
- [ ] Add internationalization (i18n) support
- [ ] Create public API with authentication
