import { zCreateVehicleBrandTrpcInput } from './input'
import { trpcLoggedProcedure } from '../../../../lib/trpc'

export const createVehicleBrandTrpcRoute = trpcLoggedProcedure
  .input(zCreateVehicleBrandTrpcInput)
  .mutation(async ({ input, ctx }) => {
    if (!ctx.me) {
      throw Error('UNAUTHORIZED')
    }

    const existingBrand = await ctx.prisma.vehicleBrand.findFirst({
      where: {
        name: input.name,
      },
    })

    if (existingBrand) {
      throw new Error('Название должно быть уникальным')
    }

    await ctx.prisma.vehicleBrand.create({
      data: {
        name: input.name,
        sequence: input.sequence,
      },
    })

    return true
  })
