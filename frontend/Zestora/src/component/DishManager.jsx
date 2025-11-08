// import React from 'react';
// import { Grid, Typography, Button } from '@mui/material';
// import Box from '@mui/material/Box';
// import MilkList from './MilkList';

// const MilkManager = ({ products }) => {
//   return (
//     <Box sx={{ padding: '2rem', backgroundColor: '#F7E7CE' }}>
//       <Grid container spacing={4}>
//         <Grid item xs={12} md={6}>
//           <Box sx={{ padding: 2 }}>
//             <Typography variant="h1" sx={{ fontSize: '3.5rem', fontWeight: 'bold', color: '#3E2723', mb: 2 }}>
//               Dairy Products
//               <br />
//               Upto 60% off
//             </Typography>
//             <Typography variant="h4" sx={{ fontSize: '1.5rem', color: '#795548', mb: 3 }}>
//               Same Day and Midnight Delivery
//             </Typography>
//             <Button 
//               variant="contained" 
//               sx={{ 
//                 borderRadius: '50px', 
//                 padding: '12px 30px', 
//                 fontSize: '1.2rem', 
//                 backgroundColor: '#D84315', 
//                 color: '#FFFFFF', 
//                 '&:hover': { 
//                   backgroundColor: '#BF360C' 
//                 } 
//               }}
//             >
//               Shop Now
//             </Button>
//           </Box>
//         </Grid>
//         <Grid item xs={12} md={6}>
//           <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
//             <img src="./dairies/dairy.jpg" alt="dairy" style={{ width: '100%', maxWidth: '100%' }} />
//           </Box>
//         </Grid>
//       </Grid>
//       <Box sx={{ paddingTop: 4 }}>
//         <MilkList restaurants={products} />
//       </Box>
//     </Box>
//   );
// };

// export default MilkManager;




// import React, { useEffect, useState } from 'react';
// import { Box } from '@mui/material';
// import MilkList from './MilkList'; // Importing MilkList component

// const MilkManager = ({ products }) => {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const dishes = products.flatMap(restaurant => restaurant.dishes); // Extract dishes from all restaurants

//   // Auto slide functionality
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentIndex((prevIndex) => (prevIndex + 1) % dishes.length);
//     }, 3000); // Change image every 3 seconds

//     return () => clearInterval(interval); // Cleanup on component unmount
//   }, [dishes.length]);

//   return (
//     <Box sx={{ padding: '2rem', backgroundColor: '#F7E7CE' }}>
//       {/* Display the carousel of dish images */}
//       <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', overflow: 'hidden', height: '400px' }}>
//         {dishes.length > 0 && (
//           <Box 
//             sx={{
//               display: 'flex',
//               transition: 'transform 0.5s ease',
//               transform: `translateX(-${currentIndex * 100}%)`,
//               width: `${dishes.length * 100}%`,
//             }}
//           >
//             {dishes.map((dish, index) => (
//               <Box key={index} sx={{ flex: '0 0 100%', height: '400px' }}>
//                 <img 
//                   src={dish.imageUrl} 
//                   alt={dish.name} 
//                   style={{ 
//                     width: '100%', 
//                     height: '100%', 
//                     objectFit: 'contain', // Change from 'cover' to 'contain'
//                     transition: 'transform 0.5s ease' // Optional: Smooth scaling during transition
//                   }} 
//                 />
//               </Box>
//             ))}
//           </Box>
//         )}
//       </Box>
//       <Box sx={{ paddingTop: 4 }}>
//         {/* Pass the products prop to MilkList */}
//         <MilkList restaurants={products} />
//       </Box>
//     </Box>
//   );
// };

// export default MilkManager;

// import React, { useEffect, useState } from 'react';
// import { Box, Card, CardContent, Typography } from '@mui/material';
// import MilkList from './MilkList';

// // Access icons with optional chaining and fallback components
// const Star = window['@mui/icons-material']?.Star || (() => <span>★</span>);
// const Leaf = window['@mui/icons-material']?.Eco || (() => <span>🌿</span>);
// const Fastfood = window['@mui/icons-material']?.Fastfood || (() => <span>🍔</span>);

// const MilkManager = ({ products }) => {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const dishes = products.flatMap(restaurant =>
//     restaurant.dishes.map(dish => ({
//       ...dish,
//       restaurantName: restaurant.name,
//       restaurantRating: restaurant.rating,
//     }))
//   );

//   // Auto slide functionality
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentIndex(prevIndex => (prevIndex + 1) % dishes.length);
//     }, 3000);

//     return () => clearInterval(interval); // Cleanup on component unmount
//   }, [dishes.length]);

//   const calculateTotalPrice = (originalPrice, discount) => {
//     return (originalPrice * (100 - discount)) / 100;
//   };

//   return (
//     <Box sx={{ padding: '2rem', backgroundColor: 'LightYellow' }}>
//       {/* Display the carousel of dish images */}
//       <Box
//         sx={{
//           display: 'flex',
//           justifyContent: 'center',
//           alignItems: 'center',
//           position: 'relative',
//           overflow: 'hidden',
//           height: '400px',
//         }}
//       >
//         {dishes.length > 0 && (
//           <Box
//             sx={{
//               display: 'flex',
//               transition: 'transform 0.5s ease',
//               transform: `translateX(-${currentIndex * 100}%)`,
//               width: `${dishes.length * 100}%`,
//             }}
//           >
//             {dishes.map((dish, index) => (
//               <Box
//                 key={index}
//                 sx={{
//                   flex: '0 0 100%',
//                   height: '400px',
//                   position: 'relative',
//                   display: 'flex',
//                   alignItems: 'center',
//                 }}
//               >
//                 {/* Left Card */}
//                 <Card
//                   sx={{
//                     width: '200px',
//                     marginRight: '1rem',
//                     position: 'absolute',
//                     left: 0,
//                     background: 'rgba(255, 255, 255, 0.8)',
//                   }}
//                 >
//                   <CardContent>
//                     <Typography variant="h6">{dish.name}</Typography>
//                     <Typography variant="body2">
//                        Rs. {calculateTotalPrice(dish.price, dish.discount).toFixed(2)} (Discount: {dish.discount}%)
//                     </Typography>
//                     {/* <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}> */}
//                       {/* Show Leaf if isVeg is true, Fastfood if isVeg is false */}
//                       {/* {dish.isVeg ? <Leaf sx={{ color: 'green' }} /> : <Fastfood sx={{ color: 'red' }} />} */}
//                       {/* <Typography variant="body2" sx={{ marginLeft: 1 }}>
//                         {dish.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
//                       </Typography> */}
//                     {/* </Box> */}
//                     <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
//                       {Array.from({ length: Math.round(dish.rating) }).map((_, i) => (
//                         <Star key={i} sx={{ color: 'gold' }} />
//                       ))}
//                       <Typography variant="body2" sx={{ marginLeft: 1 }}>
//                         {dish.rating} / 5
//                       </Typography>
//                     </Box>
//                   </CardContent>
//                 </Card>

//                 {/* Center Image */}
//                 <Box
//                   sx={{
//                     flex: 1,
//                     height: '400px',
//                     position: 'relative',
//                   }}
//                 >
//                   <img
//                     src={dish.imageUrl}
//                     alt={dish.name}
//                     style={{
//                       width: '100%',
//                       height: '100%',
//                       objectFit: 'contain',
//                       position: 'absolute',
//                       top: 0,
//                       left: 0,
//                     }}
//                   />
//                 </Box>

//                 {/* Right Card */}
//                 <Card
//                   sx={{
//                     width: '200px',
//                     marginLeft: '1rem',
//                     position: 'absolute',
//                     right: 0,
//                     background: 'rgba(255, 255, 255, 0.8)',
//                   }}
//                 >
//                   <CardContent>
//                     <Typography variant="h6">{dish.restaurantName}</Typography>
//                     <Typography variant="body2">
//                        {dish.description}
//                     </Typography>
//                     <Typography variant="body2" sx={{ marginTop: '0.5rem' }}>
//                        Rs. {calculateTotalPrice(dish.price, dish.discount).toFixed(2)} (Discount: {dish.discount}%)
//                     </Typography>
//                     <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
//                       {Array.from({ length: Math.round(dish.restaurantRating) }).map((_, i) => (
//                         <Star key={i} sx={{ color: 'gold' }} />
//                       ))}
//                       <Typography variant="body2" sx={{ marginLeft: 1 }}>
//                         {dish.restaurantRating} / 5
//                       </Typography>
//                     </Box>
//                   </CardContent>
//                 </Card>
//               </Box>
//             ))}
//           </Box>
//         )}
//       </Box>
//       <Box sx={{ paddingTop: 4 }}>
//         {/* Pass the products prop to MilkList */}
//         <MilkList restaurants={products} />
//       </Box>
//     </Box>
//   );
// };

// export default MilkManager;



// import React, { useEffect, useState } from 'react';
// import { Box, Card, CardContent, Typography, Button, Modal, TextField } from '@mui/material';
// import MilkList from './MilkList';
// import {jwtDecode} from 'jwt-decode';
// import axios from 'axios';
// import { useTheme } from '@mui/material/styles';

// // Access icons with optional chaining and fallback components
// const Star = window['@mui/icons-material']?.Star || (() => <span>★</span>);
// const Leaf = window['@mui/icons-material']?.Eco || (() => <span>🌿</span>);
// const Fastfood = window['@mui/icons-material']?.Fastfood || (() => <span>🍔</span>);

// const MilkManager = ({ products }) => {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [isOwner, setIsOwner] = useState(false);
//   const [openModal, setOpenModal] = useState(false);
//   const theme = useTheme(); // Access the current theme
//   const [newRestaurant, setNewRestaurant] = useState({
//     name: '',
//     ownerName: '',
//     address: '',
//     phoneNumber: '',
//     email: '',
//     imageUrl: '',
//     rating: 0,
//     location: {
//       type: 'Point',
//       coordinates: [0, 0], // default coordinates
//     },
//     dishes: [], // empty array for dishes
//   });
  

//   const dishes = products.flatMap(restaurant =>
//     restaurant.dishes.map(dish => ({
//       ...dish,
//       restaurantName: restaurant.name,
//       restaurantRating: restaurant.rating,
//     }))
//   );

//   // Check the user's role from the JWT token
//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       const decodedToken = jwtDecode(token);
//       if (decodedToken.role === 'OWNER') {
//         setIsOwner(true);
//       }
//     }
//   }, []);

//   // Auto slide functionality for the carousel
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentIndex(prevIndex => (prevIndex + 1) % dishes.length);
//     }, 3000);

//     return () => clearInterval(interval);
//   }, [dishes.length]);

//   const calculateTotalPrice = (originalPrice, discount) => {
//     return (originalPrice * (100 - discount)) / 100;
//   };

//   const handleOpenModal = () => setOpenModal(true);
//   const handleCloseModal = () => setOpenModal(false);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewRestaurant((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleAddRestaurant = async () => {
//     try {
//       await axios.post('http://localhost:8081/api/restaurants', newRestaurant);
//       alert('Restaurant added successfully!');
//       handleCloseModal();
//     } catch (error) {
//       console.error('Error adding restaurant:', error);
//       alert('Failed to add restaurant.');
//     }
//   };

//   return (
//     <Box sx={{ padding: '2rem', backgroundColor: theme.palette.mode === 'dark' ? 'background.paper' : 'LightYellow' }}>
//       {/* Display the carousel of dish images */}
//       <Box
//         sx={{
//           display: 'flex',
//           justifyContent: 'center',
//           alignItems: 'center',
//           position: 'relative',
//           overflow: 'hidden',
//           height: '400px',
//         }}
//       >
//         {dishes.length > 0 && (
//           <Box
//             sx={{
//               display: 'flex',
//               transition: 'transform 0.5s ease',
//               transform: `translateX(-${currentIndex * 100}%)`,
//               width: `${dishes.length * 100}%`,
//             }}
//           >
//             {dishes.map((dish, index) => (
//               <Box
//                 key={index}
//                 sx={{
//                   flex: '0 0 100%',
//                   height: '400px',
//                   position: 'relative',
//                   display: 'flex',
//                   alignItems: 'center',
//                 }}
//               >
//                 {/* Left Card */}
//                 <Card
//                   sx={{
//                     width: '200px',
//                     marginRight: '1rem',
//                     position: 'absolute',
//                     left: 0,
//                     // background: 'rgba(255, 255, 255, 0.8)',
//                   }}
//                 >
//                   <CardContent>
//                     <Typography variant="h6">{dish.name}</Typography>
//                     <Typography variant="body2">
//                       Rs. {calculateTotalPrice(dish.price, dish.discount).toFixed(2)} (Discount: {dish.discount}%)
//                     </Typography>
//                     <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
//                       {Array.from({ length: Math.round(dish.rating) }).map((_, i) => (
//                         <Star key={i} sx={{ color: 'gold' }} />
//                       ))}
//                       <Typography variant="body2" sx={{ marginLeft: 1 }}>
//                         {dish.rating} / 5
//                       </Typography>
//                     </Box>
//                   </CardContent>
//                 </Card>

//                 {/* Center Image */}
//                 <Box
//                   sx={{
//                     flex: 1,
//                     height: '400px',
//                     position: 'relative',
//                   }}
//                 >
//                   <img
//                     src={dish.imageUrl}
//                     alt={dish.name}
//                     style={{
//                       width: '100%',
//                       height: '100%',
//                       objectFit: 'contain',
//                       position: 'absolute',
//                       top: 0,
//                       left: 0,
//                     }}
//                   />
//                 </Box>

//                 {/* Right Card */}
//                 <Card
//                   sx={{
//                     width: '200px',
//                     marginLeft: '1rem',
//                     position: 'absolute',
//                     right: 0,
//                     // background: 'rgba(255, 255, 255, 0.8)',
                    
//                   }}
//                 >
//                   <CardContent>
//                     <Typography variant="h6">{dish.restaurantName}</Typography>
//                     <Typography variant="body2">
//                       {dish.description}
//                     </Typography>
//                     <Typography variant="body2" sx={{ marginTop: '0.5rem' }}>
//                       Rs. {calculateTotalPrice(dish.price, dish.discount).toFixed(2)} (Discount: {dish.discount}%)
//                     </Typography>
//                     <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
//                       {Array.from({ length: Math.round(dish.restaurantRating) }).map((_, i) => (
//                         <Star key={i} sx={{ color: 'gold' }} />
//                       ))}
//                       <Typography variant="body2" sx={{ marginLeft: 1 }}>
//                         {dish.restaurantRating} / 5
//                       </Typography>
//                     </Box>
//                   </CardContent>
//                 </Card>
//               </Box>
//             ))}
//           </Box>
//         )}
//       </Box>

//       {/* Conditionally Render Add Restaurant Button if the user is an OWNER */}
//       {isOwner && (
//         <Button variant="contained" color="primary" onClick={handleOpenModal} sx={{ marginTop: '1rem' }}>
//           Add Restaurant
//         </Button>
//       )}

//       {/* Add Restaurant Modal */}
//       <Modal open={openModal} onClose={handleCloseModal}>
//         <Box sx={{ padding: '2rem', backgroundColor: 'white', margin: 'auto', maxWidth: '400px', marginTop: '0%' }}>
//           <Typography variant="h6" mb={2}>Add New Restaurant</Typography>
//           <TextField label="Restaurant Name" name="name" value={newRestaurant.name} onChange={handleInputChange} fullWidth margin="normal" />
//           <TextField label="Owner Name" name="ownerName" value={newRestaurant.ownerName} onChange={handleInputChange} fullWidth margin="normal" />
//           <TextField label="Rating" name="rating" type="number" value={newRestaurant.rating} onChange={handleInputChange} fullWidth margin="normal" />
//           <TextField label="Address" name="address" value={newRestaurant.address} onChange={handleInputChange} fullWidth margin="normal" />
//           <TextField label="Phone Number" name="phoneNumber" value={newRestaurant.phoneNumber} onChange={handleInputChange} fullWidth margin="normal" />
//           <TextField label="Email" name="email" value={newRestaurant.email} onChange={handleInputChange} fullWidth margin="normal" />
//           <TextField label="Image URL" name="imageUrl" value={newRestaurant.imageUrl} onChange={handleInputChange} fullWidth margin="normal" />
//           <Button variant="contained" color="primary" onClick={handleAddRestaurant} sx={{ marginTop: '1rem' }}>
//             Submit
//           </Button>
//         </Box>
//       </Modal>

//       <Box sx={{ paddingTop: 4 }}>
//         {/* Pass the products prop to MilkList */}
//         <MilkList restaurants={products} />
//       </Box>
//     </Box>
//   );
// };

// export default MilkManager;




// import React, { useEffect, useState, useContext } from 'react';
// import { Box, Card, CardContent, Typography, Button, Modal, TextField } from '@mui/material';
// import DishList from './DishList';
// import { useTheme } from '@mui/material/styles';
// import Spa from '@mui/icons-material/Spa';
// import Egg from '@mui/icons-material/Egg';
// import StarIcon from '@mui/icons-material/Star';
// import StarHalfIcon from '@mui/icons-material/StarHalf';
// import StarBorderIcon from '@mui/icons-material/StarBorder';
// import DiscountIcon from '@mui/icons-material/Discount';
// import AuthContext from '../context/AuthContext';
// const Star = window['@mui/icons-material']?.Star || (() => <span>★</span>);

// const DishManager = ({ products }) => {
//   const { user } = useContext(AuthContext);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [isOwner, setIsOwner] = useState(false);
//   const [openModal, setOpenModal] = useState(false);
//   const [restaurantList, setRestaurantList] = useState(products);
//   const [newRestaurant, setNewRestaurant] = useState({
//     name: '',
//     ownerName: '',
//     address: '',
//     phoneNumber: '',
//     email: '',
//     imageUrl: '',
//     rating: 0,
//     location: {
//       type: 'Point',
//       coordinates: [0, 0],
//     },
//     dishes: [],
//   });

//   const dishes = products.flatMap((restaurant) =>
//     restaurant.dishes.map((dish) => ({
//       ...dish,
//       restaurantName: restaurant.name,
//       restaurantRating: restaurant.rating,
//     }))
//   );

//   // Check the user's role from the user
// useEffect(() => {
//   if (user) {
//     const userEmail = user.email;
//     setNewRestaurant((prev) => ({ ...prev, email: userEmail }));

//     // Check for matching restaurant by email using the products prop
//     const existingRestaurant = products.find(
//       (restaurant) => restaurant.email === userEmail
//     );
//     if (existingRestaurant) {
//       setNewRestaurant((prev) => ({
//         ...prev,
//         ownerName: existingRestaurant.ownerName,
//         phoneNumber: existingRestaurant.phoneNumber,
//       }));
//     }

//     if (user.role === 'OWNER') {
//       setIsOwner(true);
//     }
//   }
// }, [user, products]);

//   const handleOpenModal = () => setOpenModal(true);
//   const handleCloseModal = () => setOpenModal(false);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewRestaurant((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleAddRestaurant = async () => {
//     try {
//       setRestaurantList((prevRestaurantList) => [...prevRestaurantList, newRestaurant]);
//       alert('Restaurant added successfully!');
//       handleCloseModal();
//     } catch (error) {
//       console.error('Error adding restaurant:', error);
//       alert('Failed to add restaurant.');
//     }
//   };

//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setNewRestaurant((prev) => ({ ...prev, imageUrl: URL.createObjectURL(file) }));
//     }
//   };

//   const handleLocationChange = (e) => {
//     const { name, value } = e.target;
//     setNewRestaurant((prev) => ({
//       ...prev,
//       location: {
//         ...prev.location,
//         coordinates: name === 'latitude' ? [parseFloat(value), prev.location.coordinates[1]] : [prev.location.coordinates[0], parseFloat(value)],
//       },
//     }));
//   };

//   // Auto slide functionality for the carousel
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentIndex((prevIndex) => (prevIndex + 1) % dishes.length);
//     }, 3000);

//     return () => clearInterval(interval);
//   }, [dishes.length]);

//   const calculateTotalPrice = (originalPrice, discount) => {
//     return (originalPrice * (100 - discount)) / 100;
//   };

//   return (
//     <Box sx={{ padding: '2rem' }}>
//       {/* Display the carousel of dish images */}
//       <Box
//         sx={{
//           display: 'flex',
//           justifyContent: 'center',
//           alignItems: 'center',
//           position: 'relative',
//           overflow: 'hidden',
//           height: '400px',
//         }}
//       >
//         {dishes.length > 0 && (
//           <Box
//             sx={{
//               display: 'flex',
//               transition: 'transform 0.5s ease',
//               transform: `translateX(-${currentIndex * 100}%)`,
//               width: `${dishes.length * 100}%`,
//             }}
//           >
//             {dishes.map((dish, index) => (
//               <Box
//                 key={index}
//                 sx={{
//                   flex: '0 0 100%',
//                   height: '400px',
//                   position: 'relative',
//                   display: 'flex',
//                   alignItems: 'center',
//                 }}
//               >
//                 {/* Left Card */}
//                 <Card
//                   sx={{
//                     width: '200px',
//                     marginRight: '1rem',
//                     position: 'absolute',
//                     left: 0,
//                   }}
//                 >
//                   <CardContent>
//                     <Typography variant="h6">{dish.name}</Typography>
//                     <Typography variant="body2" sx={{ marginTop: '0.5rem' }}>
//                       Rs. {calculateTotalPrice(dish.price, dish.discount).toFixed(2)} <DiscountIcon sx={{ verticalAlign: 'middle' }} /> {dish.discount}%
//                     </Typography>
//                     <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
//                       {dish.veg ? <Spa sx={{ color: 'green' }} /> : <Egg sx={{ color: 'red' }} />}
//                       <Typography variant="body2" sx={{ marginLeft: 1 }}>
//                         {dish.veg ? 'Veg' : 'Non-Veg'}
//                       </Typography>
//                     </Box>
//                     <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
//                       {Array.from({ length: 5 }).map((_, i) => {
//                         const ratingValue = i + 0.5;
//                         return (
//                           <span key={i}>
//                             {dish.rating >= i + 1 ? (
//                               <StarIcon sx={{ color: 'gold' }} />
//                             ) : dish.rating >= ratingValue ? (
//                               <StarHalfIcon sx={{ color: 'gold' }} />
//                             ) : (
//                               <StarBorderIcon sx={{ color: 'white' }} />
//                             )}
//                           </span>
//                         );
//                       })}
//                       <Typography variant="body2" sx={{ marginLeft: 1 }}>
//                         {dish.rating} / 5
//                       </Typography>
//                     </Box>
//                   </CardContent>
//                 </Card>

//                 {/* Center Image */}
//                 <Box
//                   sx={{
//                     flex: 1,
//                     height: '400px',
//                     position: 'relative',
//                   }}
//                 >
//                   <img
//                     src={dish.imageUrl}
//                     alt={dish.name}
//                     style={{
//                       width: '100%',
//                       height: '100%',
//                       objectFit: 'contain',
//                       position: 'absolute',
//                       top: 0,
//                       left: 0,
//                     }}
//                   />
//                 </Box>

//                 {/* Right Card */}
//                 <Card
//                   sx={{
//                     width: '200px',
//                     marginLeft: '1rem',
//                     position: 'absolute',
//                     right: 0,
//                   }}
//                 >
//                   <CardContent>
//                     <Typography variant="h6">{dish.restaurantName}</Typography>
//                     <Typography variant="body2">{dish.description}</Typography>
//                     <Typography variant="body2" sx={{ marginTop: '0.5rem' }}>
//                       Rs. {calculateTotalPrice(dish.price, dish.discount).toFixed(2)} <DiscountIcon sx={{ verticalAlign: 'middle' }} /> {dish.discount}%
//                     </Typography>
//                     <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
//                       {Array.from({ length: 5 }).map((_, i) => {
//                         const ratingValue = i + 0.5;
//                         return (
//                           <span key={i}>
//                             {dish.restaurantRating >= i + 1 ? (
//                               <StarIcon sx={{ color: 'gold' }} />
//                             ) : dish.restaurantRating >= ratingValue ? (
//                               <StarHalfIcon sx={{ color: 'gold' }} />
//                             ) : (
//                               <StarBorderIcon sx={{ color: 'white' }} />
//                             )}
//                           </span>
//                         );
//                       })}
//                       <Typography variant="body2" sx={{ marginLeft: 1 }}>
//                         {dish.restaurantRating} / 5
//                       </Typography>
//                     </Box>
//                   </CardContent>
//                 </Card>
//               </Box>
//             ))}
//           </Box>
//         )}
//       </Box>

//       {/* Conditionally Render Add Restaurant Button if the user is an OWNER */}
//       {isOwner && (
//         <Button variant="contained" color="primary" onClick={handleOpenModal} sx={{ marginTop: '1rem' }}>
//           Add Restaurant
//         </Button>
//       )}

//       {/* Add Restaurant Modal
//       <Modal open={openModal} onClose={handleCloseModal}>
//         <Box sx={{ padding: '2rem', backgroundColor: 'white', margin: 'auto', maxWidth: '400px', marginTop: '5%' }}>
//           <Typography variant="h6" mb={2}>Add New Restaurant</Typography>
//           <TextField label="Restaurant Name" name="name" value={newRestaurant.name} onChange={handleInputChange} fullWidth margin="normal" />
//           <TextField label="Owner Name" name="ownerName" value={newRestaurant.ownerName} onChange={handleInputChange} fullWidth margin="normal" disabled={Boolean(newRestaurant.ownerName)} />
//           <TextField label="Rating" name="rating" type="number" value={newRestaurant.rating} onChange={handleInputChange} fullWidth margin="normal" />
//           <TextField label="Address" name="address" value={newRestaurant.address} onChange={handleInputChange} fullWidth margin="normal" />
//           <TextField label="Phone Number" name="phoneNumber" value={newRestaurant.phoneNumber} onChange={handleInputChange} fullWidth margin="normal" disabled={Boolean(newRestaurant.phoneNumber)} />
//           <TextField label="Email" name="email" value={newRestaurant.email} fullWidth margin="normal" disabled />
          
//           Location Fields
//           <TextField label="Latitude" name="latitude" value={newRestaurant.location.coordinates[0]} onChange={handleLocationChange} fullWidth margin="normal" />
//           <TextField label="Longitude" name="longitude" value={newRestaurant.location.coordinates[1]} onChange={handleLocationChange} fullWidth margin="normal" />

//           Image Upload
//           <input type="file" accept="image/*" onChange={handleImageUpload} />
//           {newRestaurant.imageUrl && (
//             <img src={newRestaurant.imageUrl} alt="Restaurant Preview" style={{ width: '100px', height: '100px', objectFit: 'contain', marginTop: '1rem' }} />
//           )}

//           <Button variant="contained" color="primary" onClick={handleAddRestaurant} sx={{ marginTop: '1rem' }}>
//             Submit
//           </Button>
//         </Box>
//       </Modal> */}

//    {/* Add Restaurant Modal */}
// <Modal open={openModal} onClose={handleCloseModal}>
//   <Box sx={{ 
//       padding: '1rem', 
//       backgroundColor: 'background.paper',
//       margin: 'auto', 
//       maxWidth: '400px', 
//       maxHeight: '500px', 
//       overflowY: 'auto', 
//       marginTop: '10%' 
//   }}>
//     <Typography variant="h6" mb={1}>Add New Restaurant</Typography>
//     <TextField label="Restaurant Name" name="name" value={newRestaurant.name} onChange={handleInputChange} fullWidth margin="normal" />
//     <TextField label="Owner Name" name="ownerName" value={newRestaurant.ownerName} onChange={handleInputChange} fullWidth margin="normal" disabled={Boolean(newRestaurant.ownerName)} />
//     <TextField label="Rating" name="rating" type="number" value={newRestaurant.rating} onChange={handleInputChange} fullWidth margin="normal" />
//     <TextField label="Address" name="address" value={newRestaurant.address} onChange={handleInputChange} fullWidth margin="normal" />
//     <TextField label="Phone Number" name="phoneNumber" value={newRestaurant.phoneNumber} onChange={handleInputChange} fullWidth margin="normal" disabled={Boolean(newRestaurant.phoneNumber)} />
//     <TextField label="Email" name="email" value={newRestaurant.email} fullWidth margin="normal" disabled />
    
//     {/* Location Fields */}
//     <TextField label="Latitude" name="latitude" value={newRestaurant.location.coordinates[0]} onChange={handleLocationChange} fullWidth margin="normal" />
//     <TextField label="Longitude" name="longitude" value={newRestaurant.location.coordinates[1]} onChange={handleLocationChange} fullWidth margin="normal" />
    
//     {/* Image Upload */}
//     <Button variant="outlined" component="label" sx={{ marginTop: '1rem' }}>
//       Upload Image
//       <input type="file" hidden onChange={handleImageUpload} />
//     </Button>
//     {newRestaurant.imageUrl && (
//       <img src={newRestaurant.imageUrl} alt="Restaurant" style={{ marginTop: '1rem', width: '100%', height: 'auto' }} />
//     )}

//     {/* Action Buttons */}
//     <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
//       <Button variant="outlined" color="secondary" onClick={handleCloseModal}>Cancel</Button>
//       <Button variant="contained" color="primary" onClick={handleAddRestaurant}>Add Restaurant</Button>
//     </Box>
//   </Box>
// </Modal>



//       <Box sx={{ paddingTop: 4 }}>
//         {/* Pass the products prop to DishList */}
//         <DishList restaurants={products} />
//       </Box>
//     </Box>
//   );
// };

// export default DishManager;









import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, Button, Modal, TextField } from '@mui/material';
import DishList from './DishList';
import { useTheme } from '@mui/material/styles';
import Spa from '@mui/icons-material/Spa';
import Egg from '@mui/icons-material/Egg';
import StarIcon from '@mui/icons-material/Star';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import DiscountIcon from '@mui/icons-material/Discount';
import { useSelector } from 'react-redux';

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

      <Box sx={{ paddingTop: 4 }}>
        <DishList restaurants={products} />
      </Box>
    </Box>
  );
};

export default DishManager;
















