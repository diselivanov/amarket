import {
  zIdRequired,
  zMileageRequired,
  zPowerRequired,
  zReleaseYearRequired,
  zStringRequired,
} from '@amarket/shared/src/zod'
import { z } from 'zod'

export const zCreateCarInfoTrpcInput = z.object({
  vehicleBrandId: zIdRequired,
  vehicleModelId: zIdRequired,
  adId: zIdRequired,
  year: zReleaseYearRequired,
  steering: zStringRequired,
  bodyType: zStringRequired,
  power: zPowerRequired,
  engineType: zStringRequired,
  transmission: zStringRequired,
  driveType: zStringRequired,
  mileage: zMileageRequired,
  condition: zStringRequired,
})
