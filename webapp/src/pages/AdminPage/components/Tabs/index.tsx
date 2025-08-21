import { ReactNode, useState } from 'react'
import css from './index.module.scss'

interface TabProps {
  label: string
  children: ReactNode
  icon?: ReactNode
}

export const Tab = ({ children }: TabProps) => {
  return <div className={css.tabContent}>{children}</div>
}

interface TabsProps {
  children: ReactNode
  defaultActiveTab?: number
}

export const Tabs = ({ children, defaultActiveTab = 0 }: TabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultActiveTab)

  const tabs = (children as React.ReactElement<TabProps>[]).map((child) => ({
    label: child.props.label,
    icon: child.props.icon,
  }))

  return (
    <div className={css.tabsContainer}>
      <div className={css.tabsHeader}>
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`${css.tabButton} ${activeTab === index ? css.active : ''}`}
            onClick={() => setActiveTab(index)}
          >
            {tab.icon && <span className={css.tabIcon}>{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>

      <div className={css.tabsContent}>{(children as React.ReactElement<TabProps>[])[activeTab]}</div>
    </div>
  )
}
