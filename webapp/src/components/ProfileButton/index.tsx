import { getAvatarUrl } from '@amarket/shared/src/cloudinary'
import { useMe } from '../../lib/ctx'
import { Link } from 'react-router-dom'
import { getProfileRoute, getSignInRoute } from '../../lib/routes'
import css from './index.module.scss'

export const ProfileButton = () => {
  const me = useMe()

  return (
    <div>
      {me ? <Link className={css.link} to={getProfileRoute()}>
      <img className={css.avatar} alt="Фото профиля" src={getAvatarUrl(me!.avatar, 'small')} />
    </Link> : <Link className={css.link} to={getSignInRoute()}>Войти</Link>}
    </div>
  )
}
