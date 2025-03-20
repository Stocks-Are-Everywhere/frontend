import React from "react";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";

import styled from "styled-components";

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <>
            <MainContent>
                <Header />
                    <main>{children}</main>
                <Footer />
            </MainContent>
        </>
    );
};

const MainContent = styled.main`
  flex: 1;
  margin-top: 64px;
  padding: 24px;
`;

export default MainLayout;
