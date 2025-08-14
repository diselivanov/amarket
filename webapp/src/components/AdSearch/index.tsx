import cn from 'classnames'
import { type FormikProps } from 'formik'
import { LuSearch } from 'react-icons/lu'
import css from './index.module.scss'
import { LinkButton } from '../Button'
import { getNewAdRoute } from '../../lib/routes'
import { CategoryMap } from '../CategoryMap'
import { Icon } from '../Icon'

export const AdSearch = ({
  name,
  label,
  formik,
  maxWidth,
  type = 'text',
  onSearch,
  isLoading,
}: {
  name: string
  label: string
  formik: FormikProps<any>
  maxWidth?: number | string
  type?: 'text'
  onSearch: () => void
  isLoading: boolean
}) => {
  const value = formik.values[name]
  const error = formik.errors[name] as string | undefined
  const touched = formik.touched[name]
  const invalid = !!touched && !!error
  const disabled = formik.isSubmitting

  const handleClear = () => {
    formik.setFieldValue(name, '')
    // Optionally trigger search after clearing
    // onSearch()
  }

  return (
    <div className={cn(css.searchContainer)}>
      <CategoryMap/>

      <div className={cn({ [css.field]: true, [css.disabled]: disabled })}>
        <div className={css.inputWrapper}>
          <LuSearch className={css.searchIcon} />
          <input
            className={cn({
              [css.input]: true,
              [css.invalid]: invalid,
            })}
            style={{ maxWidth }}
            type={type}
            onChange={(e) => {
              void formik.setFieldValue(name, e.target.value)
            }}
            onBlur={() => {
              void formik.setFieldTouched(name)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onSearch()
              }
            }}
            value={value}
            name={name}
            id={name}
            disabled={formik.isSubmitting}
            placeholder={label}
          />
          {value && (
            <button 
              type="button" 
              className={css.clearButton} 
              onClick={handleClear}
              disabled={disabled}
            >
              <Icon name={'delete'}/>
            </button>
          )}
        </div>

        <button className={css.searchButton} onClick={onSearch} disabled={isLoading}>
          Найти
        </button>
      </div>

      <LinkButton to={getNewAdRoute()}>
        Разместить объявление
      </LinkButton>
    </div>
  )
}