import { useState } from 'react'
import css from './index.module.scss'
import { Icon } from '../Icon'

interface Category {
  id: string
  name: string
  subcategories: Subcategory[]
}

interface Subcategory {
  id: string
  name: string
}

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

  // Данные категорий и подкатегорий
  const categories: Category[] = [
    {
      id: '1',
      name: 'Электроника',
      subcategories: [
        { id: '1-1', name: 'Смартфоны' },
        { id: '1-2', name: 'Ноутбуки' },
        { id: '1-3', name: 'Телевизоры' },
      ],
    },
    {
      id: '2',
      name: 'Одежда',
      subcategories: [
        { id: '2-1', name: 'Мужская' },
        { id: '2-2', name: 'Женская' },
        { id: '2-3', name: 'Детская' },
      ],
    },
    {
      id: '3',
      name: 'Дом и сад',
      subcategories: [
        { id: '3-1', name: 'Мебель' },
        { id: '3-2', name: 'Текстиль' },
        { id: '3-3', name: 'Инструменты' },
      ],
    },
  ]

  const handleSubcategoryClick = (_id: string) => {
    setIsOpen(false)
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
