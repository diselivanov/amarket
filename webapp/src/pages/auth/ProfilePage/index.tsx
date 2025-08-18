import { getAvatarUrl } from '@amarket/shared/src/cloudinary'
import { Segment } from '../../../components/Segment'
import { withPageWrapper } from '../../../lib/pageWrapper'
import { Link } from 'react-router-dom'
import { getAdminRoute, getEditProfileRoute, getSignOutRoute } from '../../../lib/routes'

export const ProfilePage = withPageWrapper({
  authorizedOnly: true,
  setProps: ({ getAuthorizedMe }) => ({
    me: getAuthorizedMe(),
  }),
  title: 'Профиль',
})(({ me }) => {
  return (
    <Segment title="Основное">
      <img alt="Фото профиля" src={getAvatarUrl(me.avatar, 'small')} />
      {me.name}
      <Link to={getAdminRoute()}>Aдминка</Link>
      <Link to={getEditProfileRoute()}>Редактировать профиль</Link>
      <Link to={getSignOutRoute()}>Выйти</Link>
    </Segment>
  )
})
