import { type FormikHelpers, useFormik } from 'formik'
import { withZodSchema } from 'formik-validator-zod'
import { useMemo, useState, useEffect } from 'react'
import { type z } from 'zod'
import { type AlertProps } from '../components/Alert'
import { type ButtonProps } from '../components/Button'

export const useForm = <TZodSchema extends z.ZodTypeAny>({
  successMessage = false,
  resetOnSuccess = true,
  showValidationAlert = false,
  initialValues = {},
  validationSchema,
  onSubmit,
}: {
  successMessage?: string | false
  resetOnSuccess?: boolean
  showValidationAlert?: boolean
  initialValues?: z.infer<TZodSchema>
  validationSchema?: TZodSchema
  onSubmit?: (values: z.infer<TZodSchema>, actions: FormikHelpers<z.infer<TZodSchema>>) => Promise<any> | any
}) => {
  const [successMessageVisible, setSuccessMessageVisible] = useState(false)
  const [submittingError, setSubmittingError] = useState<Error | null>(null)
  const [validationErrorVisible, setValidationErrorVisible] = useState(false)

  const formik = useFormik<z.infer<TZodSchema>>({
    initialValues,
    ...(validationSchema && { validate: withZodSchema(validationSchema) }),
    onSubmit: async (values, formikHelpers) => {
      if (!onSubmit) {
        return
      }
      try {
        setSubmittingError(null)
        await onSubmit(values, formikHelpers)
        if (resetOnSuccess) {
          formik.resetForm()
        }
        setSuccessMessageVisible(true)
      } catch (error: any) {
        setSubmittingError(error)
      }
    },
  })

  // Эффект для скрытия успешного сообщения
  useEffect(() => {
    if (successMessageVisible) {
      const timer = setTimeout(() => {
        setSuccessMessageVisible(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [successMessageVisible])

  // Эффект для скрытия ошибки отправки
  useEffect(() => {
    if (submittingError) {
      const timer = setTimeout(() => {
        setSubmittingError(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [submittingError])

  // Эффект для скрытия ошибки валидации
  useEffect(() => {
    if (showValidationAlert && !formik.isValid && formik.submitCount > 0) {
      setValidationErrorVisible(true)
      const timer = setTimeout(() => {
        setValidationErrorVisible(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [formik.isValid, formik.submitCount, showValidationAlert])

  const alertProps = useMemo<AlertProps>(() => {
    if (submittingError) {
      return {
        hidden: false,
        children: submittingError.message,
        color: 'red',
      }
    }
    if (showValidationAlert && !formik.isValid && !!formik.submitCount && validationErrorVisible) {
      return {
        hidden: false,
        children: 'Some fields are invalid',
        color: 'red',
      }
    }
    if (successMessageVisible && successMessage) {
      return {
        hidden: false,
        children: successMessage,
        color: 'green',
      }
    }
    return {
      color: 'red',
      hidden: true,
      children: null,
    }
  }, [
    submittingError,
    formik.isValid,
    formik.submitCount,
    successMessageVisible,
    successMessage,
    showValidationAlert,
    validationErrorVisible,
  ])

  const buttonProps = useMemo<Omit<ButtonProps, 'children'>>(() => {
    return {
      loading: formik.isSubmitting,
    }
  }, [formik.isSubmitting])

  return {
    formik,
    alertProps,
    buttonProps,
  }
}
