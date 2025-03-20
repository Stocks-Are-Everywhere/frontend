import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

// Components

import AuthCallbackHandler from './components/auth/AuthCallbackHandler';
import RedirectIfAuth from './components/auth/RedirectIfAuth';
import styled from 'styled-components';

// Pages
import AuthPage from './pages/auth/AuthPage';
import HomePage from './pages/base/HomePage';
import TradingPage from './pages/trading/TradingPage';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import PersonalPage from './pages/personal/PersonalPage';

const App: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    console.log(`Navigated to: ${location.pathname}`);
  }, [location]);

  return (
    <AppContainer>
      <Routes>
        {/* No Auth */}
        <Route
          path="/"
          element={
            <MainLayout>
              <HomePage />
            </MainLayout>
          }
        />
        <Route
          path="/order/:companyCode"
          element={
            <MainLayout>
              <TradingPage />
            </MainLayout>
          }
        />
        <Route
          path="/personal"
          element={
            <MainLayout>
              <PersonalPage />
            </MainLayout>
          }
        />
        {/* Auth */}
        <Route
          path="/auth"
          element={
            <AuthLayout>
              <RedirectIfAuth>
                <AuthPage />
              </RedirectIfAuth>
            </AuthLayout>
          }
        />
        <Route path="/auth/callback" element={<AuthCallbackHandler />} />
      </Routes>
    </AppContainer>
  );
};

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    'Helvetica Neue', Arial, sans-serif;
`;

export default App;
