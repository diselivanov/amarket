import React from 'react'
import { trpc } from '../../../../../lib/trpc'
import { Loader } from '../../../../../components/Loader'
import { Alert } from '../../../../../components/Alert'
import { Icon } from '../../../../../components/Icon'
import { Sidebar } from '../../../../../components/Sidebar'
import { EditVehicleBrand } from '../EditVehicleBrand'
import { EditVehicleModel } from '../EditVehicleModel'
import { CreateVehicleModel } from '../NewVehicleModel'
import { CreateVehicleBrand } from '../NewVehicleBrand'
import { DataTable } from '../../../../../components/DataTable'
import css from './index.module.scss'

interface VehicleBrandsProps {
  className?: string
}

export const VehicleTable: React.FC<VehicleBrandsProps> = ({ className }) => {
  const {
    data: brandsData,
    isLoading: isBrandsLoading,
    error: brandsError,
    refetch: refetchBrands,
  } = trpc.getVehicleBrands.useQuery({})

  const {
    data: modelsData,
    isLoading: isModelsLoading,
    error: modelsError,
    refetch: refetchModels,
  } = trpc.getVehicleModels.useQuery({})

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  const handleSuccess = () => {
    refetchBrands()
    refetchModels()
  }

  if (isBrandsLoading || isModelsLoading) {
    return <Loader type="section" />
  }

  if (brandsError || modelsError) {
    return <Alert color="red">Ошибка загрузки данных</Alert>
  }

  const allBrands = brandsData?.vehicleBrands || []
  const allModels = modelsData?.vehicleModels || []

  // Подготовка данных для таблицы
  const tableData = allBrands.flatMap((brand) => {
    const brandModels = allModels.filter((model) => model.brandId === brand.id)
    
    const brandRow = {
      name: brand.name,
      sequence: brand.sequence,
      actions: (
        <Sidebar title={'Редактирование бренда'} buttonText={<Icon name={'edit'} />}>
            <EditVehicleBrand
              brandId={brand.id}
              initialName={brand.name}
              initialSequence={brand.sequence}
              onSuccess={handleSuccess}
            />
          </Sidebar>
      )
    }

    const modelRows = brandModels.map((model) => ({
      name: `${model.name}`,
      type: model.type,
      sequence: model.sequence,
      actions: (
        <Sidebar title={'Редактирование модели'} buttonText={<Icon name={'edit'} />}>
            <EditVehicleModel
              vehicleModelId={model.id}
              initialName={model.name}
              initialSequence={model.sequence}
              initialType={model.type}
              initialBrandId={model.brandId}
              onSuccess={handleSuccess}
            />
          </Sidebar>
      )
    }))

    return [brandRow, ...modelRows]
  })

  // Определение колонок таблицы
  const columns = [
    { key: 'name', title: 'Бренд / Модель', width: '50%' },
    { key: 'type', title: 'Тип', width: '25%' },
    { key: 'sequence', title: 'Порядок', width: '15%' }
  ]

  // Кнопки для заголовка таблицы (onSuccess={handleSuccess} нужен у CreateVehicleBrand и CreateVehicleModel)
  const headerActions = (
    <>
      <Sidebar title={'Создание бренда'} buttonText="Бренд">
        <CreateVehicleBrand />
      </Sidebar>
      <Sidebar title={'Создание модели'} buttonText={'Модель'}>
        <CreateVehicleModel />
      </Sidebar>
    </>
  )

  // Статистика для заголовка
  const headerStats = (
    <>
      <span>Брендов: {allBrands.length}</span>
      <span>Моделей: {allModels.length}</span>
    </>
  )

  return (
    <DataTable
      columns={columns}
      data={tableData}
      headerActions={headerActions}
      headerStats={headerStats}
      className={className}
    />
  )
}