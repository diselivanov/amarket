import css from './index.module.scss'

export const FilterSection = ({ children }: { children?: React.ReactNode }) => {
  return <div className={css.FilterSection}>{children}</div>
}
