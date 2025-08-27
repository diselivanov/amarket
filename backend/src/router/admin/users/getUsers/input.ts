import { z } from 'zod'

export const zGetUsersTrpcInput = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(11),
})