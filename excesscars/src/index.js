import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router";
import './index.css';
import Home from './pages/Home';
import VehcileListings from './pages/VehicleListings';
import VehicleDetails from './pages/VehicleDetails';
import Layout from './components/Layout';
import HowItWorks from './pages/HowItWorks';
import ContactUs from './pages/ContactUs';
import reportWebVitals from './reportWebVitals';

const root = document.getElementById('root');
ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home name="Home Page" />} />
        <Route path='vehicles' element={<VehcileListings name="Vehicles Page" />} />
        <Route path="/vehicle/:vin" element={<VehicleDetails/>} />
        <Route path='howitworks' element={<HowItWorks/>} />
        <Route path='contactus' element={<ContactUs/>} />
      </Route>
    </Routes>
  </BrowserRouter>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
