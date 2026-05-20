import { kpiChipRecipe } from '../../theme/designTokens'

function cn(...parts) {
  return parts.filter(Boolean).join(' ')
}

/**
 * Summary chip — QuickAddBatchStickyFooter pattern (employees / profiles / dependents).
 * @param {'indigo' | 'emerald' | 'violet'} variant
 */
export default function KpiChip({ variant = 'indigo', icon: Icon, label, value, className }) {
  const r = kpiChipRecipe[variant] ?? kpiChipRecipe.indigo
  return (
    <div className={cn(r.shell, className)} aria-live="polite">
      {Icon ? (
        <span className={r.iconWrap}>
          <Icon size={18} strokeWidth={2.25} aria-hidden />
        </span>
      ) : null}
      <div className="min-w-0">
        <p className={r.label}>{label}</p>
        <p className="text-sm font-bold text-gray-900 tabular-nums leading-tight">{value}</p>
      </div>
    </div>
  )
}
