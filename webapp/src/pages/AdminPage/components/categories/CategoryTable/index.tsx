import React from 'react'
import { trpc } from '../../../../../lib/trpc'
import { Loader } from '../../../../../components/Loader'
import { Alert } from '../../../../../components/Alert'
import { Icon } from '../../../../../components/Icon'
import { Badge } from '../../../../../components/Badge'
import { CreateCategory } from '../NewCategory'
import { CreateSubcategory } from '../NewSubcategory'
import { EditCategory } from '../EditCategory'
import { EditSubcategory } from '../EditSubcategory'
import { Modal } from '../../../../../components/Modal'
import { DataTable } from '../../../../../components/DataTable'
import css from './index.module.scss'

// Изображения категорий
import imageCars from '../../../../../assets/images/cars.png'
import imageRealty from '../../../../../assets/images/realty.png'
import imageElectronics from '../../../../../assets/images/electronics.png'
import imageWork from '../../../../../assets/images/work.png'
import imageServices from '../../../../../assets/images/services.png'
import imageItems from '../../../../../assets/images/items.png'
import imageHome from '../../../../../assets/images/home.png'
import imageHobby from '../../../../../assets/images/hobby.png'
import imageAnimals from '../../../../../assets/images/animals.png'
import imageBusiness from '../../../../../assets/images/business.png'

interface CategoriesProps {
  className?: string
}

interface StatsBadgesProps {
  active: number
  deleted: number
  total: number
}

const StatsBadges: React.FC<StatsBadgesProps> = ({ active, deleted, total }) => {
  // Рассчитываем проценты
  const activePercentage = total > 0 ? Math.round((active / total) * 100) : 0
  const deletedPercentage = total > 0 ? Math.round((deleted / total) * 100) : 0

  // Формируем текст для подсказок
  const totalTooltip = `Общее количество`
  const activeTooltip = `Активные ${activePercentage}%`
  const deletedTooltip = `Удаленные ${deletedPercentage}%`

  return (
    <div className={css.statsBadges}>
      <Badge color="blue" title={totalTooltip}>
        {total}
      </Badge>
      <Badge color="green" title={activeTooltip}>
        {active}
      </Badge>
      <Badge color="red" title={deletedTooltip}>
        {deleted}
      </Badge>
    </div>
  )
}

// Функция для получения изображения по slug категории
const getCategoryImage = (slug: string) => {
  switch (slug) {
    case 'cars':
      return imageCars
    case 'realty':
      return imageRealty
    case 'electronics':
      return imageElectronics
    case 'work':
      return imageWork
    case 'services':
      return imageServices
    case 'items':
      return imageItems
    case 'home':
      return imageHome
    case 'hobby':
      return imageHobby
    case 'animals':
      return imageAnimals
    case 'business':
      return imageBusiness
    default:
      return null
  }
}

export const CategoryTable: React.FC<CategoriesProps> = ({ className }) => {
  const {
    data: statsData,
    isLoading: isStatsLoading,
    error: statsError,
    refetch: refetchStats,
  } = trpc.getCategoriesSubcategoriesStats.useQuery({})

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  const handleSuccess = () => {
    refetchStats()
  }

  if (isStatsLoading) {
    return <Loader type="section" />
  }

  if (statsError) {
    return <Alert color="red">Ошибка загрузки данных</Alert>
  }

  const allCategories = statsData?.categories || []

  // Рассчитываем статистику для заголовка
  const totalCategories = allCategories.length
  const totalSubcategories = allCategories.reduce(
    (sum, category) => sum + (category.subcategories?.length || 0),
    0
  )

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(Math.round(price))
  }

  // Подготовка данных для таблицы
  const tableData = allCategories.flatMap((category) => {
    const categorySubcategories = category.subcategories || []
    const categoryImage = getCategoryImage(category.slug)
    
    const categoryRow = {
      name: (
        <div className={css.nameCell}>
          {categoryImage && (
            <div className={css.categoryImageContainer}>
              <img src={categoryImage} className={css.categoryImage} alt={category.name} />
            </div>
          )}
          {category.name}
        </div>
      ),
      sellers: category.uniqueSellers,
      price: category.totalAds > 0 ? `${formatPrice(category.avgPrice)} ₽` : '—',
      ads: (
        <StatsBadges
          active={category.activeAds}
          deleted={category.deletedAds}
          total={category.totalAds}
        />
      ),
      actions: (
        <div className={css.actionsContainer} onClick={stopPropagation}>
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
      )
    }

    const subcategoryRows = categorySubcategories.map((subcategory) => ({
      name: subcategory.name,
      sellers: subcategory.uniqueSellers,
      price: subcategory.totalAds > 0 ? `${formatPrice(subcategory.avgPrice)} ₽` : '—',
      ads: (
        <StatsBadges
          active={subcategory.activeAds}
          deleted={subcategory.deletedAds}
          total={subcategory.totalAds}
        />
      ),
      actions: (
        <div className={css.actionsContainer} onClick={stopPropagation}>
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
      )
    }))

    return [categoryRow, ...subcategoryRows]
  })

  // Определение колонок таблицы
  const columns = [
    { key: 'name', title: 'Название', width: '40%' },
    { key: 'sellers', title: 'Продавцы', width: '15%' },
    { key: 'price', title: 'Средняя цена', width: '20%' },
    { key: 'ads', title: 'Объявления', width: '15%' }
  ]

  // Кнопки для заголовка таблицы
  const headerButtons = (
    <>
      <Modal title={'Создание категории'} buttonText="Категория">
        <CreateCategory onSuccess={handleSuccess} />
      </Modal>
      <Modal title={'Создание подкатегории'} buttonText={'Подкатегория'}>
        <CreateSubcategory onSuccess={handleSuccess} />
      </Modal>
    </>
  )

  // Статистика для заголовка
  const headerStats = (
    <>
      <span>Категории: {totalCategories}</span>
      <span>Подкатегории: {totalSubcategories}</span>
    </>
  )

  return (
    <DataTable
      columns={columns}
      data={tableData}
      headerButtons={headerButtons}
      headerStats={headerStats}
      className={className}
    />
  )
}