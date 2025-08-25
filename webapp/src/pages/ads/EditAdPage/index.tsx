import { zUpdateAdTrpcInput } from '@amarket/backend/src/router/ads/updateAd/input'
import { canEditAd } from '@amarket/backend/src/utils/can'
import { pick } from '@amarket/shared/src/pick'
import { useNavigate } from 'react-router-dom'
import { Alert } from '../../../components/Alert'
import { Button } from '../../../components/Button'
import { FormItems } from '../../../components/FormItems'
import { Input } from '../../../components/Input'
import { Textarea } from '../../../components/Textarea'
import { UploadsToCloudinary } from '../../../components/UploadsToCloudinary'
import { useForm } from '../../../lib/form'
import { withPageWrapper } from '../../../lib/pageWrapper'
import { getEditAdRoute, getViewAdRoute } from '../../../lib/routes'
import { trpc } from '../../../lib/trpc'
import { FormWrapper } from '../../../components/FormWrapper'
import { Select } from '../../../components/Select'
import { useEffect } from 'react'

export const EditAdPage = withPageWrapper({
  authorizedOnly: true,
  useQuery: () => {
    const { selectedAd } = getEditAdRoute.useParams()
    return trpc.getAd.useQuery({
      selectedAd,
    })
  },
  setProps: ({ queryResult, ctx, checkExists, checkAccess }) => {
    const ad = checkExists(queryResult.data.ad, 'Объявление не найдено')
    checkAccess(canEditAd(ctx.me, ad), 'Отказано в доступе')
    return {
      ad,
    }
  },
  title: () => `Редактирование объявления`,
})(({ ad }) => {
  const navigate = useNavigate()
  const updateAd = trpc.updateAd.useMutation()
  const { data: categoriesData } = trpc.getCategories.useQuery({})
  const { data: subcategoriesData } = trpc.getSubcategories.useQuery({})

  const { formik, buttonProps, alertProps } = useForm({
    initialValues: pick(ad, ['categoryId', 'subcategoryId', 'title', 'description', 'price', 'city', 'images']),
    validationSchema: zUpdateAdTrpcInput.omit({ adId: true }),
    onSubmit: async (values) => {
      await updateAd.mutateAsync({ adId: ad.id, ...values })
      navigate(getViewAdRoute({ selectedAd: ad.id }))
    },
    resetOnSuccess: false,
    showValidationAlert: true,
  })

  // Сбрасываем подкатегорию при изменении категории
  useEffect(() => {
    if (formik.values.categoryId && formik.values.categoryId !== ad.categoryId) {
      formik.setFieldValue('subcategoryId', '')
    }
  }, [formik.values.categoryId, ad.categoryId])

  // Фильтруем подкатегории по выбранной категории
  const filteredSubcategories = subcategoriesData?.subcategories?.filter(
    (sc) => sc.categoryId === formik.values.categoryId
  ) || []

  return (
    <FormWrapper type={'big'}>
      <form onSubmit={formik.handleSubmit}>
        <FormItems>
          <Select
            name="categoryId"
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
            name="subcategoryId"
            label="Подкатегория"
            formik={formik}
            options={
              filteredSubcategories.map((sc) => ({
                value: sc.id,
                label: sc.name,
              }))
            }
            disabled={!formik.values.categoryId}
          />
          <Input name="title" label="Название" formik={formik} />
          <Textarea name="description" label="Описание" formik={formik} />
          <Input name="price" label="Цена" formik={formik} />
          <Input name="city" label="Город" formik={formik} />

          <UploadsToCloudinary label="Images" name="images" type="image" preset="preview" formik={formik} />
          <Alert {...alertProps} />
          <Button {...buttonProps}>Сохранить</Button>
        </FormItems>
      </form>
    </FormWrapper>
  )
})