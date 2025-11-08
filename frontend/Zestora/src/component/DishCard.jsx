import React, { useState, useContext, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  IconButton,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Slider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Spa from "@mui/icons-material/Spa";
import Egg from "@mui/icons-material/Egg";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { useUpdateDishMutation } from "./redux/services/restaurantApi"; // ✅ RTK Query
import styles from "./DishCard.module.css"; // ✅ CSS module import

const DishCard = React.memo(({ dish, isOwner, onDelete, restaurantId }) => {
  const navigate = useNavigate();
  const imageUrl = `/${dish.imageUrl}`;
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: dish.name,
    description: dish.description,
    price: dish.price,
    imageUrl: dish.imageUrl,
    isVeg: dish.isVeg,
    rating: dish.rating,
    isAvailable: dish.isAvailable,
    discount: dish.discount || 0,
    isDiscountAvailable: dish.isDiscountAvailable || false,
    category: dish.category || "",
  });
  const [imagePath, setImagePath] = useState(dish.imageUrl);

  // ✅ RTK Query mutation
  const [updateDish] = useUpdateDishMutation();

  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }, []);

  const handleSliderChange = useCallback((event, newValue) => {
    setFormData((prev) => ({
      ...prev,
      rating: newValue,
    }));
  }, []);

  const handleImageChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      const fileName = file.name;
      const newImagePath = `dishes/${fileName}`;
      setImagePath(URL.createObjectURL(file));
      setFormData((prev) => ({
        ...prev,
        imageUrl: newImagePath,
      }));
    }
  }, []);

  const handleSave = useCallback(async () => {
    const data = { ...formData };
    try {
      await updateDish({ restaurantId, dishId: dish.id, data }).unwrap();
      setIsEditing(false);
      window.location.reload();
    } catch (error) {
      console.error("Error updating dish:", error);
    }
  }, [formData, restaurantId, dish.id, updateDish]);

  const renderStars = useMemo(() => {
    return (rating) => {
      const fullStars = Math.floor(rating);
      const hasHalfStar = rating % 1 !== 0;
      const stars = Array.from({ length: 5 }, (_, i) =>
        i < fullStars ? (
          <StarIcon key={`star-${i}`} sx={{ color: "#FFD700" }} />
        ) : hasHalfStar && i === fullStars ? (
          <StarHalfIcon key="half-star" sx={{ color: "#FFD700" }} />
        ) : (
          <StarBorderIcon key={`empty-star-${i}`} sx={{ color: "#d3d3d3" }} />
        )
      );
      return stars;
    };
  }, []);

  if (isEditing) {
    return (
      <Card className={styles.dishCardEditMode}>
        <TextField
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          fullWidth
          margin="dense"
        />
        <TextField
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          fullWidth
          margin="dense"
        />
        <TextField
          label="Price"
          name="price"
          type="number"
          value={formData.price}
          onChange={handleInputChange}
          fullWidth
          margin="dense"
        />
        <Button
          variant="outlined"
          component="label"
          fullWidth
          className={styles.chooseImgBtn}
        >
          Choose Image
          <input type="file" hidden onChange={handleImageChange} />
        </Button>
        {imagePath && (
          <CardMedia
            component="img"
            image={imagePath}
            alt="Selected Image Preview"
            className={styles.previewImg}
          />
        )}
        <Box className={styles.editOptions}>
          <FormControlLabel
            control={
              <Checkbox
                name="isVeg"
                checked={formData.isVeg}
                onChange={handleInputChange}
              />
            }
            label="Veg"
          />
          <FormControlLabel
            control={
              <Checkbox
                name="isAvailable"
                checked={formData.isAvailable}
                onChange={handleInputChange}
              />
            }
            label="Available"
          />
        </Box>
        <Typography gutterBottom>Rating</Typography>
        <Slider
          value={formData.rating}
          onChange={handleSliderChange}
          step={0.5}
          marks
          min={1}
          max={5}
          valueLabelDisplay="auto"
        />
        <Box className={styles.editButtons}>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </Button>
        </Box>
      </Card>
    );
  }

  return (
    <Card
      className={`${styles.dishCard} ${
        dish.available ? styles.available : styles.notAvailable
      }`}
      onClick={() => {
        if (dish.available) {
          navigate(`/dish/${dish.id}`, { state: { dish } });
        }
      }}
    >
      {isOwner && (
        <>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onDelete(dish.id);
            }}
            className={styles.deleteBtn}
          >
            <DeleteIcon color="error" />
          </IconButton>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
            className={styles.editBtn}
          >
            <EditIcon color="primary" />
          </IconButton>
        </>
      )}
      <div className={styles.dishImageWrapper}>
        <LazyLoadImage
          src={imageUrl}
          alt={dish.name}
          effect="blur"
          className={styles.dishCardImage}
        />
      </div>

      <CardContent className={styles.dishContent}>
        {/* Dish Name + ADD on same row */}
        <Box className={styles.dishHeader}>
          <Typography variant="h6" className={styles.dishTitle}>
            {dish.name}
          </Typography>

          {dish.available && (
            <Button variant="outlined" className={styles.addBtun}>
              ADD
            </Button>
          )}
        </Box>

        {/* Price + Discount */}
        <Typography className={styles.dishPriceText}>
          {dish.discountAvailable && dish.discount > 0 ? (
            <>
              <span className={styles.originalPrice}>₹{dish.price}</span>
              <span className={styles.discountPrice}>
                ₹{dish.price - (dish.price * dish.discount) / 100}
              </span>
              <span className={styles.discountTag}>{dish.discount}% OFF</span>
            </>
          ) : (
            <>₹{dish.price}</>
          )}
        </Typography>

        {/* Rating */}
        {dish.rating && (
          <Typography className={styles.dishRating}>
            ★ {dish.rating.toFixed(1)} ({dish.reviews || 1})
          </Typography>
        )}

        {/* Description */}
        <Typography className={styles.dishFullDescription}>
          Serves 1 | {dish.description}
        </Typography>

        {/* Not Available */}
        {!dish.available && (
          <Typography
            variant="body2"
            color="error"
            className={styles.notAvailableText}
          >
            Not Available
          </Typography>
        )}
      </CardContent>
    </Card>
  );
});

export default DishCard;
