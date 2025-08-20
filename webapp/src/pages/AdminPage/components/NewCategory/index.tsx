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
      sequence: '',
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
          label="Название" 
          name="name" 
          type="text" 
          formik={formik} 
        />
        <Input 
          label="Порядковый номер" 
          name="sequence" 
          type="text" 
          formik={formik} 
        />
        <Alert {...alertProps} />
        <Button {...buttonProps}>Создать</Button>
      </FormItems>
    </form>
  )
}