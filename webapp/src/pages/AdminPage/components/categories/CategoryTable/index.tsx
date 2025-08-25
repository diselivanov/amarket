import React from 'react'
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

interface CategoriesProps {
  className?: string
}

interface CategoryNode {
  id: string
  name: string
  sequence: string
  totalAds: number
  activeAds: number
  deletedAds: number
  avgPrice: number
  uniqueSellers: number
  subcategories: SubcategoryNode[]
}

interface SubcategoryNode extends CategoryNode {
  categoryId: string
}

export const CategoryTable: React.FC<CategoriesProps> = ({ className }) => {
  const {
    data: categoriesData,
    isLoading: isCategoriesLoading,
    error: categoriesError,
    refetch: refetchCategories
  } = trpc.getCategories.useQuery({})

  const {
    data: subcategoriesData,
    isLoading: isSubcategoriesLoading,
    error: subcategoriesError,
    refetch: refetchSubcategories
  } = trpc.getSubcategories.useQuery({})

  const {
    data: statsData,
    isLoading: isStatsLoading,
    error: statsError,
    refetch: refetchStats
  } = trpc.getCategoryStats.useQuery({})

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  const handleSuccess = () => {
    refetchCategories()
    refetchSubcategories()
    refetchStats()
  }

  if (isCategoriesLoading || isSubcategoriesLoading || isStatsLoading) {
    return <Loader type="section" />
  }

  if (categoriesError || subcategoriesError || statsError) {
    return <Alert color="red">Ошибка загрузки данных</Alert>
  }

  const allCategories = statsData?.categories || []
  const allSubcategories = subcategoriesData?.subcategories || []

  // Вычисление общей статистики для заголовка
  const totalStats = allCategories.reduce(
    (acc, category) => {
      return {
        totalAds: acc.totalAds + category.totalAds,
        activeAds: acc.activeAds + category.activeAds,
        deletedAds: acc.deletedAds + category.deletedAds,
      };
    },
    { 
      totalAds: 0, 
      activeAds: 0, 
      deletedAds: 0,
    }
  );

  // Используем totalUniqueSellers из statsData, который уже правильно вычислен на сервере
  const uniqueSellersCount = statsData?.totalUniqueSellers || 0;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(price)
  }

  // Функция для расчета процента
  const calculatePercentage = (part: number, total: number): string => {
    if (total === 0) return '0.00%'
    const percentage = (part / total) * 100
    return `${percentage.toFixed(2)}%`
  }

  return (
    <div className={`${css.tableContainer} ${className || ''}`}>
      <div className={css.header}>
        <div className={css.headerStats}>
          <div className={css.statItem}>
            <span className={css.statLabel}>Всего:</span>
            <span className={css.statValue}>{totalStats.totalAds}</span>
          </div>
          <div className={css.statItem}>
            <span className={css.statLabel}>Активные:</span>
            <span className={css.statValue}>{totalStats.activeAds}</span>
            <span className={css.percentageGreen}>
              {calculatePercentage(totalStats.activeAds, totalStats.totalAds)}
            </span>
          </div>
          <div className={css.statItem}>
            <span className={css.statLabel}>Удаленные:</span>
            <span className={css.statValue}>{totalStats.deletedAds}</span>
            <span className={css.percentageRed}>
              {calculatePercentage(totalStats.deletedAds, totalStats.totalAds)}
            </span>
          </div>
          <div className={css.statItem}>
            <span className={css.statLabel}>Продавцы:</span>
            <span className={css.statValue}>{uniqueSellersCount}</span>
          </div>
        </div>
        
        <div className={css.headerButtons}>
          <Modal title={'Создание категории'} buttonText="Категория">
            <CreateCategory/>
          </Modal>

          <Modal title={'Создание подкатегории'} buttonText={'Подкатегория'}>
            <CreateSubcategory/>
          </Modal>
        </div>
      </div>
      
      <div className={css.tableWrapper}>
        <table className={css.categoryTable}>
          <thead>
            <tr className={css.tableHeader}>
              <th className={css.colName}>Категория</th>
              <th className={css.colStats}>Всего</th>
              <th className={css.colStats}>Активные</th>
              <th className={css.colStats}>Удаленные</th>
              <th className={css.colStats}>Средняя цена</th>
              <th className={css.colStats}>Продавцы</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {allCategories.map((category, categoryIndex) => {
              const categorySubcategories = allSubcategories.filter((sub) => sub.categoryId === category.id);
              const isLastCategory = categoryIndex === allCategories.length - 1 && categorySubcategories.length === 0;
              
              return (
                <React.Fragment key={category.id}>
                  <tr className={`${css.categoryRow} ${isLastCategory ? css.lastRow : ''}`}>
                    <td className={css.colName}>
                      <span className={css.label}>{category.name}</span>
                    </td>
                    <td className={css.colStats}>
                      <span className={css.statValue}>{category.totalAds}</span>
                    </td>
                    <td className={css.colStats}>
                      <div className={css.statWithPercentage}>
                        <span className={css.statValue}>{category.activeAds}</span>
                        <span className={css.percentageGreen}>
                          {calculatePercentage(category.activeAds, category.totalAds)}
                        </span>
                      </div>
                    </td>
                    <td className={css.colStats}>
                      <div className={css.statWithPercentage}>
                        <span className={css.statValue}>{category.deletedAds}</span>
                        <span className={css.percentageRed}>
                          {calculatePercentage(category.deletedAds, category.totalAds)}
                        </span>
                      </div>
                    </td>
                    <td className={css.colStats}>
                      <span className={css.statValue}>{formatPrice(category.avgPrice)} ₽</span>
                    </td>
                    <td className={css.colStats}>
                      <span className={css.statValue}>{category.uniqueSellers}</span>
                    </td>
                    <td onClick={stopPropagation}>
                      <Modal title={'Редактирование категории'} buttonText={<Icon name={'edit'} />}>
                        <EditCategory
                          categoryId={category.id}
                          initialName={category.name}
                          initialSequence={category.sequence}
                          onSuccess={handleSuccess}
                        />
                      </Modal>
                    </td>
                  </tr>
                  
                  {category.subcategories && category.subcategories.map((subcategory, subIndex) => {
                    const isLastSubcategory = categoryIndex === allCategories.length - 1 && 
                                            subIndex === category.subcategories.length - 1;
                    
                    return (
                      <tr key={subcategory.id} className={`${css.subcategoryRow} ${isLastSubcategory ? css.lastRow : ''}`}>
                        <td className={css.colName}>
                          <span className={css.leafLabel}>{subcategory.name}</span>
                        </td>
                        <td className={css.colStats}>
                          <span className={css.statValue}>{subcategory.totalAds}</span>
                        </td>
                        <td className={css.colStats}>
                          <div className={css.statWithPercentage}>
                            <span className={css.statValue}>{subcategory.activeAds}</span>
                            <span className={css.percentageGreen}>
                              {calculatePercentage(subcategory.activeAds, subcategory.totalAds)}
                            </span>
                          </div>
                        </td>
                        <td className={css.colStats}>
                          <div className={css.statWithPercentage}>
                            <span className={css.statValue}>{subcategory.deletedAds}</span>
                            <span className={css.percentageRed}>
                              {calculatePercentage(subcategory.deletedAds, subcategory.totalAds)}
                            </span>
                          </div>
                        </td>
                        <td className={css.colStats}>
                          <span className={css.statValue}>{formatPrice(subcategory.avgPrice)} ₽</span>
                        </td>
                        <td className={css.colStats}>
                          <span className={css.statValue}>{subcategory.uniqueSellers}</span>
                        </td>
                        <td onClick={stopPropagation}>
                          <Modal title={'Редактирование подкатегории'} buttonText={<Icon name={'edit'} />}>
                            <EditSubcategory
                              subcategoryId={subcategory.id}
                              initialName={subcategory.name}
                              initialSequence={subcategory.sequence}
                              initialCategoryId={subcategory.categoryId}
                              onSuccess={handleSuccess}
                            />
                          </Modal>
                        </td>
                      </tr>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}