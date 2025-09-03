import { zIdRequired } from '@amarket/shared/src/zod'
import { z } from 'zod'

export const zGetCarInfoInput = z.object({
  adId: zIdRequired,
})
