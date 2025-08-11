import css from './index.module.scss'

export const AdsSection = ({ children }: { children?: React.ReactNode }) => {
  return <div className={css.AdsSection}>{children}</div>
}
