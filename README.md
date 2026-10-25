# SauceDemo Playwright Automation

End-to-end test automation for [SauceDemo](https://www.saucedemo.com/) built with Playwright and TypeScript, using the Page Object Model, reusable login session state, tagged test suites and an optional, manually triggered GitHub Actions workflow.

## Tech stack

- Playwright Test (TypeScript), Chromium / Firefox / WebKit
- dotenv for typed, validated test data
- Custom file + console logger
- GitHub Actions

## Folder structure

```
pages/          Page Objects (all locators and page actions)
tests/          Spec files, one per feature, plus auth.setup.ts
utils/          env.ts (typed env loader), logger.ts, testData.ts (expected site data)
.github/        CI workflow
.auth/          Saved login session (generated, git-ignored)
logs/           test-run.log (generated, git-ignored)
```

## Setup

```bash
npm install
npx playwright install
cp .env.example .env   # then fill in the values
```

`utils/env.ts` throws a clear error if any required variable is missing.

## Running tests

```bash
npm test                 # everything, all browsers
npm run test:smoke       # --grep @smoke
npm run test:regression  # --grep @regression
npm run test:negative    # --grep @negative
npm run test:headed
npm run report           # open the HTML report
npx playwright test --grep @list --project=chromium
npx playwright test --repeat-each=3
```

## Tags

| Tag | Meaning |
| --- | --- |
| `@smoke` | Critical happy paths |
| `@regression` | All tests |
| `@negative` | Validation and error cases |
| `@e2e` | Full flows |
| `@login` `@list` `@sort` `@product` `@cart` `@checkout` `@menu` `@users` | Feature tags |
| `@known-bug` | Tests that document a known site bug (`test.fail()`) |

## Session state

A `setup` project runs `tests/auth.setup.ts`, logs in once as `standard_user` and saves the session to `.auth/user.json`. Every browser project depends on `setup` and uses that `storageState`, so list, sort, product, cart, checkout and menu tests start directly on their page without UI login.

`login.spec.ts` and `users.spec.ts` override this with `test.use({ storageState: { cookies: [], origins: [] } })` to start logged out. SauceDemo keeps the cart in localStorage, so cart/checkout/menu/product tests clear it in `beforeEach` to stay independent.

## Conventions

- Locators live only in `pages/`; specs call page methods and assert.
- `data-test` attributes first (via `testIdAttribute`), then `getByRole`; no XPath.
- Web-first, auto-retrying assertions only; no `waitForTimeout`, no `force`, no retries.
- Credentials and form input come from `.env`; expected site content (product catalog, messages) is in `utils/testData.ts`.
- Every test uses `test.step()` and writes to `logs/test-run.log` through the logger.

## Test coverage

| Spec | Coverage |
| --- | --- |
| login | valid login, locked out, invalid user/password, empty username/password, close error, auth guard |
| list | each product shows name, description, price, image, Add to cart |
| sort | name A-Z / Z-A, price low-high / high-low |
| product | open details, details match list, add/remove on detail page, back to products |
| cart | add single/multiple, badge count, remove from list and cart, continue shopping, persistence, empty cart |
| checkout | full flow, multi-item totals, required field validations, cancel on each step, back home |
| menu | open/close, logout, reset app state, about, all items |
| users | problem_user, error_user, performance_glitch_user |

## Known site bugs (marked `test.fail()`)

- `problem_user`: every product shows the same placeholder image; Add to cart does not work for some products; sorting does nothing; last name cannot be entered at checkout.
- `error_user`: Add to cart does not work for some products; sorting does nothing; Finish does not complete the order.
- `performance_glitch_user`: login is slow, so that test uses extended timeouts.

## CI

`.github/workflows/playwright.yml` is currently disabled for push and pull request; it only runs when started manually from the Actions tab (`workflow_dispatch`). When run, it builds `.env` from GitHub Secrets (one secret per key in `.env.example`), and uploads `playwright-report/` and `logs/` as artifacts.
