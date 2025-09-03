import { useForm } from '../../../../../lib/form'
import { trpc } from '../../../../../lib/trpc'
import { FormItems } from '../../../../../components/FormItems'
import { Button } from '../../../../../components/Button'
import { Alert } from '../../../../../components/Alert'
import { Input } from '../../../../../components/Input'
import { Select } from '../../../../../components/Select'
import { zCreateVehicleModelTrpcInput } from '@amarket/backend/src/router/admin/vehicle/createVehicleModel/input'

export const CreateVehicleModel = () => {
  const createVehicleModel = trpc.createVehicleModel.useMutation()
  const { data: brandsData } = trpc.getVehicleBrands.useQuery({})

  const { formik, alertProps, buttonProps } = useForm({
    initialValues: {
      name: '',
      sequence: '',
      type: '',
      brandId: '',
    },
    validationSchema: zCreateVehicleModelTrpcInput,
    onSubmit: async (values) => {
      await createVehicleModel.mutateAsync(values)
    },
    successMessage: 'Модель транспортного средства успешно создана',
  })

  return (
    <form onSubmit={formik.handleSubmit}>
      <FormItems>
        <Input label="Название модели" name="name" type="text" formik={formik} />
        <Input label="Порядковый номер" name="sequence" type="text" formik={formik} />
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
            brandsData?.vehicleBrands?.map((brand) => ({
              value: brand.id,
              label: brand.name,
            })) || []
          }
        />
        <Alert {...alertProps} />
        <Button {...buttonProps}>Добавить модель</Button>
      </FormItems>
    </form>
  )
}
