import { zNumberRequired, zStringRequired } from '@amarket/shared/src/zod'
import { z } from 'zod'

export const zCreateVehicleBrandTrpcInput = z.object({
  name: zStringRequired,
  sequence: zNumberRequired,
})
