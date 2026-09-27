# frontend_task

Product listing page ("Wybierz urządzenie"): a 3-column grid of washing machines with a search field and four dropdown filters that work together.

Live demo: https://szymeknawrocki.github.io/frontend_task/

## Running locally

Requires Node.js 20.19+ or 22.12+.

```bash
npm install
npm run dev
```

Other scripts:

```bash
npm test          # unit and component tests (Vitest + Testing Library)
npm run build     # type-check and production build
npm run lint      # oxlint
npm run format    # prettier
```

## Stack

- React 19 + TypeScript (strict)
- Vite
- CSS Modules + CSS custom properties for the design tokens from Figma
- Vitest + React Testing Library

No UI library: the dropdowns and cards follow the Figma design closely, so they are written by hand.

## Decisions

**Data.** Products live in `public/data/products.json` and are loaded with `fetch` on start, the same way the page would talk to a real API. Loading and error states are handled, the request is aborted on unmount and can be retried. In the design every card has the same price and feature set, so the data was changed a bit to give the filters something to do: prices from 1 799 to 3 999 zł, different feature sets, energy classes A–F and capacities of 8, 9 and 10,5 kg. There are 23 products, matching the counter in the design.

**Normalised fields.** Features are stored as keys (`addwash`, `ai-control`, …), capacity as a number and prices in grosze. The card title and labels are built from those fields, so there is no duplicated text and no floating-point rounding on prices.

**Filters.** All criteria are combined with AND in one pure function, `applyFilters` in `src/lib/filters.ts`. It is tested without rendering any UI. Search ignores case and Polish diacritics, looks at the product code and name, and is debounced by 200 ms. "Pokaż wszystkie" means no condition for that filter. Energy class and capacity options are generated from the data.

**State.** Filters and pagination are kept in a `useReducer`. Any filter change resets the list to the first 6 cards. The filter state is synced with the query string (`?q=&feature=&energy=&capacity=&sort=`), so a filtered view can be shared as a link.

**Dropdown.** Custom listbox following the WAI-ARIA pattern: arrow keys, Home/End, Enter, Escape, closing on outside click, and only one dropdown open at a time.

**Responsive.** The design only covers 1440 px. Below 1100 px the grid and filters go to 2 columns, and below 700 px to 1 column.

## Known limitations

- SamsungOne is not publicly available, so the page falls back to Arial. The font can be added with `@font-face` in `src/styles/global.css`.
- Product images are simple SVG placeholders instead of the photos from the design.
- The selected state (WYBIERZ / WYBRANE) is kept in memory only.

## Time spent

About 7 hours.
