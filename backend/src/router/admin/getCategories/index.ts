import { trpcLoggedProcedure } from '../../../lib/trpc'
import { zGetCategoriesTrpcInput } from './input'

export const getCategoriesTrpcRoute = trpcLoggedProcedure
  .input(zGetCategoriesTrpcInput)
  .query(async ({ ctx }) => {
    const categories = await ctx.prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        count: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return { categories }
  })