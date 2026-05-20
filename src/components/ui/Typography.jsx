import { typography } from '../../theme/designTokens'

function cn(...parts) {
  return parts.filter(Boolean).join(' ')
}

export function PageTitle({ children, className, as: Tag = 'h1', ...props }) {
  return (
    <Tag className={cn(typography.pageTitle, className)} {...props}>
      {children}
    </Tag>
  )
}

export function PageSubtitle({ children, className, ...props }) {
  return (
    <p className={cn(typography.pageSubtitle, className)} {...props}>
      {children}
    </p>
  )
}

export function SectionTitle({ children, className, ...props }) {
  return (
    <h2 className={cn(typography.sectionTitle, className)} {...props}>
      {children}
    </h2>
  )
}
