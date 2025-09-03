import { ExpectedError } from '../../../../lib/error'
import { trpcLoggedProcedure } from '../../../../lib/trpc'
import { zUpdateSubcategoryTrpcInput } from './input'

export const updateSubcategoryTrpcRoute = trpcLoggedProcedure
  .input(zUpdateSubcategoryTrpcInput)
  .mutation(async ({ input, ctx }) => {
    if (!ctx.me) {
      throw Error('UNAUTHORIZED')
    }

    const subcategory = await ctx.prisma.subcategory.findUnique({
      where: {
        id: input.id,
      },
    })

    if (!subcategory) {
      throw new ExpectedError('Подкатегория не найдена')
    }

    await ctx.prisma.subcategory.update({
      where: {
        id: input.id,
      },
      data: {
        name: input.name,
        sequence: input.sequence,
        categoryId: input.categoryId,
      },
    })

    return true
  })
