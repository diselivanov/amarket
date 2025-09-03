import { trpcLoggedProcedure } from '../../../../lib/trpc'
import { zCreateVehicleModelTrpcInput } from './input'

export const createVehicleModelTrpcRoute = trpcLoggedProcedure
  .input(zCreateVehicleModelTrpcInput)
  .mutation(async ({ input, ctx }) => {
    if (!ctx.me) {
      throw Error('UNAUTHORIZED')
    }

    await ctx.prisma.vehicleModel.create({
      data: {
        name: input.name,
        sequence: input.sequence,
        type: input.type,
        brandId: input.brandId,
      },
    })

    return true
  })
