import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardMedia, CardContent, Typography, Button, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

// ✅ Redux
import { useSelector } from 'react-redux';
import {
  useGetCartQuery,
  useUpdateCartMutation,
} from './redux/services/customerApi';

const DishDetail = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  // ✅ Get user from Redux authSlice
  const user = useSelector((state) => state.auth.user);

  const hasDishData = state && state.dish;
  const dish = hasDishData ? state.dish : null;

  // ✅ RTK Query hooks
  const { data: existingCartItems = [] } = useGetCartQuery(user?.email, {
    skip: !user?.email, // don’t run if not logged in
  });
  const [updateCart] = useUpdateCartMutation();

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : prev));

  const imageurl = dish?.imageUrl ? '/' + dish.imageUrl : '/placeholder.jpg';

  // ✅ Add to cart via RTK Query
  const addToCart = async () => {
    if (!user || !user.email) {
      console.error('User is not logged in.');
      navigate('/login');
      return;
    }

    try {
      // Step 1: Create an array containing dish.id repeated based on the quantity
      const newItems = Array(quantity).fill(dish.id);

      // Step 2: Combine existing cart items with new items
      const updatedCartItems = [...existingCartItems, ...newItems];

      // Step 3: Update cart using RTK Query mutation
      await updateCart({ id: user.email, cart: updatedCartItems }).unwrap();

      console.log('Cart updated successfully');
      navigate('/');
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  return (
    <div>
      {hasDishData ? (
        <Card sx={{ maxWidth: 500, margin: 'auto', mt: 4, mb: 4 }}>
          <CardMedia
            component="img"
            height="300"
            image={imageurl}
            alt={dish.productName}
          />
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h4" sx={{ mb: 2 }}>
              {dish.productName}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              {dish.nutritionalValue}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              {dish.description}
            </Typography>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Price: Rs {dish.price}
            </Typography>

            {/* Quantity adjustment buttons */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: '16px',
              }}
            >
              <IconButton onClick={decreaseQuantity} color="primary">
                <RemoveIcon />
              </IconButton>
              <Typography variant="h6" sx={{ mx: 2 }}>
                {quantity}
              </Typography>
              <IconButton onClick={increaseQuantity} color="primary">
                <AddIcon />
              </IconButton>
            </div>

            {/* Add to Cart button */}
            <Button
              variant="contained"
              color="primary"
              startIcon={<ShoppingCartIcon />}
              onClick={addToCart}
            >
              Add to Cart
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Typography variant="h4" align="center" sx={{ mt: 4 }}>
          404 - Dish not found
        </Typography>
      )}
    </div>
  );
};

export default DishDetail;
