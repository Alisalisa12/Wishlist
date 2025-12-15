import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
const Home = React.lazy(() => import('./pages/Home/Home'));
const Registration = React.lazy(() => import('./pages/Registration/Registration'));
const Login = React.lazy(() => import('./pages/Login/Login'));
const Privacy = React.lazy(() => import('./pages/Privacy/Privacy'));
const Terms = React.lazy(() => import('./pages/Terms/Terms'));
const Friends = React.lazy(() => import('./pages/Friends/Friends'));
const EmptyWishlist = React.lazy(() => import('./pages/EmptyWishlist/EmptyWishlist'));
const CreateWishlist = React.lazy(() => import('./pages/CreateWishlists/CreateWishlists'));
const WishlistView = React.lazy(() => import('./pages/WishlistView/WishlistView'));
const GiftIdeas = React.lazy(() => import('./pages/GiftIdeas/GiftIdeas'));

// Компонент загрузки
const LoadingFallback = () => (
    <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#666'
    }}>
        Загрузка...
    </div>
);

const App: React.FC = () => {
    return (
        <Router>
            <Suspense fallback={<LoadingFallback />}>
                <Routes>
                    <Route path="/" element={<Navigate to="/home" />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/registration" element={<Registration />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/friends" element={<Friends />} />
                    <Route path="/emptywishlist" element={<EmptyWishlist />} />
                    <Route path="/create" element={<CreateWishlist />} />
                    <Route path="/wishlist" element={<WishlistView />} />
                    <Route path="/ideas" element={<GiftIdeas />} />
                </Routes>
            </Suspense>
        </Router>
    );
};

export default App;

