import { toClientMe } from '../../../lib/models'
import { trpcLoggedProcedure } from '../../../lib/trpc'
import { zUpdateProfileTrpcInput } from './input'

export const updateProfileTrpcRoute = trpcLoggedProcedure
  .input(zUpdateProfileTrpcInput)
  .mutation(async ({ ctx, input }) => {
    if (!ctx.me) {
      throw new Error('UNAUTHORIZED')
    }

    const updatedMe = await ctx.prisma.user.update({
      where: {
        id: ctx.me.id,
      },
      data: input,
    })

    ctx.me = updatedMe

    return toClientMe(updatedMe)
  })
