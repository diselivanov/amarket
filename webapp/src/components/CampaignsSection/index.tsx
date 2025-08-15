import css from './index.module.scss'

export const CampaignsSection = ({ children }: { children?: React.ReactNode }) => {
  return <div className={css.CampaignsSection}>{children}</div>
}
