import { zIdRequired } from '@amarket/shared/src/zod'
import { z } from 'zod'

export const zSetAdLikeAdTrpcInput = z.object({
  adId: zIdRequired,
  isLikedByMe: z.boolean(),
})
