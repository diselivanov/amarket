import cn from 'classnames'
import { type FormikProps } from 'formik'
import css from './index.module.scss'
import { useState, useRef, useEffect } from 'react'
import { Icon } from '../../../../components/Icon'

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

  const [isOpen, setIsOpen] = useState(false)
  const selectRef = useRef<HTMLDivElement>(null)

  // Закрытие выпадающего списка при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const selectedOption = options.find((option) => option.value === value)

  const handleSelect = (optionValue: string | number) => {
    void formik.setFieldValue(name, optionValue)
    void formik.setFieldTouched(name)
    setIsOpen(false)
  }

  return (
    <div
      className={cn({
        [css.field]: true,
        [css.disabled]: disabled,
        [css.githubSelect]: true,
      })}
      ref={selectRef}
      style={{ maxWidth }}
    >
      <label className={css.label} htmlFor={name}>
        {label}
      </label>

      <div
        className={cn({
          [css.selectTrigger]: true,
          [css.invalid]: invalid,
          [css.open]: isOpen,
        })}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        id={name}
      >
        <span className={css.selectedValue}>{selectedOption ? selectedOption.label : 'Выберите категорию'}</span>
        <Icon name={isOpen ? 'arrowRight' : 'arrowDown'} className={css.arrowIcon} />
      </div>

      {isOpen && (
        <div className={css.dropdown}>
          {options.map((option) => (
            <div
              key={option.value}
              className={cn({
                [css.option]: true,
                [css.selected]: option.value === value,
              })}
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
              {option.value === value && <Icon name="success" className={css.checkIcon} />}
            </div>
          ))}
        </div>
      )}

      {invalid && (
        <div className={css.error}>
          <Icon name="error" />
          {error}
        </div>
      )}
    </div>
  )
}
