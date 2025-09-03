import { zIdRequired } from '@amarket/shared/src/zod'
import { z } from 'zod'

export const zBlockAdTrpcInput = z.object({
  adId: zIdRequired,
})
