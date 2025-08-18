import { zStringRequired } from '@amarket/shared/src/zod'
import { z } from 'zod'

export const zCreateCategoryTrpcInput = z.object({
  name: zStringRequired,
  slug: zStringRequired,
})