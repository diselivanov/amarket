import { zIdRequired, zNumberRequired, zStringRequired } from '@amarket/shared/src/zod'
import { z } from 'zod'

export const zUpdateCategoryTrpcInput = z.object({
  id: zIdRequired,
  name: zStringRequired,
  slug: zStringRequired,
  sequence: zNumberRequired,
})
