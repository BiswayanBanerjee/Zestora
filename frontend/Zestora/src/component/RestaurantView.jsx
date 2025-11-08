import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Typography,
  Grid,
  Box,
  Card,
  CardContent,
  IconButton,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Slider,
  CardMedia,
  ToggleButton,
  ToggleButtonGroup,
  Switch,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SquareIcon from "@mui/icons-material/Stop"; // solid square icon
import styles from "./RestaurantView.module.css";
import DishListCard from "./DishListCard";

// ✅ RTK Query hooks
import {
  useGetRestaurantByIdQuery,
  useDeleteDishMutation,
  useAddDishMutation,
} from "./redux/services/restaurantApi";

const RestaurantView = () => {
  const location = useLocation();
  const { id } = useParams();
  const restaurantFromState = location.state ? location.state.restaurant : null;
  const role = location.state ? location.state.role : null;
  const isOwner = role === "OWNER";
  const navigate = useNavigate();

  const { data: restaurant, isLoading } = useGetRestaurantByIdQuery(id, {
    skip: !id,
  });

  const [deleteDish] = useDeleteDishMutation();
  const [addDish] = useAddDishMutation();

  const [newDishData, setNewDishData] = useState({
    name: "",
    description: "",
    price: 0,
    imageUrl: "",
    isVeg: false,
    rating: 1,
    isAvailable: true,
    discount: 0,
    isDiscountAvailable: false,
    category: "",
  });
  const [isAdding, setIsAdding] = useState(false);
  const [imagePath, setImagePath] = useState("");

  // ✅ Search + Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [vegFilter, setVegFilter] = useState("all");

  const handleVegFilterChange = (event, newFilter) => {
    if (newFilter !== null) setVegFilter(newFilter);
  };

  const renderStars = (rating) => {
    const starCount = Math.floor(rating);
    return [...Array(5)].map((_, index) => (
      <span key={index} style={{ color: "gold" }}>
        {index < starCount ? "★" : "☆"}
      </span>
    ));
  };

  const handleDeleteDish = async (dishId) => {
    try {
      await deleteDish({ restaurantId: id, dishId }).unwrap();
      alert("Dish deleted successfully");
    } catch (error) {
      console.error("Error deleting dish:", error);
      alert("Failed to delete dish");
    }
  };

  const handleAddDish = async () => {
    try {
      await addDish({ restaurantId: id, dish: newDishData }).unwrap();
      setIsAdding(false);
      alert("Dish added successfully");
    } catch (error) {
      console.error("Error adding new dish:", error);
      alert("Failed to add dish");
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewDishData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSliderChange = (event, newValue) => {
    setNewDishData((prev) => ({
      ...prev,
      rating: newValue,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileName = file.name;
      setImagePath(URL.createObjectURL(file));
      setNewDishData((prev) => ({
        ...prev,
        imageUrl: `dishes/${fileName}`,
      }));
    }
  };

  useEffect(() => {
    const scrollDishName = location.state?.scrollToDish;
    if (scrollDishName) {
      const timer = setTimeout(() => {
        const dishElement = document.querySelector(
          `[data-dish-name="${scrollDishName}"]`
        );
        if (dishElement) {
          dishElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 200); // wait for render
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  if (isLoading) {
    return <Typography variant="h6">Loading restaurant...</Typography>;
  }

  if (!restaurant || !restaurant.dishes) {
    return (
      <Typography variant="h6">Restaurant or dishes not found.</Typography>
    );
  }

  // ✅ Apply filters
  const filteredDishes = restaurant.dishes.filter((dish) => {
    const matchesSearch = dish.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter =
      vegFilter === "all" ? true : vegFilter === "veg" ? dish.veg : !dish.veg;

    return matchesSearch && matchesFilter;
  });

  return (
    <Box className={styles.restaurantView}>
      <Typography
        variant="h4"
        align="left"
        gutterBottom
        className={styles.restaurantName}
      >
        {restaurant.name}
      </Typography>

      {/* 🔎 Search + Veg/Non-Veg Switches */}
      <Box className={styles.filterBar}>
        <TextField
          variant="outlined"
          placeholder="Search for dishes"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
          sx={{
            bgcolor: "background.paper",
            // thinner border on focus and keep color subtle
            "& .MuiOutlinedInput-root fieldset": {
              borderWidth: "1px",
            },
            "& .MuiOutlinedInput-root.Mui-focused fieldset": {
              borderColor: "grey.500",
              borderWidth: "1px",
            },
          }}
        />

        <Box className={styles.switchFilters}>
          <FormControlLabel
            control={
              <Switch
                checked={vegFilter === "veg"}
                onChange={(e) => setVegFilter(e.target.checked ? "veg" : "all")}
                // style the switch thumb/track using sx so CSS module scoping won't break MUI internals
                sx={{
                  "& .MuiSwitch-thumb": {
                    bgcolor: "green",
                    borderRadius: 1,
                  },
                  "& .MuiSwitch-track": {
                    bgcolor: "#5e5a5a",
                    opacity: 1,
                  },
                  "&.Mui-checked + .MuiSwitch-track": {
                    bgcolor: "green",
                    opacity: 1,
                  },
                }}
              />
            }
          />

          <FormControlLabel
            control={
              <Switch
                checked={vegFilter === "nonVeg"}
                onChange={(e) =>
                  setVegFilter(e.target.checked ? "nonVeg" : "all")
                }
                sx={{
                  "& .MuiSwitch-thumb": {
                    bgcolor: "red",
                    borderRadius: 1,
                  },
                  "& .MuiSwitch-track": {
                    bgcolor: "#5e5a5a",
                    opacity: 1,
                  },
                  "&.Mui-checked + .MuiSwitch-track": {
                    bgcolor: "red",
                    opacity: 1,
                  },
                }}
              />
            }
          />
        </Box>
      </Box>

      <Box className={styles.dishGrid}>
        {filteredDishes.map((dish) => (
          <Box
            key={dish.id}
            sx={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            <DishListCard dish={dish} />
          </Box>
        ))}

        {/* Empty DishCard for Adding New Dish */}
        {isOwner && (
          <Grid item xs={12}>
            <Card
              className={styles.addDishCard}
              onClick={() => setIsAdding(true)}
            >
              {!isAdding ? (
                <CardContent className={styles.addDishCardContent}>
                  <IconButton color="primary" aria-label="add new dish">
                    <AddIcon className={styles.addDishIcon} />
                  </IconButton>
                  <Typography variant="body1" color="textSecondary">
                    Add New Dish
                  </Typography>
                </CardContent>
              ) : (
                <>
                  <TextField
                    label="Name"
                    name="name"
                    value={newDishData.name}
                    onChange={handleInputChange}
                    fullWidth
                    margin="dense"
                  />
                  <TextField
                    label="Description"
                    name="description"
                    value={newDishData.description}
                    onChange={handleInputChange}
                    fullWidth
                    margin="dense"
                  />
                  <TextField
                    label="Price"
                    name="price"
                    type="number"
                    value={newDishData.price}
                    onChange={handleInputChange}
                    fullWidth
                    margin="dense"
                  />

                  <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                    className={styles.chooseImageBtn}
                  >
                    Choose Image
                    <input type="file" hidden onChange={handleImageChange} />
                  </Button>

                  {imagePath && (
                    <CardMedia
                      component="img"
                      height="200"
                      image={imagePath}
                      alt="Selected Image Preview"
                      className={styles.dishImagePreview}
                    />
                  )}

                  <FormControlLabel
                    control={
                      <Checkbox
                        name="veg"
                        checked={newDishData.veg}
                        onChange={handleInputChange}
                      />
                    }
                    label="Veg"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="isAvailable"
                        checked={newDishData.isAvailable}
                        onChange={handleInputChange}
                      />
                    }
                    label="Available"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="isDiscountAvailable"
                        checked={newDishData.isDiscountAvailable}
                        onChange={handleInputChange}
                      />
                    }
                    label="Discount Available"
                  />

                  <TextField
                    label="Discount (%)"
                    name="discount"
                    type="number"
                    value={newDishData.discount}
                    onChange={handleInputChange}
                    fullWidth
                    margin="dense"
                  />
                  <TextField
                    label="Category"
                    name="category"
                    value={newDishData.category}
                    onChange={handleInputChange}
                    fullWidth
                    margin="dense"
                  />

                  <Typography gutterBottom>Rating</Typography>
                  <Slider
                    name="rating"
                    value={newDishData.rating}
                    onChange={handleSliderChange}
                    step={0.5}
                    marks
                    min={1}
                    max={5}
                    valueLabelDisplay="auto"
                  />

                  <Box className={styles.addDishActions}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleAddDish}
                    >
                      Add
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => setIsAdding(false)}
                    >
                      Cancel
                    </Button>
                  </Box>
                </>
              )}
            </Card>
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default RestaurantView;
