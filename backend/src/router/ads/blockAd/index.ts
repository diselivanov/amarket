import { trpcLoggedProcedure } from '../../../lib/trpc'
import { canBlockAds } from '../../../utils/can'
import { zBlockAdTrpcInput } from './input'

export const blockAdTrpcRoute = trpcLoggedProcedure.input(zBlockAdTrpcInput).mutation(async ({ ctx, input }) => {
  const { adId } = input
  if (!canBlockAds(ctx.me)) {
    throw new Error('PERMISSION_DENIED')
  }
  const ad = await ctx.prisma.ad.findUnique({
    where: {
      id: adId,
    },
  })
  if (!ad) {
    throw new Error('NOT_FOUND')
  }
  await ctx.prisma.ad.update({
    where: {
      id: adId,
    },
    data: {
      blockedAt: new Date(),
    },
  })
  return true
})
