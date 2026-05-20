function cn(...parts) {
  return parts.filter(Boolean).join(' ')
}

const variants = {
  /** Standard white card — borders + shadow-sm */
  default: 'rounded-xl border border-gray-200 bg-white shadow-sm',
  /** Hover lift — endorsement dashboard tiles use rounded-2xl + hover:shadow-lg */
  interactive:
    'rounded-2xl border bg-white transition-all hover:shadow-lg cursor-pointer text-left',
  /** Compact padded surface */
  padded: 'rounded-xl border border-gray-200 bg-white shadow-sm p-4',
}

/**
 * @param {'default' | 'interactive' | 'padded'} variant
 * @param {string} [interactiveBorderClass] — when variant=interactive, pass e.g. border-emerald-100 hover:border-emerald-200
 */
export default function Card({
  variant = 'default',
  interactiveBorderClass,
  className,
  children,
  as: Component = 'div',
  ...props
}) {
  const base =
    variant === 'interactive'
      ? cn(variants.interactive, interactiveBorderClass)
      : variants[variant] || variants.default

  return (
    <Component className={cn(base, className)} {...props}>
      {children}
    </Component>
  )
}
