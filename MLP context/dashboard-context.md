# Dashboard — Context

---

## 1. Current State (V1 Reality)

The dashboard acts as an overview screen showing high-level metrics and quick access to key actions.

### Key Elements Present:

* Welcome header ("Welcome back, [User]")
* Global search (employee search by name/email/ID)
* Entity selector

### Summary Cards:

* CD Balance (with trend graph)
* Total Lives (employees vs dependents split)
* Open Claims (with basic breakdown)
* Total Claims

### Claims Insights Section:

* Claims trend charts with multiple views:

  * By status (approved, rejected, in progress)
  * By family member
  * By treatment type
* Toggle between:

  * Count vs Amount

### Quick Actions:

* Send E-cards
* Bulk endorsements (add/update/delete employees)
* Find hospitals

### System Feedback:

* Upload status banners (e.g., “Your upload is in progress…”)
* Notifications for report generation

---

## 2. Current UX / Flow

### Entry Flow:

1. User logs in
2. Lands on dashboard
3. Views:

   * Summary metrics
   * Claims insights
   * Quick actions

### Action Flows from Dashboard:

* Quick actions → open modal flows (e-card, bulk upload, etc.)
* Search → opens employee details page
* Claims charts → informational only (limited actionability)
* Upload feedback → passive notification (no deep linking)

---

## 3. Problems / Gaps

### 1. Passive Dashboard (Biggest Issue)

* Shows data but does NOT guide actions
* No “what should I do next”

---

### 2. Weak Actionability

* Claims insights are not actionable
* No direct navigation:

  * to claims needing attention
  * to endorsements
  * to CD issues

---

### 3. No Financial Awareness

* CD balance is shown
* But:

  * no alerts
  * no risk indication
  * no linkage to endorsements

---

### 4. Quick Actions are Generic

* Not contextual
* Same for all users regardless of state

---

### 5. Missing Operational Signals

No visibility into:

* pending endorsements
* failed uploads
* incomplete tasks
* upcoming risks

---

### 6. Disconnected Modules

* Dashboard does not connect:

  * endorsements ↔ CD
  * claims ↔ employees
* Forces users to navigate manually

---

## 4. MLP Enhancements

### 1. Action-Oriented Dashboard

* Introduce “Action Required” section
* Examples:

  * “CD balance low”
  * “3 endorsements pending”
  * “2 claims under review”

---

### 2. Smart Alerts

* CD low balance alerts
* Failed upload alerts
* Pending actions alerts

---

### 3. Contextual Quick Actions

* Replace static actions with:

  * “Complete pending endorsement”
  * “Add funds to CD”
  * “Resolve claim issue”

---

### 4. Deep Linking

Every card should allow:

* click → go to filtered module view

Examples:

* Open claims → Claims (filtered)
* Endorsement pending → Endorsements page
* CD alert → CD Balance page

---

### 5. System Feedback Integration

* Upload status
* Report generation status
* Notifications visible and actionable

---

### 6. Cross-module Visibility

* Show:

  * endorsement impact on CD
  * claims linked to employees

---

## 5. Final Intended Dashboard System (MLP)

The dashboard becomes a **control center**, not a summary page.

---

### A. Top Section — Alerts & Priorities

A dedicated section for:

* Critical alerts
* Pending actions

Examples:

* “CD balance below threshold”
* “2 failed endorsements”
* “5 employees pending updates”

---

### B. Key Metrics (Retained but Improved)

* CD Balance (with risk indicator)
* Total Lives
* Open Claims
* Total Claims

Enhancements:

* clickable
* context-aware
* linked to modules

---

### C. Smart Quick Actions

Dynamic actions based on system state:

Instead of static:

* Send e-card
* Bulk endorsement

Show:

* “Complete pending upload”
* “Fix failed endorsement”
* “Add funds to CD”

---

### D. Insights Section (Claims + Future CD/Endorsements)

Keep charts but:

* make interactive
* add drill-down capability

---

### E. Activity / System Feed

Show:

* recent endorsements
* CD deductions
* claim updates
* uploads

---

## 6. Key Components

* Alert cards (priority-based)
* Metric cards (clickable)
* Smart quick actions
* Claims insights charts
* Activity feed
* Global search

---

## 7. Dependencies

* Endorsements → pending / failed actions
* CD Balance → alerts, validation
* Claims → open / delayed claims
* Reports → status visibility
* Policy → employee and coverage data

---

## 8. UX Principles (Dashboard-specific)

* Prioritize actions over information
* Reduce cognitive load
* Show what matters NOW
* Surface risks early
* Enable 1-click navigation to resolution
* Avoid static, decorative metrics

---

