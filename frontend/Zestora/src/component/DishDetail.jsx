// import React, { useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { Card, CardMedia, CardContent, Typography, Button, IconButton } from '@mui/material';
// import AddIcon from '@mui/icons-material/Add';
// import RemoveIcon from '@mui/icons-material/Remove';
// import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

// const DishDetail = () => {
//   const { state } = useLocation();
//   const navigate = useNavigate();
  
  
//   console.log('Location state:', state);

//   const [quantity, setQuantity] = useState(1); // Default quantity is 1

//   // Check for dish data and set a flag
//   const hasDishData = state && state.dish;
//   const dish = hasDishData ? state.dish : null; // dish details passed from dishCard

//   // Handle increasing quantity
//   const increaseQuantity = () => {
//     setQuantity(prev => prev + 1);
//   };

//   // Handle decreasing quantity, ensuring it doesn’t go below 1
//   const decreaseQuantity = () => {
//     if (quantity > 1) {
//       setQuantity(prev => prev - 1);
//     }
//   };
//   const imageurl = "/" + dish["imageUrl"];


//   // Handle adding to cart
//   const addToCart = () => {
//     const cartItems = JSON.parse(localStorage.getItem('cart')) || []; // Retrieve existing cart from localStorage or initialize an empty array

//     // Add the selected dish product with the quantity
//     const updatedCart = [...cartItems, { ...dish, quantity }];
//     localStorage.setItem('cart', JSON.stringify(updatedCart));
    

//     // Optionally, navigate to cart or show a message
//     navigate('/'); // Navigate to order form (cart) page
//   };

//   // Log dish object to verify correct data
//   console.log('dish data:', dish);

//   return (
//     <div>
//       {hasDishData ? (
//         <Card sx={{ maxWidth: 500, margin: 'auto', mt: 4 }}>
//           <CardMedia
//             component="img"
//             height="300"
//             image={imageurl}
//             alt={dish.productName}
//           />
//           <CardContent sx={{ textAlign: 'center' }}>
//             <Typography variant="h4" sx={{ mb: 2 }}>
//               {dish.productName}
//             </Typography>
//             <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
//               {dish.nutritionalValue}
//             </Typography>
//             <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
//               {dish.description}
//             </Typography>
//             <Typography variant="h5" sx={{ mb: 2 }}>
//               Price: Rs {dish.price}
//             </Typography>

//             {/* Quantity adjustment buttons */}
//             <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '16px' }}>
//               <IconButton onClick={decreaseQuantity} color="primary">
//                 <RemoveIcon />
//               </IconButton>
//               <Typography variant="h6" sx={{ mx: 2 }}>
//                 {quantity}
//               </Typography>
//               <IconButton onClick={increaseQuantity} color="primary">
//                 <AddIcon />
//               </IconButton>
//             </div>

//             {/* Add to Cart button */}
//             <Button
//               variant="contained"
//               color="primary"
//               startIcon={<ShoppingCartIcon />}
//               onClick={addToCart}
//             >
//               Add to Cart
//             </Button>
//           </CardContent>
//         </Card>
//       ) : (
//         <Typography variant="h4" align="center" sx={{ mt: 4 }}>
//           404 - dish not found
//         </Typography>
//       )}
//     </div>
//   );
// };

// export default DishDetail;





// import React, { useState, useContext } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { Card, CardMedia, CardContent, Typography, Button, IconButton } from '@mui/material';
// import AddIcon from '@mui/icons-material/Add';
// import RemoveIcon from '@mui/icons-material/Remove';
// import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
// import axios from 'axios';
// import AuthContext from '../context/AuthContext';


// const DishDetail = () => {
//   const { user } = useContext(AuthContext);
//   const { state } = useLocation();
//   const navigate = useNavigate();
//   const [quantity, setQuantity] = useState(1);

//   const hasDishData = state && state.dish;
//   const dish = hasDishData ? state.dish : null;

//   const increaseQuantity = () => {
//     setQuantity(prev => prev + 1);
//   };

//   const decreaseQuantity = () => {
//     if (quantity > 1) {
//       setQuantity(prev => prev - 1);
//     }
//   };

//   const imageurl = "/" + dish["imageUrl"];

//   // // Decode token to get user email
//   // const getUserEmailFromToken = () => {
//   //   const token = localStorage.getItem('token');
//   //   if (token) {
//   //     const decodedToken = jwtDecode(token);  // Use jwtDecode
//   //     return decodedToken.sub;
//   //   }
//   //   return null;
//   // };

//   // // Handle adding to cart with Axios PATCH request
//   // const addToCart = async () => {
//   //   const userEmail = getUserEmailFromToken();
//   //   if (!userEmail) {
//   //     console.error("User is not logged in.");
//   //     return;
//   //   }
  
//   //   try {
//   //     // Step 1: Fetch the existing cart items
//   //     const response = await axios.get(`http://localhost:8085/api/customers/${userEmail}/cart`);
//   //     const existingCartItems = response.data || [];
  
//   //     // Step 2: Create an array containing dish.id repeated based on the quantity
//   //     const newItems = Array(quantity).fill(dish.id);
  
//   //     // Step 3: Combine existing cart items with new items
//   //     const updatedCartItems = [...existingCartItems, ...newItems];
  
//   //     // Step 4: Send the updated cart items back to the server with a PATCH request
//   //     await axios.patch(`http://localhost:8085/api/customers/${userEmail}/cart`, updatedCartItems);
  
//   //     console.log('Cart updated successfully');
//   //     navigate('/');
  
//   //   } catch (error) {
//   //     console.error('Error adding to cart:', error);
//   //   }
//   // };
  
//   // Handle adding to cart with Axios PATCH request
//   const addToCart = async () => {
//     if (!user || !user.email) {
//       console.error("User is not logged in.");
//       return;
//     }

//     const userEmail = user.email;

//     try {
//       // Step 1: Fetch the existing cart items
//       const response = await axios.get(`http://localhost:8085/api/customers/${userEmail}/cart`);
//       const existingCartItems = response.data || [];

//       // Step 2: Create an array containing dish.id repeated based on the quantity
//       const newItems = Array(quantity).fill(dish.id);

//       // Step 3: Combine existing cart items with new items
//       const updatedCartItems = [...existingCartItems, ...newItems];

//       // Step 4: Send the updated cart items back to the server with a PATCH request
//       await axios.patch(`http://localhost:8085/api/customers/${userEmail}/cart`, updatedCartItems);

//       console.log('Cart updated successfully');
//       navigate('/');

//     } catch (error) {
//       console.error('Error adding to cart:', error);
//     }
//   };

//   return (
//     <div>
//       {hasDishData ? (
//         <Card sx={{ maxWidth: 500, margin: 'auto', mt: 4 , mb: 4 }}>
//           <CardMedia
//             component="img"
//             height="300"
//             image={imageurl}
//             alt={dish.productName}
//           />
//           <CardContent sx={{ textAlign: 'center' }}>
//             <Typography variant="h4" sx={{ mb: 2 }}>
//               {dish.productName}
//             </Typography>
//             <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
//               {dish.nutritionalValue}
//             </Typography>
//             <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
//               {dish.description}
//             </Typography>
//             <Typography variant="h5" sx={{ mb: 2 }}>
//               Price: Rs {dish.price}
//             </Typography>

//             {/* Quantity adjustment buttons */}
//             <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '16px' }}>
//               <IconButton onClick={decreaseQuantity} color="primary">
//                 <RemoveIcon />
//               </IconButton>
//               <Typography variant="h6" sx={{ mx: 2 }}>
//                 {quantity}
//               </Typography>
//               <IconButton onClick={increaseQuantity} color="primary">
//                 <AddIcon />
//               </IconButton>
//             </div>

//             {/* Add to Cart button */}
//             <Button
//               variant="contained"
//               color="primary"
//               startIcon={<ShoppingCartIcon />}
//               onClick={addToCart}
//             >
//               Add to Cart
//             </Button>
//           </CardContent>
//         </Card>
//       ) : (
//         <Typography variant="h4" align="center" sx={{ mt: 4 }}>
//           404 - Dish not found
//         </Typography>
//       )}
//     </div>
//   );
// };

// export default DishDetail;





// import React, { useState, useContext } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { Card, CardMedia, CardContent, Typography, Button, IconButton } from '@mui/material';
// import AddIcon from '@mui/icons-material/Add';
// import RemoveIcon from '@mui/icons-material/Remove';
// import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
// import AuthContext from '../context/AuthContext';

// // ✅ RTK Query hooks
// import {
//   useGetCartQuery,
//   useUpdateCartMutation,
// } from './redux/services/customerApi';

// const DishDetail = () => {
//   const { user } = useContext(AuthContext);
//   const { state } = useLocation();
//   const navigate = useNavigate();
//   const [quantity, setQuantity] = useState(1);

//   const hasDishData = state && state.dish;
//   const dish = hasDishData ? state.dish : null;

//   // ✅ RTK Query hooks
//   const { data: existingCartItems = [] } = useGetCartQuery(user?.email, {
//     skip: !user?.email, // don’t run if not logged in
//   });
//   const [updateCart] = useUpdateCartMutation();

//   const increaseQuantity = () => setQuantity((prev) => prev + 1);
//   const decreaseQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : prev));

//   const imageurl = '/' + dish?.imageUrl;

//   // ✅ Add to cart via RTK Query
//   const addToCart = async () => {
//     if (!user || !user.email) {
//       console.error('User is not logged in.');
//       return;
//     }

//     try {
//       // Step 1: Create an array containing dish.id repeated based on the quantity
//       const newItems = Array(quantity).fill(dish.id);

//       // Step 2: Combine existing cart items with new items
//       const updatedCartItems = [...existingCartItems, ...newItems];

//       // Step 3: Update cart using RTK Query mutation
//       await updateCart({ id: user.email, cart: updatedCartItems }).unwrap();

//       console.log('Cart updated successfully');
//       navigate('/');
//     } catch (error) {
//       console.error('Error adding to cart:', error);
//     }
//   };

//   return (
//     <div>
//       {hasDishData ? (
//         <Card sx={{ maxWidth: 500, margin: 'auto', mt: 4, mb: 4 }}>
//           <CardMedia
//             component="img"
//             height="300"
//             image={imageurl}
//             alt={dish.productName}
//           />
//           <CardContent sx={{ textAlign: 'center' }}>
//             <Typography variant="h4" sx={{ mb: 2 }}>
//               {dish.productName}
//             </Typography>
//             <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
//               {dish.nutritionalValue}
//             </Typography>
//             <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
//               {dish.description}
//             </Typography>
//             <Typography variant="h5" sx={{ mb: 2 }}>
//               Price: Rs {dish.price}
//             </Typography>

//             {/* Quantity adjustment buttons */}
//             <div
//               style={{
//                 display: 'flex',
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 marginBottom: '16px',
//               }}
//             >
//               <IconButton onClick={decreaseQuantity} color="primary">
//                 <RemoveIcon />
//               </IconButton>
//               <Typography variant="h6" sx={{ mx: 2 }}>
//                 {quantity}
//               </Typography>
//               <IconButton onClick={increaseQuantity} color="primary">
//                 <AddIcon />
//               </IconButton>
//             </div>

//             {/* Add to Cart button */}
//             <Button
//               variant="contained"
//               color="primary"
//               startIcon={<ShoppingCartIcon />}
//               onClick={addToCart}
//             >
//               Add to Cart
//             </Button>
//           </CardContent>
//         </Card>
//       ) : (
//         <Typography variant="h4" align="center" sx={{ mt: 4 }}>
//           404 - Dish not found
//         </Typography>
//       )}
//     </div>
//   );
// };

// export default DishDetail;








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
