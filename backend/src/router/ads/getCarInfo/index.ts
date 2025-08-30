import { trpcLoggedProcedure } from '../../../lib/trpc'
import { zGetCarInfoInput } from './input'

export const getCarInfoTrpcRoute = trpcLoggedProcedure
  .input(zGetCarInfoInput)
  .query(async ({ ctx, input }) => {
    const carInfo = await ctx.prisma.carInfo.findUnique({
      where: {
        adId: input.adId,
      },
    })

    return { carInfo }
  })