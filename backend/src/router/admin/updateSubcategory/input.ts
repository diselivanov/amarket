import { zNumberRequired, zStringRequired } from '@amarket/shared/src/zod'
import { z } from 'zod'

export const zUpdateSubcategoryTrpcInput = z.object({
  id: z.string().uuid(),
  name: zStringRequired,
  sequence: zNumberRequired,
  categoryId: zStringRequired,
})