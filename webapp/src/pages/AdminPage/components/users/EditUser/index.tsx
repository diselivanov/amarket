import { useForm } from '../../../../../lib/form'
import { trpc } from '../../../../../lib/trpc'
import { FormItems } from '../../../../../components/FormItems'
import { Button } from '../../../../../components/Button'
import { Alert } from '../../../../../components/Alert'
import { Input } from '../../../../../components/Input'
import { Sidebar } from '../../../../../components/Sidebar'
import { zUpdateUserTrpcInput } from '@amarket/backend/src/router/admin/users/updateUser/input'
import { Icon } from '../../../../../components/Icon'
import { UploadToCloudinary } from '../../../../../components/UploadToCloudinary'

interface EditUserProps {
  userId: string
  initialName: string
  initialEmail: string
  initialDescription: string
  initialPhone: string
  initialAvatar: string
  initialBalance: string
  onSuccess?: () => void
}

export const EditUser = ({
  userId,
  initialName,
  initialEmail,
  initialDescription,
  initialPhone,
  initialAvatar,
  initialBalance,
  onSuccess,
}: EditUserProps) => {
  const updateUser = trpc.updateUser.useMutation()

  const { formik, alertProps, buttonProps } = useForm({
    initialValues: {
      id: userId,
      name: initialName,
      email: initialEmail,
      description: initialDescription,
      phone: initialPhone,
      avatar: initialAvatar,
      balance: initialBalance,
    },
    validationSchema: zUpdateUserTrpcInput,
    onSubmit: async (values) => {
      await updateUser.mutateAsync({
        id: values.id,
        name: values.name,
        email: values.email,
        description: values.description,
        phone: values.phone,
        avatar: values.avatar,
        balance: values.balance,
      })
      onSuccess?.()
    },
    successMessage: 'Пользователь успешно обновлен',
    resetOnSuccess: false,
  })

  return (
    <Sidebar title={'Редактирование пользователя'} buttonText={<Icon name={'settings'} size={16}/>}>
      <form onSubmit={formik.handleSubmit}>
        <FormItems>
          <UploadToCloudinary label="Фото" name="avatar" type="avatar" preset="big" formik={formik} />
          <Input label="Имя" name="name" formik={formik} />
          <Input label="Email" name="email" formik={formik} />
          <Input label="Описание" name="description" formik={formik} />
          <Input label="Телефон" name="phone" formik={formik} />
          <Input label="Баланс" name="balance" formik={formik} />

          <Alert {...alertProps} />
          <Button {...buttonProps}>Сохранить</Button>
        </FormItems>
      </form>
    </Sidebar>
  )
}