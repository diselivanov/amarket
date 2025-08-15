import css from './index.module.scss'

export const RightSection = ({ children }: { children?: React.ReactNode }) => {
  return <div className={css.RightSection}>{children}</div>
}
