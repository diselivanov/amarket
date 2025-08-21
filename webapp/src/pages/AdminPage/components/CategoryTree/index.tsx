import React, { useState } from 'react'
import { trpc } from '../../../../lib/trpc'
import { Loader } from '../../../../components/Loader'
import { Alert } from '../../../../components/Alert'
import css from './index.module.scss'
import { Icon } from '../../../../components/Icon'
import { CreateCategory } from '../NewCategory'
import { CreateSubcategory } from '../NewSubcategory'
import { Modal } from '../../components/Modal'
import { EditCategory } from '../EditCategory'
import { EditSubcategory } from '../EditSubcategory'

interface CategoriesProps {
  className?: string
}

interface CategoryNode {
  id: string
  name: string
  sequence: string
  total?: number
  active?: number
  sold?: number
  avgPrice?: number
  views?: number
  sellers?: number
}

interface SubcategoryNode extends CategoryNode {
  categoryId: string
}

export const CategoryTree: React.FC<CategoriesProps> = ({ className }) => {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})

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

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }))
  }

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  const handleSuccess = () => {
    refetchCategories()
    refetchSubcategories()
  }

  if (isCategoriesLoading || isSubcategoriesLoading) {
    return <Loader type="section" />
  }

  if (categoriesError || subcategoriesError) {
    return <Alert color="red">Ошибка загрузки данных</Alert>
  }

  return (
    <div className={`${css.tableContainer} ${className || ''}`}>
      <div className={css.header}>
        <Modal title={'Создание категории'} buttonText="Категория">
          <CreateCategory/>
        </Modal>

        <Modal title={'Создание подкатегории'} buttonText={'Подкатегория'}>
          <CreateSubcategory/>
        </Modal>
      </div>
      
      <div className={css.tableWrapper}>
        <table className={css.categoryTable}>
          <thead>
            <tr>
              <th className={css.colName}>Категория</th>
              <th className={css.colTotal}>Всего</th>
              <th className={css.colActive}>Активные</th>
              <th className={css.colSold}>Продано</th>
              <th className={css.colAvgPrice}>Средняя цена</th>
              <th className={css.colViews}>Просмотры</th>
              <th className={css.colSellers}>Продавцы</th>
              <th className={css.colActions}></th>
            </tr>
          </thead>
          <tbody>
            {categoriesData?.categories.map((category) => (
              <React.Fragment key={category.id}>
                <tr 
                  className={`${css.categoryRow} ${expandedCategories[category.id] ? css.expanded : ''}`}
                  onClick={() => toggleCategory(category.id)}
                >
                  <td className={css.colName}>
                    <span className={css.caret}></span>
                    <span className={css.sequence}>{category.sequence}</span>
                    <span className={css.label}>{category.name}</span>
                  </td>
                  <td className={css.colTotal}>{category.total || 0}</td>
                  <td className={css.colActive}>{category.active || 0}</td>
                  <td className={css.colSold}>{category.sold || 0}</td>
                  <td className={css.colAvgPrice}>{category.avgPrice ? `$${category.avgPrice.toLocaleString()}` : 0}</td>
                  <td className={css.colViews}>{category.views ? category.views.toLocaleString() : 0}</td>
                  <td className={css.colSellers}>{category.sellers || 0}</td>
                  <td className={css.colActions} onClick={stopPropagation}>
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
                
                {expandedCategories[category.id] && subcategoriesData?.subcategories
                  .filter((sub) => sub.categoryId === category.id)
                  .map((subcategory, index) => (
                    <tr 
                      key={subcategory.id} 
                      className={css.subcategoryRow}
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <td className={css.colName}>
                        <span className={css.sequence}>{subcategory.sequence}</span>
                        <span className={css.leafLabel}>{subcategory.name}</span>
                      </td>
                      <td className={css.colTotal}>{subcategory.total || 0}</td>
                      <td className={css.colActive}>{subcategory.active || 0}</td>
                      <td className={css.colSold}>{subcategory.sold || 0}</td>
                      <td className={css.colAvgPrice}>{subcategory.avgPrice ? `$${subcategory.avgPrice.toLocaleString()}` : 0}</td>
                      <td className={css.colViews}>{subcategory.views ? subcategory.views.toLocaleString() : 0}</td>
                      <td className={css.colSellers}>{subcategory.sellers || 0}</td>
                      <td className={css.colActions} onClick={stopPropagation}>
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
                  ))
                }
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}