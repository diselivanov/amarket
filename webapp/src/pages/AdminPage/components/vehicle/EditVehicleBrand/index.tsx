import { useForm } from '../../../../../lib/form'
import { trpc } from '../../../../../lib/trpc'
import { FormItems } from '../../../../../components/FormItems'
import { Button } from '../../../../../components/Button'
import { Alert } from '../../../../../components/Alert'
import { useEffect } from 'react'
import { Input } from '../../../../../components/Input'
import { zUpdateVehicleBrandTrpcInput } from '@amarket/backend/src/router/admin/vehicle/updateVehicleBrand/input'

interface UpdateVehicleBrandProps {
  brandId: string
  initialName: string
  initialSequence: string
  onSuccess?: () => void
}

export const EditVehicleBrand = ({ brandId, initialName, initialSequence, onSuccess }: UpdateVehicleBrandProps) => {
  const updateVehicleBrand = trpc.updateVehicleBrand.useMutation()

  const { formik, alertProps, buttonProps } = useForm({
    initialValues: {
      id: brandId,
      name: initialName,
      sequence: initialSequence,
    },
    validationSchema: zUpdateVehicleBrandTrpcInput,
    onSubmit: async (values) => {
      await updateVehicleBrand.mutateAsync({
        id: values.id,
        name: values.name,
        sequence: values.sequence,
      })
      onSuccess?.()
    },
    successMessage: 'Бренд успешно обновлен',
  })

  useEffect(() => {
    formik.setValues({
      id: brandId,
      name: initialName,
      sequence: initialSequence,
    })
  }, [brandId, initialName, initialSequence, formik.setValues])

  return (
    <form onSubmit={formik.handleSubmit}>
      <FormItems>
        <Input label="Название бренда" name="name"   formik={formik} />
        <Input label="Порядковый номер" name="sequence"   formik={formik} />

        <Alert {...alertProps} />
        <Button {...buttonProps}>Сохранить</Button>
      </FormItems>
    </form>
  )
}
