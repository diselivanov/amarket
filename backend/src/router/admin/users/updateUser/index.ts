import { ExpectedError } from '../../../../lib/error'
import { trpcLoggedProcedure } from '../../../../lib/trpc'
import { zUpdateUserTrpcInput } from './input'

export const updateUserTrpcRoute = trpcLoggedProcedure
  .input(zUpdateUserTrpcInput)
  .mutation(async ({ input, ctx }) => {
    if (!ctx.me) {
      throw Error('UNAUTHORIZED')
    }

    const user = await ctx.prisma.user.findUnique({
      where: {
        id: input.id,
      },
    })

    if (!user) {
      throw new ExpectedError('Пользователь не найден')
    }

    if (input.email !== user.email) {
      const existingUserWithEmail = await ctx.prisma.user.findFirst({
        where: {
          email: input.email,
          id: {
            not: input.id,
          },
        },
      })

      if (existingUserWithEmail) {
        throw new Error('Email должен быть уникальным')
      }
    }

    await ctx.prisma.user.update({
      where: {
        id: input.id,
      },
      data: {
        name: input.name,
        email: input.email,
        description: input.description,
        phone: input.phone,
        avatar: input.avatar,
        balance: input.balance,
      },
    })

    return true
  })