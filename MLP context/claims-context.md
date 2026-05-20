# Claims — Context

---

## 1. Current State (V1 Reality)

The Claims module provides visibility into employee insurance claims and supports basic tracking and reporting.

---

### Key Elements Present:

#### A. Summary Section

- Total Claims (MTD / YTD)
- Claims Paid (₹ value)
- Top Claim Category (e.g., Cataract)
- Average Settlement Time

---

#### B. Claims List View

- Table of claims with:
  - Claim ID
  - Employee name
  - Claim type (Cashless / Reimbursement)
  - Amount
  - Submission date
  - Status
- Filters:
  - Date range
  - Status (Approved, Processing, Under Review, Rejected)
  - Type
- Sorting options

---

#### C. Claim Detail View

- Claim information:
  - Employee details
  - Treatment details
  - Hospital info
  - Diagnosis
- Financial details:
  - Claimed amount
  - Approved amount
- Documents:
  - Uploaded files
  - Pending documents

---

#### D. Claim Timeline

- Step-by-step status:
  - Submitted
  - Documents verified
  - Medical review
  - Approved / Rejected
- Shows:
  - timestamps
  - current progress %
  - next action

---

#### E. Reports

- Generate claims reports
- Download reports
- View report status (processing, completed, failed)

---

#### F. Search

- Search by:
  - employee name
  - ID
  - email

---

## 2. Current UX / Flow

### A. Entry

1. User opens Claims module
2. Views:
  - summary metrics
  - claims table

---

### B. Exploration

- Filter claims
- Search employees
- View claim details

---

### C. Detail Interaction

- Open claim → see:
  - timeline
  - documents
  - status
- No direct actions except viewing

---

### D. Reporting

- Generate report
- Track report status
- Download output

---

## 3. Problems / Gaps

### 1. Passive Visibility (Biggest Issue)

- Claims are **view-only**
- No clear:
  - actions required
  - prioritization

---

### 2. No Operational Guidance

HR cannot answer:

- “Which claims need my attention?”
- “What should I do next?”

---

### 3. Weak Escalation Handling

- No:
  - escalation workflows
  - follow-up actions
  - communication tools

---

### 4. No Proactive Alerts

- Missing:
  - stuck claims
  - delayed claims
  - document pending alerts

---

### 5. Limited Actionability

- Cannot:
  - trigger follow-ups
  - request documents
  - escalate internally

---

### 6. Disconnected from Dashboard

- Claims module is not:
  - tightly linked to dashboard alerts
  - driving actions in system

---

### 7. Insights Not Actionable

- Charts show trends
- But do NOT drive:
  - decisions
  - actions

---

## 4. MLP Enhancements

### 1. Actionable Claims System

Each claim should show:

- current status
- required action
- owner (who should act)

---

### 2. Alerts & Prioritization

Introduce:

- “Claims needing attention”
- “Documents pending”
- “Delayed claims”

---

### 3. Next Action System

For each claim:

- show:
  - “Upload document”
  - “Follow up with insurer”
  - “Awaiting approval”

---

### 4. Escalation Support

Enable:

- mark as escalated
- track escalations
- assign responsibility

---

### 5. Proactive Notifications

System should:

- notify HR when:
  - claim is stuck
  - documents missing
  - claim rejected

---

### 6. Better Timeline Intelligence

Enhance timeline to:

- show delays
- highlight blockers
- predict next step

---

### 7. Dashboard Integration

Claims should:

- surface alerts to dashboard
- drive:
  - “Resolve claims” actions

---

## 5. Final Intended System (MLP)

The Claims module becomes a **resolution system**, not just a tracking tool.

---

### A. Claims Control Layer

Top section:

- claims needing attention
- claims delayed
- claims awaiting documents

---

### B. Smart Claim List

Each row shows:

- status
- next action
- urgency

---

### C. Claim Detail = Action Hub

Instead of passive view:

- show:
  - required action
  - owner
  - timeline
- allow:
  - document upload
  - follow-up tracking

---

### D. Predictable Outcomes

Users should know:

- what is happening
- what is required
- when it will resolve

---

### E. Insight → Action

Convert:

- trends → decisions

Example:

- “High reimbursement claims → investigate”

---

## 6. Key Business Rules

- Claim status must be accurate and real-time
- Timeline must reflect true processing stages
- Documents required must be clearly indicated
- Claim cannot progress without required inputs

---

## 7. Dependencies

- Policy → coverage rules
- Employee data → claim mapping
- Insurer backend → claim processing
- Dashboard → alerts and actions

---

## 8. UX Principles (Claims-specific)

- Reduce HR anxiety
- Show clarity in status
- Highlight actions needed
- Avoid passive dashboards
- Make resolution easy and predictable

---