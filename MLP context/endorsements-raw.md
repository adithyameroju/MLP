# Endorsements — Context

*Derived only from the current codebase (React app under `src/`). No backend APIs are implemented; behaviour is client-side mock/state.*

---

## 1. Current State (Implementation Reality)

### Shell & navigation

- **Layout** (`Layout.jsx`): sidebar entries for Dashboard, Claims, CD Balance, Policy, Reports (several are placeholders), and **Endorsements** (routes under `/`, `/add`, `/update`, `/delete`, `/hrms-sync`).
- **Endorsements home** (`/` → `EndorsementsDashboard.jsx`): title “Endorsements”, four action cards (Add / Update / Delete / HRMS Sync), **Endorsement Schedule** button (UI only; no route), and `**EndorsementHistory`** table below the fold.

### Flows implemented as pages


| Area   | Route(s)                                                  | Purpose                                                                                                               |
| ------ | --------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Add    | `/add`                                                    | Chooser: Quick Add vs Bulk Upload                                                                                     |
|        | `/add/quick`                                              | **Quick Add** — multi-employee form batch (up to 5), plans, dependents, CD/premium estimate, review, submit           |
|        | `/add/bulk`                                               | **Bulk Upload — Add** — file drop, template copy, simulated processing                                                |
| Update | `/update`                                                 | Chooser: Quick Update, Bulk Update, life events                                                                       |
|        | `/update/quick`                                           | Search mock employees → edit + `PlanSelection` + `DependentForm` → submit                                             |
|        | `/update/bulk`                                            | Excel upload — simulated processing                                                                                   |
|        | `/update/add-dependents`                                  | Search → `DependentForm` for selected employee → submit                                                               |
|        | `/update/life-event/spouse`, `/update/life-event/newborn` | Life-event specific flows (forms + submit; mock)                                                                      |
| Delete | `/delete`                                                 | Chooser: Quick Deletion vs Bulk Deletion                                                                              |
|        | `/delete/quick`                                           | Multi-step: select employees → date & reason → review → submit                                                        |
|        | `/delete/bulk`                                            | File upload — simulated processing                                                                                    |
| HRMS   | `/hrms-sync`                                              | Tabs Joining / Leaving; approve/reject; plan/dependent handling for joiners; standalone-policy popup for some leavers |


### Shared state

- `**EndorsementProvider`** (`store/EndorsementStore.jsx`): in-memory **endorsement history** seeded from `mockData.endorsementHistory`. `**addEntry`** appends rows; `**updateEntry`** mutates a row by `id`.
- **Quick Add draft**: `localStorage` key `quickAdd_draft_v1` (`quickAddDraft.js`) — persists `employees`, `savedAt`, `expandedId`, `activeTab`, `uiVariation`, `cdPlacement`.

### Data sources (mock)

- Plan catalogues, departments, designations, dependent relations, `**mockEmployees`**, `**hrmsJoiningEmployees*`*, `**hrmsLeavingEmployees**` in `data/mockData.js`.

---

## 2. Current User Flow

### A. Endorsements dashboard

1. User opens `/` (hash: `#/`).
2. Sees hub cards → navigates to Add / Update / Delete / HRMS Sync.
3. Scrolls to **Endorsement History** — filter, sort, paginate, View / Download (Download is non-functional UI), status badges.

### B. Quick Add (`/add/quick`)

1. Optional: restore **draft** from startup offer or “load from device”.
2. Build batch: **up to 5 employees** (accordion or tab UI variants); per employee: **Basic** (name, emp ID, email, DOB, gender, DOJ, optional mobile), **Plans** (`PlanSelection`), **Dependents** (`DependentForm`).
3. **Calculate premium**: runs **client validation** (`quickAddValidation.js`); on failure — error banner, section shake, scroll to first invalid section; on success — `premiumFlow` → `calculated`.
4. **CD widget** (`CdBalanceFormWidget`): after calculate, shows pro-rata **lines**, GST, total, **current CD** (mock constant), **estimated deduction**, **new balance**; **sufficient / insufficient** message (insufficient does **not** block submit in code — informational only).
5. **Preview & Submit** enabled only after premium is calculated; final submit calls `**addEntry`** with `Success`, clears draft, navigates to `/`.

### C. Bulk add / update / delete

1. Select file (`.xlsx`, `.xls`, `.csv`).
2. Submit → `**addEntry`** with `status: 'In Progress'` and `count: 0` (add/update) or bulk-delete action name.
3. Timed **uploading** UI → **success** screen → redirect to `/` (no real row-level outcome).

### D. Quick Update / Add Dependents

1. Search `**mockEmployees`**.
2. Edit or add dependents → **Submit** → `addEntry` **Success** → redirect `/` after delay.

### E. Quick Delete

1. Step 1: select from mock list (multi-select, filters).
2. Step 2: **date of leaving** and **reason** per employee (with “apply to all” options).
3. Step 3: review + confirm → `addEntry` **Success** with **details** (name, id, department, designation, reason, dateOfLeaving).

### F. HRMS Sync

1. **Sync** button runs a timed loading state; updates “Last sync” string locally.
2. **Joining**: per-row Accept / Reject / Accept with changes; uses `PlanSelection` / `DependentForm` when “managing”; `addEntry` on each action.
3. **Leaving**: Approve / Reject; if `**hasParentStandalonePolicy`**, modal `**confirmApproveLeaving`** before approve.

### G. History & failures (UI only)

- `**EndorsementHistory**`: filters by **Success / Failed / In Progress**, date range, sort.
- **Failed** quick: opens **QuickErrorModal** with `**generateErrors`** (different rules than Quick Add main form — see §4) and Fix & Resubmit (timer → `updateEntry` → Success).
- **Failed** bulk: **BulkErrorModal** with mock rows, inline fix mode, resubmit simulation.
- **In Progress**: **ProgressModal** — fake progress → `updateEntry` to Success.

---

## 3. Key Capabilities

- **Add employees**: Quick Add (form, max 5 per batch); Bulk Upload Add (file).
- **Update employees**: Quick Update; Bulk Update (file); **Add Dependents**; **Add Spouse** / **Add Newborn** (dedicated pages).
- **Delete employees**: Quick Delete (multi-select + dates/reasons); Bulk Delete (file).
- **HRMS**: Review joiners/leavers; approve/reject; standalone-policy gate for some leavers.
- **History**: List, filter, sort, pagination, view modal, error/progress modals, **Download** buttons (no real download).

---

## 4. Validation & Business Logic

### Quick Add — primary validation (`lib/quickAddValidation.js`)

- **Basic**: name, emp ID, email (required + simple email regex `\S+@\S+\.\S+`), DOB, gender, DOJ required; mobile if present must be **exactly 10 digits**.
- **Plans**: at least one of **GMC base** or **GPA base** (`hasPlans` / `validatePlanFields`).
- **Dependents**: each dependent — name, DOB, gender required (`validateDependentFields`).
- Section-level flags feed **tabs**, **tooltips**, **error banner** copy (`buildQuickAddErrorBannerSummary`).

### Quick Add — “basic complete” vs “filled” (used in premium mock)

- `**requiredFields`**: `name`, `empId`, `email`, `dob`, `gender`, `doj` — all non-empty → **basic complete** (`isBasicComplete` in `QuickAdd.jsx`).
- `**isFilled`**: only name + empId + email (used alongside premium tiers in `quickAddPremiumEstimate.js`).

### Plan model (`PlanSelection.jsx` + `planHelpers.js`)

- **GMC**: toggle; base, optional secondary (not `none`), top-up, add-ons array.
- **GPA**: toggle; base plan; `gpaSiType` **fixed** vs **ctc** with optional CTC/manual SI fields when enabled.
- **Dependents**: “same as employee” GMC inheritance via `**cloneEmployeeGmcPlans`**; custom dependent GMC supported.
- `**hasActiveSecondaryGmc`**: used for parent/in-law style rules in helpers (UI).

### Quick Delete

- At least **one** employee selected (`selection` error).
- Step 2: **every** selected employee must have **date** and **reason** (`dates[emp.id]`, `reasons[emp.id]`).

### Quick Error Modal (history) — `generateErrors` in `EndorsementHistory.jsx`

- Separate from Quick Add: requires **department**, **designation**; email/DOB/mobile rules similar; **does not** use `quickAddValidation.js`.

### CD / submit gating

- **Calculate premium** requires passing Quick Add validation.
- **Preview** requires `premiumFlow === 'calculated'` and no validation issues.
- **Insufficient CD** is **displayed** (`cdAfterSubmit < 0`) but **submit is not disabled** by CD in the reviewed code paths.

---

## 5. Status & Tracking

### History row shape (`addEntry` / seed data)

- Fields: `**id`** (timestamp for new), `**date`** (ISO date string), `**action`** (free-text label), `**doneBy**` (hardcoded user name in Quick Add submit), `**status**` (`Success` | `Failed` | `In Progress`), `**count**`, `**type**` (`quick` | `bulk` | `sync`), optional `**details**` (array of per-person objects for some flows).

### UI statuses

- **Success**, **Failed**, **In Progress** — filterable in history; badges; Failed/Processing clickable to modals.

### Tracking mechanics

- **Single global array** in React context; no server sync.
- **Bulk upload** initially logs **In Progress** with **count 0**; success screen does not update that entry to a final count (unless user opens Progress modal which targets existing row by id — bulk flow adds one entry but Progress modal is typically used from table click).
- `**isNew`**: highlighted row style for newly added entries (set in `addEntry`).

---

## 6. Financial Logic

### Premium estimate (`lib/quickAddPremiumEstimate.js`)

- **Illustrative** constants: GMC/GPA complete vs partial amounts, dependent GMC rates, secondary bump, per-addon amount, **GST 18%**.
- **Rules**: For each employee, if GMC base selected — accumulate by **basic complete** vs **filled-only** tiers; dependents count into GMC lines; GPA similar; secondary and add-ons add flat amounts when employee qualifies.
- Output: `**lines`** including plan rows, `**subtotal_ex_gst`**, `**gst`**, `**total**` (`totalInclGst`).

### CD impact in Quick Add (`QuickAdd.jsx`)

- `**MOCK_CD_AVAILABLE_RUPEES**` constant (e.g. 48,50,000): treated as **current CD**.
- `**estimatedCdDraw`** = `**totalInclGst`** from breakdown.
- `**cdAfterSubmit`** = mock current − total.
- `**CdBalanceFormWidget**` compares `**cdAfterSubmit >= 0**` for **sufficient / insufficient** messaging; shows **policy days remaining** from `**MOCK_POLICY_DAYS_LEFT`**.

### Other flows

- **No** premium or CD calculation in Bulk, Quick Update, Delete, HRMS, or Dependents flows in code (only `addEntry` labels).

---

## 7. Edge Cases

- **Quick Add**: max **5** employees; adding sixth is prevented. **Remove** employee disabled when only one remains.
- **Validation failure on Calculate**: scroll to error banner + first section; **shake** animation on invalid sections; touch-all-fields for invalid employees.
- **Employee data change after calculate**: `premiumFlow` becomes `**stale`** (must recalculate for consistency — UI copy references Recalculate).
- **Draft**: save/load/clear localStorage; startup banner if draft exists and form still “empty”.
- **Bulk**: no parsing — file name/size shown; outcomes are **timed** UX only.
- **History Failed**: Quick vs Bulk modals differ; resubmit **simulated** with timeout → status **Success**.
- **HRMS leaving**: **standalone** parent policies block approve until modal confirmation.

---

## 8. Dependencies

### CD Balance

- **Quick Add only**: mock balance, estimated draw, after-submit balance, sufficiency banner. Standalone **CD Balance** route is a **placeholder page** (`ModulePlaceholder`), not wired to endorsement logic.

### Policy

- **Mock policy context** in Quick Add: `**MOCK_POLICY_DAYS_LEFT`** passed into CD widget header copy only. No policy API.

### HRMS

- `**hrmsJoiningEmployees`** / `**hrmsLeavingEmployees`** static arrays drive lists and edge cases (e.g. `**hasParentStandalonePolicy**`, dependents on leaving records). **Sync** does not fetch remote data.

---

## 9. UX Principles (inferred from implementation)

- **Hub-and-spoke**: Endorsements dashboard → chooser pages → dedicated flows with `**PageHeader`** + `**Stepper`** where applicable.
- **Progressive disclosure**: Quick Add uses accordion/tabs, optional CD rail vs bottom placement, **visibility** toggle for CD block (`sessionStorage`).
- **Validation feedback**: section-level errors, top **banner**, **tooltips** on tabs, **shake** on failed calculate, scroll-into-view.
- **Financial transparency (Quick Add)**: explicit **Calculate** → **Preview** → **Submit**; CD widget hidden until estimate “ready” after calculate.
- **Consistency of actions**: most submits → **success screen** or toast + **navigate to `/`** (endorsements home).
- **Recovery**: Quick Add **draft** restore; Failed history rows → **Fix & Resubmit** modals (mock).
- **HRMS**: tabbed join/leave; emphasis on **review before approve**; extra confirmation for **standalone** policies on leaving.