import cn from 'classnames'
import { type FormikProps } from 'formik'
import { Link } from 'react-router-dom'
import css from './index.module.scss'
import { Button, LinkButton } from '../Button'
import { getNewAdRoute, getAllAdsRoute } from '../../lib/routes'
import { CategoryMap } from '../CategoryMap'
import { Icon } from '../Icon'
import { ReactComponent as Logo } from '../../assets/images/logo.svg'
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
  const value = formik?.values[name || ''] || ''
  const error = formik?.errors[name || ''] as string | undefined
  const touched = formik?.touched[name || '']
  const invalid = !!touched && !!error
  const disabled = formik?.isSubmitting || false

  const handleClear = () => {
    if (formik && name) {
      formik.setFieldValue(name, '')
    }
  }

  return (
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
            </div>

            <Button onClick={onSearch} disabled={isLoading}>
              Найти
            </Button>
          </div>
        )}

        <div className={css.menuActions}>
          <LinkButton to={getNewAdRoute()}>Разместить объявление</LinkButton>
          <ProfileButton />
        </div>
      </div>
    </div>
  )
}