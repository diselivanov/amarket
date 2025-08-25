import { trpcLoggedProcedure } from '../../../lib/trpc'
import { canEditAd } from '../../../utils/can'
import { zUpdateAdTrpcInput } from './input'

export const updateAdTrpcRoute = trpcLoggedProcedure.input(zUpdateAdTrpcInput).mutation(async ({ ctx, input }) => {
  const { adId, ...adInput } = input

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

  if (!canEditAd(ctx.me, ad)) {
    throw new Error('NOT_YOUR_AD')
  }

  await ctx.prisma.ad.update({
    where: {
      id: adId,
    },
    data: {
      ...adInput,
    },
  })

  return true
})