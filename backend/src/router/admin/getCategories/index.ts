import { trpcLoggedProcedure } from '../../../lib/trpc'
import { zGetCategoriesTrpcInput } from './input'

export const getCategoriesTrpcRoute = trpcLoggedProcedure.input(zGetCategoriesTrpcInput).query(async ({ ctx }) => {
  const categories = await ctx.prisma.category.findMany({
    select: {
      id: true,
      name: true,
      sequence: true,
      total: true,
      active: true,
      sold: true,
      avgPrice: true,
      views: true,
      sellers: true,
      createdAt: true,
    },
  })

  // Сортировка на уровне приложения (т.к sequence - string)
  const sortedCategories = categories.sort((a, b) => {
    return parseInt(a.sequence) - parseInt(b.sequence)
  })

  return { categories: sortedCategories }
})
