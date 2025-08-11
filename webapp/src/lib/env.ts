import { zEnvHost, zEnvNonemptyTrimmed } from '@amarket/shared/src/zod'
import { z } from 'zod'

export const zEnv = z.object({
  NODE_ENV: z.enum(['development', 'production']),
  HOST_ENV: zEnvHost,
  VITE_BACKEND_TRPC_URL: zEnvNonemptyTrimmed,
  VITE_WEBAPP_URL: zEnvNonemptyTrimmed,
  VITE_CLOUDINARY_CLOUD_NAME: zEnvNonemptyTrimmed,
})

const envFromBackend = (window as any).webappEnvFromBackend
// eslint-disable-next-line node/no-process-env
export const env = zEnv.parse(envFromBackend?.replaceMeWithPublicEnv ? process.env : envFromBackend)
