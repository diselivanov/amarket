import { useState } from 'react'
import { getCloudinaryUploadUrl } from '@amarket/shared/src/cloudinary'
import css from './index.module.scss'
import { getViewAdRoute } from '../../lib/routes'
import { Link } from 'react-router-dom'

interface AdCardProps {
  id: string
  title: string
  price: string
  city: string
  images: string[]
}

export const AdCard = ({ id, title, price, city, images }: AdCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [showDots, setShowDots] = useState(false)

  const minSwipeDistance = 50

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
    setShowDots(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    } else if (isRightSwipe) {
      setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (images.length <= 1) return

    const container = e.currentTarget
    const rect = container.getBoundingClientRect()
    const x = e.clientX - rect.left
    const containerWidth = rect.width
    const segmentWidth = containerWidth / images.length

    // Определяем индекс изображения на основе положения курсора
    const newIndex = Math.min(Math.floor(x / segmentWidth), images.length - 1)

    if (newIndex !== currentImageIndex) {
      setCurrentImageIndex(newIndex)
    }

    setShowDots(true)
  }

  const handleMouseLeave = () => {
    setCurrentImageIndex(0)
    setShowDots(false)
  }

  return (
    <Link className={css.card} to={getViewAdRoute({ selectedAd: id })}>
      <div
        className={css.imageContainer}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* {images.length > 0 && (
          <img
            src={getCloudinaryUploadUrl(images[currentImageIndex], 'image', 'large')}
            alt={title}
            className={css.mainImage}
          />
        )} */}
        <img
            src={"https://cdn1.youla.io/files/images/360_360/68/9e/689e219713d3c2dff804b5d6-2.jpg"}
            alt={title}
            className={css.mainImage}
          />
          
        {images.length > 1 && (showDots || touchStart !== null) && (
          <div className={css.dotsContainer}>
            {images.map((_, index) => (
              <div
                key={index}
                className={`${css.dot} ${index === currentImageIndex ? css.activeDot : ''}`}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setCurrentImageIndex(index)
                }}
              />
            ))}
          </div>
        )}
      </div>

      <div className={css.info}>
        <p className={css.title}>{title}</p>
        <p className={css.price}>{price} ₽</p>
        <p className={css.city}>{city}</p>
      </div>
    </Link>
  )
}
