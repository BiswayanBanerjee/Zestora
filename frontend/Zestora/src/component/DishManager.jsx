import React, { useEffect, useState } from 'react';
// import { Box, Card, CardContent, Typography, Button, Modal, TextField } from '@mui/material';
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import DishList from './DishList';
import { useTheme } from '@mui/material/styles';
import Spa from '@mui/icons-material/Spa';
import Egg from '@mui/icons-material/Egg';
import StarIcon from '@mui/icons-material/Star';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import DiscountIcon from '@mui/icons-material/Discount';
import { useSelector } from 'react-redux';
import TopCategories from './TopCategories';

const DishManager = ({ products }) => {
  const user = useSelector((state) => state.auth.user); // ✅ from Redux store
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOwner, setIsOwner] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [restaurantList, setRestaurantList] = useState(products);
  const [newRestaurant, setNewRestaurant] = useState({
    name: '',
    ownerName: '',
    address: '',
    phoneNumber: '',
    email: '',
    imageUrl: '',
    rating: 0,
    location: {
      type: 'Point',
      coordinates: [0, 0],
    },
    dishes: [],
  });

  const dishes = products.flatMap((restaurant) =>
    restaurant.dishes.map((dish) => ({
      ...dish,
      restaurantName: restaurant.name,
      restaurantRating: restaurant.rating,
    }))
  );

  // ✅ Check the user's role from Redux
  useEffect(() => {
    if (user) {
      const userEmail = user.email;
      setNewRestaurant((prev) => ({ ...prev, email: userEmail }));

      const existingRestaurant = products.find(
        (restaurant) => restaurant.email === userEmail
      );
      if (existingRestaurant) {
        setNewRestaurant((prev) => ({
          ...prev,
          ownerName: existingRestaurant.ownerName,
          phoneNumber: existingRestaurant.phoneNumber,
        }));
      }

      if (user.role === 'OWNER') {
        setIsOwner(true);
      }
    }
  }, [user, products]);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRestaurant((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddRestaurant = async () => {
    try {
      setRestaurantList((prevRestaurantList) => [
        ...prevRestaurantList,
        newRestaurant,
      ]);
      alert('Restaurant added successfully!');
      handleCloseModal();
    } catch (error) {
      console.error('Error adding restaurant:', error);
      alert('Failed to add restaurant.');
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewRestaurant((prev) => ({
        ...prev,
        imageUrl: URL.createObjectURL(file),
      }));
    }
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setNewRestaurant((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        coordinates:
          name === 'latitude'
            ? [parseFloat(value), prev.location.coordinates[1]]
            : [prev.location.coordinates[0], parseFloat(value)],
      },
    }));
  };

  // Auto slide functionality for the carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % dishes.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [dishes.length]);

  const calculateTotalPrice = (originalPrice, discount) => {
    return (originalPrice * (100 - discount)) / 100;
  };

  return (
    <Box sx={{ padding: "2rem" }}>
      {/* Owner-only button */}
      {isOwner && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenModal}
          sx={{ marginTop: "1rem" }}
        >
          Add Restaurant
        </Button>
      )}

      {/* Add Restaurant Modal */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            padding: "1rem",
            backgroundColor: "background.paper",
            margin: "auto",
            maxWidth: "400px",
            maxHeight: "500px",
            overflowY: "auto",
            marginTop: "10%",
          }}
        >
          <Typography variant="h6" mb={1}>
            Add New Restaurant
          </Typography>
          <TextField
            label="Restaurant Name"
            name="name"
            value={newRestaurant.name}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Owner Name"
            name="ownerName"
            value={newRestaurant.ownerName}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            disabled={Boolean(newRestaurant.ownerName)}
          />
          <TextField
            label="Rating"
            name="rating"
            type="number"
            value={newRestaurant.rating}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Address"
            name="address"
            value={newRestaurant.address}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Phone Number"
            name="phoneNumber"
            value={newRestaurant.phoneNumber}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            disabled={Boolean(newRestaurant.phoneNumber)}
          />
          <TextField
            label="Email"
            name="email"
            value={newRestaurant.email}
            fullWidth
            margin="normal"
            disabled
          />

          {/* Location Fields */}
          <TextField
            label="Latitude"
            name="latitude"
            value={newRestaurant.location.coordinates[0]}
            onChange={handleLocationChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Longitude"
            name="longitude"
            value={newRestaurant.location.coordinates[1]}
            onChange={handleLocationChange}
            fullWidth
            margin="normal"
          />

          {/* Image Upload */}
          <Button
            variant="outlined"
            component="label"
            sx={{ marginTop: "1rem" }}
          >
            Upload Image
            <input type="file" hidden onChange={handleImageUpload} />
          </Button>
          {newRestaurant.imageUrl && (
            <img
              src={newRestaurant.imageUrl}
              alt="Restaurant"
              style={{ marginTop: "1rem", width: "100%", height: "auto" }}
            />
          )}

          {/* Action Buttons */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "1rem",
            }}
          >
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleCloseModal}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddRestaurant}
            >
              Add Restaurant
            </Button>
          </Box>
        </Box>
      </Modal>

      <TopCategories onSelect={(cat) => console.log("Filter:", cat)} />

      <Box sx={{ paddingTop: 4 }}>
        <DishList restaurants={products} />
      </Box>
    </Box>
  );
};

export default DishManager;
















