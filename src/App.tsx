import { EmptyWishlist } from "./components/EmptyWishlist/EmptyWishlist";
import { Footer } from "./components/Footer/Footer";
import { Header } from "./components/Header/Header";
import React from "react";

export const App: React.FC = () => {
  return (
    <div>
      <Header />
      <main>
        <EmptyWishlist />
      </main>
      <Footer />
    </div>
  );
};
