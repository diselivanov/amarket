import { zCreateSubcategoryTrpcInput } from '@amarket/backend/src/router/admin/categories/createSubcategory/input'
import { useForm } from '../../../../../lib/form'
import { trpc } from '../../../../../lib/trpc'
import { FormItems } from '../../../../../components/FormItems'
import { Button } from '../../../../../components/Button'
import { Alert } from '../../../../../components/Alert'
import { Input } from '../../../../../components/Input'
import { Select } from '../../../../../components/Select'

interface CreateSubcategoryProps {
  onSuccess?: () => void
}

export const CreateSubcategory = ({ onSuccess }: CreateSubcategoryProps) => {
  const createSubcategory = trpc.createSubcategory.useMutation()
  const { data } = trpc.getCategories.useQuery({})

  const { formik, alertProps, buttonProps } = useForm({
    initialValues: {
      name: '',
      slug: '',
      sequence: '',
      categoryId: '',
    },
    validationSchema: zCreateSubcategoryTrpcInput,
    onSubmit: async (values) => {
      await createSubcategory.mutateAsync(values)
      onSuccess?.()
    },
    successMessage: 'Подкатегория успешно создана',
  })

  return (
    <form onSubmit={formik.handleSubmit}>
      <FormItems>
        <Input label="Название" name="name" type="text" formik={formik} />
        <Input label="Идентификатор" name="slug" type="text" formik={formik} />
        <Input label="Порядковый номер" name="sequence" type="text" formik={formik} />
        <Select
          label="Категория"
          name="categoryId"
          formik={formik}
          options={
            data?.categories?.map((c) => ({
              value: c.id,
              label: c.name,
            })) || []
          }
        />
        <Alert {...alertProps} />
        <Button {...buttonProps}>Создать</Button>
      </FormItems>
    </form>
  )
}
