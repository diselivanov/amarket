import { type inferRouterInputs, type inferRouterOutputs } from '@trpc/server'
import { createTrpcRouter } from '../lib/trpc'
// @index('./**/index.ts', f => `import { ${f.path.split('/').slice(0, -1).pop()}TrpcRoute } from '${f.path.split('/').slice(0, -1).join('/')}'`)
import { createCategoryTrpcRoute } from './admin/categories/createCategory'
import { createSubcategoryTrpcRoute } from './admin/categories/createSubcategory'
import { getCategoriesSubcategoriesStatsTrpcRoute } from './admin/categories/getCategoriesSubcategoriesStats'
import { updateCategoryTrpcRoute } from './admin/categories/updateCategory'
import { updateSubcategoryTrpcRoute } from './admin/categories/updateSubcategory'
import { getUsersTrpcRoute } from './admin/users/getUsers'
import { createVehicleBrandTrpcRoute } from './admin/vehicle/createVehicleBrand'
import { createVehicleModelTrpcRoute } from './admin/vehicle/createVehicleModel'
import { getVehicleBrandsTrpcRoute } from './admin/vehicle/getVehicleBrands'
import { getVehicleModelsTrpcRoute } from './admin/vehicle/getVehicleModels'
import { updateVehicleBrandTrpcRoute } from './admin/vehicle/updateVehicleBrand'
import { updateVehicleModelTrpcRoute } from './admin/vehicle/updateVehicleModel'
import { blockAdTrpcRoute } from './ads/blockAd'
import { createAdTrpcRoute } from './ads/createAd'
import { createCarInfoTrpcRoute } from './ads/createCarInfo'
import { deleteAdTrpcRoute } from './ads/deleteAd'
import { getAdTrpcRoute } from './ads/getAd'
import { getAdsTrpcRoute } from './ads/getAds'
import { getCarInfoTrpcRoute } from './ads/getCarInfo'
import { setAdLikeTrpcRoute } from './ads/setAdLike'
import { updateAdTrpcRoute } from './ads/updateAd'
import { getMeTrpcRoute } from './auth/getMe'
import { signInTrpcRoute } from './auth/signIn'
import { signUpTrpcRoute } from './auth/signUp'
import { updatePasswordTrpcRoute } from './auth/updatePassword'
import { updateProfileTrpcRoute } from './auth/updateProfile'
import { getCategoriesTrpcRoute } from './other/getCategories'
import { getSubcategoriesTrpcRoute } from './other/getSubcategories'
import { prepareCloudinaryUploadTrpcRoute } from './upload/prepareCloudinaryUpload'
// @endindex

export const trpcRouter = createTrpcRouter({
  // @index('./**/index.ts', f => `${f.path.split('/').slice(0, -1).pop()}: ${f.path.split('/').slice(0, -1).pop()}TrpcRoute,`)
  createCategory: createCategoryTrpcRoute,
  createSubcategory: createSubcategoryTrpcRoute,
  getCategoriesSubcategoriesStats: getCategoriesSubcategoriesStatsTrpcRoute,
  updateCategory: updateCategoryTrpcRoute,
  updateSubcategory: updateSubcategoryTrpcRoute,
  getUsers: getUsersTrpcRoute,
  createVehicleBrand: createVehicleBrandTrpcRoute,
  createVehicleModel: createVehicleModelTrpcRoute,
  getVehicleBrands: getVehicleBrandsTrpcRoute,
  getVehicleModels: getVehicleModelsTrpcRoute,
  updateVehicleBrand: updateVehicleBrandTrpcRoute,
  updateVehicleModel: updateVehicleModelTrpcRoute,
  blockAd: blockAdTrpcRoute,
  createAd: createAdTrpcRoute,
  createCarInfo: createCarInfoTrpcRoute,
  deleteAd: deleteAdTrpcRoute,
  getAd: getAdTrpcRoute,
  getAds: getAdsTrpcRoute,
  getCarInfo: getCarInfoTrpcRoute,
  setAdLike: setAdLikeTrpcRoute,
  updateAd: updateAdTrpcRoute,
  getMe: getMeTrpcRoute,
  signIn: signInTrpcRoute,
  signUp: signUpTrpcRoute,
  updatePassword: updatePasswordTrpcRoute,
  updateProfile: updateProfileTrpcRoute,
  getCategories: getCategoriesTrpcRoute,
  getSubcategories: getSubcategoriesTrpcRoute,
  prepareCloudinaryUpload: prepareCloudinaryUploadTrpcRoute,
  // @endindex
})

export type TrpcRouter = typeof trpcRouter
export type TrpcRouterInput = inferRouterInputs<TrpcRouter>
export type TrpcRouterOutput = inferRouterOutputs<TrpcRouter>
