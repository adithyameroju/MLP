# Endorsements — MLP flow (target architecture)

*Aligns `PRODUCT_CONTEXT.md`, `system-rules.md`, `endorsements-context.md`, and `cd-balance-context.md`. Implementation is incremental; Quick Add now enforces CD blocking as a first slice.*

---

## 1. Information architecture

```
Employer Portal
└── Endorsements (hub: /)
    ├── Add employee
    │   ├── Quick Add (form, batch ≤5)
    │   └── Bulk upload (file)
    ├── Update employee
    │   ├── Quick update
    │   ├── Bulk update
    │   ├── Add dependents
    │   └── Life events (spouse / newborn)
    ├── Delete employee
    │   ├── Quick delete
    │   └── Bulk delete
    ├── HRMS sync (joining / leaving)
    └── Endorsement history (filters, status, drill-down)
```

**Cross-module**

- **CD Balance** — funding, transactions, reconciliation, “add funds”
- **Dashboard** — alerts (low CD, failed/pending endorsements), deep links into filtered endorsement views

---

## 2. Unified flow template (all endorsement types)

| Phase | Purpose |
|--------|--------|
| **1. Entry** | Hub card or dashboard alert → chooser → flow |
| **2. Capture** | Form, file upload, or HRMS review list |
| **3. Validate** | Field + business rules; bulk → row-level |
| **4. Financial** | Premium delta (where applicable), GST lines, **total deduction** |
| **5. CD check** | Available − deduction ≥ 0 → **allow** preview/submit; else **block** + shortfall + CTA |
| **6. Confirm** | Summary screen with financial impact |
| **7. Submit** | API → async job for bulk |
| **8. Track** | Status: submitted → validating → processing → completed / partial / failed |
| **9. Log** | History row + CD transaction linkage + export |

---

## 3. Main user journeys (screen-by-screen)

### 3.1 Add employee — Quick Add *(partially implemented)*

1. Add Employee → Quick Add  
2. Enter 1–5 employees (basic → plans → dependents)  
3. **Calculate premium** → validation; premium + CD widget  
4. If **CD insufficient** → banner, disabled Preview, link **Open CD balance**  
5. If sufficient → **Preview & Submit** → Review  
6. Review shows breakdown + CD widget; **Submit** disabled if insufficient  
7. Success → history + redirect; CD deduction recorded (backend in MLP target)  

### 3.2 Add employee — Bulk

1. Template download → upload  
2. Parse → **row validation** (errors per row)  
3. Aggregate **financial preview** + **single CD check** for net batch  
4. Confirm → submit → **partial success** possible (valid rows commit, invalid stay fixable)  
5. History shows batch ID, row outcomes, link to fix failed rows  

### 3.3 Update / dependents / life events

1. Search employee (or life-event wizard)  
2. Edit fields / dependents  
3. **Premium delta** + CD check (same gating as add)  
4. Confirm → submit → history  

### 3.4 Delete

1. Select employee(s) + leaving date/reason  
2. **Refund / adjustment** estimate if rules apply + CD impact  
3. CD check → confirm → submit  

### 3.5 HRMS sync

1. Joining / Leaving tabs  
2. Per row: approve / reject / edit plans  
3. **Financial preview** before approve + CD check  
4. Standalone-policy edge case → extra confirm  
5. Submit → history entries per decision  

### 3.6 Endorsement history

1. Filter by status, date, type  
2. View detail → download  
3. Failed → fix & resubmit (inline or re-upload)  
4. Link **View CD transaction** from row  

---

## 4. States & edge cases

| State | Meaning |
|--------|--------|
| Draft | Quick Add local draft (device) |
| Stale premium | Form changed after calculate → recalculate |
| CD blocked | Estimate shows negative projected balance → no preview/submit |
| Validating | Bulk file parsing |
| Processing | Server job |
| Completed | Full success |
| Partial success | Bulk: some rows ok |
| Failed | Validation or business rule |
| In progress | Long-running job |

**Edge cases**

- CD insufficient → block + shortfall + **Open CD balance**  
- Bulk partial success → history shows counts + failed row IDs  
- HRMS standalone policies → modal before approve leaving  
- Retry failed rows without duplicating successful ones  

---

## 5. Shared components (target)

- **Premium breakdown** — lines + GST + total (reuse `buildQuickAddPremiumBreakdown` pattern; extend for updates/deletes)  
- **CD impact panel** — current balance, deduction, new balance, sufficiency (`CdBalanceFormWidget` + `isCdSufficientForSubmission`)  
- **Validation engine** — one schema per action type; bulk row-level messages  
- **Confirm / Review** — employee summary + financial column  
- **Status badges** — consistent with history table  
- **Cross-links** — `Open CD balance` → `/cd-balance`; dashboard alerts → endorsement routes with query/hash context  

---

## 6. Implementation notes (repo)

- **`src/lib/cdSufficiency.js`** — `isCdSufficientForSubmission(cdAfterSubmit)`  
- **Quick Add** — blocks Preview & Submit when `cdAfterSubmit < 0` after calculate; review screen respects `canSubmit`  

Next builds: extend CD gating + financial preview to bulk, update, delete, HRMS; backend-driven history; row-level bulk validation UI.
