import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getBalance } from "../../../services/orderService";
import Logo from "./Logo";
import SearchBar from "../searchbar/SearchBar";
import Navigation from "./Navigation";
import UserSection from "./UserSection";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [balance, setBalance] = useState<number>(1000000);

  useEffect(() => {
    setBalance(getBalance());
    const intervalId = setInterval(() => {
      setBalance(getBalance());
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <header className="fixed top-0 z-50 w-full h-20 bg-white border-b border-gray-200">
      <div className="max-w-screen-xl h-full mx-auto px-6 flex items-center justify-between">
        <Logo />
        <div className="flex-1 flex justify-center items-center">
          <SearchBar />
        </div>
        <Navigation />
        <UserSection />
      </div>
    </header>
  );
};

export default Header;
