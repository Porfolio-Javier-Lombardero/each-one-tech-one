
import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";

export const MainLayOut = () => {
  return (
    <>
      <Header />
      <main >
        <Outlet />
      </main>

      <Footer />
    </>
  );
};
