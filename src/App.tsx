import React from "react";
import {BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import EmptyWishlist  from "./pages/EmptyWishlist/EmptyWishlist";
import CreateWishlist from "./pages/CreateWishlists/CreateWishlists";
import WishlistView from "./pages/WishlistView/WishlistView";
import Home from "./pages/Home/Home";

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/home" />} />
                <Route path="/home" element={<Home />} />
                <Route path="/emptywishlist" element={<EmptyWishlist />} />
                <Route path="/create" element={<CreateWishlist />} />
                <Route path="/wishlist" element={<WishlistView />} />
            </Routes>
        </Router>
    );
};

export default App;

