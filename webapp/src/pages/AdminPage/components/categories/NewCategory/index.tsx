import { zCreateCategoryTrpcInput } from '@amarket/backend/src/router/admin/categories/createCategory/input'
import { useForm } from '../../../../../lib/form'
import { trpc } from '../../../../../lib/trpc'
import { FormItems } from '../../../../../components/FormItems'
import { Button } from '../../../../../components/Button'
import { Alert } from '../../../../../components/Alert'
import { Input } from '../../../../../components/Input'

interface NewCategoryProps {
  onSuccess?: () => void
}

export const NewCategory = ({ onSuccess }: NewCategoryProps) => {
  const createCategory = trpc.createCategory.useMutation()

  const { formik, alertProps, buttonProps } = useForm({
    initialValues: {
      name: '',
      slug: '',
      sequence: '',
    },
    validationSchema: zCreateCategoryTrpcInput,
    onSubmit: async (values) => {
      await createCategory.mutateAsync(values)
      onSuccess?.()
    },
    successMessage: 'Категория успешно создана',
  })

  return (
      <form onSubmit={formik.handleSubmit}>
        <FormItems>
          <Input label="Название" name="name"   formik={formik} />
          <Input label="Идентификатор" name="slug"   formik={formik} />
          <Input label="Порядковый номер" name="sequence"   formik={formik} />
          <Alert {...alertProps} />
          <Button {...buttonProps}>Создать</Button>
        </FormItems>
      </form>
  )
}