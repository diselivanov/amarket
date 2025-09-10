import React, { useState, useMemo } from 'react'
import { trpc } from '../../../../../lib/trpc'
import { Loader } from '../../../../../components/Loader'
import { Alert } from '../../../../../components/Alert'
import { Icon } from '../../../../../components/Icon'
import { CreateCategory } from '../NewCategory'
import { CreateSubcategory } from '../NewSubcategory'
import { Modal } from '../../Modal'
import { EditCategory } from '../EditCategory'
import { EditSubcategory } from '../EditSubcategory'
import css from './index.module.scss'
import { getAvatarUrl } from '@amarket/shared/src/cloudinary'

interface CategoriesProps {
  className?: string
}

interface PieChartProps {
  active: number
  deleted: number
  total: number
  avgPrice: number
}

interface Seller {
  id: string
  name: string | null
  email: string
  avatar: string | null
  ads: any[]
}

interface SellerWithStats extends Seller {
  activeAds: number
  deletedAds: number
  totalAds: number
}

const SELLERS_PER_PAGE = 12

const PieChart: React.FC<PieChartProps> = ({ active, deleted, total, avgPrice }) => {
  const activePercentage = total > 0 ? (active / total) * 100 : 0
  const deletedPercentage = total > 0 ? (deleted / total) * 100 : 0

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(Math.round(price))
  }

  // Рассчитываем длину окружности (2πr)
  const circumference = 2 * Math.PI * 70

  // Добавляем отступ между секторами только если есть оба типа
  const hasBothSectors = activePercentage > 0 && deletedPercentage > 0
  const gapSize = hasBothSectors ? 3 : 0

  // Рассчитываем длины дуг с учетом отступов (если есть оба сектора)
  const activeDash = Math.max(0, (activePercentage / 100) * circumference - (hasBothSectors ? gapSize : 0))
  const deletedDash = Math.max(0, (deletedPercentage / 100) * circumference - (hasBothSectors ? gapSize : 0))

  // Рассчитываем смещение для удаленного сектора
  const deletedOffset = -activeDash - (hasBothSectors ? gapSize : 0)

  // Проверяем, есть ли данные для отображения
  const hasData = total > 0

  return (
    <div className={css.pieChartContainer}>
      <h3 className={css.pieChartTitle}>Статистика</h3>

      <div className={css.pieChartWrapper}>
        <svg width="160" height="160" viewBox="0 0 160 160" className={css.pieChart}>
          <defs>
            {/* Зеленый градиент */}
            <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#24a071ff" />
              <stop offset="100%" stopColor="#64d4beff" />
            </linearGradient>

            {/* Красный градиент */}
            <linearGradient id="redGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f8324cff" />
              <stop offset="100%" stopColor="#ff95a3ff" />
            </linearGradient>

            {/* Серый градиент для случая без данных */}
            <linearGradient id="grayGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#cccccc" />
              <stop offset="100%" stopColor="#f1f1f1ff" />
            </linearGradient>
          </defs>

          {hasData ? (
            <>
              {/* Удаленные объявления (красный сектор с градиентом) */}
              {deletedPercentage > 0 && (
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke="url(#redGradient)"
                  strokeWidth="14"
                  strokeDasharray={`${deletedDash} ${circumference - deletedDash}`}
                  strokeDashoffset={deletedOffset}
                  transform="rotate(-90 80 80)"
                />
              )}

              {/* Активные объявления (зеленый сектор с градиентом) */}
              {activePercentage > 0 && (
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke="url(#greenGradient)"
                  strokeWidth="16"
                  strokeDasharray={`${activeDash} ${circumference - activeDash}`}
                  strokeDashoffset="0"
                  transform="rotate(-90 80 80)"
                />
              )}
            </>
          ) : (
            /* Серый круг при отсутствии данных */
            <circle
              cx="80"
              cy="80"
              r="70"
              fill="none"
              stroke="url(#grayGradient)"
              strokeWidth="14"
              strokeDasharray={`${circumference} 0`}
              transform="rotate(-90 80 80)"
            />
          )}

          {/* Центр круга с общим количеством */}
          <text x="80" y="80" textAnchor="middle" dominantBaseline="middle" className={css.pieChartCenterText}>
            {total}
          </text>
        </svg>

        {hasData ? (
          <div className={css.pieChartLegend}>
            <div className={css.legendItem}>
              <span className={css.activePercentage}>{Math.round(activePercentage)}%</span>
              <span className={css.activeValue}>{active}</span>
            </div>
            <div className={css.legendItem}>
              <span className={css.deletedPercentage}>{Math.round(deletedPercentage)}%</span>
              <span className={css.deletedValue}>{deleted}</span>
            </div>
          </div>
        ) : (
          <div className={css.pieChartLegend}>
            <div className={css.legendItem}>
              <div className={`${css.legendColor} ${css.legendGray}`}></div>
              <span className={css.legendLabel}>Нет данных</span>
            </div>
          </div>
        )}
      </div>

      <div className={css.additionalStats}>
        <div className={css.statRow}>
          <span className={css.statLabel}>Средняя цена:</span>
          <span className={css.statValue}>{hasData ? `${formatPrice(avgPrice)} ₽` : '—'}</span>
        </div>
      </div>
    </div>
  )
}

const SellersList: React.FC<{
  sellers: SellerWithStats[]
  count: number
  searchQuery: string
  onSearchChange: (query: string) => void
  onLoadMore: () => void
  isLoadingMore: boolean
  hasMore: boolean
}> = ({ sellers, count, searchQuery, onSearchChange, onLoadMore, isLoadingMore, hasMore }) => {
  const filteredSellers = useMemo(() => {
    if (!searchQuery) return sellers
    return sellers.filter((seller) => seller.email.toLowerCase().includes(searchQuery.toLowerCase()))
  }, [sellers, searchQuery])

  return (
    <div className={css.sellersPanel}>
      <div className={css.sellersHeader}>
        <h3 className={css.sellersTitle}>
          Продавцы <span className={css.count}>{count}</span>
        </h3>
        <div className={css.searchContainer}>
          <Icon name="search" size={16} className={css.searchIcon} />
          <input
            type="text"
            placeholder="Поиск по email"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className={css.searchInput}
          />
        </div>
      </div>
      <div className={css.sellersList}>
        {filteredSellers.length > 0 ? (
          <>
            {filteredSellers.map((seller) => (
              <div key={seller.id} className={css.sellerItem}>
                <img className={css.sellerAvatar} alt="" src={getAvatarUrl(seller.avatar, 'small')} />
                <div className={css.sellerInfo}>
                  <div className={css.sellerNameStats}>
                    <div className={css.sellerName}>{seller.name}</div>
                    <div className={css.sellerStats}>
                      <span className={css.adsCount}>
                        <span className={css.activeAds}>{seller.activeAds}</span>
                        {seller.deletedAds > 0 && <span className={css.deletedAds}>{seller.deletedAds}</span>}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Кнопка загрузить еще */}
            {hasMore && (
              <div className={css.loadMoreContainer}>
                <button className={css.loadMoreButton} onClick={onLoadMore} disabled={isLoadingMore}>
                  {isLoadingMore ? 'Загрузка...' : 'Загрузить еще'}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className={css.noSellers}>{searchQuery ? 'Продавцы не найдены' : 'Нет продавцов'}</div>
        )}
      </div>
    </div>
  )
}

export const CategoryTable: React.FC<CategoriesProps> = ({ className }) => {
  const {
    data: statsData,
    isLoading: isStatsLoading,
    error: statsError,
    refetch: refetchStats,
  } = trpc.getCategoriesSubcategoriesStats.useQuery({})

  const [selectedCategory, setSelectedCategory] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sellersPage, setSellersPage] = useState(1)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  const handleSuccess = () => {
    refetchStats()
  }

  const handleCategoryClick = (category: any) => {
    setSelectedCategory(category)
    setSearchQuery('')
    setSellersPage(1) // Сбрасываем пагинацию при выборе новой категории
  }

  const handleLoadMore = async () => {
    setIsLoadingMore(true)
    // Имитируем задержку для плавности
    await new Promise((resolve) => setTimeout(resolve, 300))
    setSellersPage((prev) => prev + 1)
    setIsLoadingMore(false)
  }

  if (isStatsLoading) {
    return <Loader type="section" />
  }

  if (statsError) {
    return <Alert color="red">Ошибка загрузки данных</Alert>
  }

  const allCategories = statsData?.categories || []
  const allSellers = statsData?.allSellers || []
  const allAds = statsData?.allAds || []

  // Функция для получения статистики продавца по всем его объявлениям
  const getSellerStatsFromAllAds = (sellerId: string) => {
    const sellerAds = allAds.filter((ad) => ad.authorId === sellerId)
    const activeAds = sellerAds.filter((ad) => !ad.deletedAt)
    const deletedAds = sellerAds.filter((ad) => ad.deletedAt)

    return {
      activeAds: activeAds.length,
      deletedAds: deletedAds.length,
      totalAds: sellerAds.length,
    }
  }

  // Получаем всех продавцов с их статистикой
  const getAllSellersWithStats = (): SellerWithStats[] => {
    return allSellers.map((seller) => {
      const stats = getSellerStatsFromAllAds(seller.id)
      return {
        ...seller,
        activeAds: stats.activeAds,
        deletedAds: stats.deletedAds,
        totalAds: stats.totalAds,
      }
    })
  }

  // Получаем продавцов с количеством объявлений для выбранной категории
  const getSellersWithStatsForSelection = (): SellerWithStats[] => {
    if (!selectedCategory) {
      return getAllSellersWithStats()
    }

    // Для категории
    if (!selectedCategory.categoryId) {
      const category = allCategories.find((c) => c.id === selectedCategory.id)
      if (!category) return []

      const sellerStats = new Map<string, { active: number; deleted: number }>()

      // Обрабатываем объявления самой категории
      if (category.ads) {
        category.ads.forEach((ad) => {
          if (!ad.authorId) return

          const current = sellerStats.get(ad.authorId) || { active: 0, deleted: 0 }
          if (ad.deletedAt) {
            current.deleted += 1
          } else {
            current.active += 1
          }
          sellerStats.set(ad.authorId, current)
        })
      }

      // Обрабатываем объявления подкатегорий
      category.subcategories?.forEach((sub) => {
        if (sub.ads) {
          sub.ads.forEach((ad) => {
            if (!ad.authorId) return

            const current = sellerStats.get(ad.authorId) || { active: 0, deleted: 0 }
            if (ad.deletedAt) {
              current.deleted += 1
            } else {
              current.active += 1
            }
            sellerStats.set(ad.authorId, current)
          })
        }
      })

      // Формируем результат с продавцами и их статистикой
      return Array.from(sellerStats.entries())
        .map(([sellerId, stats]) => {
          const seller = allSellers.find((s) => s.id === sellerId)
          return seller
            ? {
                ...seller,
                activeAds: stats.active,
                deletedAds: stats.deleted,
                totalAds: stats.active + stats.deleted,
              }
            : null
        })
        .filter(Boolean) as SellerWithStats[]
    }

    // Для подкатегории
    const parentCategory = allCategories.find((c) => c.subcategories?.some((sub) => sub.id === selectedCategory.id))

    if (!parentCategory) return []

    const subcategory = parentCategory.subcategories?.find((sub) => sub.id === selectedCategory.id)
    if (!subcategory || !subcategory.ads) return []

    // Собираем статистику по продавцам для подкатегории
    const sellerStats = new Map<string, { active: number; deleted: number }>()

    subcategory.ads.forEach((ad) => {
      if (!ad.authorId) return

      const current = sellerStats.get(ad.authorId) || { active: 0, deleted: 0 }
      if (ad.deletedAt) {
        current.deleted += 1
      } else {
        current.active += 1
      }
      sellerStats.set(ad.authorId, current)
    })

    // Формируем результат с продавцами и их статистикой
    return Array.from(sellerStats.entries())
      .map(([sellerId, stats]) => {
        const seller = allSellers.find((s) => s.id === sellerId)
        return seller
          ? {
              ...seller,
              activeAds: stats.active,
              deletedAds: stats.deleted,
              totalAds: stats.active + stats.deleted,
            }
          : null
      })
      .filter(Boolean) as SellerWithStats[]
  }

  // Получаем всех продавцов для текущей выборки
  const allSellersForSelection = getSellersWithStatsForSelection()

  // Пагинируем продавцов
  const paginatedSellers = allSellersForSelection.slice(0, sellersPage * SELLERS_PER_PAGE)
  const hasMoreSellers = paginatedSellers.length < allSellersForSelection.length

  // Получаем статистику для отображения
  const getStatsForSelection = () => {
    if (!selectedCategory) {
      // Общая статистика по всем категориям
      const totalAds = allCategories.reduce((sum, cat) => sum + cat.totalAds, 0)
      const activeAds = allCategories.reduce((sum, cat) => sum + cat.activeAds, 0)
      const deletedAds = allCategories.reduce((sum, cat) => sum + cat.deletedAds, 0)
      const avgPrice =
        totalAds > 0
          ? Math.round(allCategories.reduce((sum, cat) => sum + cat.avgPrice * cat.totalAds, 0) / totalAds)
          : 0

      return {
        active: activeAds,
        deleted: deletedAds,
        total: totalAds,
        avgPrice: avgPrice,
      }
    }

    // Статистика для выбранной категории/подкатегории
    return {
      active: selectedCategory.activeAds,
      deleted: selectedCategory.deletedAds,
      total: selectedCategory.totalAds,
      avgPrice: selectedCategory.avgPrice,
    }
  }

  const currentStats = getStatsForSelection()

  return (
    <div className={`${css.tableContainer} ${className || ''}`}>
      <div className={css.contentWrapper}>
        <div className={css.tablePanel}>
          <div className={css.header}>
            <div className={css.headerStats}>Категории и подкатегории</div>

            <div className={css.headerButtons}>
              <Modal title={'Создание категории'} buttonText="Категория">
                <CreateCategory onSuccess={handleSuccess} />
              </Modal>

              <Modal title={'Создание подкатегории'} buttonText={'Подкатегория'}>
                <CreateSubcategory onSuccess={handleSuccess} />
              </Modal>
            </div>
          </div>

          <div className={css.tableWrapper}>
            <table className={css.categoryTable}>
              <tbody>
                {allCategories.map((category, categoryIndex) => {
                  const categorySubcategories = category.subcategories || []
                  const isLastCategory =
                    categoryIndex === allCategories.length - 1 && categorySubcategories.length === 0

                  return (
                    <React.Fragment key={category.id}>
                      <tr
                        className={`${css.categoryRow} ${isLastCategory ? css.lastRow : ''} ${selectedCategory?.id === category.id ? css.selectedRow : ''}`}
                        onClick={() => handleCategoryClick(category)}
                      >
                        <td className={css.colName}>
                          <span className={css.label}>{category.name}</span>
                        </td>

                        <td className={css.colActions}>
                          <div className={css.actionsContainer}>
                            <div onClick={stopPropagation}>
                              <Modal title={'Редактирование категории'} buttonText={<Icon name={'edit'} />}>
                                <EditCategory
                                  categoryId={category.id}
                                  initialName={category.name}
                                  initialSlug={category.slug}
                                  initialSequence={category.sequence}
                                  onSuccess={handleSuccess}
                                />
                              </Modal>
                            </div>
                          </div>
                        </td>
                      </tr>

                      {categorySubcategories.map((subcategory, subIndex) => {
                        const isLastSubcategory =
                          categoryIndex === allCategories.length - 1 && subIndex === categorySubcategories.length - 1

                        return (
                          <tr
                            key={subcategory.id}
                            className={`${css.subcategoryRow} ${isLastSubcategory ? css.lastRow : ''} ${selectedCategory?.id === subcategory.id ? css.selectedRow : ''}`}
                            onClick={() => handleCategoryClick(subcategory)}
                          >
                            <td className={css.colName}>
                              <span className={css.leafLabel}>{subcategory.name}</span>
                            </td>

                            <td className={css.colActions}>
                              <div className={css.actionsContainer}>
                                <div onClick={stopPropagation}>
                                  <Modal title={'Редактирование подкатегории'} buttonText={<Icon name={'edit'} />}>
                                    <EditSubcategory
                                      subcategoryId={subcategory.id}
                                      initialName={subcategory.name}
                                      initialSlug={subcategory.slug}
                                      initialSequence={subcategory.sequence}
                                      initialCategoryId={subcategory.categoryId}
                                      onSuccess={handleSuccess}
                                    />
                                  </Modal>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </React.Fragment>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className={css.sellersPanelContainer}>
          <SellersList
            sellers={paginatedSellers}
            count={allSellersForSelection.length}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onLoadMore={handleLoadMore}
            isLoadingMore={isLoadingMore}
            hasMore={hasMoreSellers}
          />
        </div>

        <div className={css.chartPanelContainer}>
          <div className={css.chartPanel}>
            <PieChart
              active={currentStats.active}
              deleted={currentStats.deleted}
              total={currentStats.total}
              avgPrice={currentStats.avgPrice}
            />
            {selectedCategory && (
              <button
                className={css.closeChartButton}
                onClick={() => {
                  setSelectedCategory(null)
                  setSearchQuery('')
                  setSellersPage(1) // Сбрасываем пагинацию
                }}
                aria-label="Сбросить выбор"
              >
                <Icon name="reset" size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
