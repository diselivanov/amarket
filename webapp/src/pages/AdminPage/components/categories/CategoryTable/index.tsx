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

  // Получаем все категории и подкатегории для определения последнего элемента
  const allCategories = categoriesData?.categories || [];
  const allSubcategories = subcategoriesData?.subcategories || [];

  return (
    <div className={`${css.tableContainer} ${className || ''}`}>
      <div className={css.header}>
        <div className={css.headerTitle}>
          Категории
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
                    <td className={css.actionCell} onClick={stopPropagation}>
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
                  
                  {categorySubcategories.map((subcategory, subIndex) => {
                    const isLastSubcategory = categoryIndex === allCategories.length - 1 && 
                                            subIndex === categorySubcategories.length - 1;
                    
                    return (
                      <tr key={subcategory.id} className={`${css.subcategoryRow} ${isLastSubcategory ? css.lastRow : ''}`}>
                        <td className={css.colName}>
                          <span className={css.leafLabel}>{subcategory.name}</span>
                        </td>
                        <td className={css.actionCell} onClick={stopPropagation}>
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