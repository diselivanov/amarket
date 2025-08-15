import css from './index.module.scss'

export const LeftSection = ({ children }: { children?: React.ReactNode }) => {
  return <div className={css.LeftSection}>{children}</div>
}
