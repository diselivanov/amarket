import { ExpectedError } from '../../../lib/error'
import { trpcLoggedProcedure } from '../../../lib/trpc'
import { getPasswordHash } from '../../../utils/getPasswordHash'
import { signJWT } from '../../../utils/signJWT'
import { zSignUpTrpcInput } from './input'

export const signUpTrpcRoute = trpcLoggedProcedure.input(zSignUpTrpcInput).mutation(async ({ ctx, input }) => {
  const existingUserWithEmail = await ctx.prisma.user.findUnique({
    where: {
      email: input.email,
    },
  })

  if (existingUserWithEmail) {
    throw new ExpectedError('Аккаунт с такой почтой уже существует')
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
