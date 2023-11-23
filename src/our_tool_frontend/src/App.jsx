import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, } from "react-router-dom";
import Home from "./pages/Home/Home";
import Wallet from "./pages/Wallet/Wallet";
import Send from "./pages/Send/Send";
import Receive from "./pages/Receive/Receive";
import "./App.css";
import { useAuth, AuthProvider } from "./utils/useAuthClient";
import Footer from "./pages/Footer/Footer";
// import { useLocation } from 'react-router-dom';

function App() {

  const [showButton, setShowButton] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [currentRoute, setCurrentRoute] = useState(window.location.pathname)

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Update UI to show the "Add to home screen" button
      setShowButton(true);
    });
  }, []);
  function isIOS() {
    const userAgent = window.navigator.userAgent;
    return userAgent.includes("Mac");
  }
  function updateRoute(route) {
    setCurrentRoute(route)
  }



  useEffect(() => {
    window.addEventListener('appinstalled', (evt) => {
      console.log('Application was installed');
    });
  }, []);
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/wallet" element={<Wallet updateRoute={updateRoute} />} />
          <Route path="/send-token/:tokenId" element={<Send updateRoute={updateRoute} />} />
          <Route path="/receive-token" element={<Receive />} />
        </Routes>
        {currentRoute === '/wallet' && !isIOS() ? <Footer deferredPrompt={deferredPrompt} setShowButton={setShowButton} setDeferredPrompt={setDeferredPrompt} /> : ''}
      </Router>
    </div>
  );
}

export default () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);