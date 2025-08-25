import { zCreateAdTrpcInput } from '@amarket/backend/src/router/ads/createAd/input'
import { Alert } from '../../../components/Alert'
import { Button } from '../../../components/Button'
import { FormItems } from '../../../components/FormItems'
import { Input } from '../../../components/Input'
import { Textarea } from '../../../components/Textarea'
import { UploadsToCloudinary } from '../../../components/UploadsToCloudinary'
import { useForm } from '../../../lib/form'
import { withPageWrapper } from '../../../lib/pageWrapper'
import { trpc } from '../../../lib/trpc'
import { FormWrapper } from '../../../components/FormWrapper'
import { Select } from '../../../components/Select'
import { useEffect } from 'react'

export const NewAdPage = withPageWrapper({
  authorizedOnly: true,
  title: 'New Ad',
})(() => {
  const createAd = trpc.createAd.useMutation()
  const { data: categoriesData } = trpc.getCategories.useQuery({})
  const { data: subcategoriesData } = trpc.getSubcategories.useQuery({})

  const { formik, buttonProps, alertProps } = useForm({
    initialValues: {
      category: '',
      subcategory: '',
      title: '',
      description: '',
      price: '',
      city: '',
      images: [],
    },
    validationSchema: zCreateAdTrpcInput,
    onSubmit: async (values) => {
      await createAd.mutateAsync(values)
      formik.resetForm()
    },
    successMessage: 'Ad created!',
    showValidationAlert: true,
  })

  // Сбрасываем подкатегорию при изменении категории
  useEffect(() => {
    if (formik.values.category) {
      formik.setFieldValue('subcategory', '')
    }
  }, [formik.values.category])

  // Фильтруем подкатегории по выбранной категории
  const filteredSubcategories = subcategoriesData?.subcategories?.filter(
    (sc) => sc.categoryId === formik.values.category
  ) || []

  return (
    <FormWrapper type={'big'}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          formik.handleSubmit()
        }}
      >
        <FormItems>
          <Select
            name="category"
            label="Категория"
            formik={formik}
            options={
              categoriesData?.categories?.map((c) => ({
                value: c.id,
                label: c.name,
              })) || []
            }
          />
          <Select
            name="subcategory"
            label="Подкатегория"
            formik={formik}
            options={
              filteredSubcategories.map((sc) => ({
                value: sc.id,
                label: sc.name,
              }))
            }
            disabled={!formik.values.category}
          />
          <Input name="title" label="Название" formik={formik} />
          <Textarea name="description" label="Описание" formik={formik} />
          <Input name="price" label="Цена" formik={formik} />
          <Input name="city" label="Город" formik={formik} />

          <UploadsToCloudinary label="Images" name="images" type="image" preset="preview" formik={formik} />

          <Alert {...alertProps} />
          <Button {...buttonProps}>Разместить объявление</Button>
        </FormItems>
      </form>
    </FormWrapper>
  )
})