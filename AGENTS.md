# AGENTS — MLP employer portal

Guidance for humans and coding agents working in this repo. **Product research** lives under `Research data/` and is referenced by `.cursor/rules/employer-portal-research.mdc`. **UI shell consistency** is referenced by `.cursor/rules/employer-portal-ui-shell.mdc` (always applied).

---

## UI shell checklist (new or refactored pages)

Use this before opening a PR. Gold-copy pages: `[src/pages/CdBalance.jsx](src/pages/CdBalance.jsx)`, `[src/pages/PolicyCoverage.jsx](src/pages/PolicyCoverage.jsx)`. **Full-width primary content** (within padding only): `[src/pages/EndorsementsDashboard.jsx](src/pages/EndorsementsDashboard.jsx)`. Header contract: `[src/components/PageHeader.jsx](src/components/PageHeader.jsx)`.

### Layout and width

- Outer scroll container: `**flex h-full min-h-0 flex-col overflow-y-auto`** (adjust `flex` direction only if matching an existing flow).
- Horizontal + vertical padding: `**px-6 py-6 lg:px-8**` on that container unless matching an established exception (e.g. some flows use `pt-4 pb-0` — then match siblings in the same module).
- **Full width** inside `Layout` main — no `max-w-6xl mx-auto` on the page shell unless the task explicitly requires a narrow column.
- **Primary page content** uses `**w-full`** under that padding (same as Endorsements): do **not** wrap the main block in `**mx-auto` + `max-w-*`** unless the task documents an exception (e.g. a deliberate reading column). Modals, dialogs, and per-control width limits are fine.
- Page background: prefer `**bg-gray-50**` on the scroll root for tool-style pages.

### Breadcrumbs and title

- `**PageHeader**` with `**title**`, `**subtitle**` (when helpful), and `**breadcrumbs**`.
- **Module landing:** `breadcrumbs={[]}` (no breadcrumb row / no back icon).
- **Inner pages:** trail ends with **current page** (last item: label only, no `path`). For Endorsements subtree, start with `**endorsementsModuleCrumb`** from `[src/lib/breadcrumbPresets.js](src/lib/breadcrumbPresets.js)`.
- No duplicate custom header (no second back + title block outside `PageHeader`).

### Typography

- Page title / subtitle only via `**PageHeader**` defaults (`text-2xl` title, `text-sm` subtitle — see component).
- No extra stray `**h1**` for the same screen.

### Colors and surfaces

- Cards: `**bg-white**`, `**border-gray-200**`, `**shadow-sm**` where siblings use them.
- Primary buttons: `**indigo-600` / `indigo-700**` hover; inputs: indigo focus ring pattern used elsewhere.
- Body / meta: `**text-gray-600**`, `**text-gray-500**` — avoid new palette families per page.

### Interactions

- Primary actions clearly `**cursor-pointer**`; disabled states consistent with sibling pages.
- Do not add visible back **text** next to the arrow in `PageHeader` (icon-only back).

### Routing and nav

- New routes in `[src/App.jsx](src/App.jsx)`; sidebar + active state in `[src/components/Layout.jsx](src/components/Layout.jsx)` when adding a user-facing module.

---

## Optional hardening (later)

- Introduce a shared `**AppPageLayout`** wrapper component that applies the scroll + padding + `bg-gray-50` defaults so new pages cannot drift.
- ESLint or PR template checkbox pointing to this file.

---

## Research (product)

For flows, empty states, copy, CD/premium transparency, and workflow sequencing, read `**Research data/**` as required by `employer-portal-research.mdc`.