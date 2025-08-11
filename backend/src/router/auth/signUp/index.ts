import { ExpectedError } from '../../../lib/error'
import { trpcLoggedProcedure } from '../../../lib/trpc'
import { getPasswordHash } from '../../../utils/getPasswordHash'
import { signJWT } from '../../../utils/signJWT'
import { zSignUpTrpcInput } from './input'

export const signUpTrpcRoute = trpcLoggedProcedure.input(zSignUpTrpcInput).mutation(async ({ ctx, input }) => {
  const exUserWithEmail = await ctx.prisma.user.findUnique({
    where: {
      email: input.email,
    },
  })

  if (exUserWithEmail) {
    throw new ExpectedError('User with this email already exists')
  }

  const user = await ctx.prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      password: getPasswordHash(input.password),
    },
  })
  const token = signJWT(user.id)
  return { token }
})
