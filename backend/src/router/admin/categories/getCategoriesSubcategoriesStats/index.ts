import { trpcLoggedProcedure } from '../../../../lib/trpc'
import { zgetCategoriesSubcategoriesStatsInput } from './input'

export const getCategoriesSubcategoriesStatsTrpcRoute = trpcLoggedProcedure
  .input(zgetCategoriesSubcategoriesStatsInput)
  .query(async ({ ctx }) => {
    const categories = await ctx.prisma.category.findMany({
      include: {
        subcategories: {
          include: {
            ads: {
              where: {
                blockedAt: null,
              },
            },
          },
        },
        ads: {
          where: {
            blockedAt: null,
          },
        },
      },
      orderBy: {
        sequence: 'asc',
      },
    })

    const categoryStats = categories.map((category) => {
      const allCategoryAds = category.ads
      const activeCategoryAds = allCategoryAds.filter((ad) => !ad.deletedAt)
      const deletedCategoryAds = allCategoryAds.filter((ad) => ad.deletedAt)

      const avgPrice =
        allCategoryAds.length > 0
          ? Math.round(
              allCategoryAds.reduce((sum, ad) => {
                const price = parseFloat(ad.price) || 0
                return sum + price
              }, 0) / allCategoryAds.length
            )
          : 0

      const uniqueSellers = new Set(allCategoryAds.map((ad) => ad.authorId)).size

      const subcategoriesStats = category.subcategories.map((subcategory) => {
        const subcategoryAds = subcategory.ads || []
        const activeSubcategoryAds = subcategoryAds.filter((ad) => !ad.deletedAt)
        const deletedSubcategoryAds = subcategoryAds.filter((ad) => ad.deletedAt)

        const subAvgPrice =
          subcategoryAds.length > 0
            ? Math.round(
                subcategoryAds.reduce((sum, ad) => {
                  const price = parseFloat(ad.price) || 0
                  return sum + price
                }, 0) / subcategoryAds.length
              )
            : 0
        const subUniqueSellers = new Set(subcategoryAds.map((ad) => ad.authorId)).size

        return {
          id: subcategory.id,
          name: subcategory.name,
          slug: subcategory.slug,
          sequence: subcategory.sequence,
          categoryId: subcategory.categoryId,
          totalAds: subcategoryAds.length,
          activeAds: activeSubcategoryAds.length,
          deletedAds: deletedSubcategoryAds.length,
          avgPrice: subAvgPrice,
          uniqueSellers: subUniqueSellers,
        }
      })

      const sortedSubcategories = subcategoriesStats.sort((a, b) => {
        return parseInt(a.sequence) - parseInt(b.sequence)
      })

      return {
        id: category.id,
        name: category.name,
        slug: category.slug,
        sequence: category.sequence,
        totalAds: allCategoryAds.length,
        activeAds: activeCategoryAds.length,
        deletedAds: deletedCategoryAds.length,
        avgPrice: avgPrice,
        uniqueSellers: uniqueSellers,
        subcategories: sortedSubcategories,
      }
    })

    const sortedCategoryStats = categoryStats.sort((a, b) => {
      return parseInt(a.sequence) - parseInt(b.sequence)
    })

    return {
      categories: sortedCategoryStats,
    }
  })