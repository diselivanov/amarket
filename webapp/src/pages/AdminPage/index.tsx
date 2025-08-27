import { Icon } from '../../components/Icon'
import { withPageWrapper } from '../../lib/pageWrapper'
import { CategoryTable } from './components/categories/CategoryTable'
import { Tabs, Tab } from './components/Tabs'
import { UsersTable } from './components/users/UsersTable'

export const AdminPage = withPageWrapper({
  title: 'Админ панель',
})(() => {
  return (
    <Tabs>
      <Tab label="Категории" icon={<Icon name={'list'} size={20} />}>
        <CategoryTable />
      </Tab>

      <Tab label="Пользователи" icon={<Icon name={'users'} size={20} />}>
        <UsersTable />
      </Tab>

      <Tab label="Настройки" icon={<Icon name={'settings'} size={20} />}>
        <div>Контент</div>
      </Tab>
    </Tabs>
  )
})
