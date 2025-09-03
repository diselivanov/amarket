import { useState } from 'react'
import css from './index.module.scss'
import { Icon } from '../Icon'
import { trpc } from '../../lib/trpc'
import type { TrpcRouterOutput } from '@amarket/backend/src/router'

interface CategoryMapButtonProps {
  isOpen: boolean
  onClick: () => void
}

const CategoryMapButton = ({ onClick }: CategoryMapButtonProps) => {
  return (
    <button className={css.openMapButton} onClick={onClick}>
      <Icon name={'list'} />
      Категории
    </button>
  )
}

export const CategoryMap = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)

  // Используем типы из tRPC вместо ручного описания
  type CategoryType = TrpcRouterOutput['getCategories']['categories'][number]
  type SubcategoryType = TrpcRouterOutput['getSubcategories']['subcategories'][number]

  // Запрашиваем категории
  const { data: categoriesData, isLoading: categoriesLoading } = trpc.getCategories.useQuery({})
  
  // Запрашиваем подкатегории
  const { data: subcategoriesData, isLoading: subcategoriesLoading } = trpc.getSubcategories.useQuery({})

  // Формируем данные в нужном формате с использованием типов tRPC
  const categories = categoriesData?.categories?.map((category: CategoryType) => ({
    id: category.id,
    name: category.name,
    subcategories: subcategoriesData?.subcategories
      ?.filter((sub: SubcategoryType) => sub.categoryId === category.id)
      ?.map((sub: SubcategoryType) => ({
        id: sub.id,
        name: sub.name
      })) || []
  })) || []

  const handleSubcategoryClick = (id: string) => {
    setIsOpen(false)
    // Тут можно добавить навигацию и т.п.
  }

  if (categoriesLoading || subcategoriesLoading) {
    return (
      <div className={css.CategoryMap}>
        <CategoryMapButton isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
        {isOpen && <div>Загрузка категорий...</div>}
      </div>
    )
  }

  return (
    <div className={css.CategoryMap}>
      <CategoryMapButton isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />

      {isOpen && (
        <div className={css.mapContainer}>
          <div className={css.mapContent}>
            <div className={css.categoriesList}>
              {categories.map((category) => (
                <div
                  key={category.id}
                  className={css.categoryItem}
                  onMouseEnter={() => setHoveredCategory(category.id)}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  {category.name}
                </div>
              ))}
            </div>

            <div className={css.subcategoriesPanel}>
              {hoveredCategory && (
                <div className={css.subcategoriesList}>
                  {categories
                    .find((c) => c.id === hoveredCategory)
                    ?.subcategories.map((subcategory) => (
                      <div
                        key={subcategory.id}
                        className={css.subcategoryItem}
                        onClick={() => handleSubcategoryClick(subcategory.id)}
                      >
                        {subcategory.name}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}