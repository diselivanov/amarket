import { zCreateCategoryTrpcInput } from '@amarket/backend/src/router/admin/categories/createCategory/input'
import { useForm } from '../../../../../lib/form'
import { trpc } from '../../../../../lib/trpc'
import { FormItems } from '../../../../../components/FormItems'
import { Button } from '../../../../../components/Button'
import { Alert } from '../../../../../components/Alert'
import { Input } from '../../../../../components/Input'

interface CreateCategoryProps {
  onSuccess?: () => void
}

export const CreateCategory = ({ onSuccess }: CreateCategoryProps) => {
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
        <Input label="Название" name="name" type="text" formik={formik} />
        <Input label="Идентификатор" name="slug" type="text" formik={formik} />
        <Input label="Порядковый номер" name="sequence" type="text" formik={formik} />
        <Alert {...alertProps} />
        <Button {...buttonProps}>Создать</Button>
      </FormItems>
    </form>
  )
}
