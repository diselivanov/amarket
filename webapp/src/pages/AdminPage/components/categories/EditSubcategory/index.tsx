import { useForm } from '../../../../../lib/form'
import { trpc } from '../../../../../lib/trpc'
import { FormItems } from '../../../../../components/FormItems'
import { Button } from '../../../../../components/Button'
import { Alert } from '../../../../../components/Alert'
import { useEffect } from 'react'
import { Input } from '../../../../../components/Input'
import { Select } from '../../../../../components/Select'
import { zUpdateSubcategoryTrpcInput } from '@amarket/backend/src/router/admin/categories/updateSubcategory/input'

interface EditSubcategoryProps {
  subcategoryId: string
  initialName: string
  initialSequence: string
  initialCategoryId: string
  onSuccess?: () => void
}

export const EditSubcategory = ({
  subcategoryId,
  initialName,
  initialSequence,
  initialCategoryId,
  onSuccess,
}: EditSubcategoryProps) => {
  const updateSubcategory = trpc.updateSubcategory.useMutation()
  const { data } = trpc.getCategories.useQuery({})

  const { formik, alertProps, buttonProps } = useForm({
    initialValues: {
      id: subcategoryId,
      name: initialName,
      sequence: initialSequence,
      categoryId: initialCategoryId,
    },
    validationSchema: zUpdateSubcategoryTrpcInput,
    onSubmit: async (values) => {
      await updateSubcategory.mutateAsync({
        id: values.id,
        name: values.name,
        sequence: values.sequence,
        categoryId: values.categoryId,
      })
      onSuccess?.()
    },
    successMessage: 'Подкатегория успешно обновлена',
  })

  // Обновляем форму при изменении начальных значений
  useEffect(() => {
    formik.setValues({
      id: subcategoryId,
      name: initialName,
      sequence: initialSequence,
      categoryId: initialCategoryId,
    })
  }, [subcategoryId, initialName, initialSequence, initialCategoryId, formik.setValues])

  return (
    <form onSubmit={formik.handleSubmit}>
      <FormItems>
        <Input label="Название" name="name" type="text" formik={formik} />
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
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button {...buttonProps}>Сохранить</Button>
        </div>
      </FormItems>
    </form>
  )
}
