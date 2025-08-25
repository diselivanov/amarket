import { zNumberRequired, zStringRequired } from '@amarket/shared/src/zod'
import { z } from 'zod'

export const zCreateSubcategoryTrpcInput = z.object({
  name: zStringRequired,
  sequence: zNumberRequired,
  categoryId: zStringRequired,
})
