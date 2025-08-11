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
})(({ ad, me }) => (
  <Segment title={ad.title}>
    <div className={css.createdAt}>Created At: {format(ad.createdAt, 'yyyy-MM-dd')}</div>
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
      <div className={css.editButton}>
        <LinkButton to={getEditAdRoute({ selectedAd: ad.id })}>Редактировать</LinkButton>
      </div>
    )}
    {canBlockAds(me) && (
      <div className={css.blockAd}>
        <BlockAd ad={ad} />
      </div>
    )}
  </Segment>
))
