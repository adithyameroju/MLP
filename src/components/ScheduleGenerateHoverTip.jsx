/**
 * Wraps the schedule Generate control so a tooltip appears on hover / focus-within.
 * Placed below the control so it isn’t clipped by common overflow-x/overflow-hidden ancestors.
 * Disabled buttons still activate the tooltip via the wrapper.
 *
 * @param {{ children: import('react').ReactNode; className?: string }} props
 */
export default function ScheduleGenerateHoverTip({ children, className = '' }) {
  return (
    <span className={`group/sched-tip relative z-[1] inline-flex ${className}`}>
      {children}
      <span
        className="pointer-events-none absolute left-1/2 top-full z-[100] mt-2 flex -translate-x-1/2 flex-col items-center whitespace-nowrap opacity-0 shadow-none transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:duration-75 translate-y-[-0.375rem] scale-[0.96] group-hover/sched-tip:translate-y-0 group-hover/sched-tip:scale-100 group-hover/sched-tip:opacity-100 group-focus-within/sched-tip:translate-y-0 group-focus-within/sched-tip:scale-100 group-focus-within/sched-tip:opacity-100 motion-reduce:group-hover/sched-tip:opacity-100 motion-reduce:group-hover/sched-tip:translate-y-0 motion-reduce:group-hover/sched-tip:scale-100"
        role="tooltip"
      >
        <span
          className="-mb-px h-0 w-0 border-x-[6px] border-b-[6px] border-x-transparent border-b-slate-900 drop-shadow-[0_-2px_6px_rgba(15,23,42,0.35)]"
          aria-hidden
        />
        <span className="rounded-lg bg-slate-900 px-3 py-2 text-[11px] font-medium leading-snug tracking-tight text-white shadow-xl shadow-indigo-950/30 ring-1 ring-white/[0.12] backdrop-blur-[2px]">
          Select rows to generate.
        </span>
      </span>
    </span>
  )
}
