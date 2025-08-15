import { createRef } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { ReactComponent as Logo } from '../../assets/images/logo.svg'
import { useMe } from '../../lib/ctx'
import {
  getAllAdsRoute,
  getEditProfileRoute,
  getNewAdRoute,
  getSignInRoute,
  getSignOutRoute,
  getSignUpRoute,
} from '../../lib/routes'
import css from './index.module.scss'
import { ProfileButton } from '../ProfileButton'

export const layoutContentElRef = createRef<HTMLDivElement>()

export const Layout = () => {
  const me = useMe()

  return (
    <div className={css.layout}>
        <div className={css.menu}>
          <Link className={css.link} to={getAllAdsRoute()}>
            <Logo className={css.logo} />
          </Link>

          {me ? (
            <>
              <ProfileButton />
            </>
          ) : (
            <>
              <Link className={css.link} to={getSignInRoute()}>
                Войти
              </Link>
            </>
          )}
        </div>

      <div className={css.content} ref={layoutContentElRef}>
        <Outlet />
      </div>
    </div>
  )
}
