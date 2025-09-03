import { zIdRequired } from '@amarket/shared/src/zod'
import { z } from 'zod'

export const zDeleteAdTrpcInput = z.object({
  adId: zIdRequired,
})
