import { trpcLoggedProcedure } from '../../../lib/trpc'
import { zDeleteAdTrpcInput } from './input'

export const deleteAdTrpcRoute = trpcLoggedProcedure.input(zDeleteAdTrpcInput).mutation(async ({ ctx, input }) => {
  const { adId } = input

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
      deletedAt: new Date(),
    },
  })

  return true
})
