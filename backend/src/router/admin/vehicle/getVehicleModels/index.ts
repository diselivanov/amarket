import { trpcLoggedProcedure } from '../../../../lib/trpc'
import { zGetVehicleModelsTrpcInput } from './input'

export const getVehicleModelsTrpcRoute = trpcLoggedProcedure
  .input(zGetVehicleModelsTrpcInput)
  .query(async ({ ctx }) => {
    const vehicleModels = await ctx.prisma.vehicleModel.findMany()

    const sortedVehicleModels = vehicleModels.sort((a, b) => {
      return parseInt(a.sequence) - parseInt(b.sequence)
    })

    return { vehicleModels: sortedVehicleModels }
  })
