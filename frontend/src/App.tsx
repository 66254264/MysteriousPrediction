import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { HomePage } from './pages/HomePage'
import ErrorBoundary from './components/ErrorBoundary'
import { OfflineIndicator } from './components/OfflineIndicator'

// Lazy load pages for code splitting
const LoginPage = lazy(() => import('./pages/LoginPage'))
const RegisterPage = lazy(() => import('./pages/RegisterPage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const TarotPage = lazy(() => import('./pages/TarotPage'))
const AstrologyPage = lazy(() => import('./pages/AstrologyPage'))
const BaziPage = lazy(() => import('./pages/BaziPage'))
const YijingPage = lazy(() => import('./pages/YijingPage'))
const ResultPage = lazy(() => import('./pages/ResultPage'))

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
  </div>
)

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <OfflineIndicator />
          <div className="min-h-screen bg-gradient-to-br from-mystic-900 via-purple-900 to-indigo-900 flex flex-col">
            <Header />
            <main className="flex-1">
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/divination/tarot"
                    element={
                      <ProtectedRoute>
                        <TarotPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/divination/astrology"
                    element={
                      <ProtectedRoute>
                        <AstrologyPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/divination/bazi"
                    element={
                      <ProtectedRoute>
                        <BaziPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/divination/yijing"
                    element={
                      <ProtectedRoute>
                        <YijingPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/result"
                    element={
                      <ProtectedRoute>
                        <ResultPage />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </Suspense>
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  )
}

export default App
