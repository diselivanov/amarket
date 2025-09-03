import { useForm } from '../../../../../lib/form'
import { trpc } from '../../../../../lib/trpc'
import { FormItems } from '../../../../../components/FormItems'
import { Button } from '../../../../../components/Button'
import { Alert } from '../../../../../components/Alert'
import { Input } from '../../../../../components/Input'
import { zCreateVehicleBrandTrpcInput } from '@amarket/backend/src/router/admin/vehicle/createVehicleBrand/input'

export const CreateVehicleBrand = () => {
  const createVehicleBrand = trpc.createVehicleBrand.useMutation()

  const { formik, alertProps, buttonProps } = useForm({
    initialValues: {
      name: '',
      sequence: '',
    },
    validationSchema: zCreateVehicleBrandTrpcInput,
    onSubmit: async (values) => {
      await createVehicleBrand.mutateAsync(values)
    },
    successMessage: 'Бренд транспортного средства успешно создан',
  })

  return (
    <form onSubmit={formik.handleSubmit}>
      <FormItems>
        <Input label="Название бренда" name="name" type="text" formik={formik} />
        <Input label="Порядковый номер" name="sequence" type="text" formik={formik} />
        <Alert {...alertProps} />
        <Button {...buttonProps}>Добавить бренд</Button>
      </FormItems>
    </form>
  )
}
