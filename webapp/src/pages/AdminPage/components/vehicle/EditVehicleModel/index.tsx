import { useForm } from '../../../../../lib/form'
import { trpc } from '../../../../../lib/trpc'
import { FormItems } from '../../../../../components/FormItems'
import { Button } from '../../../../../components/Button'
import { Alert } from '../../../../../components/Alert'
import { useEffect } from 'react'
import { Input } from '../../../../../components/Input'
import { Select } from '../../../../../components/Select'
import { zUpdateVehicleModelTrpcInput } from '@amarket/backend/src/router/admin/vehicle/updateVehicleModel/input'

interface EditVehicleModelProps {
  vehicleModelId: string
  initialName: string
  initialSequence: string
  initialType: string
  initialBrandId: string
  onSuccess?: () => void
}

export const EditVehicleModel = ({
  vehicleModelId,
  initialName,
  initialSequence,
  initialType,
  initialBrandId,
  onSuccess,
}: EditVehicleModelProps) => {
  const updateVehicleModel = trpc.updateVehicleModel.useMutation()
  const { data: brandsData } = trpc.getVehicleBrands.useQuery({})

  const { formik, alertProps, buttonProps } = useForm({
    initialValues: {
      id: vehicleModelId,
      name: initialName,
      sequence: initialSequence,
      type: initialType,
      brandId: initialBrandId,
    },
    validationSchema: zUpdateVehicleModelTrpcInput,
    onSubmit: async (values) => {
      await updateVehicleModel.mutateAsync({
        id: values.id,
        name: values.name,
        sequence: values.sequence,
        type: values.type,
        brandId: values.brandId,
      })
      onSuccess?.()
    },
    successMessage: 'Модель транспортного средства успешно обновлена',
  })

  // Обновляем форму при изменении начальных значений
  useEffect(() => {
    formik.setValues({
      id: vehicleModelId,
      name: initialName,
      sequence: initialSequence,
      type: initialType,
      brandId: initialBrandId,
    })
  }, [vehicleModelId, initialName, initialSequence, initialType, initialBrandId, formik.setValues])

  return (
    <form onSubmit={formik.handleSubmit}>
      <FormItems>
        <Input label="Название" name="name"   formik={formik} />
        <Input label="Порядковый номер" name="sequence"   formik={formik} />

        <Select
          name="type"
          label="Тип"
          formik={formik}
          options={[
            { value: 'cars', label: 'Легковые автомобили' },
            { value: 'motorcycles', label: 'Мотоциклы и мототехника' },
            { value: 'trucks', label: 'Грузовики и спецтехника' },
            { value: 'watercraft', label: 'Водный транспорт' },
          ]}
        />

        <Select
          label="Бренд"
          name="brandId"
          formik={formik}
          options={
            brandsData?.vehicleBrands?.map((b) => ({
              value: b.id,
              label: b.name,
            })) || []
          }
        />

        <Alert {...alertProps} />
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button {...buttonProps}>Сохранить</Button>
        </div>
      </FormItems>
    </form>
  )
}
