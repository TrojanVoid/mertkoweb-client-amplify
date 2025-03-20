if (typeof Notification === 'undefined') {
  // Define a dummy Notification constructor that does nothing
  window.Notification = function(title, options) {
    console.warn('Notification API is not supported in this environment.');
  };
  // Set a default permission value so that any checks for Notification.permission work
  window.Notification.permission = 'default';
  // Provide a dummy requestPermission method that resolves to 'default'
  window.Notification.requestPermission = function() {
    return Promise.resolve('default');
  };
}

import { Amplify } from 'aws-amplify';
import amplifyconfig from './amplifyconfiguration.json';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import "./index.css"; 


Amplify.configure(amplifyconfig);



const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

if (typeof window !== 'undefined') {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  if (isIOS && typeof Notification === 'undefined') {
    window.Notification = function(title, options) {
      console.log("Simulated Notification:", title, options);
    };
    window.Notification.requestPermission = function(callback) {
      if (callback) callback("denied");
      return Promise.resolve("denied");
    };
    window.Notification.permission = "denied";
    console.log("iOS tespit edildi: Notification API polyfill yüklendi.");
  }
}

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
