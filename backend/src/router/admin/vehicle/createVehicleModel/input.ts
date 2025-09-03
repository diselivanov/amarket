import { zNumberRequired, zStringRequired } from '@amarket/shared/src/zod'
import { z } from 'zod'

export const zCreateVehicleModelTrpcInput = z.object({
  name: zStringRequired,
  sequence: zNumberRequired,
  type: zStringRequired,
  brandId: zStringRequired,
})
