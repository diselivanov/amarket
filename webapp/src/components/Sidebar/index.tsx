import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import css from './index.module.scss'
import { Icon } from '../Icon'

interface SidebarProps {
  children: React.ReactNode
  buttonText?: string | React.ReactNode
  title?: React.ReactNode
  onClose?: () => void
  onOpen?: () => void
}

export const Sidebar = ({
  children,
  buttonText,
  title,
  onClose,
  onOpen,
}: SidebarProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [sidebarContainer] = useState(() => document.createElement('div'))

  const isIconButton = React.isValidElement(buttonText) && buttonText.type === Icon

  const handleOpen = () => {
    setIsOpen(true)
    setIsClosing(false)
    onOpen?.()
    document.body.style.overflow = 'hidden'
    document.body.appendChild(sidebarContainer)
  }

  const handleClose = () => {
    if (!isOpen && !isClosing) return
    
    setIsClosing(true)
    // Ждем завершения анимации перед фактическим закрытием
    setTimeout(() => {
      setIsOpen(false)
      setIsClosing(false)
      onClose?.()
      document.body.style.overflow = 'unset'
      if (document.body.contains(sidebarContainer)) {
        document.body.removeChild(sidebarContainer)
      }
    }, 200) // Должно совпадать с длительностью анимации в CSS
  }

  useEffect(() => {
    return () => {
      if (document.body.contains(sidebarContainer)) {
        document.body.removeChild(sidebarContainer)
      }
    }
  }, [sidebarContainer])

  const sidebarContent = (isOpen || isClosing) ? (
    <div 
      className={`${css.sidebarOverlay} ${isClosing ? css.closing : ''}`} 
      onClick={handleClose}
    >
      <div 
        className={`${css.sidebar} ${isClosing ? css.closing : ''}`} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className={css.sidebarHeader}>
          {title && <h2 className={css.sidebarTitle}>{title}</h2>}
          <button 
            className={css.closeButton} 
            onClick={handleClose} 
            type="button" 
            aria-label="Закрыть"
          >
            <Icon name={'delete'} size={18}/>
          </button>
        </div>
        <div className={css.sidebarContent}>{children}</div>
      </div>
    </div>
  ) : null

  return (
    <>
      <button
        className={`${css.sidebarButton} ${isIconButton ? css.iconButton : ''}`}
        onClick={handleOpen}
        type="button"
      >
        {buttonText}
      </button>

      {ReactDOM.createPortal(sidebarContent, sidebarContainer)}
    </>
  )
}