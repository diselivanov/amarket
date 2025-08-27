import cn from 'classnames'
import css from './index.module.scss'
import { useEffect, useRef } from 'react'
import { Icon } from '../Icon'

export type AlertProps = {
  color: 'red' | 'green' | 'blue'
  hidden?: boolean
  children: React.ReactNode
}

export const Alert = ({ color, hidden, children }: AlertProps) => {
  const alertRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = alertRef.current
    if (!element) return

    if (hidden) {
      element.style.transition = 'transform 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28), opacity 0.3s ease-out'
      element.style.transform = 'translateX(120%)'
      element.style.opacity = '0'
    } else {
      element.style.transition = 'transform 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28), opacity 0.3s ease-out'
      element.style.transform = 'translateX(0)'
      element.style.opacity = '1'
    }
  }, [hidden])

  const iconName = color === 'red' ? 'error' : color === 'green' ? 'success' : 'info'

  return (
    <div
      ref={alertRef}
      className={cn(css.alert, css[color])}
      style={{
        transform: 'translateX(120%)',
        opacity: '0',
        transition: 'none',
      }}
    >
      <Icon name={iconName} className={css.icon} size={20}/>
      <div className={css.content}>{children}</div>
    </div>
  )
}
