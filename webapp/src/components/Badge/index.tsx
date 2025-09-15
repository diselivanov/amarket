import React, { useState } from 'react'
import css from './index.module.scss'

interface BadgeProps {
  color: 'green' | 'red' | 'blue' | 'purple'
  children: React.ReactNode
  className?: string
  title?: string
}

export const Badge: React.FC<BadgeProps> = ({ 
  color, 
  children, 
  className, 
  title 
}) => {
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <span 
      className={`${css.badge} ${css[color]} ${className || ''}`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {children}
      {title && showTooltip && (
        <div className={css.tooltip}>
          {title}
        </div>
      )}
    </span>
  )
}