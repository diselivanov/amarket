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
  count?: number
}

interface SubcategoryNode extends CategoryNode {
  categoryId: string
}

type StatsDisplayMode = 'none' | 'all' | 'active' | 'sold' | 'total'

export const CategoryTree: React.FC<CategoriesProps> = ({ className }) => {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})
  const [statsDisplayMode, setStatsDisplayMode] = useState<StatsDisplayMode>('none')

  const {
    data: categoriesData,
    isLoading: isCategoriesLoading,
    error: categoriesError,
  } = trpc.getCategories.useQuery({})

  const {
    data: subcategoriesData,
    isLoading: isSubcategoriesLoading,
    error: subcategoriesError,
  } = trpc.getSubcategories.useQuery({})

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }))
  }

  // Функция предотвращения открытия списка подкатегорий
  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  const shouldShowStat = (statType: 'total' | 'active' | 'sold') => {
    return statsDisplayMode !== 'none'
  }

  if (isCategoriesLoading || isSubcategoriesLoading) {
    return <Loader type="section" />
  }

  if (categoriesError || subcategoriesError) {
    return <Alert color="red">Ошибка загрузки данных</Alert>
  }

  return (
    <div className={`${css.treeView} ${className || ''}`}>
      <h3 className={css.header}>
        <Modal title={'Создание категории'} buttonText="Категория">
          <CreateCategory />
        </Modal>

        <Modal title={'Создание подкатегории'} buttonText={'Подкатегория'}>
          <CreateSubcategory />
        </Modal>

        <button
          className={`${css.statsToggle} ${css[statsDisplayMode]}`}
          onClick={() => setStatsDisplayMode(statsDisplayMode === 'none' ? 'all' : 'none')}
        >
          <Icon name={'chart'} />
        </button>
      </h3>
      <ul className={css.tree}>
        {categoriesData?.categories.map((category) => (
          <li key={category.id} className={css.node}>
            <div
              className={`${css.nodeHeader} ${expandedCategories[category.id] ? css.expanded : ''}`}
              onClick={() => toggleCategory(category.id)}
            >
              <span className={css.caret}>
                {expandedCategories[category.id] ? <Icon name={'arrowDown'} /> : <Icon name={'arrowRight'} />}
              </span>

              <span className={css.sequence}>{category.sequence}.</span>
              <span className={css.label}>{category.name}</span>

              <div className={css.stopPropagation} onClick={stopPropagation}>
                <Modal title={'Редактирование категории'} buttonText={<Icon name={'edit'} />}>
                  <EditCategory
                    categoryId={category.id}
                    initialName={category.name}
                    initialSequence={category.sequence}
                  />
                </Modal>

                {shouldShowStat('total') && <span className={css.total}>{category.count}</span>}
                {shouldShowStat('active') && <span className={css.active}>{category.count}</span>}
                {shouldShowStat('sold') && <span className={css.sold}>{category.count}</span>}
              </div>
            </div>

            {expandedCategories[category.id] && (
              <ul className={css.subtree}>
                {subcategoriesData?.subcategories
                  .filter((sub) => sub.categoryId === category.id)
                  .map((subcategory) => (
                    <li key={subcategory.id} className={css.leaf}>
                      <span className={css.sequence}>{subcategory.sequence}.</span>
                      <span className={css.leafLabel}>{subcategory.name}</span>

                      <div className={css.stopPropagation} onClick={stopPropagation}>
                        <Modal title={'Редактирование подкатегории'} buttonText={<Icon name={'edit'} />}>
                          <EditSubcategory
                            subcategoryId={subcategory.id}
                            initialName={subcategory.name}
                            initialSequence={subcategory.sequence}
                            initialCategoryId={subcategory.categoryId}
                          />
                        </Modal>

                        {shouldShowStat('total') && (
                          <span className={css.total} onClick={stopPropagation}>
                            {subcategory.count}
                          </span>
                        )}
                        {shouldShowStat('active') && (
                          <span className={css.active} onClick={stopPropagation}>
                            {subcategory.count}
                          </span>
                        )}
                        {shouldShowStat('sold') && (
                          <span className={css.sold} onClick={stopPropagation}>
                            {subcategory.count}
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
