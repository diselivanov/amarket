import React, { useState } from 'react'
import { trpc } from '../../../../../lib/trpc'
import { Loader } from '../../../../../components/Loader'
import { Alert } from '../../../../../components/Alert'
import { DataTable } from '../../../../../components/DataTable'
import { getAvatarUrl } from '@amarket/shared/src/cloudinary'
import css from './index.module.scss'

interface UsersTableProps {
  className?: string
}

interface User {
  id: string
  name: string
  email: string
  description: string | null
  phone: string | null
  avatar: string | null
  createdAt: Date
  adsCount: number
  likesCount: number
}

export const UsersTable: React.FC<UsersTableProps> = ({ className }) => {
  const [page, setPage] = useState(1)
  const limit = 12
  const [allUsers, setAllUsers] = useState<User[]>([])

  const {
    data: usersData,
    isLoading: isUsersLoading,
    error: usersError,
  } = trpc.getUsers.useQuery(
    { page, limit },
    {
      onSuccess: (data) => {
        if (data && data.users) {
          if (page === 1) {
            setAllUsers(data.users)
          } else {
            setAllUsers((prev) => [...prev, ...data.users])
          }
        }
      },
    }
  )

  const handleLoadMore = () => {
    setPage((prev) => prev + 1)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date(date))
  }

  // Подготовка данных для таблицы
  const tableData = allUsers.map((user) => ({
    name: (
      <div className={css.userInfo}>
        <img className={css.avatar} alt="" src={getAvatarUrl(user.avatar, 'small')} />
        <div className={css.userDetails}>
          <span className={css.userName}>{user.name || 'Не указано'}</span>
          {user.description && <span className={css.userDescription}>{user.description}</span>}
        </div>
      </div>
    ),
    email: <span className={css.statValue}>{user.email}</span>,
    phone: <span className={css.statValue}>{user.phone || 'Не указан'}</span>,
    ads: <span className={css.statValue}>{user.adsCount}</span>,
    likes: <span className={css.statValue}>{user.likesCount}</span>,
    date: <span className={css.statValue}>{formatDate(user.createdAt)}</span>,
  }))

  // Определение колонок таблицы
  const columns = [
    { key: 'name', title: 'Имя', width: '20%' },
    { key: 'email', title: 'Email', width: '20%' },
    { key: 'phone', title: 'Телефон', width: '15%' },
    { key: 'ads', title: 'Объявления', width: '10%', align: 'center' as const },
    { key: 'likes', title: 'Лайки', width: '10%', align: 'center' as const },
    { key: 'date', title: 'Дата регистрации', width: '15%' },
  ]

  // Статистика для заголовка
  const headerStats = (
    <>
      <span>Всего: {usersData?.totalCount || 0}</span>
      <span>Загружено: {allUsers.length}</span>
    </>
  )

  // Кнопка загрузки еще (будет в footer)
  const footerContent = (
    <>
      {usersData && allUsers.length < usersData.totalCount && (
        <button className={css.loadMoreButton} onClick={handleLoadMore} disabled={isUsersLoading}>
          {isUsersLoading ? 'Загрузка...' : 'Загрузить еще'}
        </button>
      )}
    </>
  )

  if (isUsersLoading && page === 1) {
    return <Loader type="section" />
  }

  if (usersError) {
    return <Alert color="red">Ошибка загрузки данных: {usersError.message}</Alert>
  }

  return (
    <DataTable
      columns={columns}
      data={tableData}
      headerStats={headerStats}
      className={className}
      footerContent={footerContent}
    />
  )
}