import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home/Home';
import Registration from './pages/Registration/Registration';
import Login from './pages/Login/Login';
import Privacy from './pages/Privacy/Privacy';
import Terms from './pages/Terms/Terms'
import Friends from './pages/Friends/Friends';
import EmptyWishlist  from "./pages/EmptyWishlist/EmptyWishlist";
import CreateWishlist from "./pages/CreateWishlists/CreateWishlists";
import WishlistView from "./pages/WishlistView/WishlistView";
import Profile from "./pages/Profile/Profile";


const App: React.FC = () => {
    return (
        <Router>
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
                <Route path="/profile" element={<Profile />} />
            </Routes>
        </Router>
    );
};

export default App;

