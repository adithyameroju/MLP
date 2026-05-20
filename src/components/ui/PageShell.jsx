import {
  pageShellScrollRoot,
  pageShellPadding,
  pageCanvasBg,
  pageContentWidth,
} from '../../theme/designTokens'

function cn(...parts) {
  return parts.filter(Boolean).join(' ')
}

/**
 * Standard scroll + padding + canvas for tool-style pages (AGENTS.md).
 */
export default function PageShell({
  children,
  className,
  /** When false, skip bg-gray-50 (e.g. nested inside another canvas). */
  withCanvasBg = true,
  /** When false, skip px/py padding (caller handles it). */
  withPadding = true,
}) {
  return (
    <div
      className={cn(
        pageShellScrollRoot,
        withCanvasBg && pageCanvasBg,
        withPadding && pageShellPadding,
        pageContentWidth,
        className,
      )}
    >
      {children}
    </div>
  )
}
