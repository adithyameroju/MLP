import { useEffect, useState } from 'react'

/**
 * Short KPI tile — title + metric + optional subtitle + compact donut. Entrance animation on mount (respect motion-reduced).
 * Hover: subtle lift (no shadow). Channel subtitle pins to bottom when provided.
 */
export default function ClaimsCompactKpi({
  title,
  metric,
  subtitle,
  metricClassName = 'text-[30px] font-bold tabular-nums leading-tight text-gray-900',
  donut,
  delayMs = 0,
  tooltip = '',
}) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = window.setTimeout(() => setVisible(true), delayMs)
    return () => window.clearTimeout(t)
  }, [delayMs])

  return (
    <div
      title={tooltip || undefined}
      className={`group flex min-h-[7rem] cursor-default items-stretch gap-4 rounded-xl border border-gray-200 bg-white px-5 py-4 motion-safe:transition-all motion-safe:duration-500 motion-safe:ease-out motion-safe:hover:-translate-y-0.5 ${
        visible ? 'motion-safe:opacity-100 motion-safe:translate-y-0' : 'motion-safe:opacity-0 motion-safe:translate-y-2'
      }`}
    >
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">{title}</p>
        <div className={`mt-1.5 ${metricClassName}`}>{metric}</div>
        {subtitle ? (
          <div className="mt-auto pt-3 motion-safe:transition-opacity motion-safe:duration-300">{subtitle}</div>
        ) : null}
      </div>
      {donut ? (
        <div
          title={tooltip || undefined}
          className="shrink-0 self-start pt-0.5 motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out motion-safe:group-hover:scale-105"
        >
          {donut}
        </div>
      ) : null}
    </div>
  )
}
