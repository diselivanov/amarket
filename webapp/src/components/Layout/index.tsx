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

export const layoutContentElRef = createRef<HTMLDivElement>()

export const Layout = () => {
  const me = useMe()

  return (
    <div className={css.layout}>
      <div className={css.navigation}>
        <Link className={css.link} to={getAllAdsRoute()}>
          <Logo className={css.logo} />
        </Link>

        <div className={css.menu}>
          {me ? (
            <>
              <Link className={css.link} to={getNewAdRoute()}>
                Разместить объявление
              </Link>
              <Link className={css.link} to={getEditProfileRoute()}>
                Редактировать профиль
              </Link>
              <Link className={css.link} to={getSignOutRoute()}>
                Выйти
              </Link>
            </>
          ) : (
            <>
              <Link className={css.link} to={getSignUpRoute()}>
                Создать аккаунт
              </Link>
              <Link className={css.link} to={getSignInRoute()}>
                Войти
              </Link>
            </>
          )}
        </div>
      </div>

      <div className={css.content} ref={layoutContentElRef}>
        <Outlet />
      </div>
    </div>
  )
}
