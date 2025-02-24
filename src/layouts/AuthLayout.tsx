import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

interface MainLayoutProps {
    children: React.ReactNode;
}

const AuthLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <>
            <main>{children}</main>
        </>
    );
};

export default AuthLayout;
