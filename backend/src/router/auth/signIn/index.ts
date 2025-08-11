import { ExpectedError } from '../../../lib/error'
import { trpcLoggedProcedure } from '../../../lib/trpc'
import { getPasswordHash } from '../../../utils/getPasswordHash'
import { signJWT } from '../../../utils/signJWT'
import { zSignInTrpcInput } from './input'

export const signInTrpcRoute = trpcLoggedProcedure.input(zSignInTrpcInput).mutation(async ({ ctx, input }) => {
  const user = await ctx.prisma.user.findFirst({
    where: {
      email: input.email,
      password: getPasswordHash(input.password),
    },
  })

  if (!user) {
    throw new ExpectedError('Wrong email or password')
  }

  const token = signJWT(user.id)

  return { token }
})
