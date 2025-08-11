import { zStringRequired, zEmailRequired } from '@amarket/shared/src/zod'
import { z } from 'zod'

export const zSignInTrpcInput = z.object({
  email: zEmailRequired,
  password: zStringRequired,
})
