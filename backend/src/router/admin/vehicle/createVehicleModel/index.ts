import { trpcLoggedProcedure } from '../../../../lib/trpc'
import { zCreateVehicleModelTrpcInput } from './input'

export const createVehicleModelTrpcRoute = trpcLoggedProcedure
  .input(zCreateVehicleModelTrpcInput)
  .mutation(async ({ input, ctx }) => {
    if (!ctx.me) {
      throw Error('UNAUTHORIZED')
    }

    const existingModel = await ctx.prisma.vehicleModel.findFirst({
      where: {
        name: input.name,
      },
    })

    if (existingModel) {
      throw new Error('Название модели должно быть уникальным')
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
