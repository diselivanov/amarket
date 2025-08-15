import cn from 'classnames'
import { type FormikProps } from 'formik'
import { useState } from 'react'
import css from './index.module.scss'
import { LinkButton } from '../Button'
import { getNewAdRoute } from '../../lib/routes'
import { CategoryMap } from '../CategoryMap'
import { Icon } from '../Icon'

export const AdSearchSection = ({
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
  const [showFilters, setShowFilters] = useState(false)
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

  const toggleFilters = () => {
    setShowFilters(!showFilters)
  }

  return (
    <>
      <div className={cn(css.searchContainer)}>
        <CategoryMap />

        <div className={cn({ [css.field]: true, [css.disabled]: disabled })}>
          <div className={css.inputWrapper}>
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
              <button type="button" className={css.clearButton} onClick={handleClear} disabled={disabled}>
                <Icon name={'delete'} />
              </button>
            )}
            <button type="button" className={css.filterButton} onClick={toggleFilters} disabled={disabled}>
              <Icon name={'filter'} />
            </button>
          </div>

          <button className={css.searchButton} onClick={onSearch} disabled={isLoading}>
            <Icon name={'search'} />
          </button>
        </div>

        <LinkButton to={getNewAdRoute()}>Разместить объявление</LinkButton>
      </div>

      {showFilters && (
        <div className={css.filterContainer}>
          {/* Здесь можно разместить компоненты фильтров */}
          Фильтры будут здесь
        </div>
      )}
    </>
  )
}
