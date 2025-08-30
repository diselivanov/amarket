import { zStringRequired } from '@amarket/shared/src/zod'
import { z } from 'zod'

export const zCreateCarInfoTrpcInput = z.object({
  brand: zStringRequired,
  year: zStringRequired,
  steering: zStringRequired,
  bodyType: zStringRequired,
  power: zStringRequired,
  engineType: zStringRequired,
  transmission: zStringRequired,
  driveType: zStringRequired,
  mileage: zStringRequired,
  condition: zStringRequired,
  adId: z.string().optional(),
})