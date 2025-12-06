import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Box from "@mui/material/Box";
import Switch from "@mui/material/Switch";
import IconButton from "@mui/material/IconButton";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styles from "../styles/DishList.module.css";
import {
  useDeleteRestaurantMutation,
  useToggleApprovalMutation,
  useToggleAvailabilityMutation,
  useFetchStatusesQuery,
} from "../redux/services/restaurantApi";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useUpdateFavouritesMutation } from "../redux/services/customerApi"; // :contentReference[oaicite:0]{index=0}
import { setCustomerData } from "../redux/slices/customerSlice"; // :contentReference[oaicite:1]{index=1}

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
  const dispatch = useDispatch();
  const favouriteRestaurants = useSelector(
    (state) => state.customer.customerData.favourites || []
  );
  const [updateFavourites] = useUpdateFavouritesMutation();

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

  const handleToggleFavouriteRestaurant = async (restaurantId) => {
    if (!user) {
      alert("Please login first");
      return;
    }

    let updated = [...favouriteRestaurants];

    if (updated.includes(String(restaurantId))) {
      updated = updated.filter((id) => id !== String(restaurantId));
    } else {
      updated.push(String(restaurantId));
    }

    // Update backend
    await updateFavourites({
      id: user.email,
      favourites: updated,
    });

    // Update Redux state
    dispatch(setCustomerData({ favourites: updated }));
  };

  return (
    <div className={styles.restaurantGridContainer}>
      {filteredRestaurants.length > 0 ? (
        filteredRestaurants.map((restaurant) => (
          <div key={restaurant.id} className={styles.restaurantGridItem}>
            <Box
              onClick={() => handleNavigate(restaurant)}
              className={styles.restaurantCard}
            >
              {/* 🔹 Image with overlay badges */}
              <Box className={styles.restaurantImageWrapper}>
                {/* ❤️ Favorite Icon for Restaurant */}
                <Box
                  className={styles.favIcon}
                  onClick={(e) => {
                    e.stopPropagation(); // prevent navigating into restaurant
                    handleToggleFavouriteRestaurant(restaurant.id);
                  }}
                >
                  {favouriteRestaurants.includes(String(restaurant.id)) ? (
                    <FavoriteIcon className={styles.favFilled} />
                  ) : (
                    <FavoriteBorderIcon className={styles.favOutline} />
                  )}
                </Box>

                <img
                  src={restaurant.imageUrl || "/placeholder.jpg"}
                  alt={restaurant.name}
                  className={styles.restaurantImage}
                />

                {/* Top-left badge */}
                <Box className={styles.badgeTopLeft}>Free delivery</Box>

                {/* Bottom badge */}
                <Box className={styles.badgeBottom}>
                  ITEMS AT ₹{restaurant.dishes?.[0]?.price || 99}
                </Box>
              </Box>

              {/* 🔹 Restaurant details below */}
              <Box className={styles.restaurantDetails}>
                <Typography variant="h6" className={styles.restaurantTitle}>
                  {restaurant.name}
                </Typography>
                <Typography variant="body2" className={styles.restaurantMeta}>
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
