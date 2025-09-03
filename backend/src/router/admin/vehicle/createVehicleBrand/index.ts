import { zCreateVehicleBrandTrpcInput } from './input'
import { trpcLoggedProcedure } from '../../../../lib/trpc'

export const createVehicleBrandTrpcRoute = trpcLoggedProcedure
  .input(zCreateVehicleBrandTrpcInput)
  .mutation(async ({ input, ctx }) => {
    if (!ctx.me) {
      throw Error('UNAUTHORIZED')
    }

    await ctx.prisma.vehicleBrand.create({
      data: {
        name: input.name,
        sequence: input.sequence,
      },
    })

    return true
  })
