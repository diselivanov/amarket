import type { Ad, User, UserPermission } from '@prisma/client'

type MaybeUser = Pick<User, 'permissions' | 'id'> | null
type MaybeAd = Pick<Ad, 'authorId'> | null

export const hasPermission = (user: MaybeUser, permission: UserPermission) => {
  return user?.permissions.includes(permission) || user?.permissions.includes('ALL') || false
}

export const canBlockAds = (user: MaybeUser) => {
  return hasPermission(user, 'BLOCK_ADS')
}

export const canEditAd = (user: MaybeUser, ad: MaybeAd) => {
  return !!user && !!ad && user?.id === ad?.authorId
}
