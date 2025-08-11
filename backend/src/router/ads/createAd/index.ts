import { trpcLoggedProcedure } from '../../../lib/trpc'
import { zCreateAdTrpcInput } from './input'

export const createAdTrpcRoute = trpcLoggedProcedure.input(zCreateAdTrpcInput).mutation(async ({ input, ctx }) => {
  if (!ctx.me) {
    throw Error('UNAUTHORIZED')
  }

  await ctx.prisma.ad.create({
    data: { ...input, authorId: ctx.me.id },
  })

  return true
})
