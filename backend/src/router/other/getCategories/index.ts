import { trpcLoggedProcedure } from '../../../lib/trpc'
import { zGetCategoriesTrpcInput } from './input'

export const getCategoriesTrpcRoute = trpcLoggedProcedure.input(zGetCategoriesTrpcInput).query(async ({ ctx }) => {
  const categories = await ctx.prisma.category.findMany()

  const sortedCategories = categories.sort((a, b) => {
    return parseInt(a.sequence) - parseInt(b.sequence)
  })

  return { categories: sortedCategories }
})
