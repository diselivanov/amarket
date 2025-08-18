import React, { useState } from 'react'
import { trpc } from '../../../../lib/trpc'
import { Loader } from '../../../../components/Loader'
import { Alert } from '../../../../components/Alert'
import css from './index.module.scss'

interface CategoriesProps {
  className?: string
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
      <h3 className={css.header}>Categories</h3>
      <ul className={css.tree}>
        {categoriesData?.categories.map(category => (
          <li key={category.id} className={css.node}>
            <div 
              className={css.nodeHeader}
              onClick={() => toggleCategory(category.id)}
            >
              <span className={css.caret}>
                {expandedCategories[category.id] ? (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.78 6.22a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06 0L3.22 7.28a.75.75 0 011.06-1.06L8 9.94l3.72-3.72a.75.75 0 011.06 0z" fill="#57606A"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path fillRule="evenodd" d="M6.22 3.22a.75.75 0 011.06 0l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06-1.06L9.94 8 6.22 4.28a.75.75 0 010-1.06z" fill="#57606A"/>
                  </svg>
                )}
              </span>
              <span className={css.label}>{category.name}</span>
            </div>
            
            {expandedCategories[category.id] && (
              <ul className={css.subtree}>
                {subcategoriesData?.subcategories
                  .filter(sub => sub.categoryId === category.id)
                  .map(subcategory => (
                    <li key={subcategory.id} className={css.leaf}>
                      <span className={css.leafLabel}>{subcategory.name}</span>
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