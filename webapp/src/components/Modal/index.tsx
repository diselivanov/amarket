import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import css from './index.module.scss'
import { Icon } from '../../components/Icon'

interface ModalProps {
  children: React.ReactNode
  buttonText?: string | React.ReactNode
  buttonClassName?: string
  title?: React.ReactNode
  onClose?: () => void
  onOpen?: () => void
}

export const Modal = ({
  children,
  buttonText = 'Открыть',
  buttonClassName = '',
  title,
  onClose,
  onOpen,
}: ModalProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [modalContainer] = useState(() => document.createElement('div'))

  const isIconButton = React.isValidElement(buttonText) && buttonText.type === Icon
  const isTextButton = typeof buttonText === 'string'

  const handleOpen = () => {
    setIsOpen(true)
    onOpen?.()
    document.body.style.overflow = 'hidden'
    document.body.appendChild(modalContainer)
  }

  const handleClose = () => {
    setIsOpen(false)
    onClose?.()
    document.body.style.overflow = 'unset'
    if (document.body.contains(modalContainer)) {
      document.body.removeChild(modalContainer)
    }
  }

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen])

  useEffect(() => {
    return () => {
      if (document.body.contains(modalContainer)) {
        document.body.removeChild(modalContainer)
      }
    }
  }, [modalContainer])

  const modalContent = isOpen ? (
    <div className={css.modalOverlay}>
      <div className={css.modal}>
        <div className={css.modalHeader}>
          {title && <h2 className={css.modalTitle}>{title}</h2>}
          <button className={css.closeButton} onClick={handleClose} type="button" aria-label="Закрыть">
            <Icon name={'delete'} />
          </button>
        </div>
        <div className={css.modalContent}>{children}</div>
      </div>
    </div>
  ) : null

  return (
    <>
      <button
        className={`${css.modalButton} ${isIconButton ? css.iconButton : ''} ${buttonClassName}`}
        onClick={handleOpen}
        type="button"
      >
        {isTextButton ? (
          <>
            <Icon name={'add'} className={css.buttonIcon} />
            {buttonText}
          </>
        ) : (
          buttonText
        )}
      </button>

      {ReactDOM.createPortal(modalContent, modalContainer)}
    </>
  )
}
