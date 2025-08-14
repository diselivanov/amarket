import { getAvatarUrl } from '@amarket/shared/src/cloudinary'
import { useMe } from '../../lib/ctx'
import { Link } from 'react-router-dom'
import { getProfileRoute } from '../../lib/routes'
import css from './index.module.scss'

export const ProfileButton = () => {
  const me = useMe()

  return (
    <Link className={css.link} to={getProfileRoute()}>
      <img className={css.avatar} alt="Фото профиля" src={getAvatarUrl(me!.avatar, 'small')} />
    </Link>
  )
}
