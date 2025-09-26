import { zIdRequired, zNumberRequired, zStringRequired, zEmailRequired } from '@amarket/shared/src/zod'
import { z } from 'zod'

export const zUpdateUserTrpcInput = z.object({
  id: zIdRequired,
  name: zStringRequired,
  email: zEmailRequired,
  description: zStringRequired,
  phone: zNumberRequired,
  avatar: z.string().nullable(),
  balance: zNumberRequired,
})