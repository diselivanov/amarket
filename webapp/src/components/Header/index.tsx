import cn from 'classnames'
import { type FormikProps } from 'formik'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import css from './index.module.scss'
import { Button, LinkButton } from '../Button'
import { getNewAdRoute, getAllAdsRoute, getSignInRoute } from '../../lib/routes'
import { CategoryMap } from '../CategoryMap'
import { Icon } from '../Icon'
import { ReactComponent as Logo } from '../../assets/images/logo.svg'
import { useMe } from '../../lib/ctx'
import { ProfileButton } from '../ProfileButton'

export const Header = ({
  name,
  label,
  formik,
  maxWidth,
  type = 'text',
  onSearch,
  isLoading,
  showSearch = false,
  showCategories = false,
}: {
  name?: string
  label?: string
  formik?: FormikProps<any>
  maxWidth?: number | string
  type?: 'text'
  onSearch?: () => void
  isLoading?: boolean
  showSearch?: boolean
  showCategories?: boolean
}) => {
  const [showFilters, setShowFilters] = useState(false)
  const value = formik?.values[name || ''] || ''
  const error = formik?.errors[name || ''] as string | undefined
  const touched = formik?.touched[name || '']
  const invalid = !!touched && !!error
  const disabled = formik?.isSubmitting || false
  const me = useMe()

  const handleClear = () => {
    if (formik && name) {
      formik.setFieldValue(name, '')
    }
  }

  const toggleFilters = () => {
    setShowFilters(!showFilters)
  }

  return (
    <>
      <div className={cn(css.searchContainer)}>
        <div className={css.headerContent}>
          <Link className={css.logoLink} to={getAllAdsRoute()}>
            <Logo className={css.logo} />
          </Link>

          {showCategories && <CategoryMap />}

          {showSearch && (
            <div className={cn({ [css.field]: true, [css.disabled]: disabled })}>
              <div className={css.inputWrapper}>
                <Icon name={'search'} />
                
                <input
                  className={cn({
                    [css.input]: true,
                    [css.invalid]: invalid,
                  })}
                  style={{ maxWidth }}
                  type={type}
                  onChange={(e) => {
                    if (formik && name) {
                      void formik.setFieldValue(name, e.target.value)
                    }
                  }}
                  onBlur={() => {
                    if (formik && name) {
                      void formik.setFieldTouched(name)
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && onSearch) {
                      onSearch()
                    }
                  }}
                  value={value}
                  name={name}
                  id={name}
                  disabled={disabled}
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

              <Button onClick={onSearch} disabled={isLoading}>
                Найти
              </Button>
            </div>
          )}

          <div className={css.menuActions}>
            <LinkButton to={getNewAdRoute()}>Разместить объявление</LinkButton>
            {me ? <ProfileButton /> : <Link className={css.link} to={getSignInRoute()}>Войти</Link>}
          </div>
        </div>

        {showFilters && (
          <div className={css.filterContainer}>
            {/* Здесь можно разместить компоненты фильтров */}
            Фильтры будут здесь
          </div>
        )}
      </div>
    </>
  )
}