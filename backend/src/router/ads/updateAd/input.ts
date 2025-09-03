import { zIdRequired } from '@amarket/shared/src/zod'
import { zCreateAdTrpcInput } from '../createAd/input'

export const zUpdateAdTrpcInput = zCreateAdTrpcInput.extend({
  adId: zIdRequired,
})
