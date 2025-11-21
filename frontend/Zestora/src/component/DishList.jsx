import React, { useEffect, useState } from 'react';
import {
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Box,
  Switch,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import {
  useDeleteRestaurantMutation,
  useToggleApprovalMutation,
  useToggleAvailabilityMutation,
  useFetchStatusesQuery,
} from './redux/services/restaurantApi';

import './DishList.css';

const DishList = ({ restaurants = [] }) => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [role, setRole] = useState(null);
  const [isPollingPaused, setIsPollingPaused] = useState(false);

  const [deleteRestaurant] = useDeleteRestaurantMutation();
  const [toggleApproval] = useToggleApprovalMutation();
  const [toggleAvailability] = useToggleAvailabilityMutation();

  const { data: statuses } = useFetchStatusesQuery(
    filteredRestaurants.map((r) => r.id),
    {
      skip: filteredRestaurants.length === 0,
      pollingInterval: isPollingPaused ? 0 : 15000,
    }
  );

  useEffect(() => {
    let filtered = restaurants;
    if (user) {
      const { role: userRole, email } = user;
      setRole(userRole);
      if (userRole === "OWNER") {
        filtered = restaurants.filter(
          (restaurant) => restaurant.email === email
        );
      }
    }
    setFilteredRestaurants(filtered);
  }, [user, restaurants]);

  useEffect(() => {
    if (statuses) {
      setFilteredRestaurants((prev) =>
        prev.map((restaurant) => ({
          ...restaurant,
          available:
            statuses[restaurant.id]?.isAvailable ?? restaurant.available,
          approved: statuses[restaurant.id]?.isApproved ?? restaurant.approved,
        }))
      );
    }
  }, [statuses]);

  const handleNavigate = (restaurant) => {
    if (restaurant.approved) {
      navigate(`/restaurant/${restaurant.id}`, {
        state: { restaurant, role },
      });
    }
  };

  const handleDelete = async (restaurantId) => {
    try {
      await deleteRestaurant(restaurantId).unwrap();
      setFilteredRestaurants((prev) =>
        prev.filter((restaurant) => restaurant.id !== restaurantId)
      );
      alert("Restaurant deleted successfully");
    } catch (error) {
      console.error("Error deleting restaurant:", error);
      alert("Failed to delete restaurant");
    }
  };

  const handleToggleApproved = async (restaurantId, isApproved) => {
    setFilteredRestaurants((prev) =>
      prev.map((r) =>
        r.id === restaurantId ? { ...r, approved: isApproved } : r
      )
    );
    setIsPollingPaused(true);
    try {
      await toggleApproval({ id: restaurantId, isApproved }).unwrap();
    } catch (error) {
      setFilteredRestaurants((prev) =>
        prev.map((r) =>
          r.id === restaurantId ? { ...r, approved: !isApproved } : r
        )
      );
    } finally {
      setTimeout(() => setIsPollingPaused(false), 2000);
    }
  };

  const handleToggleAvailable = async (restaurantId, isAvailable) => {
    setFilteredRestaurants((prev) =>
      prev.map((r) =>
        r.id === restaurantId ? { ...r, available: isAvailable } : r
      )
    );
    setIsPollingPaused(true);
    try {
      await toggleAvailability({ id: restaurantId, isAvailable }).unwrap();
    } catch (error) {
      console.error("Error toggling availability:", error);
    } finally {
      setIsPollingPaused(false);
    }
  };

  return (
    <div className="restaurantGridContainer">
      {filteredRestaurants.length > 0 ? (
        filteredRestaurants.map((restaurant) => (
          <div key={restaurant.id} className="restaurantGridItem">
            <Box
              onClick={() => handleNavigate(restaurant)}
              className="restaurantCard"
            >
              {/* 🔹 Image with overlay badges */}
              <Box className="restaurantImageWrapper">
                <img
                  src={restaurant.imageUrl || "/placeholder.jpg"}
                  alt={restaurant.name}
                  className="restaurantImage"
                />

                {/* Top-left badge */}
                <Box className="badgeTopLeft">Free delivery</Box>

                {/* Bottom badge */}
                <Box className="badgeBottom">
                  ITEMS AT ₹{restaurant.dishes?.[0]?.price || 99}
                </Box>
              </Box>

              {/* 🔹 Restaurant details below */}
              <Box className="restaurantDetails">
                <Typography variant="h6" className="restaurantTitle">
                  {restaurant.name}
                </Typography>
                <Typography variant="body2" className="restaurantMeta">
                  ⭐ {restaurant.rating} •{" "}
                  {restaurant.deliveryTime || "20-30 mins"}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {restaurant.cuisine || "Multi-cuisine"}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {restaurant.address || "Unknown Location"}
                </Typography>
              </Box>
            </Box>
          </div>
        ))
      ) : (
        <Typography variant="h6" align="center" style={{ width: "100%" }}>
          No restaurants available.
        </Typography>
      )}
    </div>
  );

};

export default DishList;
