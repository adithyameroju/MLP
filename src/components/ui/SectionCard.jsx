import { formSectionShellByAccent } from '../../theme/designTokens'

function cn(...parts) {
  return parts.filter(Boolean).join(' ')
}

/**
 * Form section surface with left accent — mirrors Quick Add / Update section shells.
 * @param {'basic' | 'plans' | 'dependents'} accent
 */
export default function SectionCard({ accent = 'basic', className, children, ...props }) {
  const shell = formSectionShellByAccent[accent] ?? formSectionShellByAccent.basic
  return (
    <section className={cn(shell, className)} {...props}>
      {children}
    </section>
  )
}
