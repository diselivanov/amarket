import { zIdRequired, zNumberRequired, zStringRequired } from '@amarket/shared/src/zod'
import { z } from 'zod'

export const zUpdateVehicleModelTrpcInput = z.object({
  id: zIdRequired,
  name: zStringRequired,
  sequence: zNumberRequired,
  type: zStringRequired,
  brandId: zIdRequired,
})
