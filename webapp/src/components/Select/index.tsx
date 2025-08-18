import cn from 'classnames'
import { type FormikProps } from 'formik'
import { Icon } from '../Icon'
import css from './index.module.scss'

export const Select = ({
  name,
  label,
  formik,
  maxWidth,
  options = [],
}: {
  name: string
  label: string
  formik: FormikProps<any>
  maxWidth?: number | string
  options?: Array<{ value: number | string; label: string }>
}) => {
  const value = formik.values[name]
  const error = formik.errors[name] as string | undefined
  const touched = formik.touched[name]
  const invalid = !!touched && !!error
  const disabled = formik.isSubmitting

  return (
    <div className={cn({ [css.field]: true, [css.disabled]: disabled })}>
      <label className={css.label} htmlFor={name}>
        {label}
      </label>
      <select
        className={cn({
          [css.input]: true,
          [css.invalid]: invalid,
        })}
        style={{ maxWidth }}
        onChange={(e) => {
          void formik.setFieldValue(name, e.target.value)
        }}
        onBlur={() => {
          void formik.setFieldTouched(name)
        }}
        value={value}
        name={name}
        id={name}
        disabled={formik.isSubmitting}
      >
        <option value="">Выберите категорию</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {invalid && (
        <div className={css.error}>
          <Icon name="error" />
          {error}
        </div>
      )}
    </div>
  )
}