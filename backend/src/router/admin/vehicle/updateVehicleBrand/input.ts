import { zNumberRequired, zStringRequired } from '@amarket/shared/src/zod'
import { z } from 'zod'

export const zUpdateVehicleBrandTrpcInput = z.object({
  id: z.string().uuid(),
  name: zStringRequired,
  sequence: zNumberRequired,
})
