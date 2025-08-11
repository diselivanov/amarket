import { zStringRequired } from '@amarket/shared/src/zod'
import { z } from 'zod'

export const zBlockAdTrpcInput = z.object({
  adId: zStringRequired,
})
