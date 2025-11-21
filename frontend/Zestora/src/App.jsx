import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Routes, Route, useParams, useLocation } from "react-router-dom";
import { Box, CircularProgress, Typography } from "@mui/material";
import Navbar from "./component/Navbar";
import Header from "./component/Header";
import DishManager from "./component/DishManager";
import Footer from "./component/Footer";
import OrderForm from "./component/OrderForm";
import PrivateRoute from "./component/PrivateRoute";
import DishDetail from "./component/DishDetail";
import AccountDashboard from "./component/AccountDashboard";
import RestaurantView from "./component/RestaurantView";
import useAppTheme from "./theme";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { useGetRestaurantsQuery } from "./component/redux/services/restaurantApi";
import AuthDrawer from "./component/AuthDrawer";

const App = () => {
  const { theme, setThemePreference } = useAppTheme();
  const location = useLocation();
  const [serverStatus, setServerStatus] = useState({
    auth: false,
    customer: false,
    restaurant: false,
  });
  const [isWarmingUp, setIsWarmingUp] = useState(true);
  const { data: restaurants = [], error, isLoading } = useGetRestaurantsQuery();
  const [filteredDish, setFilteredDish] = useState([]);
  const [authOpen, setAuthOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsWarmingUp(true);

    const urls = {
      auth: `${import.meta.env.VITE_AUTH_WAKE_URL}/wake`,
      customer: `${import.meta.env.VITE_CUSTOMER_WAKE_URL}/wake`,
      restaurant: `${import.meta.env.VITE_RESTAURANT_WAKE_URL}/wake`,
    };

    let delay = 500;
    const maxDelay = 8000;
    const timeout = 60000;
    const start = Date.now();

    const checkWake = async () => {
  if (Date.now() - start > timeout) {
    console.warn("⚠ Timeout: Some servers failed to wake.");
    setIsWarmingUp(false);
    return;
  }

  // FIX: always create full object
  const newStatus = {
    auth: false,
    customer: false,
    restaurant: false,
  };

  await Promise.all(
    Object.keys(urls).map(async (key) => {
      try {
        const res = await fetch(urls[key]);
        newStatus[key] = res.ok;
      } catch {
        newStatus[key] = false;
      }
    })
  );

  setServerStatus(newStatus);

  const allAwake = Object.values(newStatus).every((v) => v === true);

  if (allAwake) {
    console.log("🎉 All servers awake!");
    setIsWarmingUp(false);
    return;
  }

  delay = Math.min(delay * 2, maxDelay);
  setTimeout(checkWake, delay);
};


    checkWake();
  }, []);

  useEffect(() => {
    if (restaurants.length > 0) {
      setFilteredDish(restaurants);
    }
  }, [restaurants]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const protectedRoutes = ["/profile", "/order", "/checkout"];

    if (protectedRoutes.includes(location.pathname) && !token) {
      setAuthOpen(true);

      // If user typed the URL manually OR clicked a link:
      if (location.key !== "default") {
        navigate(-1); // go back to previous location
      } else {
        navigate("/"); // fallback if no history entry
      }
    }
  }, [location.pathname]);

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

        <Box sx={{ mt: 3, textAlign: "left" }}>
          <Typography>
            <b>Server Status:</b>
          </Typography>

          <Typography color={serverStatus.auth ? "green" : "red"}>
            {serverStatus.auth ? "✔ Auth Awake" : "⏳ Waking Auth..."}
          </Typography>

          <Typography color={serverStatus.customer ? "green" : "red"}>
            {serverStatus.customer
              ? "✔ Customer Awake"
              : "⏳ Waking Customer..."}
          </Typography>

          <Typography color={serverStatus.restaurant ? "green" : "red"}>
            {serverStatus.restaurant
              ? "✔ Restaurant Awake"
              : "⏳ Waking Restaurant..."}
          </Typography>
        </Box>
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
        <AuthDrawer open={authOpen} onClose={() => setAuthOpen(false)} />
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
            element={<PrivateRoute onRequireAuth={() => setAuthOpen(true)} />}
          >
            <Route path="/profile" element={<AccountDashboard />} />
            <Route path="/order" element={<OrderPage dish={restaurants} />} />
            <Route
              path="/checkout"
              element={<OrderForm dish={filteredDish} />}
            />
          </Route>

          <Route path="/order-success" element={<OrderSuccess />} />
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
