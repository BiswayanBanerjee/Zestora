import React, { useState, useEffect } from "react";
import { Routes, Route, useParams, useLocation } from "react-router-dom";
import { Box, CircularProgress, Typography } from "@mui/material";
import Navbar from "./component/Navbar";
import Header from "./component/Header";
import DishManager from "./component/DishManager";
import Footer from "./component/Footer";
import OrderForm from "./component/OrderForm";
import Login from "./component/Login";
import SignUp from "./component/SignUp";
import PrivateRoute from "./component/PrivateRoute";
import DishDetail from "./component/DishDetail";
import AccountDashboard from "./component/AccountDashboard";
import RestaurantView from "./component/RestaurantView";
import useAppTheme from "./theme";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { useGetRestaurantsQuery } from "./component/redux/services/restaurantApi";

const App = () => {
  const { theme, setThemePreference } = useAppTheme();
  const location = useLocation();
  const [isWarmingUp, setIsWarmingUp] = useState(true);

  useEffect(() => {
    setIsWarmingUp(true); // loader shows immediately

    const urls = [
      `${import.meta.env.VITE_AUTH_WAKE_URL}/wake`,
      `${import.meta.env.VITE_CUSTOMER_WAKE_URL}/wake`,
      `${import.meta.env.VITE_RESTAURANT_WAKE_URL}/wake`,
    ];

    const interval = setInterval(async () => {
      const results = await Promise.all(
        urls.map(async (url) => {
          try {
            const res = await fetch(url);
            return res.ok;
          } catch {
            return false;
          }
        })
      );

      const allAwake = results.every((r) => r === true);

      if (allAwake) {
        clearInterval(interval);
        setIsWarmingUp(false); // stop loader
      }
    }, 500); // retry every 500ms (safe + fast)

    return () => clearInterval(interval);
  }, []);

  const { data: restaurants = [], error, isLoading } = useGetRestaurantsQuery();
  const [filteredDish, setFilteredDish] = useState([]);

  useEffect(() => {
    if (restaurants.length > 0) {
      setFilteredDish(restaurants);
    }
  }, [restaurants]);

  if (isWarmingUp) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          textAlign: "center",
          bgcolor: theme.palette.background.default,
        }}
      >
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Warming up servers... please wait 20–40 seconds
        </Typography>
      </Box>
    );
  }

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  const handleFilterDish = (category) => {
    if (category === "ALL") {
      setFilteredDish(restaurants);
    } else {
      const filteredRestaurants = restaurants
        .map((restaurant) => {
          const filteredDishes = restaurant.dishes.filter(
            (dish) =>
              dish.category &&
              dish.category.toLowerCase() === category.toLowerCase()
          );
          return { ...restaurant, dishes: filteredDishes };
        })
        .filter((r) => r.dishes.length > 0);

      setFilteredDish(filteredRestaurants);
    }
  };

  const handleHeaderSearch = (searchTerm) => {
    if (!searchTerm || searchTerm.toLowerCase() === "all") {
      setFilteredDish(restaurants);
    } else {
      const filteredRestaurants = restaurants
        .map((restaurant) => {
          const restaurantMatches = restaurant.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
          const filteredDishes = restaurant.dishes.filter(
            (dish) =>
              dish.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
              dish.name.toLowerCase().includes(searchTerm.toLowerCase())
          );

          if (restaurantMatches || filteredDishes.length > 0) {
            return { ...restaurant, dishes: filteredDishes };
          }
          return null;
        })
        .filter(Boolean);

      setFilteredDish(filteredRestaurants);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        className="App"
        sx={{
          backgroundColor: theme.palette.background.default,
          minHeight: "100vh",
        }}
      >
        <Header
          products={restaurants}
          onSearchDish={handleHeaderSearch}
          setThemePreference={setThemePreference}
        />
        {location.pathname === "/" && (
          <Navbar products={restaurants} onSearchDish={handleFilterDish} />
        )}
        <Routes>
          <Route path="/" element={<DishManager products={filteredDish} />} />
          <Route
            path="/dish/:dishId"
            element={<DishDetail dish={restaurants} />}
          />
          <Route
            path="/order"
            element={
              <PrivateRoute>
                <OrderPage dish={restaurants} />
              </PrivateRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <PrivateRoute>
                <OrderForm dish={filteredDish} />
              </PrivateRoute>
            }
          />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route
            path="/Profile"
            element={
              <PrivateRoute>
                <AccountDashboard />
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/restaurant/:id" element={<RestaurantView />} />
          <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Routes>
        {location.pathname === "/" && <Footer />}
      </Box>
    </ThemeProvider>
  );
};

const OrderSuccess = () => (
  <Box sx={{ textAlign: "center", p: 3 }}>
    <h2>Order Placed Successfully!</h2>
    <p>
      Thank you for your order. You will receive a confirmation email shortly.
    </p>
  </Box>
);

const OrderPage = ({ dish }) => {
  const { dishId } = useParams();
  const selectedDish = dish.find((item) => item.id.toString() === dishId);

  if (!selectedDish) {
    return <Box sx={{ textAlign: "center", p: 3 }}>Dish not found</Box>;
  }

  return <OrderForm dish={selectedDish} />;
};

export default App;
