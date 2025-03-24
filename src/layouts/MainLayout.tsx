import React from "react";
import Header from "../components/common/header/Header";
import Footer from "../components/common/footer/Footer";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 text-gray-800">
      <Header />
      <main className="flex-1 px-4 sm:px-6 md:px-8 mt-20">{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
