import React, { useState } from 'react'
import { trpc } from '../../../../../lib/trpc'
import { Loader } from '../../../../../components/Loader'
import { Alert } from '../../../../../components/Alert'
import css from './index.module.scss'
import { getAvatarUrl } from '@amarket/shared/src/cloudinary'
import { Icon } from '../../../../../components/Icon'

interface UsersTableProps {
  className?: string
}

interface User {
  id: string
  name: string | null
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
  const limit = 11
  const [allUsers, setAllUsers] = useState<User[]>([])

  const {
    data: usersData,
    isLoading: isUsersLoading,
    error: usersError,
  } = trpc.getUsers.useQuery({ page, limit }, {
    onSuccess: (data) => {
      if (data && data.users) {
        if (page === 1) {
          setAllUsers(data.users)
        } else {
          setAllUsers(prev => [...prev, ...data.users])
        }
      }
    }
  })

  const handleLoadMore = () => {
    setPage(prev => prev + 1)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date(date))
  }

  if (isUsersLoading && page === 1) {
    return <Loader type="section" />
  }

  if (usersError) {
    return <Alert color="red">Ошибка загрузки данных: {usersError.message}</Alert>
  }

  const { totalCount } = usersData || {}
  const hasMore = allUsers.length < (totalCount || 0)

  return (
    <div className={`${css.tableContainer} ${className || ''}`}>
      <div className={css.header}>
        <div className={css.headerStats}>
          <div className={css.statItem}>
            <span className={css.statLabel}>Всего:</span>
            <span className={css.statValue}>{totalCount}</span>
          </div>
          <div className={css.statItem}>
            <span className={css.statLabel}>Загружено:</span>
            <span className={css.statValue}>{allUsers.length}</span>
          </div>
        </div>
      </div>
      
      <div className={css.tableWrapper}>
        <table className={css.usersTable}>
          <thead>
            <tr className={css.tableHeader}>
              <th className={css.colName}>Имя</th>
              <th className={css.colEmail}>Email</th>
              <th className={css.colPhone}>Телефон</th>
              <th className={css.colStats}>Объявления</th>
              <th className={css.colStats}>Лайки</th>
              <th className={css.colDate}>Дата регистрации</th>
            </tr>
          </thead>
          
          <tbody>
            {allUsers.map((user: User, index: number) => {
              const isLastRow = index === allUsers.length - 1
              
              return (
                <tr key={user.id} className={`${css.userRow} ${isLastRow ? css.lastRow : ''}`}>
                  <td className={css.colName}>
                    <div className={css.userInfo}>
                      <img className={css.avatar} alt="" src={getAvatarUrl(user.avatar, 'small')} />
                      <div className={css.userDetails}>
                        <span className={css.userName}>{user.name || 'Не указано'}</span>
                        {user.description && (
                          <span className={css.userDescription}>{user.description}</span>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className={css.colEmail}>
                    <span className={css.statValue}>{user.email}</span>
                  </td>

                  <td className={css.colPhone}>
                    <span className={css.statValue}>{user.phone || 'Не указан'}</span>
                  </td>

                  <td className={css.colStats}>
                    <span className={css.statValue}>{user.adsCount}</span>
                  </td>

                  <td className={css.colStats}>
                    <span className={css.statValue}>{user.likesCount}</span>
                  </td>

                  <td className={css.colDate}>
                    <span className={css.statValue}>{formatDate(user.createdAt)}</span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {hasMore && (
          <div className={css.loadMoreContainer}>
            <button
              className={css.loadMoreButton}
              onClick={handleLoadMore}
              disabled={isUsersLoading}
            >
              {isUsersLoading ? (
                <Loader type="section" />
              ) : (
                <>
                  <span>Загрузить еще</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}