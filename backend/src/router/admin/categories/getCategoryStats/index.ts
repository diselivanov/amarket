import { trpcLoggedProcedure } from '../../../../lib/trpc'
import { z } from 'zod'

export const zGetCategoryStatsInput = z.object({})

export const getCategoryStatsTrpcRoute = trpcLoggedProcedure
  .input(zGetCategoryStatsInput)
  .query(async ({ ctx }) => {
    const categories = await ctx.prisma.category.findMany({
      include: {
        subcategories: {
          include: {
            ads: {
              where: {
                blockedAt: null // Фильтруем только незаблокированные объявления
              },
              include: {
                author: true,
              },
            },
          },
        },
        ads: {
          where: {
            blockedAt: null // Фильтруем только незаблокированные объявления
          },
          include: {
            author: true,
          },
        },
      },
      orderBy: {
        sequence: 'asc',
      },
    })

    // Собираем всех авторов из всех объявлений для расчета общего количества уникальных продавцов
    const allAuthors = new Set<string>()
    
    const categoryStats = await Promise.all(
      categories.map(async (category) => {
        const allCategoryAds = category.ads
        const activeCategoryAds = allCategoryAds.filter(ad => !ad.deletedAt)
        const deletedCategoryAds = allCategoryAds.filter(ad => ad.deletedAt)

        // Добавляем авторов этой категории в общий набор
        allCategoryAds.forEach(ad => {
          if (ad.authorId) {
            allAuthors.add(ad.authorId)
          }
        })

        const avgPrice = allCategoryAds.length > 0
          ? Math.round(allCategoryAds.reduce((sum, ad) => {
              const price = parseFloat(ad.price) || 0
              return sum + price
            }, 0) / allCategoryAds.length)
          : 0

        const uniqueSellers = new Set(allCategoryAds.map(ad => ad.authorId)).size

        const subcategoriesStats = await Promise.all(
          category.subcategories.map(async (subcategory) => {
            // Дополнительно запрашиваем объявления подкатегории с фильтрацией blockedAt
            const subcategoryAds = await ctx.prisma.ad.findMany({
              where: {
                subcategoryId: subcategory.id,
                blockedAt: null // Фильтруем только незаблокированные объявления
              },
              include: {
                author: true,
              },
            })

            const activeSubcategoryAds = subcategoryAds.filter(ad => !ad.deletedAt)
            const deletedSubcategoryAds = subcategoryAds.filter(ad => ad.deletedAt)

            const subAvgPrice = subcategoryAds.length > 0
              ? Math.round(subcategoryAds.reduce((sum, ad) => {
                  const price = parseFloat(ad.price) || 0
                  return sum + price
                }, 0) / subcategoryAds.length)
              : 0
            const subUniqueSellers = new Set(subcategoryAds.map(ad => ad.authorId)).size

            return {
              id: subcategory.id,
              name: subcategory.name,
              categoryId: subcategory.categoryId,
              totalAds: subcategoryAds.length,
              activeAds: activeSubcategoryAds.length,
              deletedAds: deletedSubcategoryAds.length,
              avgPrice: subAvgPrice,
              uniqueSellers: subUniqueSellers,
              sequence: subcategory.sequence,
            }
          })
        )

        const sortedSubcategories = subcategoriesStats.sort((a, b) => {
          return parseInt(a.sequence) - parseInt(b.sequence)
        })

        return {
          id: category.id,
          name: category.name,
          sequence: category.sequence,
          totalAds: allCategoryAds.length,
          activeAds: activeCategoryAds.length,
          deletedAds: deletedCategoryAds.length,
          avgPrice: avgPrice,
          uniqueSellers: uniqueSellers,
          subcategories: sortedSubcategories,
        }
      })
    )

    const sortedCategoryStats = categoryStats.sort((a, b) => {
      return parseInt(a.sequence) - parseInt(b.sequence)
    })

    return { 
      categories: sortedCategoryStats,
      totalUniqueSellers: allAuthors.size
    }
  })