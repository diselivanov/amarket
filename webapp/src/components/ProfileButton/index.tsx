import { getAvatarUrl } from '@amarket/shared/src/cloudinary'
import { useMe } from '../../lib/ctx'
import { Link } from 'react-router-dom'
import { getProfileRoute, getSignInRoute } from '../../lib/routes'
import css from './index.module.scss'
import { Icon } from '../Icon'
import { useState, useRef } from 'react'

export const ProfileButton = () => {
  const me = useMe()
  const [isBalanceTooltipOpen, setIsBalanceTooltipOpen] = useState(false)
  const tooltipRef = useRef<HTMLDivElement>(null)

  const handleBalanceClick = () => {
    setIsBalanceTooltipOpen(!isBalanceTooltipOpen)
  }

  const handleOpenChat = () => {
    // Логика открытия чата
    console.log('Открыть чат')
    setIsBalanceTooltipOpen(false)
  }

  return (
    <div className={css.wrapper}>
      {me ? (
        <div className={css.profileContainer}>
          <div className={css.balanceContainer}>
            <div className={css.balance} onClick={handleBalanceClick}>
              <Icon name={'wallet'} size={18} className={css.balanceIcon} />
              <span className={css.balanceValue}>
                {me.balance} ₽
              </span>
            </div>

            {isBalanceTooltipOpen && (
              <div className={css.tooltip} ref={tooltipRef}>
                <div className={css.tooltipHeader}>
                  <h3 className={css.tooltipTitle}>Пополнение баланса</h3>
                  <button 
                    className={css.tooltipClose} 
                    onClick={() => setIsBalanceTooltipOpen(false)}
                  >
                    <Icon name={'delete'} size={18}/>
                  </button>
                </div>
                <div className={css.tooltipContent}>
                  <p className={css.tooltipText}>
                    Для пополнения баланса напишите в Telegram @amarket
                  </p>
                  <button className={css.chatButton} onClick={handleOpenChat}>
                    Открыть чат
                  </button>
                </div>
              </div>
            )}
          </div>

          <Link className={css.profileLink} to={getProfileRoute()}>
            <img 
              className={css.avatar} 
              alt="Фото профиля" 
              src={getAvatarUrl(me.avatar, 'small')} 
            />
          </Link>
        </div>
      ) : (
        <Link className={css.signInLink} to={getSignInRoute()}>
          Войти
        </Link>
      )}
    </div>
  )
}