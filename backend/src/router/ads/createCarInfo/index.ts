import { trpcLoggedProcedure } from '../../../lib/trpc'
import { zCreateCarInfoTrpcInput } from './input'

export const createCarInfoTrpcRoute = trpcLoggedProcedure.input(zCreateCarInfoTrpcInput).mutation(async ({ input, ctx }) => {
  if (!ctx.me) {
    throw Error('UNAUTHORIZED')
  }

  await ctx.prisma.carInfo.create({
    data: { ...input },
  })

  return true
})