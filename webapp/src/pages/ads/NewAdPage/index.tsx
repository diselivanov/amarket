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
import { HintCreateAd } from '../../../components/HintCreateAd'

export const NewAdPage = withPageWrapper({
  authorizedOnly: true,
  title: 'New Ad',
})(() => {
  const createAd = trpc.createAd.useMutation()
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

  return (
    <FormWrapper type={'big'}>
      <HintCreateAd />

      <form
        onSubmit={(e) => {
          e.preventDefault()
          formik.handleSubmit()
        }}
      >
        <FormItems>
          <Input name="category" label="Категория" formik={formik} />
          <Input name="subcategory" label="Подкатегория" formik={formik} />
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
