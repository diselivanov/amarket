import { zStringRequired } from '@amarket/shared/src/zod'
import { z } from 'zod'

export const zSetAdLikeAdTrpcInput = z.object({
  adId: zStringRequired,
  isLikedByMe: z.boolean(),
})
