import { ExpectedError } from '../../../lib/error'
import { trpcLoggedProcedure } from '../../../lib/trpc'
import { zCreateCategoryTrpcInput } from './input'

export const createCategoryTrpcRoute = trpcLoggedProcedure
  .input(zCreateCategoryTrpcInput)
  .mutation(async ({ input, ctx }) => {
    if (!ctx.me) {
      throw Error('UNAUTHORIZED')
    }

    await ctx.prisma.category.create({
      data: {
        name: input.name,
        sequence: input.sequence,
      },
    })

    return true
  })