import { z } from 'zod'

export const zGetVehicleModelsTrpcInput = z.object({
  brandId: z.string().optional(),
})
