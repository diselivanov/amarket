import { omit } from '@amarket/shared/src/omit'
import { ExpectedError } from '../../../lib/error'
import { trpcLoggedProcedure } from '../../../lib/trpc'
import { zGetAdTrpcInput } from './input'

export const getAdTrpcRoute = trpcLoggedProcedure.input(zGetAdTrpcInput).query(async ({ ctx, input }) => {
  const rawAd = await ctx.prisma.ad.findUnique({
    where: {
      id: input.selectedAd,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          phone: true,
          avatar: true,
        },
      },
      category: true,
      subcategory: true,
      adsLikes: {
        select: {
          id: true,
        },
        where: {
          userId: ctx.me?.id,
        },
      },
      _count: {
        select: {
          adsLikes: true,
        },
      },
    },
  })

  if (rawAd?.blockedAt) {
    throw new ExpectedError('Объявление заблокировано')
  }

  if (rawAd?.deletedAt) {
    throw new ExpectedError('Объявление удалено')
  }

  const isLikedByMe = !!rawAd?.adsLikes.length
  const likesCount = rawAd?._count.adsLikes || 0
  const ad = rawAd && { ...omit(rawAd, ['adsLikes', '_count']), isLikedByMe, likesCount }

  return { ad }
})