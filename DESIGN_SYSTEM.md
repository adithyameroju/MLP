# Design system — Employer portal (V2)

Reusable tokens and UI primitives derived from **endorsements flows**, `**PageHeader`**, `**QuickAdd**`, `**Stepper**`, and `**formUi**`. Use these when building new pages so layout, CTAs, and typography stay consistent.

## Quick reference


| Need                                 | Use                                                                                     |
| ------------------------------------ | --------------------------------------------------------------------------------------- |
| Page scroll + padding + `bg-gray-50` | `<PageShell>` from `src/components/ui`                                                  |
| Canonical title block                | Prefer `**PageHeader**` (`src/components/PageHeader.jsx`) — includes breadcrumbs & back |
| Standalone title / subtitle classes  | `PageTitle`, `PageSubtitle`, `SectionTitle` from `src/components/ui/Typography.jsx`     |
| Primary / secondary buttons          | `<Button variant="primary | secondary | ghost | danger">`                               |
| White card / dashboard tile          | `<Card variant="default | interactive | padded">`                                       |
| Form section with left accent        | `<SectionCard accent="basic | plans | dependents">`                                     |
| Quick Add–style main panel           | `<InsetPanel>`                                                                          |
| Footer summary chips                 | `<KpiChip variant="indigo | emerald | violet" icon={Icon} label="" value="" />`         |
| Sticky bottom bar chrome             | `<StickyFooterBar>`                                                                     |
| Raw class strings / recipes          | `src/theme/designTokens.js`                                                             |


## Tokens (`src/theme/designTokens.js`)

- **Shell:** `pageShellScrollRoot`, `pageShellPadding`, `pageCanvasBg`, `pageContentWidth`
- **Typography:** `typography.pageTitle`, `pageSubtitle`, `sectionTitle`, `fieldLabel`, `helper`, `cardEyebrow`
- **Shadows:** `shadows.card`, `cardHoverLg`, `primaryButton`, `stickyFooterUp`, `insetRing`
- **Buttons:** `buttonRecipe.primary`, `secondary`, `ghost`, `danger`
- **Sections:** `sectionCardShell`, `sectionAccentBorder`, `formSectionShellByAccent`, `insetPanelShell`
- **Footer:** `stickyFooterBarShell`, `kpiChipRecipe`
- **Dashboard tiles:** `dashboardActionTileShell`

`src/lib/formUi.js` re-exports section shells via `**formSectionShellByAccent`** so existing imports of `updateFormSectionShell` stay aligned with tokens.

## Layout rules

See `**AGENTS.md**` — outer scroll `**flex h-full min-h-0 flex-col overflow-y-auto**`, padding `**px-6 py-6 lg:px-8**`, primary content `**w-full**`, avoid stray `**max-w-* mx-auto**` unless intentional.

## Breadcrumbs & header

**Canonical:** `**PageHeader`** — back button `h-9 w-9 rounded-lg`, crumbs `text-[11px]`, current page `font-semibold text-gray-900`, links `text-gray-500 hover:text-indigo-600`. Title `text-2xl font-bold tracking-tight text-gray-900`; subtitle `text-sm leading-snug text-gray-500`.

Legacy `**Breadcrumb.jsx**` (Home + trail) exists for older screens; **new flows should use `PageHeader`**.

## Radius & shadows (Tailwind)


| Use                   | Classes                          |
| --------------------- | -------------------------------- |
| Controls, small wells | `rounded-lg`                     |
| Cards, CTAs, chips    | `rounded-xl`                     |
| Large action tiles    | `rounded-2xl`                    |
| Stepper / badges      | `rounded-full`                   |
| Default elevation     | `shadow-sm`                      |
| Tile hover            | `hover:shadow-lg`                |
| Primary CTA           | `shadow-md shadow-indigo-600/20` |


## Stepper

Use `**src/components/Stepper.jsx**` — active/completed `**bg-indigo-600**`, ring `**ring-[3px] ring-indigo-100**`, connectors `**h-0.5 rounded-full**`.

## CSS theme variables

Global brand-ish colors live in `**src/index.css**` under `@theme` (`--color-primary`, sidebar colors, etc.). Prefer Tailwind **gray / indigo** scales in components unless extending `@theme`.

## Imports

```jsx
import {
  Button,
  Card,
  SectionCard,
  PageShell,
  KpiChip,
  StickyFooterBar,
  InsetPanel,
  PageTitle,
  PageSubtitle,
  SectionTitle,
} from '../components/ui'
```

Adjust the relative path from your page file.