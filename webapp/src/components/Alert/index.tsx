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
      element.classList.add(css.hidden)
    } else {
      element.classList.remove(css.hidden)
    }
  }, [hidden])

  const iconName = color === 'red' ? 'error' : color === 'green' ? 'success' : 'info'

  return (
    <div ref={alertRef} className={cn(css.alert, css[color], hidden && css.hidden)}>
      <Icon name={iconName} className={css.icon} size={18} />
      <div className={css.content}>{children}</div>
    </div>
  )
}
