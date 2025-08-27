import { trpcLoggedProcedure } from '../../../../lib/trpc'
import { zGetUsersTrpcInput } from './input'

export const getUsersTrpcRoute = trpcLoggedProcedure
  .input(zGetUsersTrpcInput)
  .query(async ({ ctx, input }) => {

    const skip = (input.page - 1) * input.limit
    const take = input.limit

    const [users, totalCount] = await Promise.all([
      ctx.prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          description: true,
          phone: true,
          avatar: true,
          createdAt: true,
          _count: {
            select: {
              ads: true,
              adsLikes: true,
            },
          },
        },
        orderBy: [
          {
            createdAt: 'desc',
          },
        ],
        skip,
        take,
      }),
      ctx.prisma.user.count(),
    ])

    const formattedUsers = users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      description: user.description,
      phone: user.phone,
      avatar: user.avatar,
      createdAt: user.createdAt,
      adsCount: user._count.ads,
      likesCount: user._count.adsLikes,
    }))

    return {
      users: formattedUsers,
      totalCount,
      totalPages: Math.ceil(totalCount / input.limit),
      currentPage: input.page,
    }
  })