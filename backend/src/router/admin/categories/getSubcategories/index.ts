import { trpcLoggedProcedure } from '../../../../lib/trpc'
import { zGetSubcategoriesTrpcInput } from './input'

export const getSubcategoriesTrpcRoute = trpcLoggedProcedure
  .input(zGetSubcategoriesTrpcInput)
  .query(async ({ ctx }) => {
    const subcategories = await ctx.prisma.subcategory.findMany({
      select: {
        id: true,
        name: true,
        sequence: true,
        categoryId: true,
        createdAt: true,
      },
    })

    // Сортировка на уровне приложения (т.к sequence - string)
    const sortedSubcategories = subcategories.sort((a, b) => {
      return parseInt(a.sequence) - parseInt(b.sequence)
    })

    return { subcategories: sortedSubcategories }
  })
