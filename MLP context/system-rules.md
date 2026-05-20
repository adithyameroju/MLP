# System Rules — Acko Employer Portal

---

## 1. Purpose

Define cross-module rules, constraints, and system behavior to ensure:

- consistency across modules
- predictable outcomes
- correct business logic enforcement

This file governs how all modules interact.

---

## 2. Core System Philosophy

### 1. Prevent failure BEFORE it happens

- No action should fail after submission if it could be predicted earlier

---

### 2. Financial clarity is mandatory

- Any action affecting cost must:
  - show impact
  - show balance
  - show consequences

---

### 3. System over modules

- Modules are NOT independent
- Actions in one module must reflect in others

---

## 3. Cross-Module Rules

---

### A. Endorsements ↔ CD Balance

#### Rule 1 — Pre-validation (MANDATORY)

Before any endorsement:

- Check CD balance
- If insufficient:
  - BLOCK action
  - Show:
    - required amount
    - available balance
    - shortfall

---

#### Rule 2 — Deduction Mapping

Every endorsement must:

- create a CD transaction
- store:
  - employee(s)
  - action type
  - cost breakdown

---

#### Rule 3 — Real-time Update

After endorsement:

- CD balance must update immediately

---

---

### B. Endorsements ↔ Dashboard

#### Rule 4 — Action Surfacing

Dashboard must show:

- pending endorsements
- failed endorsements
- actions required

---

#### Rule 5 — Deep Linking

Clicking dashboard alert must:

- open endorsements module
- with filtered context

---

---

### C. Claims ↔ Dashboard

#### Rule 6 — Claims Alerts

Dashboard must show:

- claims needing attention
- claims awaiting documents
- delayed claims

---

#### Rule 7 — Action Flow

Clicking claim alert must:

- open claims module
- highlight relevant claims

---

---

### D. Claims ↔ Policy

#### Rule 8 — Coverage Dependency

Claims must:

- reflect policy coverage
- show:
  - eligibility
  - limits

---

---

### E. Reports ↔ All Modules

#### Rule 9 — Data Aggregation

Reports must pull from:

- endorsements
- claims
- CD balance
- policy

---

#### Rule 10 — Consistency

Report data must match:

- module-level data
- no discrepancies allowed

---

---

### F. Enrolment ↔ Endorsements

#### Rule 11 — Lifecycle Flow

- Enrollment → creates initial employees
- Endorsements → manage updates after enrollment

---

---

## 4. Global Business Rules

---

### Rule 12 — CD Integrity

- CD balance must NEVER go below zero

---

### Rule 13 — Validation First

- All inputs must be validated before submission

---

### Rule 14 — Status Accuracy

- All operations must have:
  - real status
  - real-time updates

---

### Rule 15 — Auditability

- All actions must be:
  - traceable
  - explainable
  - exportable

---

## 5. System States

Every operation must support:

- Pending
- In Progress
- Completed
- Failed

---

## 6. Notifications & Alerts

System must generate alerts for:

- Low CD balance
- Failed endorsements
- Pending actions
- Claims requiring attention
- Report completion/failure

---

## 7. Interaction Rules

---

### Rule 16 — No Dead Ends

Every screen must:

- provide next action
- guide user forward

---

### Rule 17 — Cross Navigation

Users should NOT:

- manually search across modules

System must:

- link related data automatically

---

### Rule 18 — Inline Context

Important information must:

- appear within flows
- not require navigation

Example:

- CD balance shown inside endorsement flow

---

## 8. UX Consistency Rules

---

### Rule 19 — Standard Components

- Tables
- Filters
- Status badges
- Actions

Must behave consistently across modules

---

### Rule 20 — Action-first Design

- Prioritize actions over information
- Avoid passive screens

---

## 9. Constraints for Cursor

When generating features:

- Do NOT:
  - invent backend logic
  - skip validation
  - ignore CD rules
- Always:
  - include edge cases
  - include failure states
  - include system feedback

---