import { trpcLoggedProcedure } from '../../../../lib/trpc'
import { zGetVehicleBrandTrpcInput } from './input'

export const getVehicleBrandsTrpcRoute = trpcLoggedProcedure.input(zGetVehicleBrandTrpcInput).query(async ({ ctx }) => {
  const vehicleBrands = await ctx.prisma.vehicleBrand.findMany()

  const sortedVehicleBrands = vehicleBrands.sort((a, b) => {
    return parseInt(a.sequence) - parseInt(b.sequence)
  })

  return { vehicleBrands: sortedVehicleBrands }
})
