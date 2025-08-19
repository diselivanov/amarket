import React, { useState } from 'react'
import { trpc } from '../../../../lib/trpc'
import { Loader } from '../../../../components/Loader'
import { Alert } from '../../../../components/Alert'
import css from './index.module.scss'
import { Icon } from '../../../../components/Icon'

interface CategoriesProps {
  className?: string
}

interface CategoryNode {
  id: string
  name: string
  count?: number
}

interface SubcategoryNode extends CategoryNode {
  categoryId: string
}

export const CategoryTree: React.FC<CategoriesProps> = ({ className }) => {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})
  
  const { 
    data: categoriesData, 
    isLoading: isCategoriesLoading, 
    error: categoriesError 
  } = trpc.getCategories.useQuery({})

  const { 
    data: subcategoriesData, 
    isLoading: isSubcategoriesLoading, 
    error: subcategoriesError 
  } = trpc.getSubcategories.useQuery({})

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }))
  }

  if (isCategoriesLoading || isSubcategoriesLoading) {
    return <Loader type="section" />
  }

  if (categoriesError || subcategoriesError) {
    return <Alert color="red">Ошибка загрузки данных</Alert>
  }

  return (
    <div className={`${css.treeView} ${className || ''}`}>
      <h3 className={css.header}>Категории</h3>
      <ul className={css.tree}>
        {categoriesData?.categories.map(category => (
          <li key={category.id} className={css.node}>
            <div 
              className={css.nodeHeader}
              onClick={() => toggleCategory(category.id)}
            >
              <span className={css.caret}>
                {expandedCategories[category.id] ? (
                  <Icon name={'arrowDown'}/>
                ) : (
                  <Icon name={'arrowRight'}/>
                )}
              </span>
              <span className={css.label}>{category.name}</span>
              {category.count !== undefined && (
                <span className={css.count}>{category.count}</span>
              )}
            </div>
            
            {expandedCategories[category.id] && (
              <ul className={css.subtree}>
                {subcategoriesData?.subcategories
                  .filter(sub => sub.categoryId === category.id)
                  .map(subcategory => (
                    <li key={subcategory.id} className={css.leaf}>
                      <span className={css.leafLabel}>{subcategory.name}</span>
                      {subcategory.count !== undefined && (
                        <span className={css.count}>{subcategory.count}</span>
                      )}
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