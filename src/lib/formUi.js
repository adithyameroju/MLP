import { formSectionShellByAccent, typography } from '../theme/designTokens'

/**
 * Shared Quick Add / dependent / plan form typography and control sizing.
 * Hierarchy: section title (largest) → field label → input text (sm) → helper (xs).
 */
export const formSectionTitleClass = typography.sectionTitle

export const formSectionBadgeClass =
  'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold'

export const formFieldLabelClass = typography.fieldLabel

export const formHelperTextClass = typography.helper

/** Inputs and selects: one consistent height across Basic info, Plans, Dependents */
export const formControlClass =
  'w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white transition-colors min-h-[2.75rem] box-border'

export const formControlErrorClass = 'border-red-300 bg-red-50/30'

/** Section shells aligned with Quick Add Employees (left accent + white card). Source: theme/designTokens.js */
export const updateFormSectionShell = formSectionShellByAccent
