import { ExpectedError } from '../../../../lib/error'
import { trpcLoggedProcedure } from '../../../../lib/trpc'
import { zUpdateVehicleBrandTrpcInput } from './input'

export const updateVehicleBrandTrpcRoute = trpcLoggedProcedure
  .input(zUpdateVehicleBrandTrpcInput)
  .mutation(async ({ input, ctx }) => {
    if (!ctx.me) {
      throw Error('UNAUTHORIZED')
    }

    const vehicleBrand = await ctx.prisma.vehicleBrand.findUnique({
      where: {
        id: input.id,
      },
    })

    if (!vehicleBrand) {
      throw new ExpectedError('Бренд транспортного средства не найден')
    }

    await ctx.prisma.vehicleBrand.update({
      where: {
        id: input.id,
      },
      data: {
        name: input.name,
        sequence: input.sequence,
      },
    })

    return true
  })
