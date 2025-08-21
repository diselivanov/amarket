import { zNumberRequired, zStringRequired } from '@amarket/shared/src/zod'
import { z } from 'zod'

export const zUpdateCategoryTrpcInput = z.object({
  id: z.string().uuid(),
  name: zStringRequired,
  sequence: zNumberRequired,
})
