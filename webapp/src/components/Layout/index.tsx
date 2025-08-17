import { createRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Header } from '../Header'
import { getAllAdsRoute } from '../../lib/routes'
import css from './index.module.scss'

export const layoutContentElRef = createRef<HTMLDivElement>()

export const Layout = () => {
  const location = useLocation()
  const isAllAdsPage = location.pathname === getAllAdsRoute()

  return (
    <div className={css.layout}>
      {!isAllAdsPage && <Header />}

      <div className={css.content} ref={layoutContentElRef}>
        <Outlet />
      </div>
    </div>
  )
}