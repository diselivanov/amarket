import { ExpectedError } from '../../../../lib/error'
import { trpcLoggedProcedure } from '../../../../lib/trpc'
import { zUpdateVehicleModelTrpcInput } from './input'

export const updateVehicleModelTrpcRoute = trpcLoggedProcedure
  .input(zUpdateVehicleModelTrpcInput)
  .mutation(async ({ input, ctx }) => {
    if (!ctx.me) {
      throw Error('UNAUTHORIZED')
    }

    const vehicleModel = await ctx.prisma.vehicleModel.findUnique({
      where: {
        id: input.id,
      },
    })

    if (!vehicleModel) {
      throw new ExpectedError('Модель транспортного средства не найдена')
    }

    // Проверяем существование бренда, если он меняется
    if (input.brandId !== vehicleModel.brandId) {
      const brand = await ctx.prisma.vehicleBrand.findUnique({
        where: {
          id: input.brandId,
        },
      })

      if (!brand) {
        throw new ExpectedError('Бренд транспортного средства не найден')
      }
    }

    await ctx.prisma.vehicleModel.update({
      where: {
        id: input.id,
      },
      data: {
        name: input.name,
        sequence: input.sequence,
        type: input.type,
        brandId: input.brandId,
      },
    })

    return true
  })
