import { ExpectedError } from '../../../../lib/error'
import { trpcLoggedProcedure } from '../../../../lib/trpc'
import { zUpdateCategoryTrpcInput } from './input'

export const updateCategoryTrpcRoute = trpcLoggedProcedure
  .input(zUpdateCategoryTrpcInput)
  .mutation(async ({ input, ctx }) => {
    if (!ctx.me) {
      throw Error('UNAUTHORIZED')
    }

    const category = await ctx.prisma.category.findUnique({
      where: {
        id: input.id,
      },
    })

    if (!category) {
      throw new ExpectedError('Категория не найдена')
    }

    await ctx.prisma.category.update({
      where: {
        id: input.id,
      },
      data: {
        name: input.name,
        sequence: input.sequence,
      },
    })

    return true
  })
