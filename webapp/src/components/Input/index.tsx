import cn from 'classnames'
import { type FormikProps } from 'formik'
import { Icon } from '../Icon'
import css from './index.module.scss'

export const Input = ({
  name,
  label,
  formik,
  maxWidth,
  type = 'text',
}: {
  name: string
  label: string
  formik: FormikProps<any>
  maxWidth?: number | string
  type?: 'text' | 'password' | 'number'
}) => {
  const value = formik.values[name]
  const error = formik.errors[name] as string | undefined
  const touched = formik.touched[name]
  const invalid = !!touched && !!error
  const disabled = formik.isSubmitting

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (type === 'number') {
      const numValue = e.target.value === '' ? '' : Number(e.target.value)
      void formik.setFieldValue(name, numValue)
    } else {
      void formik.setFieldValue(name, e.target.value)
    }
  }

  return (
    <div className={cn({ [css.field]: true, [css.disabled]: disabled })}>
      <label className={css.label} htmlFor={name}>
        {label}
      </label>
      <input
        className={cn({
          [css.input]: true,
          [css.invalid]: invalid,
        })}
        style={{ maxWidth }}
        type={type}
        onChange={handleChange}
        onBlur={() => {
          void formik.setFieldTouched(name)
        }}
        value={value}
        name={name}
        id={name}
        disabled={formik.isSubmitting}
      />
      {invalid && (
        <div className={css.error}>
          <Icon name="error" />
          {error}
        </div>
      )}
    </div>
  )
}