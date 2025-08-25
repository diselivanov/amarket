import { type inferRouterInputs, type inferRouterOutputs } from '@trpc/server'
import { createTrpcRouter } from '../lib/trpc'
// @index('./**/index.ts', f => `import { ${f.path.split('/').slice(0, -1).pop()}TrpcRoute } from '${f.path.split('/').slice(0, -1).join('/')}'`)
import { createCategoryTrpcRoute } from './admin/categories/createCategory'
import { createSubcategoryTrpcRoute } from './admin/categories/createSubcategory'
import { getCategoriesTrpcRoute } from './admin/categories/getCategories'
import { getSubcategoriesTrpcRoute } from './admin/categories/getSubcategories'
import { updateCategoryTrpcRoute } from './admin/categories/updateCategory'
import { updateSubcategoryTrpcRoute } from './admin/categories/updateSubcategory'
import { blockAdTrpcRoute } from './ads/blockAd'
import { createAdTrpcRoute } from './ads/createAd'
import { getAdTrpcRoute } from './ads/getAd'
import { getAdsTrpcRoute } from './ads/getAds'
import { setAdLikeTrpcRoute } from './ads/setAdLike'
import { updateAdTrpcRoute } from './ads/updateAd'
import { getMeTrpcRoute } from './auth/getMe'
import { signInTrpcRoute } from './auth/signIn'
import { signUpTrpcRoute } from './auth/signUp'
import { updatePasswordTrpcRoute } from './auth/updatePassword'
import { updateProfileTrpcRoute } from './auth/updateProfile'
import { prepareCloudinaryUploadTrpcRoute } from './upload/prepareCloudinaryUpload'
// @endindex

export const trpcRouter = createTrpcRouter({
  // @index('./**/index.ts', f => `${f.path.split('/').slice(0, -1).pop()}: ${f.path.split('/').slice(0, -1).pop()}TrpcRoute,`)
  createCategory: createCategoryTrpcRoute,
  createSubcategory: createSubcategoryTrpcRoute,
  getCategories: getCategoriesTrpcRoute,
  getSubcategories: getSubcategoriesTrpcRoute,
  updateCategory: updateCategoryTrpcRoute,
  updateSubcategory: updateSubcategoryTrpcRoute,
  blockAd: blockAdTrpcRoute,
  createAd: createAdTrpcRoute,
  getAd: getAdTrpcRoute,
  getAds: getAdsTrpcRoute,
  setAdLike: setAdLikeTrpcRoute,
  updateAd: updateAdTrpcRoute,
  getMe: getMeTrpcRoute,
  signIn: signInTrpcRoute,
  signUp: signUpTrpcRoute,
  updatePassword: updatePasswordTrpcRoute,
  updateProfile: updateProfileTrpcRoute,
  prepareCloudinaryUpload: prepareCloudinaryUploadTrpcRoute,
  // @endindex
})

export type TrpcRouter = typeof trpcRouter
export type TrpcRouterInput = inferRouterInputs<TrpcRouter>
export type TrpcRouterOutput = inferRouterOutputs<TrpcRouter>
