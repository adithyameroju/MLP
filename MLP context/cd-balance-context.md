# CD Balance — Context

---

## 1. Current State (V1 Reality)

The CD Balance module provides visibility into the employer’s prepaid wallet used for insurance operations.

---

### Key Elements Present:

#### A. Summary Cards

* Current Balance
* Monthly Burn Rate

---

#### B. Transaction History Table

* List of transactions including:

  * Date & time
  * Transaction type (Deposit / Deduction / Refund)
  * Description (e.g., endorsement, employee exit)
  * Amount
  * Running balance

---

#### C. Filters & Controls

* Date range filter (calendar picker)
* View modes:

  * Daily
  * Monthly
  * Quarterly
* Transaction type filters

---

#### D. Views

* Tabular transaction list
* Aggregated monthly/quarterly summaries

---

#### E. Reports

* Ability to generate CD balance reports
* Download historical reports

---

## 2. Current UX / Flow

### Entry Flow:

1. User navigates to CD Balance module
2. Views:

   * Current balance
   * Burn rate
   * Transaction history

---

### Exploration Flow:

* Apply filters (date / type)
* Switch views (daily / monthly / quarterly)
* View transaction details

---

### Reporting Flow:

* Generate report
* Select date range
* Download report

---

## 3. Problems / Gaps

### 1. Passive Financial View (Biggest Issue)

* Shows data but does NOT guide decisions
* No indication of:

  * risk
  * sufficiency
  * upcoming issues

---

### 2. No Pre-action Context

* User cannot answer:

  * “Can I perform an endorsement?”
  * “Will this action fail?”

---

### 3. Weak Link to Endorsements

* Transactions show endorsements
* But:

  * no direct mapping
  * no drill-down
  * no explanation of cost

---

### 4. No Alerts System

* No:

  * low balance alerts
  * threshold warnings
  * proactive notifications

---

### 5. No Forecasting

* Burn rate is shown
* But no:

  * runway calculation
  * future risk prediction

---

### 6. Poor Reconciliation Experience

* Finance cannot easily:

  * match endorsements → deductions
  * understand “why balance changed”

---

## 4. MLP Enhancements

### 1. Pre-action Validation (CRITICAL)

Before any endorsement:

* System must show:

  * available balance
  * required amount
  * shortfall (if any)

---

### 2. CD Risk System

Introduce states:

* Safe
* Warning
* Critical

Based on:

* balance vs threshold
* burn rate

---

### 3. Alerts & Notifications

* Low balance alerts
* Upcoming risk alerts
* Failed transaction alerts

---

### 4. Endorsement Mapping

Each deduction must show:

* which endorsement caused it
* employee / action
* cost breakdown

---

### 5. Forecasting / Runway

Show:

* “Estimated runway: X weeks”
* based on:

  * burn rate
  * current balance

---

### 6. Actionability

Enable:

* “Add funds” CTA
* “View related endorsement”
* “Resolve discrepancy”

---

### 7. Reconciliation Layer

Make it easy to:

* trace:
  endorsement → deduction → balance
* export clean statements

---

## 5. Final Intended System (MLP)

The CD Balance module becomes a **financial control system**, not just a ledger.

---

### A. Top Section — Financial Health

* Current Balance
* Burn Rate
* Runway (weeks remaining)
* Risk indicator (safe / warning / critical)

---

### B. Alerts & Actions

Examples:

* “CD balance below threshold”
* “Endorsements may fail”
* “Recharge required”

With actions:

* Add funds
* View details

---

### C. Transaction Intelligence

Transaction list enhanced with:

* clear categorization
* endorsement linkage
* explanation of deductions

---

### D. Reconciliation View

* Map:
  endorsement ↔ CD transaction
* show:

  * what changed
  * why it changed

---

### E. Reporting

* Clean exportable reports
* Finance-friendly format

---

## 6. Key Business Rules

* CD balance must NEVER go below zero
* Any operation must validate balance before execution
* Deduction = incremental premium
* Refund only if:

  * no claims made

---

## 7. Dependencies

* Endorsements → creates deductions
* Policy → defines coverage cost
* Finance system → handles deposits
* Dashboard → surfaces alerts

---

## 8. UX Principles (CD-specific)

* Absolute financial clarity
* Explain every deduction
* Prevent failure BEFORE it happens
* Show consequences of actions
* Make reconciliation effortless

---
