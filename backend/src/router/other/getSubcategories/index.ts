import { trpcLoggedProcedure } from '../../../lib/trpc'
import { zGetSubcategoriesTrpcInput } from './input'

export const getSubcategoriesTrpcRoute = trpcLoggedProcedure
  .input(zGetSubcategoriesTrpcInput)
  .query(async ({ ctx }) => {
    const subcategories = await ctx.prisma.subcategory.findMany()

    const sortedSubcategories = subcategories.sort((a, b) => {
      return parseInt(a.sequence) - parseInt(b.sequence)
    })

    return { subcategories: sortedSubcategories }
  })
