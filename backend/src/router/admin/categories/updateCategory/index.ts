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

    if (input.slug !== category.slug) {
      const existingCategoryWithSlug = await ctx.prisma.category.findFirst({
        where: {
          slug: input.slug,
          id: {
            not: input.id,
          },
        },
      })

      if (existingCategoryWithSlug) {
        throw new Error('Идентификатор должен быть уникальным')
      }
    }

    await ctx.prisma.category.update({
      where: {
        id: input.id,
      },
      data: {
        name: input.name,
        slug: input.slug,
        sequence: input.sequence,
      },
    })

    return true
  })
