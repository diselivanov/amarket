import { withPageWrapper } from '../../lib/pageWrapper'
import { Tabs, Tab } from '../../components/Tabs'
import { Icon } from '../../components/Icon'
import { CategoryTable } from './components/categories/CategoryTable'
import { UsersTable } from './components/users/UsersTable'
import { VehicleTable } from './components/vehicle/VehicleTable'

export const AdminPage = withPageWrapper({
  title: 'Админ панель',
})(() => {
  return (
    <Tabs>
      <Tab label="Категории" icon={<Icon name={'category'} size={20} />}>
        <CategoryTable />
      </Tab>

      <Tab label="Пользователи" icon={<Icon name={'users'} size={20} />}>
        <UsersTable />
      </Tab>

      <Tab label="Транспорт" icon={<Icon name={'car'} size={20} />}>
        <VehicleTable />
      </Tab>
    </Tabs>
  )
})