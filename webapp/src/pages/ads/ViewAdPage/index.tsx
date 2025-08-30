import type { TrpcRouterOutput } from '@amarket/backend/src/router'
import { canBlockAds, canEditAd } from '@amarket/backend/src/utils/can'
import { getAvatarUrl, getCloudinaryUploadUrl } from '@amarket/shared/src/cloudinary'
import format from 'date-fns/format'
import ImageGallery from 'react-image-gallery'
import { Alert } from '../../../components/Alert'
import { Button, LinkButton } from '../../../components/Button'
import { FormItems } from '../../../components/FormItems'
import { Icon } from '../../../components/Icon'
import { Segment } from '../../../components/Segment'
import { useForm } from '../../../lib/form'
import { withPageWrapper } from '../../../lib/pageWrapper'
import { getEditAdRoute, getViewAdRoute } from '../../../lib/routes'
import { trpc } from '../../../lib/trpc'
import css from './index.module.scss'

const LikeButton = ({ ad }: { ad: NonNullable<TrpcRouterOutput['getAd']['ad']> }) => {
  const trpcUtils = trpc.useContext()
  const setAdLike = trpc.setAdLike.useMutation({
    onMutate: ({ isLikedByMe }) => {
      const oldGetAdData = trpcUtils.getAd.getData({ selectedAd: ad.id })
      if (oldGetAdData?.ad) {
        const newGetAdData = {
          ...oldGetAdData,
          ad: {
            ...oldGetAdData.ad,
            isLikedByMe,
            likesCount: oldGetAdData.ad.likesCount + (isLikedByMe ? 1 : -1),
          },
        }
        trpcUtils.getAd.setData({ selectedAd: ad.id }, newGetAdData)
      }
    },
    onSuccess: () => {
      void trpcUtils.getAd.invalidate({ selectedAd: ad.id })
    },
  })
  return (
    <button
      className={css.likeButton}
      onClick={() => {
        void setAdLike.mutateAsync({ adId: ad.id, isLikedByMe: !ad.isLikedByMe })
      }}
    >
      <Icon size={32} className={css.likeIcon} name={ad.isLikedByMe ? 'likeFilled' : 'likeEmpty'} />
    </button>
  )
}

const BlockAd = ({ ad }: { ad: NonNullable<TrpcRouterOutput['getAd']['ad']> }) => {
  const blockAd = trpc.blockAd.useMutation()
  const trpcUtils = trpc.useContext()
  const { formik, alertProps, buttonProps } = useForm({
    onSubmit: async () => {
      await blockAd.mutateAsync({ adId: ad.id })
      await trpcUtils.getAd.refetch({ selectedAd: ad.id })
    },
  })
  return (
    <form onSubmit={formik.handleSubmit}>
      <FormItems>
        <Alert {...alertProps} />
        <Button color="red" {...buttonProps}>
          Бан
        </Button>
      </FormItems>
    </form>
  )
}

const DeleteAd = ({ ad }: { ad: NonNullable<TrpcRouterOutput['getAd']['ad']> }) => {
  const deleteAd = trpc.deleteAd.useMutation()
  const trpcUtils = trpc.useContext()
  const { formik, alertProps, buttonProps } = useForm({
    onSubmit: async () => {
      await deleteAd.mutateAsync({ adId: ad.id })
      await trpcUtils.getAd.refetch({ selectedAd: ad.id })
    },
  })
  return (
    <form onSubmit={formik.handleSubmit}>
      <FormItems>
        <Alert {...alertProps} />
        <Button color="red" {...buttonProps}>
          Удалить
        </Button>
      </FormItems>
    </form>
  )
}

const CarInfoSection = ({ ad }: { ad: NonNullable<TrpcRouterOutput['getAd']['ad']> }) => {
  // Проверяем, является ли объявление автомобильным
  const isCarAd = ad.subcategory.name === "Легковые автомобили"
  
  const { data: carInfoData, isLoading } = trpc.getCarInfo.useQuery(
    { adId: ad.id },
    {
      enabled: isCarAd, // Запрос выполняется только для автомобилей
    }
  )

  if (!isCarAd) {
    return null // Не показываем секцию для не-автомобильных объявлений
  }

  if (isLoading) {
    return <div>Загрузка информации об автомобиле...</div>
  }

  if (!carInfoData?.carInfo) {
    return null
  }

  const { carInfo } = carInfoData

  return (
    <div className={css.carInfo}>
      <h3>Информация об автомобиле</h3>
      <div className={css.carInfoGrid}>
        <div className={css.carInfoItem}>
          <strong>Марка:</strong> {carInfo.brand}
        </div>
        <div className={css.carInfoItem}>
          <strong>Год выпуска:</strong> {carInfo.year}
        </div>
        <div className={css.carInfoItem}>
          <strong>Руль:</strong> {carInfo.steering}
        </div>
        <div className={css.carInfoItem}>
          <strong>Кузов:</strong> {carInfo.bodyType}
        </div>
        <div className={css.carInfoItem}>
          <strong>Мощность:</strong> {carInfo.power}
        </div>
        <div className={css.carInfoItem}>
          <strong>Тип двигателя:</strong> {carInfo.engineType}
        </div>
        <div className={css.carInfoItem}>
          <strong>Коробка передач:</strong> {carInfo.transmission}
        </div>
        <div className={css.carInfoItem}>
          <strong>Привод:</strong> {carInfo.driveType}
        </div>
        <div className={css.carInfoItem}>
          <strong>Пробег:</strong> {carInfo.mileage} км
        </div>
        <div className={css.carInfoItem}>
          <strong>Состояние:</strong> {carInfo.condition}
        </div>
      </div>
    </div>
  )
}

export const ViewAdPage = withPageWrapper({
  useQuery: () => {
    const { selectedAd } = getViewAdRoute.useParams()
    return trpc.getAd.useQuery({
      selectedAd,
    })
  },
  setProps: ({ queryResult, checkExists, ctx }) => ({
    ad: checkExists(queryResult.data.ad, 'Ad not found'),
    me: ctx.me,
  }),
  showLoaderOnFetching: false,
  title: ({ ad }) => ad.title,
})(({ ad, me }) => {

  return (
    <Segment title={undefined}>
      <div>Категория: {ad.category.name}</div>
      <div>Подкатегория: {ad.subcategory.name}</div>
      <div>Название: {ad.title}</div>
      <div>Цена: {ad.price}</div>
      <div>Дата: {format(ad.createdAt, 'yyyy-MM-dd')}</div>
      
      <div className={css.author}>
        <img className={css.avatar} alt="" src={getAvatarUrl(ad.author.avatar, 'small')} />
        <div className={css.name}>
          <p>{ad.author.name}</p>
          <p>{ad.author.phone}</p>
        </div>
      </div>
      
      {!!ad.images.length && (
        <div className={css.gallery}>
          <ImageGallery
            showPlayButton={false}
            showFullscreenButton={false}
            items={ad.images.map((image) => ({
              original: getCloudinaryUploadUrl(image, 'image', 'large'),
              thumbnail: getCloudinaryUploadUrl(image, 'image', 'preview'),
            }))}
          />
        </div>
      )}

      <CarInfoSection ad={ad} />

      <div className={css.likes}>
        Likes: {ad.likesCount}
        {me && (
          <>
            <br />
            <LikeButton ad={ad} />
          </>
        )}
      </div>
      
      {canEditAd(me, ad) && (
        <div>
          <LinkButton to={getEditAdRoute({ selectedAd: ad.id })}>Редактировать</LinkButton>
          <DeleteAd ad={ad} />
        </div>
      )}
      
      {canBlockAds(me) && (
        <div>
          <BlockAd ad={ad} />
        </div>
      )}
    </Segment>
  )
})