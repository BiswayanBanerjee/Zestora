import { Navigate } from 'react-router-dom';

// Check if the token exists in local storage
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
