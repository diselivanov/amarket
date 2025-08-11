import { zStringRequired } from '@amarket/shared/src/zod'
import { z } from 'zod'

export const zUpdateProfileTrpcInput = z.object({
  name: zStringRequired,
  description: zStringRequired,
  phone: zStringRequired,
  avatar: z.string().nullable(),
})
