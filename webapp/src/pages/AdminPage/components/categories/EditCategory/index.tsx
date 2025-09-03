import { useForm } from '../../../../../lib/form'
import { trpc } from '../../../../../lib/trpc'
import { FormItems } from '../../../../../components/FormItems'
import { Button } from '../../../../../components/Button'
import { Alert } from '../../../../../components/Alert'
import { useEffect } from 'react'
import { Input } from '../../../../../components/Input'
import { zUpdateCategoryTrpcInput } from '@amarket/backend/src/router/admin/categories/updateCategory/input'

interface UpdateCategoryProps {
  categoryId: string
  initialName: string
  initialSlug: string
  initialSequence: string
  onSuccess?: () => void
}

export const EditCategory = ({
  categoryId,
  initialName,
  initialSlug,
  initialSequence,
  onSuccess,
}: UpdateCategoryProps) => {
  const UpdateCategory = trpc.updateCategory.useMutation()

  const { formik, alertProps, buttonProps } = useForm({
    initialValues: {
      id: categoryId,
      name: initialName,
      slug: initialSlug,
      sequence: initialSequence,
    },
    validationSchema: zUpdateCategoryTrpcInput,
    onSubmit: async (values) => {
      await UpdateCategory.mutateAsync({
        id: values.id,
        name: values.name,
        slug: values.slug,
        sequence: values.sequence,
      })
      onSuccess?.()
    },
    successMessage: 'Категория успешно обновлена',
  })

  useEffect(() => {
    formik.setValues({
      id: categoryId,
      name: initialName,
      slug: initialSlug,
      sequence: initialSequence,
    })
  }, [categoryId, initialName, initialSequence, formik.setValues])

  return (
    <form onSubmit={formik.handleSubmit}>
      <FormItems>
        <Input label="Название" name="name" type="text" formik={formik} />
        <Input label="Идентификатор" name="slug" type="text" formik={formik} />
        <Input label="Порядковый номер" name="sequence" type="text" formik={formik} />

        <Alert {...alertProps} />
        <Button {...buttonProps}>Сохранить</Button>
      </FormItems>
    </form>
  )
}
