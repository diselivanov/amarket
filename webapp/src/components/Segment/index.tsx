import css from './index.module.scss'

export const Segment = ({ title, children }: { title: React.ReactNode; children?: React.ReactNode }) => {
  return (
    <div className={css.segment}>
      <h1 className={css.title}>{title}</h1>
      <div className={css.content}>{children}</div>
    </div>
  )
}
