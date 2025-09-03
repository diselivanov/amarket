import { zIdRequired } from '@amarket/shared/src/zod'
import { z } from 'zod'

export const zGetVehicleModelsTrpcInput = z.object({
  brandId: zIdRequired,
})
