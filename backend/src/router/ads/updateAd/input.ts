import { zStringRequired } from '@amarket/shared/src/zod'
import { zCreateAdTrpcInput } from '../createAd/input'

export const zUpdateAdTrpcInput = zCreateAdTrpcInput.extend({
  adId: zStringRequired,
})