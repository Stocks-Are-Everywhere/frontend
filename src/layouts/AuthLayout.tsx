import React from "react";

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
