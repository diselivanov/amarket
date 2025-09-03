import { zIdRequired, zNumberRequired, zStringRequired } from '@amarket/shared/src/zod'
import { z } from 'zod'

export const zUpdateVehicleBrandTrpcInput = z.object({
  id: zIdRequired,
  name: zStringRequired,
  sequence: zNumberRequired,
})
