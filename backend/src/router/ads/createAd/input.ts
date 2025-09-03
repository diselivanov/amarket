import { zIdRequired, zPriceRequired, zStringRequired } from '@amarket/shared/src/zod'
import { z } from 'zod'

export const zCreateAdTrpcInput = z.object({
  categoryId: zIdRequired,
  subcategoryId: zIdRequired,
  title: zStringRequired,
  description: zStringRequired,
  price: zPriceRequired,
  city: zStringRequired,
  images: z.array(zStringRequired),
})
