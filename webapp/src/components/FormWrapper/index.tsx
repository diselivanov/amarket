import cn from 'classnames'
import css from './index.module.scss'
import { ReactNode } from 'react'

export const FormWrapper = ({ type, children }: { type: 'small' | 'big'; children: ReactNode }) => (
  <div className={css.main}>
    <div
      className={cn({
        [css.FormWrapper]: true,
        [css[`type-${type}`]]: true,
      })}
    >
      {children}
    </div>
  </div>
)
