import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Profile from "./pages/Profile/Profile";
import EditProfile from './pages/EditProfile/EditProfile';
import MyReservations from './pages/MyReservations/MyReservations';
import { AuthProvider, useAuth } from './context/AuthContext';

export const API_URL = 'http://localhost:7777';

// Добавляем webpackPrefetch, чтобы заранее подгружать бандлы страниц на фоне
const Home = React.lazy(() => import(/* webpackPrefetch: true */ './pages/Home/Home'));
const Registration = React.lazy(() => import(/* webpackPrefetch: true */ './pages/Registration/Registration'));
const Login = React.lazy(() => import(/* webpackPrefetch: true */ './pages/Login/Login'));
const Privacy = React.lazy(() => import(/* webpackPrefetch: true */ './pages/Privacy/Privacy'));
const Terms = React.lazy(() => import(/* webpackPrefetch: true */ './pages/Terms/Terms'));
const Friends = React.lazy(() => import(/* webpackPrefetch: true */ './pages/Friends/Friends'));
const EmptyWishlist = React.lazy(() => import(/* webpackPrefetch: true */ './pages/EmptyWishlist/EmptyWishlist'));
const CreateWishlist = React.lazy(() => import(/* webpackPrefetch: true */ './pages/CreateWishlists/CreateWishlists'));
const WishlistView = React.lazy(() => import(/* webpackPrefetch: true */ './pages/WishlistView/WishlistView'));
const GiftIdeas = React.lazy(() => import(/* webpackPrefetch: true */ './pages/GiftIdeas/GiftIdeas'));
const GiftIdeaDetail = React.lazy(() => import(/* webpackPrefetch: true */ './pages/GiftIdeaDetail/GiftIdeaDetail'));
const FriendWishlistView = React.lazy(() => import(/* webpackPrefetch: true */ './pages/FriendWishlistView/FriendWishlistView'));

// Компонент для защиты приватных страниц
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuth, isLoading } = useAuth();
    if (isLoading) return <LoadingFallback />;
    return isAuth ? <>{children}</> : <Navigate to="/login" />;
};

// Менее навязчивый фолбэк: убираем полноэкранную «Загрузка...»
const LoadingFallback = () => null;

const App: React.FC = () => {
    return (
        <Router>
            <AuthProvider>
                {/* Убираем заметный фолбэк, чтобы при ленивой подгрузке не было полноэкранной задержки */}
                <Suspense fallback={<LoadingFallback />}>
                    <Routes>
                        <Route path="/" element={<Navigate to="/home" />} />
                        
                        <Route path="/home" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/registration" element={<Registration />} />
                        <Route path="/privacy" element={<Privacy />} />
                        <Route path="/terms" element={<Terms />} />
                        <Route path="/ideas" element={<GiftIdeas />} />
                        <Route path="/ideas/:id" element={<GiftIdeaDetail />} />


                        <Route path="/friends" element={<ProtectedRoute><Friends /></ProtectedRoute>} />
                        <Route path="/emptywishlist" element={<ProtectedRoute><EmptyWishlist /></ProtectedRoute>} />
                        <Route path="/create" element={<ProtectedRoute><CreateWishlist /></ProtectedRoute>} />
                        <Route path="/wishlist" element={<ProtectedRoute><EmptyWishlist /></ProtectedRoute>} />
                        <Route path="/wishlist/:id" element={<ProtectedRoute><WishlistView /></ProtectedRoute>} />
                        <Route path="/friend-wishlist" element={<ProtectedRoute><FriendWishlistView /></ProtectedRoute>} />
                        <Route path="/friend-wishlist/:id" element={<ProtectedRoute><FriendWishlistView /></ProtectedRoute>} />
                        <Route path="/reservations" element={<ProtectedRoute><MyReservations /></ProtectedRoute>} />
                        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                        <Route path="/profile/:id" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                        <Route path="/editprofile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
                        <Route path="/editprofile/:id" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
                        
                        <Route path="*" element={<Navigate to="/home" />} />
                    </Routes>
                </Suspense>
            </AuthProvider>
        </Router>
    );
};

export default App;