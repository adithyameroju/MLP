import { insetPanelShell } from '../../theme/designTokens'

function cn(...parts) {
  return parts.filter(Boolean).join(' ')
}

/** Large bordered inset panel (Quick Add main chrome). */
export default function InsetPanel({ children, className, ...props }) {
  return (
    <div className={cn(insetPanelShell, className)} {...props}>
      {children}
    </div>
  )
}
