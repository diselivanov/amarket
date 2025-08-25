import { trpcLoggedProcedure } from '../../../../lib/trpc'
import { zCreateSubcategoryTrpcInput } from './input'

export const createSubcategoryTrpcRoute = trpcLoggedProcedure
  .input(zCreateSubcategoryTrpcInput)
  .mutation(async ({ input, ctx }) => {
    if (!ctx.me) {
      throw Error('UNAUTHORIZED')
    }

    await ctx.prisma.subcategory.create({
      data: {
        name: input.name,
        sequence: input.sequence,
        categoryId: input.categoryId,
      },
    })

    return true
  })
