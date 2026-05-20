/**
 * CD sufficiency for endorsement submission (MLP rule: balance must not go negative).
 * @param {number} cdAfterSubmit — projected balance after estimated deduction
 */
export function isCdSufficientForSubmission(cdAfterSubmit) {
  return typeof cdAfterSubmit === 'number' && cdAfterSubmit >= 0
}
