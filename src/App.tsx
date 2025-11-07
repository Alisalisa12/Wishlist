import { EmptyWishlist } from "./pages/EmptyWishlist/EmptyWishlist";
// import { Footer } from "./components/Footer/Footer";
// import { Header } from "./components/Header/Header";
import React from "react";
import {BrowserRouter, Routes, Route } from "react-router-dom";
import CreateWishlist from "./pages/CreateWishlists/CreateWishlists";

export const App: React.FC = () => {
  return (
    <div>
      {/* <Header /> */}
      <main>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<EmptyWishlist />} />
            <Route path="/create" element={<CreateWishlist />} />
          </Routes>
        </BrowserRouter>
      </main>
      {/* <Footer /> */}
    </div>
  );
};