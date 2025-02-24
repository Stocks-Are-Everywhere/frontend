import React, { useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";

// Components
import AuthCallbackHandler from "./components/Auth/AuthCallbackHandler";
import RedirectIfAuth from "./components/Auth/RedirectIfAuth";
import styled from "styled-components";

// Pages
import AuthPage from "./pages/Auth/AuthPage";
import HomePage from "./pages/Base/HomePage";

// Layouts
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";


const App: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    console.log(`Navigated to: ${location.pathname}`);
  }, [location]);

  return (
    <AppContainer>
        <Routes>
            {/* No Auth */}
            <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
            {/* Auth */}
            <Route path="/auth" element={<AuthLayout><RedirectIfAuth><AuthPage /></RedirectIfAuth></AuthLayout>} />
            <Route path="/auth/callback" element={<AuthCallbackHandler />} />
          </Routes>
    </AppContainer>
  );
};

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
`;



export default App;
