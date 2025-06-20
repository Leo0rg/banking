import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import { AuthProvider } from './context/AuthContext';
import Header from './components/layout/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MortgageCalculator from './pages/calculators/MortgageCalculator';
import CarLoanCalculator from './pages/calculators/CarLoanCalculator';
import ConsumerLoanCalculator from './pages/calculators/ConsumerLoanCalculator';
import PensionCalculator from './pages/calculators/PensionCalculator';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCalculators from './pages/admin/AdminCalculators';
import AdminCalculatorEdit from './pages/admin/AdminCalculatorEdit';
import NotFound from './pages/NotFound';
import AdminRoute from './components/routing/AdminRoute';
import GlobalStyle from './styles/GlobalStyle';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 2rem 0;
`;

function App() {
  return (
    <AuthProvider>
      <GlobalStyle />
      <Router>
        <AppContainer>
          <Header />
          <MainContent>
            <div className="container">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/calculators/mortgage" element={<MortgageCalculator />} />
                <Route path="/calculators/car-loan" element={<CarLoanCalculator />} />
                <Route path="/calculators/consumer-loan" element={<ConsumerLoanCalculator />} />
                <Route path="/calculators/pension" element={<PensionCalculator />} />
                
                <Route 
                  path="/admin" 
                  element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  } 
                />
                <Route 
                  path="/admin/calculators" 
                  element={
                    <AdminRoute>
                      <AdminCalculators />
                    </AdminRoute>
                  } 
                />
                <Route 
                  path="/admin/calculators/:id" 
                  element={
                    <AdminRoute>
                      <AdminCalculatorEdit />
                    </AdminRoute>
                  } 
                />
                <Route 
                  path="/admin/calculators/new" 
                  element={
                    <AdminRoute>
                      <AdminCalculatorEdit />
                    </AdminRoute>
                  } 
                />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </MainContent>
        </AppContainer>
      </Router>
    </AuthProvider>
  );
}

export default App;
