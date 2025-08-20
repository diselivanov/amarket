import React, { useState } from 'react';
import css from './index.module.scss';
import { Icon } from '../../../../components/Icon';

interface ModalProps {
  /** Контент модального окна */
  children: React.ReactNode;
  /** Текст или компонент на кнопке, открывающей модальное окно */
  buttonText?: string | React.ReactNode;
  /** Дополнительные классы для кнопки */
  buttonClassName?: string;
  /** Заголовок модального окна */
  title?: React.ReactNode;
  /** Функция, вызываемая при закрытии модального окна */
  onClose?: () => void;
  /** Функция, вызываемая при открытии модального окна */
  onOpen?: () => void;
}

export const Modal = ({
  children,
  buttonText = 'Открыть',
  buttonClassName = '',
  title,
  onClose,
  onOpen
}: ModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Проверяем, является ли buttonText иконкой
  const isIconButton = React.isValidElement(buttonText) && 
                      buttonText.type === Icon;

  const handleOpen = () => {
    setIsOpen(true);
    onOpen?.();
  };

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <>
      <button
        className={`${css.modalButton} ${isIconButton ? css.iconButton : ''} ${buttonClassName}`}
        onClick={handleOpen}
        type="button"
      >
        {buttonText}
      </button>

      {isOpen && (
        <div className={css.modalOverlay} onClick={handleBackdropClick}>
          <div className={css.modal}>
            <div className={css.modalHeader}>
              {title && <h2 className={css.modalTitle}>{title}</h2>}
              <button
                className={css.closeButton}
                onClick={handleClose}
                type="button"
                aria-label="Закрыть"
              >
                <Icon name={'delete'}/>
              </button>
            </div>
            <div className={css.modalContent}>
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  );
};