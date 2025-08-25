import { trpcLoggedProcedure } from '../../../lib/trpc'
import { zGetAdsTrpcInput } from './input'

export const getAdsTrpcRoute = trpcLoggedProcedure.input(zGetAdsTrpcInput).query(async ({ ctx, input }) => {
  const normalizedSearch = input.search ? input.search.trim().replace(/[\s\n\t]/g, ' & ') : undefined
  const rawAds = await ctx.prisma.ad.findMany({
    select: {
      id: true,
      serialNumber: true,
      category: true,
      subcategory: true,
      title: true,
      description: true,
      price: true,
      city: true,
      images: true,
    },

    where: {
      blockedAt: null,
      deletedAt: null,

      ...(!normalizedSearch
        ? {}
        : {
            OR: [
              {
                title: {
                  search: normalizedSearch,
                },
              },
              {
                description: {
                  search: normalizedSearch,
                },
              },
            ],
          }),
    },

    orderBy: [
      {
        createdAt: 'desc',
      },
      {
        serialNumber: 'desc',
      },
    ],

    cursor: input.cursor ? { serialNumber: input.cursor } : undefined,
    take: input.limit + 1,
  })

  const nextAd = rawAds.at(input.limit)
  const nextCursor = nextAd?.serialNumber
  const ads = rawAds.slice(0, input.limit)

  return { ads, nextCursor }
})
