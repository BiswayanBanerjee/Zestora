// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )


import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from "react-redux";
import { store } from "./component/redux/store.js";
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App.jsx';
import './App.css';
import { AuthProvider } from './context/AuthContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>   {/* 👈 Redux Provider here */}
      <Router>
          <App />
      </Router>
    </Provider>
  </StrictMode>
);

