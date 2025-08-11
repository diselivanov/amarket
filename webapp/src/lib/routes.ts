import { pgr } from '../utils/pumpGetRoute'

export const getSignUpRoute = pgr(() => '/sign-up')

export const getSignInRoute = pgr(() => '/sign-in')

export const getSignOutRoute = pgr(() => '/sign-out')

export const getEditProfileRoute = pgr(() => '/edit-profile')

export const getAllAdsRoute = pgr(() => '/')

export const getViewAdRoute = pgr({ selectedAd: true }, ({ selectedAd }) => `/ads/${selectedAd}`)

export const getEditAdRoute = pgr({ selectedAd: true }, ({ selectedAd }) => `/ads/${selectedAd}/edit`)

export const getNewAdRoute = pgr(() => '/ads/new')
