import { Icon } from "../../components/Icon"
import { withPageWrapper } from "../../lib/pageWrapper"
import { Tabs, Tab } from "./components/Tabs"

const StatsIcon = () => <Icon name={"stats"} size={20}/>
const UsersIcon = () => <Icon name={"users"} size={20}/>
const SettingsIcon = () => <Icon name={"settings"} size={20}/>

export const AdministrationPage = withPageWrapper({
  title: 'Админ панель',
})(() => {
  return (
    <Tabs>
      <Tab label="Статистика" icon={<StatsIcon />}>
        <div>Контент вкладки статистики</div>
      </Tab>

      <Tab label="Пользователи" icon={<UsersIcon />}>
        <div>Контент вкладки пользователей</div>
      </Tab>

      <Tab label="Настройки" icon={<SettingsIcon />}>
        <div>Контент вкладки настроек</div>
      </Tab>
    </Tabs>
  )
})