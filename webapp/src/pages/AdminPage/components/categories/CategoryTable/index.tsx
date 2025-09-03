// CategoryTable.tsx
import React, { useState } from 'react'
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
  uniqueSellers: number
  avgPrice: number
}

interface Seller {
  id: string
  name: string | null
  email: string
  avatar: string | null
  ads: any[]
  adsLikes: any[]
}

const PieChart: React.FC<PieChartProps> = ({ active, deleted, total, uniqueSellers, avgPrice }) => {
  const activePercentage = total > 0 ? (active / total) * 100 : 0;
  const deletedPercentage = total > 0 ? (deleted / total) * 100 : 0;
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(Math.round(price));
  };

  // Рассчитываем длину окружности (2πr)
  const circumference = 2 * Math.PI * 70;
  
  // Добавляем отступ между секторами только если есть оба типа
  const hasBothSectors = activePercentage > 0 && deletedPercentage > 0;
  const gapSize = hasBothSectors ? 3 : 0;
  
  // Рассчитываем длины дуг с учетом отступов (если есть оба сектора)
  const activeDash = Math.max(0, (activePercentage / 100) * circumference - (hasBothSectors ? gapSize : 0));
  const deletedDash = Math.max(0, (deletedPercentage / 100) * circumference - (hasBothSectors ? gapSize : 0));
  
  // Рассчитываем смещение для удаленного сектора
  const deletedOffset = -activeDash - (hasBothSectors ? gapSize : 0);

  // Проверяем, есть ли данные для отображения
  const hasData = total > 0;

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
          <span className={css.statLabel}>Продавцы:</span>
          <span className={css.statValue}>{uniqueSellers}</span>
        </div>
        <div className={css.statRow}>
          <span className={css.statLabel}>Средняя цена:</span>
          <span className={css.statValue}>{hasData ? `${formatPrice(avgPrice)} ₽` : '—'}</span>
        </div>
      </div>
    </div>
  );
};

const SellersList: React.FC<{ sellers: Seller[], title: string }> = ({ sellers, title }) => {
  return (
    <div className={css.sellersPanel}>
      <h3 className={css.sellersTitle}>{title}</h3>
      <div className={css.sellersList}>
        {sellers.length > 0 ? (
          sellers.map(seller => (
            <div key={seller.id} className={css.sellerItem}>
              <img className={css.sellerAvatar} alt="" src={getAvatarUrl(seller.avatar, 'small')} />
              <span className={css.sellerName}>{seller.name}</span>
            </div>
          ))
        ) : (
          <div className={css.noSellers}>Нет продавцов</div>
        )}
      </div>
    </div>
  );
};

export const CategoryTable: React.FC<CategoriesProps> = ({ className }) => {
  const {
    data: statsData,
    isLoading: isStatsLoading,
    error: statsError,
    refetch: refetchStats,
  } = trpc.getCategoriesSubcategoriesStats.useQuery({})

  const [selectedCategory, setSelectedCategory] = useState<any>(null)

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  const handleSuccess = () => {
    refetchStats()
  }

  const handleCategoryClick = (category: any) => {
    setSelectedCategory(category)
  }

  if (isStatsLoading) {
    return <Loader type="section" />
  }

  if (statsError) {
    return <Alert color="red">Ошибка загрузки данных</Alert>
  }

  const allCategories = statsData?.categories || []
  const allSellers = statsData?.allSellers || []

  // Получаем продавцов для выбранной категории или всех продавцов
  const getSellersForSelection = () => {
    if (!selectedCategory) return allSellers;
    
    // Для категории
    if (!selectedCategory.categoryId) {
      const category = allCategories.find(c => c.id === selectedCategory.id);
      if (!category) return [];
      
      // Собираем всех уникальных продавцов из категории и ее подкатегорий
      const sellerIds = new Set<string>();
      const sellers: Seller[] = [];
      
      // Добавляем продавцов из самой категории
      if (category.sellers) {
        category.sellers.forEach(seller => {
          if (!sellerIds.has(seller.id)) {
            sellerIds.add(seller.id);
            sellers.push(seller);
          }
        });
      }
      
      // Добавляем продавцов из подкатегорий
      category.subcategories?.forEach(sub => {
        if (sub.sellers) {
          sub.sellers.forEach(seller => {
            if (!sellerIds.has(seller.id)) {
              sellerIds.add(seller.id);
              sellers.push(seller);
            }
          });
        }
      });
      
      return sellers;
    }
    
    // Для подкатегории
    const parentCategory = allCategories.find(c => 
      c.subcategories?.some(sub => sub.id === selectedCategory.id)
    );
    
    if (!parentCategory) return [];
    
    const subcategory = parentCategory.subcategories?.find(sub => sub.id === selectedCategory.id);
    return subcategory?.sellers || [];
  };

  const currentSellers = getSellersForSelection();
  const sellersTitle = selectedCategory 
    ? `Продавцы: ${selectedCategory.name}` 
    : `Все продавцы: ${allSellers.length}`;

  // Получаем статистику для отображения
  const getStatsForSelection = () => {
    if (!selectedCategory) {
      // Общая статистика по всем категориям
      const totalAds = allCategories.reduce((sum, cat) => sum + cat.totalAds, 0);
      const activeAds = allCategories.reduce((sum, cat) => sum + cat.activeAds, 0);
      const deletedAds = allCategories.reduce((sum, cat) => sum + cat.deletedAds, 0);
      const avgPrice = totalAds > 0 
        ? Math.round(allCategories.reduce((sum, cat) => sum + cat.avgPrice * cat.totalAds, 0) / totalAds)
        : 0;
      
      return {
        active: activeAds,
        deleted: deletedAds,
        total: totalAds,
        uniqueSellers: allSellers.length,
        avgPrice: avgPrice
      };
    }
    
    // Статистика для выбранной категории/подкатегории
    return {
      active: selectedCategory.activeAds,
      deleted: selectedCategory.deletedAds,
      total: selectedCategory.totalAds,
      uniqueSellers: currentSellers.length,
      avgPrice: selectedCategory.avgPrice
    };
  };

  const currentStats = getStatsForSelection();

  return (
    <div className={`${css.tableContainer} ${className || ''}`}>

      <div className={css.contentWrapper}>
        <div className={css.tablePanel}>

          <div className={css.header}>
        <div className={css.headerStats}>
          Категории и подкатегории
        </div>

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
                  const isLastCategory = categoryIndex === allCategories.length - 1 && categorySubcategories.length === 0

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
          <SellersList sellers={currentSellers} title={sellersTitle} />
        </div>

        <div className={css.chartPanelContainer}>
          <div className={css.chartPanel}>
            <PieChart
              active={currentStats.active}
              deleted={currentStats.deleted}
              total={currentStats.total}
              uniqueSellers={currentStats.uniqueSellers}
              avgPrice={currentStats.avgPrice}
            />
            {selectedCategory && (
              <button 
                className={css.closeChartButton}
                onClick={() => setSelectedCategory(null)}
                aria-label="Сбросить выбор"
              >
                <Icon name="delete" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}