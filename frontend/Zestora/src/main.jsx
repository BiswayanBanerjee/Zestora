import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from "react-redux";
import { store } from "./redux/store.js";
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

