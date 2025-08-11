import { zSignUpTrpcInput } from '@amarket/backend/src/router/auth/signUp/input'
import { zPasswordsMustBeTheSame, zStringRequired } from '@amarket/shared/src/zod'
import Cookies from 'js-cookie'
import { Alert } from '../../../components/Alert'
import { Button } from '../../../components/Button'
import { FormItems } from '../../../components/FormItems'
import { Input } from '../../../components/Input'
import { Segment } from '../../../components/Segment'
import { useForm } from '../../../lib/form'
import { withPageWrapper } from '../../../lib/pageWrapper'
import { trpc } from '../../../lib/trpc'
import { FormWrapper } from '../../../components/FormWrapper'

export const SignUpPage = withPageWrapper({
  redirectAuthorized: true,
  title: 'Sign Up',
})(() => {
  const trpcUtils = trpc.useContext()
  const signUp = trpc.signUp.useMutation()
  const { formik, buttonProps, alertProps } = useForm({
    initialValues: {
      name: '',
      email: '',
      password: '',
      passwordAgain: '',
    },
    validationSchema: zSignUpTrpcInput
      .extend({
        passwordAgain: zStringRequired,
      })
      .superRefine(zPasswordsMustBeTheSame('password', 'passwordAgain')),
    onSubmit: async (values) => {
      const { token } = await signUp.mutateAsync(values)
      Cookies.set('token', token, { expires: 99999 })
      void trpcUtils.invalidate()
    },
    resetOnSuccess: false,
  })

  return (
    <FormWrapper type={'small'}>
      <form onSubmit={formik.handleSubmit}>
        <FormItems>
          <Input label="Имя пользователя" name="name" formik={formik} />
          <Input label="Почта" name="email" formik={formik} />
          <Input label="Пароль" name="password" type="password" formik={formik} />
          <Input label="Пароль ещё раз" name="passwordAgain" type="password" formik={formik} />
          <Alert {...alertProps} />
          <Button {...buttonProps}>Создать аккаунт</Button>
        </FormItems>
      </form>
    </FormWrapper>
  )
})
