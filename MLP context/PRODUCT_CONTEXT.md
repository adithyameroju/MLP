# Product context

Put whatever you have here: stream of consciousness, copy-paste from docs, bullet lists, screenshots described in text, competitor notes, things you’re *not* building, open questions—anything. You don’t need to follow a template.

When you work in Cursor, point to this file or @-mention it so the context is loaded. I’ll read it as-is and use it to stay aligned with the product and the MLP.

---

_(Your notes start below this line.)_

# Acko Employer Portal — Product Context

## Product Purpose

The Employer Portal is Acko’s operational platform for managing employee benefits after onboarding.

It enables HR and Finance teams to:

* Manage employee policies and coverage
* Perform endorsements (add/update/delete members)
* Track claims and handle escalations
* Monitor and manage CD (Cash Deposit) balance
* Access reports and insights

The goal is to reduce dependency on Acko teams and make operations self-serve, transparent, and reliable.

---

## North Star

Create a single, connected employer experience where operations are:

* Faster
* Clearer
* More controlled

Success = The portal becomes the employer’s default system for running insurance.

---

## Primary Users

* HR Manager / Benefits Head → operations owner
* Finance Manager → financial owner

Secondary:

* Broker
* BizOps / Admin

---

## Core Problems

* Manual and slow endorsements
* Lack of claims transparency
* Poor CD visibility and reconciliation
* High operational dependency on Acko
* Low confidence during employee escalations

---

## Product Philosophy

### 1. System, not modules

The portal is NOT a set of independent modules.
It is a connected system where:

* Endorsements depend on CD
* Claims depend on policies
* Reports depend on all modules

### 2. Proactive > Reactive

The system should guide users:

* What to do
* When to do it
* What will happen next

### 3. Financial clarity is critical

Every action with financial impact must:

* Show cost
* Show impact
* Prevent failure

---

## Current MLP Scope

Focus ONLY on:

* Endorsements V2
* Endorsement schedule
* Premium calculation visibility
* CD balance accuracy
* CD alerts
* CD statement enhancements
* Reconciliation (endorsement ↔ CD)
* HRMS integration
* Claims page improvements
* Master policy coverage view
* Dashboard redesign
* AI assistant (v1)

---

## Core System Relationships

* Endorsements → require CD validation
* CD → reflects endorsements and policy changes
* Claims → linked to employee and policy
* Reports → aggregate all modules

---

## Global UX Principles

* Show current state clearly
* Show next steps
* Show blockers early
* Avoid hidden logic
* Reduce user anxiety
* Prefer inline validation over post-failure

---

## Design Rules for Cursor

* Stay within MLP scope
* Do NOT assume undefined backend capabilities
* Always include:

  * empty states
  * error states
  * loading states
  * success states
* Highlight assumptions
* Prefer realistic flows over ideal ones

---
