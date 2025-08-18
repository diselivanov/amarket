import { zCreateCategoryTrpcInput } from "@amarket/backend/src/router/admin/createCategory/input"
import { useForm } from "../../../../lib/form"
import { trpc } from "../../../../lib/trpc"
import { FormItems } from "../../../../components/FormItems"
import { Input } from "../../../../components/Input"
import { Button } from "../../../../components/Button"
import { Alert } from "../../../../components/Alert"

export const CreateCategory = () => {
  const createCategory = trpc.createCategory.useMutation()
  
  const { formik, alertProps, buttonProps } = useForm({
    initialValues: {
      name: '',
      slug: '',
    },
    validationSchema: zCreateCategoryTrpcInput,
    onSubmit: async (values) => {
      await createCategory.mutateAsync(values)
    },
    successMessage: 'Категория успешно создана',
  })

  return (
    <form onSubmit={formik.handleSubmit}>
      <FormItems>
        <Input 
          label="Название категории" 
          name="name" 
          type="text" 
          formik={formik} 
        />
        <Input 
          label="Slug (уникальный идентификатор)" 
          name="slug" 
          type="text" 
          formik={formik} 
        />
        <Alert {...alertProps} />
        <Button {...buttonProps}>Создать категорию</Button>
      </FormItems>
    </form>
  )
}