import { trpcLoggedProcedure } from '../../../lib/trpc'
import { zGetSubcategoriesTrpcInput } from './input'

export const getSubcategoriesTrpcRoute = trpcLoggedProcedure
  .input(zGetSubcategoriesTrpcInput)
  .query(async ({ ctx }) => {
    const subcategories = await ctx.prisma.subcategory.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        categoryId: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return { subcategories }
  })