import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Catalog from './components/catalog/Catalog';
import Product from './components/product/Product';
import RegistrationForm from './components/register/Register';
import LoginForm from './components/login/Login';
import Profile from './components/profile/Profile';
import Header from './components/header/Header';
import About from './components/about/about';
import Main from './components/main/main';
function App() {
  return (
      <Router>
        <AppContent/>
      </Router>
  );
}

function AppContent() {
  const location = useLocation();
  const hideHeaderPaths = ['/', '/register'];
  const shouldShowHeader = !hideHeaderPaths.includes(location.pathname);

  return (
    <>
      {shouldShowHeader && <Header />}
      <Routes>
        <Route path='/main' element={<Main />} />
        <Route path='/about' element={<About />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/register' element={<RegistrationForm />} />
        <Route path='/' element={<LoginForm />} />
        <Route path='/catalog' element={<Catalog />} />
        <Route path='/catalog/product/:id' element={<Product />} />
      </Routes>
    </>
  );
}
export default App;
