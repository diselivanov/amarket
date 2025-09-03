import { z } from 'zod'

export const zEnvNonemptyTrimmed = z.string().trim().min(1)

export const zEnvNonemptyTrimmedRequiredOnNotLocal = zEnvNonemptyTrimmed.optional().refine(
  // eslint-disable-next-line node/no-process-env
  (val) => `${process.env.HOST_ENV}` === 'local' || !!val,
  'Required on not local host'
)

export const zEnvHost = z.enum(['local', 'production'])

export const zStringRequired = z.string({ required_error: 'Заполните поле' }).min(1, 'Заполните поле')

export const zStringOptional = z.string().optional()

export const zEmailRequired = zStringRequired.email()

export const zNumberRequired = z
  .string({ required_error: 'Заполните поле' })
  .min(1, 'Заполните поле')
  .regex(/^\d+$/, 'Только числа')
  .refine(
    (val) => {
      const num = Number(val)
      return num >= 0
    },
    { message: 'Значение не может быть отрицательным' }
  )

export const zStringMin = (min: number) =>
  zStringRequired.min(min, `Длина текста должна составлять не менее ${min} символов`)

export const zPasswordsMustBeTheSame =
  (passwordFieldName: string, passwordAgainFieldName: string) => (val: any, ctx: z.RefinementCtx) => {
    if (val[passwordFieldName] !== val[passwordAgainFieldName]) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Пароли должны быть одинаковыми',
        path: [passwordAgainFieldName],
      })
    }
  }

export const zPriceRequired = z
  .string({ required_error: 'Заполните поле' })
  .min(1, 'Заполните поле')
  .regex(/^\d+$/, 'Только числа')
  .refine(
    (val) => {
      const num = Number(val)
      return num >= 0 && num <= 1000000000
    },
    { message: 'Введите число от 1 до 1 000 000 000' }
  )

export const zReleaseYearRequired = z
  .string({ required_error: 'Заполните поле' })
  .min(1, 'Заполните поле')
  .regex(/^\d+$/, 'Только числа')
  .refine(
    (val) => {
      const num = Number(val)
      return num >= 1900 && num <= 2026
    },
    { message: 'Введите число от 1900 до 2026' }
  )

export const zPowerRequired = z
  .string({ required_error: 'Заполните поле' })
  .min(1, 'Заполните поле')
  .regex(/^\d+$/, 'Только числа')
  .refine(
    (val) => {
      const num = Number(val)
      return num >= 10 && num <= 1600
    },
    { message: 'Введите число от 10 до 1600' }
  )

export const zMileageRequired = z
  .string({ required_error: 'Заполните поле' })
  .min(1, 'Заполните поле')
  .regex(/^\d+$/, 'Только числа')
  .refine(
    (val) => {
      const num = Number(val)
      return num >= 1 && num <= 1000000
    },
    { message: 'Введите число от 1 до 1 000 000' }
  )
