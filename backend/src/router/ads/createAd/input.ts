import { zStringRequired } from '@amarket/shared/src/zod'
import { z } from 'zod'

export const zCreateAdTrpcInput = z.object({
  category: zStringRequired,
  subcategory: zStringRequired,
  title: zStringRequired,
  description: zStringRequired,
  price: zStringRequired,
  city: zStringRequired,
  images: z.array(zStringRequired),
})
