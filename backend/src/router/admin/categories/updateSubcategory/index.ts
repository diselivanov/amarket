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

    if (input.slug !== subcategory.slug) {
      const existingSubcategoryWithSlug = await ctx.prisma.subcategory.findFirst({
        where: {
          slug: input.slug,
          id: {
            not: input.id,
          },
        },
      })

      if (existingSubcategoryWithSlug) {
        throw new Error('Идентификатор должен быть уникальным')
      }
    }

    await ctx.prisma.subcategory.update({
      where: {
        id: input.id,
      },
      data: {
        name: input.name,
        slug: input.slug,
        sequence: input.sequence,
        categoryId: input.categoryId,
      },
    })

    return true
  })
