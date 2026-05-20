import { useId, useMemo, useState, useCallback, useRef } from 'react'

function formatCompactInr(n) {
  const v = Math.round(n)
  if (Math.abs(v) >= 10000000) return `₹${(v / 10000000).toFixed(1)}Cr`
  if (Math.abs(v) >= 100000) return `₹${(v / 100000).toFixed(1)}L`
  if (Math.abs(v) >= 1000) return `₹${(v / 1000).toFixed(0)}k`
  return `₹${v}`
}

/**
 * CD balance trend — line + area with optional shadcn-style grid and hover tooltip.
 * @param {{ labels: string[], values: number[], detailed?: boolean }} props
 */
export default function CdBalanceTrendChart({ labels, values, detailed = false }) {
  const rawId = useId()
  const gradId = `cdTrendFill_${rawId.replace(/:/g, '')}`
  const wrapRef = useRef(null)
  const [hoverIdx, setHoverIdx] = useState(null)
  const [tipStyle, setTipStyle] = useState({ left: 0, top: 0 })

  const layout = useMemo(() => {
    const W = detailed ? 340 : 100
    const H = detailed ? 120 : 56
    const padL = detailed ? 8 : 4
    const padR = detailed ? 8 : 4
    const padT = detailed ? 8 : 6
    const padB = detailed ? 22 : 14
    const chartW = W - padL - padR
    const chartH = H - padT - padB
    const minV = Math.min(...values) * 0.98
    const maxV = Math.max(...values) * 1.02
    const range = maxV - minV || 1
    const n = values.length
    const xStep = n > 1 ? chartW / (n - 1) : 0
    const pts = values.map((v, i) => {
      const x = padL + i * xStep
      const y = padT + (1 - (v - minV) / range) * chartH
      return [x, y]
    })
    const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')
    const last = pts[pts.length - 1]
    const first = pts[0]
    const area = `${line} L${last[0].toFixed(1)},${padT + chartH} L${first[0].toFixed(1)},${padT + chartH}Z`
    const gridYs = detailed ? [0.33, 0.66].map((t) => padT + chartH * t) : []
    return { W, H, padL, padT, chartW, chartH, line, area, pts, gridYs }
  }, [values, detailed])

  const onMove = useCallback(
    (e) => {
      if (!detailed || !layout.pts.length) return
      const rect = wrapRef.current?.getBoundingClientRect()
      if (!rect) return
      const xSvg = ((e.clientX - rect.left) / rect.width) * layout.W
      let best = 0
      let bestD = Infinity
      layout.pts.forEach((p, i) => {
        const d = Math.abs(p[0] - xSvg)
        if (d < bestD) {
          bestD = d
          best = i
        }
      })
      setHoverIdx(best)
      const px = (layout.pts[best][0] / layout.W) * rect.width
      setTipStyle({ left: Math.min(Math.max(px, 48), rect.width - 120), top: 6 })
    },
    [detailed, layout],
  )

  const leave = useCallback(() => setHoverIdx(null), [])

  return (
    <div ref={wrapRef} className={`relative w-full ${detailed ? 'min-h-[128px]' : ''}`} onMouseMove={onMove} onMouseLeave={leave}>
      {detailed && hoverIdx != null ? (
        <div
          className="pointer-events-none absolute z-10 rounded-md border border-gray-200 bg-white px-2 py-1.5 text-[10px] shadow-md"
          style={{ left: tipStyle.left, top: tipStyle.top }}
        >
          <p className="font-semibold text-gray-900">{labels[hoverIdx]}</p>
          <p className="tabular-nums text-indigo-700">{formatCompactInr(values[hoverIdx])}</p>
        </div>
      ) : null}
      <svg
        viewBox={`0 0 ${layout.W} ${layout.H}`}
        className={`w-full ${detailed ? 'h-[120px]' : 'h-[72px]'} overflow-visible text-gray-400`}
        preserveAspectRatio="none"
        role="img"
        aria-label="CD balance trend"
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {detailed &&
          layout.gridYs.map((gy) => (
            <line
              key={gy}
              x1={layout.padL}
              y1={gy}
              x2={layout.W - layout.padR}
              y2={gy}
              stroke="#e5e7eb"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        <path d={layout.area} fill={`url(#${gradId})`} />
        <path
          d={layout.line}
          fill="none"
          stroke="#4f46e5"
          strokeWidth={detailed ? 2 : 1.75}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {layout.pts.map((p, i) => (
          <circle
            key={labels[i]}
            cx={p[0]}
            cy={p[1]}
            r={hoverIdx === i && detailed ? 3.5 : 2.25}
            fill={hoverIdx === i && detailed ? '#4f46e5' : 'white'}
            stroke="#4f46e5"
            strokeWidth="1.5"
          />
        ))}
      </svg>
      <div className={`flex justify-between ${detailed ? 'mt-1 px-1' : 'mt-1 px-0.5'}`}>
        {labels.map((lb) => (
          <span key={lb} className="text-[10px] font-medium text-gray-500">
            {lb}
          </span>
        ))}
      </div>
      {detailed ? <p className="mt-1 text-[10px] text-gray-400">Closing balance by month (mock). Hover points for values.</p> : null}
    </div>
  )
}
