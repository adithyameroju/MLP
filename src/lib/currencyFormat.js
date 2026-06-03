export function formatInr(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(amount)))
}

export function formatInrSigned(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Math.round(amount))
}

/** Compact INR for summaries (e.g. ₹1.9L). */
export function formatCompactInr(amount) {
  const v = Math.round(Number(amount) || 0)
  if (Math.abs(v) >= 10000000) return `₹${(v / 10000000).toFixed(1)}Cr`
  if (Math.abs(v) >= 100000) return `₹${(v / 100000).toFixed(1)}L`
  if (Math.abs(v) >= 1000) return `₹${(v / 1000).toFixed(0)}k`
  return `₹${v}`
}
