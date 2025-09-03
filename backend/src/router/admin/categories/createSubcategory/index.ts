import { trpcLoggedProcedure } from '../../../../lib/trpc'
import { zCreateSubcategoryTrpcInput } from './input'

export const createSubcategoryTrpcRoute = trpcLoggedProcedure
  .input(zCreateSubcategoryTrpcInput)
  .mutation(async ({ input, ctx }) => {
    if (!ctx.me) {
      throw Error('UNAUTHORIZED')
    }

    const existingSubcategory = await ctx.prisma.subcategory.findUnique({
      where: {
        slug: input.slug,
      },
    })

    if (existingSubcategory) {
      throw new Error('Идентификатор должен быть уникальным')
    }

    await ctx.prisma.subcategory.create({
      data: {
        name: input.name,
        slug: input.slug,
        sequence: input.sequence,
        categoryId: input.categoryId,
      },
    })

    return true
  })
