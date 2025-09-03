import { trpcLoggedProcedure } from '../../../../lib/trpc'
import { zCreateCategoryTrpcInput } from './input'

export const createCategoryTrpcRoute = trpcLoggedProcedure
  .input(zCreateCategoryTrpcInput)
  .mutation(async ({ input, ctx }) => {
    if (!ctx.me) {
      throw Error('UNAUTHORIZED')
    }

    const existingCategory = await ctx.prisma.category.findUnique({
      where: {
        slug: input.slug,
      },
    })

    if (existingCategory) {
      throw new Error('Идентификатор должен быть уникальным')
    }

    await ctx.prisma.category.create({
      data: {
        name: input.name,
        slug: input.slug,
        sequence: input.sequence,
      },
    })

    return true
  })
