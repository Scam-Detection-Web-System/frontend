import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from './pages/user/Home';
import PersonalPage from './pages/user/PersonalPage';
import EditProfilePage from './pages/user/EditProfilePage';
import SecurityPage from './pages/user/SecurityPage';
import AdminDashboard from './pages/admin/AdminDashboard';

import { ThemeProvider } from "@/components/shared/theme-provider"
import { AuthProvider, useAuth } from "@/contexts/auth-context"
import { Toaster } from "@/components/ui/sonner"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ScamChecker } from "@/components/sections/scam-checker"
import { ReportForm } from "@/components/sections/report-form"
import { NewsSection } from "@/components/sections/news-section"
import { GuidesSection } from "@/components/sections/guides-section"
import { LogoutOverlay } from "@/components/shared/LogoutOverlay"
import NewsDetailPage from "./pages/user/NewsDetailPage"
import QuizPage from "./pages/user/QuizPage"
import QuizHistoryPage from "./pages/user/QuizHistoryPage"
import PhoneAssessmentPage from "./pages/user/PhoneAssessmentPage"
import { ChatbotButton } from "@/components/shared/chatbot-button"

// Protected route component for admin pages
function AdminRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isAdmin } = useAuth()

    if (!isAuthenticated || !isAdmin) {
        return <Navigate to="/" replace />
    }

    return <>{children}</>
}

// User-only route: redirect admin to /admin
function UserRoute({ children }: { children: React.ReactNode }) {
    const { isAdmin, isAuthenticated } = useAuth()

    if (isAuthenticated && isAdmin) {
        return <Navigate to="/admin" replace />
    }

    return <>{children}</>
}

function ScrollToTop() {
    const { pathname } = useLocation()
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [pathname])
    return null
}

function AppRoutes() {
    return (
        <Routes>
            {/* Admin route — full-screen layout, no header/footer */}
            <Route
                path="/admin/*"
                element={
                    <AdminRoute>
                        <AdminDashboard />
                    </AdminRoute>
                }
            />

            {/* Public routes with shared header/footer */}
            <Route
                path="*"
                element={
                    <div className="flex min-h-screen flex-col bg-background">
                        <Header />
                        <main className="flex flex-1 flex-col">
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/taikhoan" element={<UserRoute><PersonalPage /></UserRoute>} />
                                <Route path="/taikhoan/chinhsua" element={<UserRoute><EditProfilePage /></UserRoute>} />
                                <Route path="/baomat" element={<UserRoute><SecurityPage /></UserRoute>} />
                                <Route
                                    path="/kiemtra"
                                    element={
                                        <div className="flex flex-1 items-center justify-center p-4">
                                            <ScamChecker />
                                        </div>
                                    }
                                />
                                <Route path="/baocao" element={<ReportForm />} />
                                <Route path="/tintuc" element={<NewsSection />} />
                                <Route path="/tintuc/:id" element={<NewsDetailPage />} />
                                <Route path="/huongdan" element={<GuidesSection />} />
                                <Route path="/quiz" element={<QuizPage />} />
                                <Route path="/quiz/history" element={<QuizHistoryPage />} />
                                <Route path="/tracuu/:phone" element={<PhoneAssessmentPage />} />
                            </Routes>
                        </main>
                        <Footer />
                        <ChatbotButton />
                    </div>
                }
            />
        </Routes>
    )
}

function App() {
    return (
        <AuthProvider>
            <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
                <Router>
                    <ScrollToTop />
                    <AppRoutes />
                    <LogoutOverlay />
                    <Toaster />
                </Router>
            </ThemeProvider>
        </AuthProvider>
    );
}

export default App;
