import { zStringRequired } from '@amarket/shared/src/zod'
import { z } from 'zod'

export const zGetAdTrpcInput = z.object({
  selectedAd: zStringRequired,
})
