import { forwardRef } from 'react'
import { buttonRecipe } from '../../theme/designTokens'

function cn(...parts) {
  return parts.filter(Boolean).join(' ')
}

/**
 * Primary / secondary / ghost / danger buttons — matches endorsement flow CTAs.
 */
const Button = forwardRef(function Button(
  {
    variant = 'primary',
    className,
    type = 'button',
    disabled,
    ...props
  },
  ref,
) {
  const recipe =
    variant === 'secondary'
      ? buttonRecipe.secondary
      : variant === 'ghost'
        ? buttonRecipe.ghost
        : variant === 'danger'
          ? buttonRecipe.danger
          : buttonRecipe.primary

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      className={cn(recipe, className)}
      {...props}
    />
  )
})

export default Button
