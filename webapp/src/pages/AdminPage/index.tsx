import { Icon } from "../../components/Icon"
import { withPageWrapper } from "../../lib/pageWrapper"
import { CategoryTree } from "./components/CategoryTree"
import { Tabs, Tab } from "./components/Tabs"

const StatsIcon = () => <Icon name={"stats"} size={20}/>
const UsersIcon = () => <Icon name={"users"} size={20}/>
const SettingsIcon = () => <Icon name={"settings"} size={20}/>

export const AdminPage = withPageWrapper({
  title: 'Админ панель',
})(() => {
  return (
    <Tabs>
      <Tab label="Объявления" icon={<StatsIcon />}>
        <CategoryTree/>
      </Tab>

      <Tab label="Пользователи" icon={<UsersIcon />}>
        <div>Контент</div>
      </Tab>

      <Tab label="Настройки" icon={<SettingsIcon />}>
        <div>Контент</div>
      </Tab>
    </Tabs>
  )
})