import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
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
import PrivateRoute from './components/routing/PrivateRoute';
import AdminRoute from './components/routing/AdminRoute';
import './styles/App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Header />
          <main className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/calculators/mortgage" element={<MortgageCalculator />} />
              <Route path="/calculators/car-loan" element={<CarLoanCalculator />} />
              <Route path="/calculators/consumer-loan" element={<ConsumerLoanCalculator />} />
              <Route path="/calculators/pension" element={<PensionCalculator />} />
              
              {/* Защищенные маршруты для администраторов */}
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
              
              {/* Маршрут для несуществующих страниц */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
