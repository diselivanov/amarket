import { pgr } from '../utils/pumpGetRoute'

export const getAllAdsRoute = pgr(() => '/')

export const getSignUpRoute = pgr(() => '/sign-up')
export const getSignInRoute = pgr(() => '/sign-in')
export const getSignOutRoute = pgr(() => '/sign-out')

export const getProfileRoute = pgr(() => '/profile')
export const getEditProfileRoute = pgr(() => '/edit-profile')

export const getNewAdRoute = pgr(() => '/ads/new')
export const getViewAdRoute = pgr({ selectedAd: true }, ({ selectedAd }) => `/ads/${selectedAd}`)
export const getEditAdRoute = pgr({ selectedAd: true }, ({ selectedAd }) => `/ads/${selectedAd}/edit`)

export const getAdminRoute = pgr(() => '/admin')
