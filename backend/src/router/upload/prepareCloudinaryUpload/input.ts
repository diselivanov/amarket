import { cloudinaryUploadTypes } from '@amarket/shared/src/cloudinary'
import { getKeysAsArray } from '@amarket/shared/src/getKeysAsArray'
import { z } from 'zod'

export const zPrepareCloudinaryUploadTrpcInput = z.object({
  type: z.enum(getKeysAsArray(cloudinaryUploadTypes)),
})
