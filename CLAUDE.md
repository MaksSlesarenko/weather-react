# CLAUDE.md

Guidelines for AI assistants working on this repo.

## Commands

```bash
npm run dev            # start dev server (mock mode)
npm run test           # run all tests (always do this before finishing)
npm run lint           # ESLint — must be clean
npx tsc -p tsconfig.app.json --noEmit   # type check
```

## Code rules

- **TypeScript strict** — `"strict": true` is on. No `as any` in `src/` (test utilities are exempt with a comment).
- **No non-null assertions** — use `?? fallback` instead of `!`.
- **No new `any`** — if you must cast, use `unknown` as the intermediate and add a comment explaining why.
- **No dead code** — remove unused imports, variables, and branches before finishing.
- **No comments** unless the WHY is non-obvious (workarounds, hidden constraints). Never describe what the code does.

## Architecture constraints

- `src/api/weatherApi.ts` is **generated** — do not edit by hand. Run `npm run generate:weather-api` to regenerate from `src/api/owm.yaml`.
- `__MOCK_MODE__` is a compile-time boolean injected by Vite. Guard any code that must not run in tests behind it or use `getCachedRaw`/`setCachedRaw` directly to bypass the guard.
- All constants that users might want to tune live in `src/app/constants.ts` and must be overridable via `VITE_*` env vars using the `envInt()` helper.
- Theme tokens (colors, spacing, breakpoints) go in `src/app/theme.ts` only — never hardcode hex values or spacing numbers in components.

## State

- History slice is wrapped with `redux-undo` (limit 10). Any action that modifies `cities` is undoable.
- `themeMiddleware` persists mode to `localStorage` on every `toggleTheme` dispatch.
- RTK Query cache is augmented by `src/api/weatherCache.ts` (localStorage, TTL-based). Cache is bypassed in mock/test mode.

## Testing

- Every feature needs unit tests. Integration test lives in `src/__tests__/integration.test.tsx`.
- Use `renderWithProviders` from `src/test-utils/` — it wires the full store + MUI theme.
- `localStorage.clear()` runs in `afterEach` (set up in `src/test-utils/setup.ts`) — do not call it manually in tests.
- MSW mock server is started in `beforeAll` / reset in `afterEach` — do not start it again in individual tests.
- Test user-visible behaviour, not implementation details. Prefer `getByRole`, `getByLabelText`, `getByText`.

## MUI + styling

- Use MUI `sx` prop for all styling. No inline `style`, no separate CSS files for component styles.
- MUI spacing scale: `1` = 8px. Match designs to this grid.
- MUI breakpoints: `xs` 0px, `sm` 600px, `md` 900px, `lg` 1200px.
- Snackbar styles (background, text, button colors) are owned by `MuiSnackbarContent` in `theme.ts`.

## Common pitfalls

- `redux-undo` v1 types lack RTK ≥ 2.x's `Reducer<S, A, PreloadedState>` third generic. Cast with `as unknown as Reducer<S>` and add a comment — do not remove the comment.
- `City.getAllCities()` is called at module scope in `SearchBar.tsx`. This is a known perf trade-off (148k cities, ~100ms on first load). Do not move it inside the render cycle.
- `filterOptions` in `SearchBar` uses `debouncedInput` not the live `inputValue` — the debounce ref clears itself on unmount; no cleanup needed.
- MUI `Stack` `alignItems` must go in `sx` not as a direct prop (MUI v9 strict types).
