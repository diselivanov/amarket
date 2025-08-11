import { trpcLoggedProcedure } from '../../../lib/trpc'
import { zSetAdLikeAdTrpcInput } from './input'

export const setAdLikeTrpcRoute = trpcLoggedProcedure.input(zSetAdLikeAdTrpcInput).mutation(async ({ ctx, input }) => {
  const { adId, isLikedByMe } = input

  if (!ctx.me) {
    throw new Error('UNAUTHORIZED')
  }

  const ad = await ctx.prisma.ad.findUnique({
    where: {
      id: adId,
    },
  })

  if (!ad) {
    throw new Error('NOT_FOUND')
  }

  if (isLikedByMe) {
    await ctx.prisma.adLike.upsert({
      where: {
        adId_userId: {
          adId,
          userId: ctx.me.id,
        },
      },
      create: {
        userId: ctx.me.id,
        adId,
      },
      update: {},
    })
  } else {
    await ctx.prisma.adLike.delete({
      where: {
        adId_userId: {
          adId,
          userId: ctx.me.id,
        },
      },
    })
  }

  const likesCount = await ctx.prisma.adLike.count({
    where: {
      adId,
    },
  })

  return {
    ad: {
      id: ad.id,
      likesCount,
      isLikedByMe,
    },
  }
})
