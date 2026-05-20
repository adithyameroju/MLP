import { stickyFooterBarShell, shadows } from '../../theme/designTokens'

function cn(...parts) {
  return parts.filter(Boolean).join(' ')
}

/**
 * Bottom sticky bar — matches QuickAddBatchStickyFooter container (blur + top border + upward shadow).
 */
export default function StickyFooterBar({ children, className }) {
  return (
    <div className={cn(stickyFooterBarShell, shadows.stickyFooterUp, className)}>{children}</div>
  )
}
