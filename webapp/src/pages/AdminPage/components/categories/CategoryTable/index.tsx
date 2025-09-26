import { useState } from 'react'
import { trpc } from '../../../../../lib/trpc'
import { Loader } from '../../../../../components/Loader'
import { Alert } from '../../../../../components/Alert'
import { Badge } from '../../../../../components/Badge'
import { NewCategory } from '../NewCategory'
import { NewSubcategory } from '../NewSubcategory'
import { EditCategory } from '../EditCategory'
import { EditSubcategory } from '../EditSubcategory'
import { DataTable } from '../../../../../components/DataTable'
import { EmojiWithText } from '../../../../../components/Emoji'
import css from './index.module.scss'

interface CategoriesProps {
  className?: string
}

interface StatsBadgesProps {
  active: number
  deleted: number
  total: number
}

// Маппинг slug'ов категорий на названия emoji
const slugToEmojiMap: Record<string, string> = {
  realty: 'House',
  transport: 'Automobile',
  accessories: 'Gear',
  electronics: 'Laptop',
  work: 'Briefcase',
  services: 'Hammer and Wrench',
  items: 'T-Shirt',
  home: 'Potted Plant',
  hobby: 'Soccer Ball',
  animals: 'Dog',
  business: 'Money Bag'
}

const StatsBadges: React.FC<StatsBadgesProps> = ({ active, deleted, total }) => {
  const activePercentage = total > 0 ? Math.round((active / total) * 100) : 0
  const deletedPercentage = total > 0 ? Math.round((deleted / total) * 100) : 0

  const totalTooltip = `Общее количество`
  const activeTooltip = `Активные ${activePercentage}%`
  const deletedTooltip = `Удаленные ${deletedPercentage}%`

  return (
    <>
      <Badge color="blue" title={totalTooltip}>
        {total}
      </Badge>
      <Badge color="green" title={activeTooltip}>
        {active}
      </Badge>
      <Badge color="red" title={deletedTooltip}>
        {deleted}
      </Badge>
    </>
  )
}

interface TableItem {
  id: string
  type: 'category' | 'subcategory'
  name: string
  slug: string
  sequence: string
  categoryId?: string
  emojiName?: string
  uniqueSellers: number
  avgPrice: number
  totalAds: number
  activeAds: number
  deletedAds: number
}

type DetailViewMode = 'none' | 'new-category' | 'new-subcategory' | 'edit-category' | 'edit-subcategory'

export const CategoryTable: React.FC<CategoriesProps> = ({ className }) => {
  const [selectedRow, setSelectedRow] = useState<number | null>(null)
  const [selectedItem, setSelectedItem] = useState<TableItem | null>(null)
  const [detailViewMode, setDetailViewMode] = useState<DetailViewMode>('none')

  const {
    data: statsData,
    isLoading: isStatsLoading,
    error: statsError,
    refetch: refetchStats,
  } = trpc.getCategoriesSubcategoriesStats.useQuery({})

  const handleSuccess = () => {
    refetchStats()
    setSelectedRow(null)
    setSelectedItem(null)
    setDetailViewMode('none')
  }

  const handleRowClick = (index: number) => {
    setSelectedRow(selectedRow === index ? null : index)
    
    if (flatData[index]) {
      setSelectedItem(flatData[index])
      setDetailViewMode(flatData[index].type === 'category' ? 'edit-category' : 'edit-subcategory')
    } else {
      setSelectedItem(null)
      setDetailViewMode('none')
    }
  }

  const handleNewCategoryClick = () => {
    setSelectedRow(null)
    setSelectedItem(null)
    setDetailViewMode('new-category')
  }

  const handleNewSubcategoryClick = () => {
    setSelectedRow(null)
    setSelectedItem(null)
    setDetailViewMode('new-subcategory')
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

  // Подготавливаем плоский список данных для таблицы
  const flatData: TableItem[] = allCategories.flatMap((category) => {
    const categorySubcategories = category.subcategories || []
    const emojiName = slugToEmojiMap[category.slug]
    
    const categoryItem: TableItem = {
      id: category.id,
      type: 'category',
      name: category.name,
      slug: category.slug,
      sequence: category.sequence,
      emojiName,
      uniqueSellers: category.uniqueSellers,
      avgPrice: category.avgPrice,
      totalAds: category.totalAds,
      activeAds: category.activeAds,
      deletedAds: category.deletedAds
    }

    const subcategoryItems: TableItem[] = categorySubcategories.map((subcategory) => ({
      id: subcategory.id,
      type: 'subcategory',
      name: subcategory.name,
      slug: subcategory.slug,
      sequence: subcategory.sequence,
      categoryId: subcategory.categoryId,
      uniqueSellers: subcategory.uniqueSellers,
      avgPrice: subcategory.avgPrice,
      totalAds: subcategory.totalAds,
      activeAds: subcategory.activeAds,
      deletedAds: subcategory.deletedAds
    }))

    return [categoryItem, ...subcategoryItems]
  })

  // Подготовка данных для таблицы
  const tableData = flatData.map((item) => ({
    name: item.type === 'category' ? (
      <EmojiWithText name={item.emojiName} text={item.name} />
    ) : (
      <span>{item.name}</span>
    ),
    sellers: item.uniqueSellers,
    price: item.totalAds > 0 ? `${formatPrice(item.avgPrice)} ₽` : '—',
    ads: (
      <StatsBadges
        active={item.activeAds}
        deleted={item.deletedAds}
        total={item.totalAds}
      />
    )
  }))

  // Определение колонок таблицы
  const columns = [
    { key: 'name', title: 'Категория / Подкатегория', width: '35%' },
    { key: 'sellers', title: 'Продавцы', width: '20%' },
    { key: 'price', title: 'Средняя цена', width: '20%' },
    { key: 'ads', title: 'Объявления', width: '20%' }
  ]

  // Кнопки для заголовка таблицы
  const headerActions = (
    <>
      <button 
        onClick={handleNewCategoryClick}
      >
        Создать категорию
      </button>
      <button 
        onClick={handleNewSubcategoryClick}
      >
        Создать подкатегорию
      </button>
    </>
  )

  // Статистика для заголовка
  const headerStats = (
    <>
      <span>Категории: {totalCategories}</span>
      <span>Подкатегории: {totalSubcategories}</span>
    </>
  )

  // Контент для правой панели
  const renderDetailContent = () => {
    switch (detailViewMode) {
      case 'new-category':
        return (
          <NewCategory onSuccess={handleSuccess} />
        )
      
      case 'new-subcategory':
        return (
          <NewSubcategory onSuccess={handleSuccess} />
        )
      
      case 'edit-category':
        if (!selectedItem) return null
        return (
          <EditCategory
              categoryId={selectedItem.id}
              initialName={selectedItem.name}
              initialSlug={selectedItem.slug}
              initialSequence={selectedItem.sequence}
              onSuccess={handleSuccess}
            />
        )
      
      case 'edit-subcategory':
        if (!selectedItem) return null
        return (
          <EditSubcategory
              subcategoryId={selectedItem.id}
              initialName={selectedItem.name}
              initialSlug={selectedItem.slug}
              initialSequence={selectedItem.sequence}
              initialCategoryId={selectedItem.categoryId}
              onSuccess={handleSuccess}
            />
        )
    }
  }

  return (
    <DataTable
      columns={columns}
      data={tableData}
      headerActions={headerActions}
      headerStats={headerStats}
      className={className}
      onRowClick={handleRowClick}
      selectedRow={selectedRow}
      detailContent={renderDetailContent()}
    />
  )
}