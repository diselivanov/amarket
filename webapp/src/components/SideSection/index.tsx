import css from './index.module.scss'

export const SideSection = ({ children }: { children?: React.ReactNode }) => {
  return <div className={css.SideSection}>{children}</div>
}
