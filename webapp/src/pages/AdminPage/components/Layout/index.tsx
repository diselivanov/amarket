import css from './index.module.scss'

interface LayoutProps {
  left: React.ReactNode;
  topRight: React.ReactNode;
  bottomRight: React.ReactNode;
}

export const Layout = ({ left, topRight, bottomRight }: LayoutProps) => {
  return (
    <div className={css.layout}>
      <div className={css.leftContainer}>
        {left}
      </div>
      <div className={css.rightContainer}>
        <div className={css.topRight}>{topRight}</div>
        <div className={css.bottomRight}>{bottomRight}</div>
      </div>
    </div>
  )
}