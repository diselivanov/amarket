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

  const {
    data: usersData,
    isLoading: isUsersLoading,
    error: usersError,
  } = trpc.getUsers.useQuery({ page, limit })

  if (isUsersLoading) {
    return <Loader type="section" />
  }

  if (usersError) {
    return <Alert color="red">Ошибка загрузки данных: {usersError.message}</Alert>
  }

  const { users, totalCount, totalPages, currentPage } = usersData || {}
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date(date))
  }

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage)
    }
  }

  return (
    <div className={`${css.tableContainer} ${className || ''}`}>
      <div className={css.header}>
        <div className={css.headerStats}>
          <div className={css.statItem}>
            <span className={css.statLabel}>Всего:</span>
            <span className={css.statValue}>{totalCount}</span>
          </div>
        </div>
      </div>
      
      <div className={css.tableWrapper}>
        <div className={css.tableHeader}>
          <div className={css.colName}>Имя</div>
          <div className={css.colEmail}>Email</div>
          <div className={css.colPhone}>Телефон</div>
          <div className={css.colStats}>Объявления</div>
          <div className={css.colStats}>Лайки</div>
          <div className={css.colDate}>Дата регистрации</div>
        </div>
        
        <table className={css.usersTable}>
          <tbody>
            {users?.map((user: User, index: number) => {
              const isLastRow = index === users.length - 1
              
              return (
                <tr key={user.id} className={`${css.userRow} ${isLastRow ? css.lastRow : ''}`}>
                  <td className={css.colName}>
                    <div className={css.userInfo}>
                      <img className={css.avatar} alt="" src={getAvatarUrl(user.avatar, 'small')} />
                      <div className={css.userDetails}>
                        <span className={css.userName}>user.name</span>
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

        {totalPages > 1 && (
          <div className={css.pagination}>
            <button
              className={css.paginationButton}
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              <Icon name={'arrowLeft'}/>
            </button>
            
            <div className={css.paginationPages}>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (currentPage <= 3) {
                  pageNum = i + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = currentPage - 2 + i
                }
                
                return (
                  <button
                    key={pageNum}
                    className={`${css.paginationPage} ${currentPage === pageNum ? css.active : ''}`}
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </button>
                )
              })}
            </div>
            
            <button
              className={css.paginationButton}
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              <Icon name={'arrowRight'}/>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}