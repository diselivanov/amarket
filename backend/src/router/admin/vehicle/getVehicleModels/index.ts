import { trpcLoggedProcedure } from '../../../../lib/trpc'
import { zGetVehicleModelsTrpcInput } from './input'

export const getVehicleModelsTrpcRoute = trpcLoggedProcedure
  .input(zGetVehicleModelsTrpcInput)
  .query(async ({ ctx, input }) => {
    const whereClause = input.brandId ? { brandId: input.brandId } : {}

    const vehicleModels = await ctx.prisma.vehicleModel.findMany({
      where: whereClause,
    })

    const sortedVehicleModels = vehicleModels.sort((a, b) => {
      return parseInt(a.sequence) - parseInt(b.sequence)
    })

    return { vehicleModels: sortedVehicleModels }
  })
