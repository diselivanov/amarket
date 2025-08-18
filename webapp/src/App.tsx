import { HelmetProvider } from 'react-helmet-async'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { NotAuthRouteTracker } from './components/NotAuthRouteTracker'
import { AppContextProvider } from './lib/ctx'
import * as routes from './lib/routes'
import { TrpcProvider } from './lib/trpc'
import { AllAdsPage } from './pages/ads/AllAdsPage'
import { EditAdPage } from './pages/ads/EditAdPage'
import { NewAdPage } from './pages/ads/NewAdPage'
import { ViewAdPage } from './pages/ads/ViewAdPage'
import { EditProfilePage } from './pages/auth/EditProfilePage'
import { SignInPage } from './pages/auth/SignInPage'
import { SignOutPage } from './pages/auth/SignOutPage'
import { SignUpPage } from './pages/auth/SignUpPage'
import { NotFoundPage } from './pages/other/NotFoundPage'
import './styles/global.scss'
import { ProfilePage } from './pages/auth/ProfilePage'
import { AdminPage } from './pages/AdminPage'

export const App = () => {
  return (
    <HelmetProvider>
      <TrpcProvider>
        <AppContextProvider>
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <NotAuthRouteTracker />
            <Routes>
              <Route path={routes.getSignOutRoute.definition} element={<SignOutPage />} />
              <Route element={<Layout />}>
                <Route path={routes.getSignUpRoute.definition} element={<SignUpPage />} />
                <Route path={routes.getSignInRoute.definition} element={<SignInPage />} />
                <Route path={routes.getProfileRoute.definition} element={<ProfilePage />} />
                <Route path={routes.getEditProfileRoute.definition} element={<EditProfilePage />} />
                <Route path={routes.getAllAdsRoute.definition} element={<AllAdsPage />} />
                <Route path={routes.getViewAdRoute.definition} element={<ViewAdPage />} />
                <Route path={routes.getEditAdRoute.definition} element={<EditAdPage />} />
                <Route path={routes.getNewAdRoute.definition} element={<NewAdPage />} />
                <Route path={routes.getAdminRoute.definition} element={<AdminPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AppContextProvider>
      </TrpcProvider>
    </HelmetProvider>
  )
}
