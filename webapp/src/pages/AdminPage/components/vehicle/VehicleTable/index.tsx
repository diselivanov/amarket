import React from 'react'
import { trpc } from '../../../../../lib/trpc'
import { Loader } from '../../../../../components/Loader'
import { Alert } from '../../../../../components/Alert'
import { Icon } from '../../../../../components/Icon'
import { Modal } from '../../Modal'
import css from './index.module.scss'
import { EditVehicleBrand } from '../EditVehicleBrand'
import { EditVehicleModel } from '../EditVehicleModel'
import { CreateVehicleModel } from '../NewVehicleModel'
import { CreateVehicleBrand } from '../NewVehicleBrand'

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

  return (
    <div className={`${css.tableContainer} ${className || ''}`}>
      <div className={css.header}>
        <div className={css.headerStats}>
          <div className={css.statItem}>
            <span className={css.statLabel}>Брендов:</span>
            <span className={css.statValue}>{allBrands.length}</span>
          </div>
          <div className={css.statItem}>
            <span className={css.statLabel}>Моделей:</span>
            <span className={css.statValue}>{allModels.length}</span>
          </div>
        </div>

        <div className={css.headerButtons}>
          <Modal title={'Создание бренда'} buttonText="Бренд">
            <CreateVehicleBrand />
          </Modal>

          <Modal title={'Создание модели'} buttonText={'Модель'}>
            <CreateVehicleModel />
          </Modal>
        </div>
      </div>

      <div className={css.tableWrapper}>
        <div className={css.tableHeader}>
          <div className={css.colName}>Бренд / Модель</div>
          <div className={css.colType}>Тип</div>
          <div className={css.colSequence}>Порядок</div>
          <div></div>
        </div>

        <table className={css.brandsTable}>
          <tbody>
            {allBrands.map((brand, brandIndex) => {
              const brandModels = allModels.filter((model) => model.brandId === brand.id)
              const isLastBrand = brandIndex === allBrands.length - 1 && brandModels.length === 0

              return (
                <React.Fragment key={brand.id}>
                  <tr className={`${css.brandRow} ${isLastBrand ? css.lastRow : ''}`}>
                    <td className={css.colName}>
                      <span className={css.label}>{brand.name}</span>
                    </td>

                    <td className={css.colType}>
                      <span className={css.statValue}>-</span>
                    </td>

                    <td className={css.colSequence}>
                      <span className={css.statValue}>{brand.sequence}</span>
                    </td>

                    <td onClick={stopPropagation}>
                      <Modal title={'Редактирование бренда'} buttonText={<Icon name={'edit'} />}>
                        <EditVehicleBrand
                          brandId={brand.id}
                          initialName={brand.name}
                          initialSequence={brand.sequence}
                          onSuccess={handleSuccess}
                        />
                      </Modal>
                    </td>
                  </tr>

                  {brandModels.map((model, modelIndex) => {
                    const isLastModel = brandIndex === allBrands.length - 1 && modelIndex === brandModels.length - 1

                    return (
                      <tr key={model.id} className={`${css.modelRow} ${isLastModel ? css.lastRow : ''}`}>
                        <td className={css.colName}>
                          <span className={css.leafLabel}>{model.name}</span>
                        </td>

                        <td className={css.colType}>
                          <span className={css.statValue}>{model.type}</span>
                        </td>

                        <td className={css.colSequence}>
                          <span className={css.statValue}>{model.sequence}</span>
                        </td>

                        <td onClick={stopPropagation}>
                          <Modal title={'Редактирование модели'} buttonText={<Icon name={'edit'} />}>
                            <EditVehicleModel
                              vehicleModelId={model.id}
                              initialName={model.name}
                              initialSequence={model.sequence}
                              initialType={model.type}
                              initialBrandId={model.brandId}
                              onSuccess={handleSuccess}
                            />
                          </Modal>
                        </td>
                      </tr>
                    )
                  })}
                </React.Fragment>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
