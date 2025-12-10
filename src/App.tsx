import React from "react";
import {BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EmptyWishlist  from "./pages/EmptyWishlist/EmptyWishlist";
import CreateWishlist from "./pages/CreateWishlists/CreateWishlists";
import WishlistView from "./pages/WishlistView/WishlistView";

const App: React.FC = () => {
  return (
    <div>
      <main>
        <Router>
          <Routes>
            <Route path="/emptywishlist" element={<EmptyWishlist />} />
            <Route path="/create" element={<CreateWishlist />} />
             <Route path="/wishlist" element={<WishlistView />} />
          </Routes>
        </Router>
      </main>
    </div>
  );
};
export default App;