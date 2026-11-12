import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { RequireAuth } from './components/RequireAuth'
import { ArticlePage } from './pages/ArticlePage'
import { BookmarksPage } from './pages/BookmarksPage'
import { CategoriesIndexPage } from './pages/CategoriesIndexPage'
import { CategoryPage } from './pages/CategoryPage'
import { EmailChangeVerifyPage } from './pages/EmailChangeVerifyPage'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage'
import { GoogleCallbackPage } from './pages/GoogleCallbackPage'
import { HomePage } from './pages/HomePage'
import { LatestPage } from './pages/LatestPage'
import { LoginPage } from './pages/LoginPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { ProfilePage } from './pages/ProfilePage'
import { RegisterPage } from './pages/RegisterPage'
import { ReporterPage } from './pages/ReporterPage'
import { ResetPasswordPage } from './pages/ResetPasswordPage'
import { SearchResultsPage } from './pages/SearchResultsPage'
import { TagPage } from './pages/TagPage'
import { TopicsIndexPage } from './pages/TopicsIndexPage'
import { VerifyEmailPage } from './pages/VerifyEmailPage'

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    const root = document.documentElement
    const previousBehavior = root.style.scrollBehavior
    root.style.scrollBehavior = 'auto'
    window.scrollTo(0, 0)
    root.style.scrollBehavior = previousBehavior
  }, [pathname])

  return null
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-page">
      <ScrollToTop />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[80] focus:rounded-[3px] focus:bg-brand focus:px-3 focus:py-2 focus:text-[12px] focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>
      <Header />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/latest" element={<LatestPage />} />
          <Route path="/categories" element={<CategoriesIndexPage />} />
          <Route path="/categories/:slug" element={<CategoryPage />} />
          <Route path="/topics" element={<TopicsIndexPage />} />
          <Route path="/tags/:slug" element={<TagPage />} />
          <Route path="/reporters/:slug" element={<ReporterPage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/articles/:slug" element={<ArticlePage />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route
            path="/verify-email-change"
            element={<EmailChangeVerifyPage />}
          />
          <Route
            path="/auth/google/callback"
            element={<GoogleCallbackPage />}
          />

          <Route
            path="/profile"
            element={
              <RequireAuth>
                <ProfilePage />
              </RequireAuth>
            }
          />
          <Route
            path="/bookmarks"
            element={
              <RequireAuth>
                <BookmarksPage />
              </RequireAuth>
            }
          />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}
