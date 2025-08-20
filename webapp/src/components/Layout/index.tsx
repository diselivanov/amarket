import { createRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Header } from '../Header'
import { getAllAdsRoute, getAdminRoute } from '../../lib/routes'
import css from './index.module.scss'

export const layoutContentElRef = createRef<HTMLDivElement>()

export const Layout = () => {
  const location = useLocation()
  const isAllAdsPage = location.pathname === getAllAdsRoute()
  const isAdminPage = location.pathname === getAdminRoute()
  const shouldHideHeader = isAllAdsPage || isAdminPage

  return (
    <div className={css.layout}>
      {!shouldHideHeader && <Header />}

      <div className={css.content} ref={layoutContentElRef}>
        <Outlet />
      </div>
    </div>
  )
}