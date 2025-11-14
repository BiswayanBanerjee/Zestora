import { Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return null; // Do not render protected components
  }

  return <Outlet />;
};

export default PrivateRoute;
