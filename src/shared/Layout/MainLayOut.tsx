import React from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

export const LayOut = ({ children }) => {
  return (
    <>
      <Header />
      <main >
      {children}
      </main>

      <Footer />
    </>
  );
};
