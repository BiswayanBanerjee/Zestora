// import React from 'react';
// import { Grid } from '@mui/material';
// import MilkCard from './MilkCard';

// const MilkList = ({ milk }) => {
//   return (
//     <Grid container spacing={4} justifyContent="center">
//       {milk.map((item) => (
//         <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
//           <MilkCard milk={item} />
//         </Grid>
//       ))}
//     </Grid>
//   );
// };

// export default MilkList

// import React from 'react';
// import { Grid, Typography } from '@mui/material';
// import MilkCard from './MilkCard';

// const MilkList = ({ milk }) => {
//   return (
//     <Grid container spacing={4} justifyContent="center">
//       {milk.map((restaurant) => (
//         <React.Fragment key={restaurant.id}>
//           <Grid item xs={12}>
//             <Typography variant="h5" align="center">
//               {restaurant.name}
//             </Typography>
//           </Grid>
//           {restaurant.dishes.map((dish) => (
//             <Grid item xs={12} sm={6} md={4} lg={3} key={dish.id}>
//               <MilkCard milk={dish} />
//             </Grid>
//           ))}
//         </React.Fragment>
//       ))}
//     </Grid>
//   );
// };

// export default MilkList;

// import React, { useRef, useEffect, useState } from 'react';
// import { Grid, Typography, IconButton, Box, useMediaQuery, useTheme } from '@mui/material';
// import { ArrowBack, ArrowForward } from '@mui/icons-material';
// import MilkCard from './MilkCard';

// const MilkList = ({ restaurants }) => {
//   const scrollRefs = useRef({});
//   const [isHovered, setIsHovered] = useState(false);
//   const theme = useTheme();
//   const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

//   const scroll = (restaurantId, direction) => {
//     const scrollAmount = 200;
//     const scrollContainer = scrollRefs.current[restaurantId];
//     if (scrollContainer) {
//       // Get current scroll position
//       const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;

//       // Check if we're at the end of the list
//       if (scrollLeft + clientWidth >= scrollWidth) {
//         scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
//       } else {
//         scrollContainer.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
//       }
//     }
//   };

//   const vibrantColors = ['#FFD700', '#FF6347', '#32CD32', '#1E90FF', '#FF69B4', '#FF4500'];

//   // Combine dishes for seamless auto-scroll
//   const getAllDishes = (restaurant) => [...restaurant.dishes, ...restaurant.dishes];

//   useEffect(() => {
//     const intervalId = setInterval(() => {
//       if (!isHovered) {
//         restaurants.forEach((restaurant) => scroll(restaurant.id, 1));
//       }
//     }, 3000); // Change dishes every 3 seconds

//     return () => clearInterval(intervalId);
//   }, [isHovered, restaurants]);

//   return (
//     <Grid container spacing={4} direction="column" alignItems="center">
//       {restaurants.map((restaurant, index) => (
//         <Grid item xs={12} key={restaurant.id} style={{ width: '100%' }}>
//           {/* Restaurant Section with Vibrant Background */}
//           <Box
//             p={3}
//             mb={5}
//             borderRadius={3}
//             style={{
//               backgroundColor: vibrantColors[index % vibrantColors.length],
//               width: isSmallScreen ? '100%' : '95%',
//               maxWidth: '1300px',
//               margin: 'auto',
//             }}
//           >
//             {/* Restaurant Name */}
//             <Typography variant="h5" align="center" gutterBottom>
//               {restaurant.name}
//             </Typography>

//             {/* Dishes Container with Scroll Arrows */}
//             <Box
//               display="flex"
//               alignItems="center"
//               position="relative"
//               width="100%"
//               onMouseEnter={() => setIsHovered(true)}
//               onMouseLeave={() => setIsHovered(false)}
//             >
//               {/* Back Arrow */}
//               <IconButton
//                 onClick={() => scroll(restaurant.id, -1)}
//                 style={{ position: 'absolute', left: 0, zIndex: 1 }}
//                 disabled={restaurant.dishes.length <= 4}
//               >
//                 <ArrowBack />
//               </IconButton>

//               {/* Scrollable Dishes */}
//               <Box
//                 ref={(el) => (scrollRefs.current[restaurant.id] = el)}
//                 display="flex"
//                 overflow="hidden"
//                 flexWrap="nowrap"
//                 style={{
//                   marginLeft: 40,
//                   marginRight: 40,
//                   width: 'calc(100% - 80px)',
//                   maxWidth: '100%',
//                 }}
//               >
//                 {getAllDishes(restaurant).map((dish) => (
//                   <Box key={dish.id} flex="0 0 auto" width="200px" mr={2}>
//                     <MilkCard milk={dish} />
//                   </Box>
//                 ))}
//               </Box>

//               {/* Forward Arrow */}
//               <IconButton
//                 onClick={() => scroll(restaurant.id, 1)}
//                 style={{ position: 'absolute', right: 0, zIndex: 1 }}
//                 disabled={restaurant.dishes.length <= 4}
//               >
//                 <ArrowForward />
//               </IconButton>
//             </Box>
//           </Box>
//         </Grid>
//       ))}
//     </Grid>
//   );
// };

// export default MilkList;

// import React, { useRef, useEffect, useState } from 'react';
// import { Grid, Typography, IconButton, Box, useMediaQuery, useTheme } from '@mui/material';
// import { ArrowBack, ArrowForward } from '@mui/icons-material';
// import MilkCard from './MilkCard';
// import { useNavigate } from 'react-router-dom'; // Import useNavigate

// const MilkList = ({ restaurants }) => {
//   const scrollRefs = useRef({});
//   const [isHovered, setIsHovered] = useState(false);
//   const theme = useTheme();
//   const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
//   const navigate = useNavigate(); // Initialize navigate

//   const scroll = (restaurantId, direction) => {
//     const scrollAmount = 200;
//     const scrollContainer = scrollRefs.current[restaurantId];
//     if (scrollContainer) {
//       // Get current scroll position
//       const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;

//       // Check if we're at the end of the list
//       if (scrollLeft + clientWidth >= scrollWidth) {
//         scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
//       } else {
//         scrollContainer.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
//       }
//     }
//   };

//   const vibrantColors = ['#FFD700', '#FF6347', '#32CD32', '#1E90FF', '#FF69B4', '#FF4500'];

//   // Combine dishes for seamless auto-scroll
//   const getAllDishes = (restaurant) => [...restaurant.dishes, ...restaurant.dishes];

//   useEffect(() => {
//     const intervalId = setInterval(() => {
//       if (!isHovered) {
//         restaurants.forEach((restaurant) => scroll(restaurant.id, 1));
//       }
//     }, 3000); // Change dishes every 3 seconds

//     return () => clearInterval(intervalId);
//   }, [isHovered, restaurants]);

//   return (
//     <Grid container spacing={4} direction="column" alignItems="center">
//       {restaurants.map((restaurant, index) => (
//         <Grid item xs={12} key={restaurant.id} style={{ width: '100%' }}>
//           {/* Restaurant Section with Vibrant Background */}
//           <Box
//             p={3}
//             mb={5}
//             borderRadius={3}
//             style={{
//               backgroundColor: vibrantColors[index % vibrantColors.length],
//               width: isSmallScreen ? '100%' : '95%',
//               maxWidth: '1300px',
//               margin: 'auto',
//             }}
//           >
//             {/* Restaurant Name - Clickable */}
//             <Typography 
//               variant="h5" 
//               align="center" 
//               gutterBottom
//               //onClick={() => navigate(`/restaurant/${restaurant.id}`)}
//               onClick={() => navigate(`/restaurant/${restaurant.id}`, { state: { restaurant } })}
//  // Navigate on click
//               style={{ cursor: 'pointer' }} // Change cursor to pointer
//             >
//               {restaurant.name}
//             </Typography>

//             {/* Dishes Container with Scroll Arrows */}
//             <Box
//               display="flex"
//               alignItems="center"
//               position="relative"
//               width="100%"
//               onMouseEnter={() => setIsHovered(true)}
//               onMouseLeave={() => setIsHovered(false)}
//             >
//               {/* Back Arrow */}
//               <IconButton
//                 onClick={() => scroll(restaurant.id, -1)}
//                 style={{ position: 'absolute', left: 0, zIndex: 1 }}
//                 disabled={restaurant.dishes.length <= 4}
//               >
//                 <ArrowBack />
//               </IconButton>

//               {/* Scrollable Dishes */}
//               <Box
//                 ref={(el) => (scrollRefs.current[restaurant.id] = el)}
//                 display="flex"
//                 overflow="hidden"
//                 flexWrap="nowrap"
//                 style={{
//                   marginLeft: 40,
//                   marginRight: 40,
//                   width: 'calc(100% - 80px)',
//                   maxWidth: '100%',
//                 }}
//               >
//                 {getAllDishes(restaurant).map((dish) => (
//                   <Box key={dish.id} flex="0 0 auto" width="200px" mr={2}>
//                     <MilkCard milk={dish} />
//                   </Box>
//                 ))}
//               </Box>

//               {/* Forward Arrow */}
//               <IconButton
//                 onClick={() => scroll(restaurant.id, 1)}
//                 style={{ position: 'absolute', right: 0, zIndex: 1 }}
//                 disabled={restaurant.dishes.length <= 4}
//               >
//                 <ArrowForward />
//               </IconButton>
//             </Box>
//           </Box>
//         </Grid>
//       ))}
//     </Grid>
//   );
// };

// export default MilkList;

// import React, { useRef, useEffect, useState } from 'react';
// import { Grid, Typography, IconButton, Box, useMediaQuery, useTheme } from '@mui/material';
// import { ArrowBack, ArrowForward } from '@mui/icons-material';
// import MilkCard from './MilkCard';
// import { useNavigate } from 'react-router-dom'; // Import useNavigate

// const MilkList = ({ restaurants }) => {
//   const scrollRefs = useRef({});
//   const [isHovered, setIsHovered] = useState(false);
//   const theme = useTheme();
//   const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
//   const navigate = useNavigate(); // Initialize navigate

//   const scroll = (restaurantId, direction) => {
//     const scrollAmount = 200;
//     const scrollContainer = scrollRefs.current[restaurantId];
//     if (scrollContainer) {
//       // Get current scroll position
//       const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;

//       // Check if we're at the end of the list
//       if (scrollLeft + clientWidth >= scrollWidth) {
//         scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
//       } else {
//         scrollContainer.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
//       }
//     }
//   };

//   const vibrantColors = ['#FFD700', '#FF6347', '#32CD32', '#1E90FF', '#FF69B4', '#FF4500'];

//   // Get all dishes without duplication
//   const getAllDishes = (restaurant) => [...restaurant.dishes];

//   useEffect(() => {
//     const intervalId = setInterval(() => {
//       if (!isHovered) {
//         restaurants.forEach((restaurant) => scroll(restaurant.id, 1));
//       }
//     }, 3000); // Change dishes every 3 seconds

//     return () => clearInterval(intervalId);
//   }, [isHovered, restaurants]);

//   return (
//     <Grid container spacing={4} direction="column" alignItems="center">
//       {restaurants.map((restaurant, index) => (
//         <Grid item xs={12} key={restaurant.id} style={{ width: '100%' }}>
//           {/* Restaurant Section with Vibrant Background */}
//           <Box
//             p={3}
//             mb={5}
//             borderRadius={3}
//             style={{
//               backgroundColor: vibrantColors[index % vibrantColors.length],
//               width: isSmallScreen ? '100%' : '95%',
//               maxWidth: '1300px',
//               margin: 'auto',
//             }}
//           >
//             {/* Restaurant Name - Clickable */}
//             <Typography 
//               variant="h5" 
//               align="center" 
//               gutterBottom
//               onClick={() => navigate(`/restaurant/${restaurant.id}`, { state: { restaurant } })} // Navigate on click
//               style={{ cursor: 'pointer' }} // Change cursor to pointer
//             >
//               {restaurant.name}
//             </Typography>

//             {/* Dishes Container with Scroll Arrows */}
//             <Box
//               display="flex"
//               alignItems="center"
//               position="relative"
//               width="100%"
//               onMouseEnter={() => setIsHovered(true)}
//               onMouseLeave={() => setIsHovered(false)}
//             >
//               {/* Back Arrow */}
//               <IconButton
//                 onClick={() => scroll(restaurant.id, -1)}
//                 style={{ position: 'absolute', left: 0, zIndex: 1 }}
//                 disabled={restaurant.dishes.length <= 4}
//               >
//                 <ArrowBack />
//               </IconButton>

//               {/* Scrollable Dishes */}
//               <Box
//                 ref={(el) => (scrollRefs.current[restaurant.id] = el)}
//                 display="flex"
//                 overflow="hidden"
//                 flexWrap="nowrap"
//                 style={{
//                   marginLeft: 40,
//                   marginRight: 40,
//                   width: 'calc(100% - 80px)',
//                   maxWidth: '100%',
//                 }}
//               >
//                 {getAllDishes(restaurant).map((dish) => (
//                   <Box key={`${restaurant.id}-${dish.id}`} flex="0 0 auto" width="200px" mr={2}>
//                     <MilkCard milk={dish} />
//                   </Box>
//                 ))}
//               </Box>

//               {/* Forward Arrow */}
//               <IconButton
//                 onClick={() => scroll(restaurant.id, 1)}
//                 style={{ position: 'absolute', right: 0, zIndex: 1 }}
//                 disabled={restaurant.dishes.length <= 4}
//               >
//                 <ArrowForward />
//               </IconButton>
//             </Box>
//           </Box>
//         </Grid>
//       ))}
//     </Grid>
//   );
// };

// export default MilkList;




// import React, { useRef, useEffect, useState } from 'react';
// import { Grid, Typography, IconButton, Box, useMediaQuery, useTheme } from '@mui/material';
// import { ArrowBack, ArrowForward } from '@mui/icons-material';
// import MilkCard from './MilkCard';
// import { useNavigate } from 'react-router-dom'; // Import useNavigate

// const MilkList = ({ restaurants = [] }) => { // Default to an empty array
//   const scrollRefs = useRef({});
//   const [isHovered, setIsHovered] = useState(false);
//   const theme = useTheme();
//   const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
//   const navigate = useNavigate(); // Initialize navigate

//   const scroll = (restaurantId, direction) => {
//     const scrollAmount = 200;
//     const scrollContainer = scrollRefs.current[restaurantId];
//     if (scrollContainer) {
//       // Get current scroll position
//       const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;

//       // Check if we're at the end of the list
//       if (scrollLeft + clientWidth >= scrollWidth) {
//         scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
//       } else {
//         scrollContainer.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
//       }
//     }
//   };

//   const vibrantColors = ['#FFD700', '#FF6347', '#32CD32', '#1E90FF', '#FF69B4', '#FF4500'];

//   // Get all dishes from a restaurant
//   const getAllDishes = (restaurant) => restaurant.dishes || []; // Safely return an empty array if dishes are undefined

//   // Function to render stars based on the rating
//   const renderStars = (rating) => {
//     const starCount = Math.floor(rating); // Get the whole number part of the rating
//     return [...Array(5)].map((_, index) => (
//       <span key={index} style={{ color: 'black' }}>
//         {index < starCount ? '★' : '☆'} {/* Black filled star or empty star */}
//       </span>
//     ));
//   };

//   useEffect(() => {
//     const intervalId = setInterval(() => {
//       if (!isHovered) {
//         restaurants.forEach((restaurant) => scroll(restaurant.id, 1));
//       }
//     }, 3000); // Change dishes every 3 seconds

//     return () => clearInterval(intervalId);
//   }, [isHovered, restaurants]);

//   return (
//     <Grid container spacing={4} direction="column" alignItems="center">
//       {restaurants.length > 0 ? ( // Check if restaurants array is not empty
//         restaurants.map((restaurant, index) => (
//           <Grid item xs={12} key={restaurant.id} style={{ width: '100%' }}>
//             {/* Restaurant Section with Vibrant Background */}
//             <Box
//               p={3}
//               mb={5}
//               borderRadius={3}
//               style={{
//                 backgroundColor: vibrantColors[index % vibrantColors.length],
//                 width: isSmallScreen ? '100%' : '95%',
//                 maxWidth: '1300px',
//                 margin: 'auto',
//               }}
//             >
//               {/* Restaurant Name with Ratings */}
//               <Box display="flex" alignItems="center" justifyContent="center">

//                 {/* Left Rating */}
//                 <Typography variant="h6" style={{ marginRight: '10px' , marginTop: '-10px'}}>
//                   {renderStars(restaurant.rating)} {/* Display the stars */}
//                 </Typography>

//                 {/* Restaurant Name - Clickable */}
//                 <Typography 
//                   variant="h5" 
//                   align="center" 
//                   gutterBottom
//                   onClick={() => navigate(`/restaurant/${restaurant.id}`, { state: { restaurant } })} // Navigate on click
                  
//                   style={{ cursor: 'pointer' }} // Change cursor to pointer
//                 >
//                   {restaurant.name}
//                 </Typography>

//                 {/* Right Rating */}
//                 <Typography variant="h6" style={{ marginLeft: '10px' , marginTop: '-10px'}}>
//                   {renderStars(restaurant.rating)} {/* Display the stars */}
//                 </Typography>
//               </Box>

//               {/* Dishes Container with Scroll Arrows */}
//               <Box
//                 display="flex"
//                 alignItems="center"
//                 position="relative"
//                 width="100%"
//                 onMouseEnter={() => setIsHovered(true)}
//                 onMouseLeave={() => setIsHovered(false)}
//               >
//                 {/* Back Arrow */}
//                 <IconButton
//                   onClick={() => scroll(restaurant.id, -1)}
//                   style={{ position: 'absolute', left: 0, zIndex: 1 }}
//                   disabled={(getAllDishes(restaurant).length <= 4)} // Check length of dishes
//                 >
//                   <ArrowBack />
//                 </IconButton>

//                 {/* Scrollable Dishes */}
//                 <Box
//                   ref={(el) => (scrollRefs.current[restaurant.id] = el)}
//                   display="flex"
//                   overflow="hidden"
//                   flexWrap="nowrap"
//                   style={{
//                     marginLeft: 40,
//                     marginRight: 40,
//                     width: 'calc(100% - 80px)',
//                     maxWidth: '100%',
//                   }}
//                 >
//                   {getAllDishes(restaurant).map((dish) => (
//                     <Box key={`${restaurant.id}-${dish.id}`} flex="0 0 auto" width="200px" mr={2}>
//                       <MilkCard milk={dish} />
//                     </Box>
//                   ))}
//                 </Box>

//                 {/* Forward Arrow */}
//                 <IconButton
//                   onClick={() => scroll(restaurant.id, 1)}
//                   style={{ position: 'absolute', right: 0, zIndex: 1 }}
//                   disabled={(getAllDishes(restaurant).length <= 4)} // Check length of dishes
//                 >
//                   <ArrowForward />
//                 </IconButton>
//               </Box>
//             </Box>
//           </Grid>
//         ))
//       ) : (
//         <Typography variant="h6" align="center">No restaurants available.</Typography> // Fallback UI
//       )}
//     </Grid>
//   );
// };

// export default MilkList;















// import React, { useRef, useEffect, useState } from 'react';
// import { Grid, Typography, IconButton, Box, useMediaQuery, useTheme } from '@mui/material';
// import { ArrowBack, ArrowForward } from '@mui/icons-material';
// import MilkCard from './MilkCard';
// import {jwtDecode} from 'jwt-decode';
// import { useNavigate } from 'react-router-dom';

// const MilkList = ({ restaurants = [] }) => {
//   const scrollRefs = useRef({});
//   const [isHovered, setIsHovered] = useState(false);
//   const theme = useTheme();
//   const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
//   const navigate = useNavigate();
//   const vibrantColors = ['#FFD700', '#FF6347', '#32CD32', '#1E90FF', '#FF69B4', '#FF4500'];

//   // Decode the JWT token and extract role and email
//   const [filteredRestaurants, setFilteredRestaurants] = useState([]);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     let filtered = restaurants;

//     if (token) {
//       const decodedToken = jwtDecode(token);
//       const { role, sub: email } = decodedToken;

//       if (role === 'OWNER') {
//         // Filter for the restaurant matching the owner's email
//         filtered = restaurants.filter((restaurant) => restaurant.email === email);
//       }
//     }

//     setFilteredRestaurants(filtered);
//   }, [restaurants]);

//   const scroll = (restaurantId, direction) => {
//     const scrollAmount = 200;
//     const scrollContainer = scrollRefs.current[restaurantId];
//     if (scrollContainer) {
//       const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;

//       if (scrollLeft + clientWidth >= scrollWidth) {
//         scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
//       } else {
//         scrollContainer.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
//       }
//     }
//   };

//   const getAllDishes = (restaurant) => restaurant.dishes || [];

//   const renderStars = (rating) => {
//     const starCount = Math.floor(rating);
//     return [...Array(5)].map((_, index) => (
//       <span key={index} style={{ color: 'black' }}>
//         {index < starCount ? '★' : '☆'}
//       </span>
//     ));
//   };

//   useEffect(() => {
//     const intervalId = setInterval(() => {
//       if (!isHovered) {
//         filteredRestaurants.forEach((restaurant) => scroll(restaurant.id, 1));
//       }
//     }, 3000);

//     return () => clearInterval(intervalId);
//   }, [isHovered, filteredRestaurants]);

//   return (
//     <Grid container spacing={4} direction="column" alignItems="center">
//       {filteredRestaurants.length > 0 ? (
//         filteredRestaurants.map((restaurant, index) => (
//           <Grid item xs={12} key={restaurant.id} style={{ width: '100%' }}>
//             <Box
//               p={3}
//               mb={5}
//               borderRadius={3}
//               style={{
//                 backgroundColor: vibrantColors[index % vibrantColors.length],
//                 width: isSmallScreen ? '100%' : '95%',
//                 maxWidth: '1300px',
//                 margin: 'auto',
//               }}
//             >
//               <Box display="flex" alignItems="center" justifyContent="center">
//                 <Typography variant="h6" style={{ marginRight: '10px', marginTop: '-10px' }}>
//                   {renderStars(restaurant.rating)}
//                 </Typography>

//                 <Typography
//                   variant="h5"
//                   align="center"
//                   gutterBottom
//                   onClick={() => navigate(`/restaurant/${restaurant.id}`, { state: { restaurant } })}
//                   style={{ cursor: 'pointer' }}
//                 >
//                   {restaurant.name}
//                 </Typography>

//                 <Typography variant="h6" style={{ marginLeft: '10px', marginTop: '-10px' }}>
//                   {renderStars(restaurant.rating)}
//                 </Typography>
//               </Box>

//               <Box
//                 display="flex"
//                 alignItems="center"
//                 position="relative"
//                 width="100%"
//                 onMouseEnter={() => setIsHovered(true)}
//                 onMouseLeave={() => setIsHovered(false)}
//               >
//                 <IconButton
//                   onClick={() => scroll(restaurant.id, -1)}
//                   style={{ position: 'absolute', left: 0, zIndex: 1 }}
//                   disabled={getAllDishes(restaurant).length <= 4}
//                 >
//                   <ArrowBack />
//                 </IconButton>

//                 <Box
//                   ref={(el) => (scrollRefs.current[restaurant.id] = el)}
//                   display="flex"
//                   overflow="hidden"
//                   flexWrap="nowrap"
//                   style={{
//                     marginLeft: 40,
//                     marginRight: 40,
//                     width: 'calc(100% - 80px)',
//                     maxWidth: '100%',
//                   }}
//                 >
//                   {getAllDishes(restaurant).map((dish) => (
//                     <Box key={`${restaurant.id}-${dish.id}`} flex="0 0 auto" width="200px" mr={2}>
//                       <MilkCard milk={dish} />
//                     </Box>
//                   ))}
//                 </Box>

//                 <IconButton
//                   onClick={() => scroll(restaurant.id, 1)}
//                   style={{ position: 'absolute', right: 0, zIndex: 1 }}
//                   disabled={getAllDishes(restaurant).length <= 4}
//                 >
//                   <ArrowForward />
//                 </IconButton>
//               </Box>
//             </Box>
//           </Grid>
//         ))
//       ) : (
//         <Typography variant="h6" align="center">
//           No restaurants available.
//         </Typography>
//       )}
//     </Grid>
//   );
// };

// export default MilkList;














// import React, { useRef, useEffect, useState } from 'react';
// import { Grid, Typography, IconButton, Box, useMediaQuery, useTheme } from '@mui/material';
// import { ArrowBack, ArrowForward } from '@mui/icons-material';
// import MilkCard from './MilkCard';
// import {jwtDecode} from 'jwt-decode';
// import { useNavigate } from 'react-router-dom';

// const MilkList = ({ restaurants = [] }) => {
//   const scrollRefs = useRef({});
//   const [isHovered, setIsHovered] = useState(false);
//   const theme = useTheme();
//   const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
//   const navigate = useNavigate();
//   const vibrantColors = ['#FFD700', '#FF6347', '#32CD32', '#1E90FF', '#FF69B4', '#FF4500'];

//   const [filteredRestaurants, setFilteredRestaurants] = useState([]);
//   const [role, setRole] = useState(null);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     let filtered = restaurants;

//     if (token) {
//       const decodedToken = jwtDecode(token);
//       const { role: userRole, sub: email } = decodedToken;
//       setRole(userRole);

//       if (userRole === 'OWNER') {
//         // Filter for the restaurant matching the owner's email
//         filtered = restaurants.filter((restaurant) => restaurant.email === email);
//       }
//     }

//     setFilteredRestaurants(filtered);
//   }, [restaurants]);

//   const scroll = (restaurantId, direction) => {
//     const scrollAmount = 200;
//     const scrollContainer = scrollRefs.current[restaurantId];
//     if (scrollContainer) {
//       const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;

//       if (scrollLeft + clientWidth >= scrollWidth) {
//         scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
//       } else {
//         scrollContainer.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
//       }
//     }
//   };

//   const getAllDishes = (restaurant) => restaurant.dishes || [];

//   const renderStars = (rating) => {
//     const starCount = Math.floor(rating);
//     return [...Array(5)].map((_, index) => (
//       <span key={index} style={{ color: 'black' }}>
//         {index < starCount ? '★' : '☆'}
//       </span>
//     ));
//   };

//   useEffect(() => {
//     const intervalId = setInterval(() => {
//       if (!isHovered) {
//         filteredRestaurants.forEach((restaurant) => scroll(restaurant.id, 1));
//       }
//     }, 3000);

//     return () => clearInterval(intervalId);
//   }, [isHovered, filteredRestaurants]);

//   const handleNavigate = (restaurant) => {
//     navigate(`/restaurant/${restaurant.id}`, {
//       state: { restaurant, role },
//     });
//   };

//   return (
//     <Grid container spacing={4} direction="column" alignItems="center">
//       {filteredRestaurants.length > 0 ? (
//         filteredRestaurants.map((restaurant, index) => (
//           <Grid item xs={12} key={restaurant.id} style={{ width: '100%' }}>
//             <Box
//               p={3}
//               mb={5}
//               borderRadius={3}
//               style={{
//                 backgroundColor: vibrantColors[index % vibrantColors.length],
//                 width: isSmallScreen ? '100%' : '95%',
//                 maxWidth: '1300px',
//                 margin: 'auto',
//               }}
//             >
//               <Box display="flex" alignItems="center" justifyContent="center">
//                 <Typography variant="h6" style={{ marginRight: '10px', marginTop: '-10px' }}>
//                   {renderStars(restaurant.rating)}
//                 </Typography>

//                 <Typography
//                   variant="h5"
//                   align="center"
//                   gutterBottom
//                   onClick={() => handleNavigate(restaurant)}
//                   style={{ cursor: 'pointer' }}
//                 >
//                   {restaurant.name}
//                 </Typography>

//                 <Typography variant="h6" style={{ marginLeft: '10px', marginTop: '-10px' }}>
//                   {renderStars(restaurant.rating)}
//                 </Typography>
//               </Box>

//               <Box
//                 display="flex"
//                 alignItems="center"
//                 position="relative"
//                 width="100%"
//                 onMouseEnter={() => setIsHovered(true)}
//                 onMouseLeave={() => setIsHovered(false)}
//               >
//                 <IconButton
//                   onClick={() => scroll(restaurant.id, -1)}
//                   style={{ position: 'absolute', left: 0, zIndex: 1 }}
//                   disabled={getAllDishes(restaurant).length <= 4}
//                 >
//                   <ArrowBack />
//                 </IconButton>

//                 <Box
//                   ref={(el) => (scrollRefs.current[restaurant.id] = el)}
//                   display="flex"
//                   overflow="hidden"
//                   flexWrap="nowrap"
//                   style={{
//                     marginLeft: 40,
//                     marginRight: 40,
//                     width: 'calc(100% - 80px)',
//                     maxWidth: '100%',
//                   }}
//                 >
//                   {getAllDishes(restaurant).map((dish) => (
//                     <Box key={`${restaurant.id}-${dish.id}`} flex="0 0 auto" width="200px" mr={2}>
//                       <MilkCard milk={dish} />
//                     </Box>
//                   ))}
//                 </Box>

//                 <IconButton
//                   onClick={() => scroll(restaurant.id, 1)}
//                   style={{ position: 'absolute', right: 0, zIndex: 1 }}
//                   disabled={getAllDishes(restaurant).length <= 4}
//                 >
//                   <ArrowForward />
//                 </IconButton>
//               </Box>
//             </Box>
//           </Grid>
//         ))
//       ) : (
//         <Typography variant="h6" align="center">
//           No restaurants available.
//         </Typography>
//       )}
//     </Grid>
//   );
// };

// export default MilkList;




// import React, { useRef, useEffect, useState } from 'react';
// import { Grid, Typography, IconButton, Box, useMediaQuery, useTheme } from '@mui/material';
// import { ArrowBack, ArrowForward, Delete } from '@mui/icons-material';
// import MilkCard from './MilkCard';
// import {jwtDecode} from 'jwt-decode';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const MilkList = ({ restaurants = [] }) => {
//   const scrollRefs = useRef({});
//   const [isHovered, setIsHovered] = useState(false);
//   const theme = useTheme();
//   const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
//   const navigate = useNavigate();
//   const vibrantColors = ['#FFD700', '#FF6347', '#32CD32', '#1E90FF', '#FF69B4', '#FF4500'];

//   const [filteredRestaurants, setFilteredRestaurants] = useState([]);
//   const [role, setRole] = useState(null);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     let filtered = restaurants;

//     if (token) {
//       const decodedToken = jwtDecode(token);
//       const { role: userRole, sub: email } = decodedToken;
//       setRole(userRole);

//       if (userRole === 'OWNER') {
//         filtered = restaurants.filter((restaurant) => restaurant.email === email);
//       }
//     }

//     setFilteredRestaurants(filtered);
//   }, [restaurants]);

//   const scroll = (restaurantId, direction) => {
//     const scrollAmount = 200;
//     const scrollContainer = scrollRefs.current[restaurantId];
//     if (scrollContainer) {
//       const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;

//       if (scrollLeft + clientWidth >= scrollWidth) {
//         scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
//       } else {
//         scrollContainer.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
//       }
//     }
//   };

//   const getAllDishes = (restaurant) => restaurant.dishes || [];

//   const renderStars = (rating) => {
//     const starCount = Math.floor(rating);
//     return [...Array(5)].map((_, index) => (
//       <span key={index} style={{ color: 'black' }}>
//         {index < starCount ? '★' : '☆'}
//       </span>
//     ));
//   };

//   useEffect(() => {
//     const intervalId = setInterval(() => {
//       if (!isHovered) {
//         filteredRestaurants.forEach((restaurant) => scroll(restaurant.id, 1));
//       }
//     }, 3000);

//     return () => clearInterval(intervalId);
//   }, [isHovered, filteredRestaurants]);

//   const handleNavigate = (restaurant) => {
//     navigate(`/restaurant/${restaurant.id}`, {
//       state: { restaurant, role },
//     });
//   };

//   const handleDelete = async (restaurantId) => {
//     try {
//       await axios.delete(`http://localhost:8081/api/restaurants/${restaurantId}`);
//       setFilteredRestaurants((prev) =>
//         prev.filter((restaurant) => restaurant.id !== restaurantId)
//       );
//       alert('Restaurant deleted successfully');
//     } catch (error) {
//       console.error('Error deleting restaurant:', error);
//       alert('Failed to delete restaurant');
//     }
//   };

//   return (
//     <Grid container spacing={4} direction="column" alignItems="center">
//       {filteredRestaurants.length > 0 ? (
//         filteredRestaurants.map((restaurant, index) => (
//           <Grid item xs={12} key={restaurant.id} style={{ width: '100%' }}>
//             <Box
//               p={3}
//               mb={5}
//               borderRadius={3}
//               style={{
//                 backgroundColor: vibrantColors[index % vibrantColors.length],
//                 width: isSmallScreen ? '100%' : '95%',
//                 maxWidth: '1300px',
//                 margin: 'auto',
//                 position: 'relative',
//               }}
//             >
//               <Box display="flex" alignItems="center" justifyContent="center">
//                 <Typography variant="h6" style={{ marginRight: '10px', marginTop: '-10px' }}>
//                   {renderStars(restaurant.rating)}
//                 </Typography>

//                 <Typography
//                   variant="h5"
//                   align="center"
//                   gutterBottom
//                   onClick={() => handleNavigate(restaurant)}
//                   style={{ cursor: 'pointer' }}
//                 >
//                   {restaurant.name}
//                 </Typography>

//                 <Typography variant="h6" style={{ marginLeft: '10px', marginTop: '-10px' }}>
//                   {renderStars(restaurant.rating)}
//                 </Typography>
//               </Box>

//               {role === 'OWNER' && (
//                 <IconButton
//                   onClick={() => handleDelete(restaurant.id)}
//                   style={{ position: 'absolute', top: 10, right: 10 }}
//                 >
//                   <Delete />
//                 </IconButton>
//               )}

//               <Box
//                 display="flex"
//                 alignItems="center"
//                 position="relative"
//                 width="100%"
//                 onMouseEnter={() => setIsHovered(true)}
//                 onMouseLeave={() => setIsHovered(false)}
//               >
//                 <IconButton
//                   onClick={() => scroll(restaurant.id, -1)}
//                   style={{ position: 'absolute', left: 0, zIndex: 1 }}
//                   disabled={getAllDishes(restaurant).length <= 4}
//                 >
//                   <ArrowBack />
//                 </IconButton>

//                 <Box
//                   ref={(el) => (scrollRefs.current[restaurant.id] = el)}
//                   display="flex"
//                   overflow="hidden"
//                   flexWrap="nowrap"
//                   style={{
//                     marginLeft: 40,
//                     marginRight: 40,
//                     width: 'calc(100% - 80px)',
//                     maxWidth: '100%',
//                   }}
//                 >
//                   {getAllDishes(restaurant).map((dish) => (
//                     <Box key={`${restaurant.id}-${dish.id}`} flex="0 0 auto" width="200px" mr={2}>
//                       <MilkCard milk={dish} />
//                     </Box>
//                   ))}
//                 </Box>

//                 <IconButton
//                   onClick={() => scroll(restaurant.id, 1)}
//                   style={{ position: 'absolute', right: 0, zIndex: 1 }}
//                   disabled={getAllDishes(restaurant).length <= 4}
//                 >
//                   <ArrowForward />
//                 </IconButton>
//               </Box>
//             </Box>
//           </Grid>
//         ))
//       ) : (
//         <Typography variant="h6" align="center">
//           No restaurants available.
//         </Typography>
//       )}
//     </Grid>
//   );
// };

// export default MilkList;





// import React, { useRef, useEffect, useState, lazy, Suspense } from 'react';
// import {
//   Grid,
//   Typography,
//   IconButton,
//   Box,
//   useMediaQuery,
//   useTheme,
//   Switch,
// } from '@mui/material';
// import { ArrowBack, ArrowForward, Delete } from '@mui/icons-material';
// import MilkCard from './MilkCard';
// import { jwtDecode } from 'jwt-decode';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { fetchStatuses, deleteRestaurant, toggleRestaurantApproval, toggleRestaurantAvailability } from '../api';

// const MilkList = ({ restaurants = [] }) => {
//   const scrollRefs = useRef({});
//   const [isHovered, setIsHovered] = useState(false);
//   const theme = useTheme();
//   const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
//   const navigate = useNavigate();
//   const vibrantColors = ['#FFD700', '#FF6347', '#32CD32', '#1E90FF', '#FF69B4', '#FF4500'];

//   const [filteredRestaurants, setFilteredRestaurants] = useState([]);
//   const [role, setRole] = useState(null);
//   const [isPollingPaused, setIsPollingPaused] = useState(false);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   // const MilkCard = lazy(() => import('./MilkCard'));

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     let filtered = restaurants;

//     if (token) {
//       const decodedToken = jwtDecode(token);
//       const { role: userRole, sub: email } = decodedToken;
//       setRole(userRole);

//       if (userRole === 'OWNER') {
//         filtered = restaurants.filter((restaurant) => restaurant.email === email);
//       }
//     }

//     setFilteredRestaurants(filtered);
//   }, [restaurants]);

//   // useEffect(() => {
//   //   if (isPollingPaused) return;
  
//   //   const intervalId = setInterval(async () => {
//   //     try {
//   //       const responses = await Promise.all(
//   //         filteredRestaurants.map((restaurant) =>
//   //           axios.get(`http://localhost:8081/api/restaurants/${restaurant.id}/approval`)
//   //         )
//   //       );
  
//   //       const updatedRestaurants = filteredRestaurants.map((restaurant, index) => ({
//   //         ...restaurant,
//   //         approved: responses[index]?.data?.isApproved ?? restaurant.approved,
//   //       }));
  
//   //       setFilteredRestaurants(updatedRestaurants);
//   //     } catch (error) {
//   //       console.error('Error fetching approval statuses:', error);
//   //     }
//   //   }, 5000);
  
//   //   return () => clearInterval(intervalId);
//   // }, [filteredRestaurants, isPollingPaused]);

//   // useEffect(() => {
//   //   if (isPollingPaused) return;
  
//   //   const intervalId = setInterval(async () => {
//   //     try {
//   //       // Fetch availability and approval data concurrently
//   //       const availabilityResponses = await Promise.all(
//   //         filteredRestaurants.map((restaurant) =>
//   //           axios.get(`http://localhost:8081/api/restaurants/${restaurant.id}/availability`)
//   //         )
//   //       );
  
//   //       const approvalResponses = await Promise.all(
//   //         filteredRestaurants.map((restaurant) =>
//   //           axios.get(`http://localhost:8081/api/restaurants/${restaurant.id}/approval`)
//   //         )
//   //       );
  
//   //       // Update restaurants with both availability and approval statuses
//   //       const updatedRestaurants = filteredRestaurants.map((restaurant, index) => ({
//   //         ...restaurant,
//   //         available: availabilityResponses[index]?.data?.isAvailable ?? restaurant.available,
//   //         approved: approvalResponses[index]?.data?.isApproved ?? restaurant.approved,
//   //       }));
  
//   //       setFilteredRestaurants(updatedRestaurants);
//   //     } catch (error) {
//   //       console.error('Error fetching statuses:', error);
//   //     }
//   //   }, 5000);
  
//   //   return () => clearInterval(intervalId);
//   // }, [filteredRestaurants, isPollingPaused]);
  

//   useEffect(() => {
//     if (isPollingPaused) return;
  
//     const intervalId = setInterval(async () => {
//       try {
//         // Collect all restaurant IDs
//         const restaurantIds = filteredRestaurants.map((restaurant) => restaurant.id).join(',');
  
//         // // Fetch statuses (availability and approval) from the merged endpoint
//         // const response = await axios.get(`http://localhost:8081/api/restaurants/statuses?ids=${restaurantIds}`);

//         // Fetch statuses (availability and approval) from the merged endpoint
//         const response = await fetchStatuses(restaurantIds);

  
//         // Extract data from the response
//         const statusesData = response.data || {};
  
//         // Update restaurants with availability and approval statuses
//         const updatedRestaurants = filteredRestaurants.map((restaurant) => ({
//           ...restaurant,
//           available: statusesData[restaurant.id]?.isAvailable ?? restaurant.available,
//           approved: statusesData[restaurant.id]?.isApproved ?? restaurant.approved,
//         }));
  
//         setFilteredRestaurants(updatedRestaurants);
//       } catch (error) {
//         console.error('Error fetching statuses:', error);
//       }
//     }, 5000);
  
//     return () => clearInterval(intervalId);
//   }, [filteredRestaurants, isPollingPaused]);
  
  
  

//   const scroll = (restaurantId, direction) => {
//     const scrollAmount = 200;
//     const scrollContainer = scrollRefs.current[restaurantId];
//     if (scrollContainer) {
//       const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;

//       if (scrollLeft + clientWidth >= scrollWidth) {
//         scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
//       } else {
//         scrollContainer.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
//       }
//     }
//   };

//   // useEffect(() => {
//   //   if (isPollingPaused) return;
  
//   //   const intervalId = setInterval(() => {
//   //     filteredRestaurants.forEach((restaurant) => {
//   //       axios.get(`http://localhost:8081/api/restaurants/${restaurant.id}/availability`)
//   //         .then(response => {
//   //           setFilteredRestaurants(prevRestaurants =>
//   //             prevRestaurants.map(r =>
//   //               r.id === restaurant.id ? { ...r, available: response.data.available } : r
//   //             )
//   //           );
//   //         })
//   //         .catch(error => {
//   //           console.error('Error fetching restaurant availability:', error);
//   //         });
//   //     });
//   //   }, 3000);
  
//   //   return () => clearInterval(intervalId);
//   // }, [isPollingPaused, filteredRestaurants]);

//   // useEffect(() => {
//   //   if (isPollingPaused) return;
  
//   //   const intervalId = setInterval(async () => {
//   //     try {
//   //       const responses = await Promise.all(
//   //         filteredRestaurants.map((restaurant) =>
//   //           axios.get(`http://localhost:8081/api/restaurants/${restaurant.id}/availability`)
//   //         )
//   //       );
  
//   //       const updatedRestaurants = filteredRestaurants.map((restaurant, index) => ({
//   //         ...restaurant,
//   //         available: responses[index]?.data?.isAvailable ?? restaurant.available,
//   //       }));
  
//   //       setFilteredRestaurants(updatedRestaurants);
//   //     } catch (error) {
//   //       console.error('Error fetching approval statuses:', error);
//   //     }
//   //   }, 5000);
  
//   //   return () => clearInterval(intervalId);
//   // }, [filteredRestaurants, isPollingPaused]);

//   const getAllDishes = (restaurant) => restaurant.dishes || [];

//   const renderStars = (rating) => {
//     const starCount = Math.floor(rating);
//     return [...Array(5)].map((_, index) => (
//       <span key={index} style={{ color: 'black' }}>
//         {index < starCount ? '★' : '☆'}
//       </span>
//     ));
//   };

//   useEffect(() => {
//     const intervalId = setInterval(() => {
//       if (!isHovered) {
//         filteredRestaurants.forEach((restaurant) => scroll(restaurant.id, 1));
//       }
//     }, 3000);

//     return () => clearInterval(intervalId);
//   }, [isHovered, filteredRestaurants]);



// // useEffect(() => {
// //   const intervalId = setInterval(() => {
// //     if (!isHovered && filteredRestaurants.length > 0) {
// //       const currentRestaurant = filteredRestaurants[currentIndex];
// //       scroll(currentRestaurant.id, 1);

// //       // Move to the next restaurant, loop back to the first one if at the end
// //       const nextIndex = (currentIndex + 1) % filteredRestaurants.length;
// //       setCurrentIndex(nextIndex);
// //     }
// //   }, 3000);

// //   return () => clearInterval(intervalId);
// // }, [isHovered, filteredRestaurants, currentIndex]);


//   const handleNavigate = (restaurant) => {
//     if (restaurant.approved) {
//       navigate(`/restaurant/${restaurant.id}`, {
//         state: { restaurant, role },
//       });
//     }
//   };

//   const handleDelete = async (restaurantId) => {
//     try {
//       // await axios.delete(`http://localhost:8081/api/restaurants/${restaurantId}`);
//       await deleteRestaurant(restaurantId);
//       setFilteredRestaurants((prev) =>
//         prev.filter((restaurant) => restaurant.id !== restaurantId)
//       );
//       alert('Restaurant deleted successfully');
//     } catch (error) {
//       console.error('Error deleting restaurant:', error);
//       alert('Failed to delete restaurant');
//     }
//   };

//   const handleToggleApproved = async (restaurantId, isApproved) => {
//     // Optimistically update the UI
//     setFilteredRestaurants((prevRestaurants) =>
//       prevRestaurants.map((restaurant) =>
//         restaurant.id === restaurantId ? { ...restaurant, approved: isApproved } : restaurant
//       )
//     );
  
//     // Temporarily stop polling
//     setIsPollingPaused(true);
  
//     try {
//       // Update the backend
//       // await axios.patch(`http://localhost:8081/api/restaurants/${restaurantId}/approval?isApproved=${isApproved}`);

//       await toggleRestaurantApproval(restaurantId, isApproved);
//       alert(`Restaurant ${isApproved ? 'approved' : 'disapproved'} successfully`);
//     } catch (error) {
//       console.error('Error toggling restaurant approval:', error);
//       alert('Failed to toggle restaurant approval');
  
//       // Revert the optimistic update in case of error
//       setFilteredRestaurants((prevRestaurants) =>
//         prevRestaurants.map((restaurant) =>
//           restaurant.id === restaurantId ? { ...restaurant, approved: !isApproved } : restaurant
//         )
//       );
//     } finally {
//       // Resume polling after a short delay
//       setTimeout(() => setIsPollingPaused(false), 2000);
//     }
//   };

//   const handleToggleAvailable = async (restaurantId, isAvailable) => {
//     // Optimistically update the UI
//     setFilteredRestaurants((prevRestaurants) =>
//       prevRestaurants.map((restaurant) =>
//         restaurant.id === restaurantId ? { ...restaurant, available: isAvailable } : restaurant
//       )
//     );
  
//     // Temporarily stop polling
//     setIsPollingPaused(true);
  
//     try {
//       // Update the backend
//       // await axios.patch(`http://localhost:8081/api/restaurants/${restaurantId}/availability?isAvailable=${isAvailable}`);

//       await toggleRestaurantAvailability(restaurantId, isAvailable);
//       alert(`Restaurant ${isAvailable ? 'available' : 'unavailable'} successfully`);
//     } catch (error) {
//       console.error('Error toggling restaurant availability:', error);
//       alert('Failed to toggle restaurant availability');
//     } finally {
//       // Resume polling
//       setIsPollingPaused(false);
//     }
//   };
  
  

//   return (
//     <Grid container spacing={4} direction="column" alignItems="center">
//       {filteredRestaurants.length > 0 ? (
//         filteredRestaurants.map((restaurant, index) => (
//           <Grid
//             item
//             xs={12}
//             key={restaurant.id}
//             style={{
//               width: '100%',
//               opacity:restaurant.approved? (role === 'ADMIN' ? 1 : restaurant.available ? 1 : 0.5): (role === 'ADMIN' ? 0.5 : 0.5), // Component is visible even if not approved
//               pointerEvents:restaurant.approved? 'auto': (role === 'ADMIN' ? 'auto' : 'none'), // Non-ADMIN cannot interact if not approved
//             }}
//           >
//             <Box
//               p={3}
//               mb={5}
//               borderRadius={3}
//               style={{
//                 backgroundColor: vibrantColors[index % vibrantColors.length],
//                 width: isSmallScreen ? '100%' : '95%',
//                 maxWidth: '1300px',
//                 margin: 'auto',
//                 position: 'relative',
//               }}
//             >
//               <Box display="flex" alignItems="center" justifyContent="center">
//                 <Typography variant="h6" style={{ marginRight: '10px', marginTop: '-10px' }}>
//                   {renderStars(restaurant.rating)}
//                 </Typography>

//                 <Typography
//                   variant="h5"
//                   align="center"
//                   gutterBottom
//                   onClick={() => handleNavigate(restaurant)}
//                   style={{ cursor: 'pointer' }}
//                 >
//                   {restaurant.name}
//                 </Typography>

//                 <Typography variant="h6" style={{ marginLeft: '10px', marginTop: '-10px' }}>
//                   {renderStars(restaurant.rating)}
//                 </Typography>
//               </Box>

//               {/* {role === 'OWNER' && (
//                 <IconButton
//                   onClick={() => handleDelete(restaurant.id)}
//                   style={{ position: 'absolute', top: 10, right: 10 }}
//                 >
//                   <Delete />
//                 </IconButton>
//               )} */}
//               {role === 'OWNER' && (
//                 <Box sx={{ position: 'absolute', top: 10, right: 10, display: 'flex', alignItems: 'center' }}>
//                   <IconButton onClick={() => handleDelete(restaurant.id)}>
//                     <Delete />
//                   </IconButton>
//                   <Switch
//                     checked={Boolean(restaurant.available)}
//                     onChange={(e) => handleToggleAvailable(restaurant.id, e.target.checked)}
//                     color="primary"
//                   />
//                 </Box>
//               )}

//               {role === 'ADMIN' && (
//                 <Box
//                   style={{
//                     position: 'absolute',
//                     top: 10,
//                     right: role === 'OWNER' ? 50 : 10,
//                   }}
//                 >
//                   <Typography variant="body2" style={{ marginBottom: 5 }}>
//                     {restaurant.approved ? 'Approved' : 'Disapproved'}
//                   </Typography>
//                   <Switch
//                     checked={Boolean(restaurant.approved)} // Always a boolean
//                     onChange={(e) => handleToggleApproved(restaurant.id, e.target.checked)}
//                   />

//                 </Box>
//               )}

//               <Box
//                 display="flex"
//                 alignItems="center"
//                 position="relative"
//                 width="100%"
//                 onMouseEnter={() => setIsHovered(true)}
//                 onMouseLeave={() => setIsHovered(false)}
//               >
//                 <IconButton
//                   onClick={() => scroll(restaurant.id, -1)}
//                   style={{ position: 'absolute', left: 0, zIndex: 1 }}
//                   disabled={getAllDishes(restaurant).length <= 4}
//                 >
//                   <ArrowBack />
//                 </IconButton>

//                 <Box
//                   ref={(el) => (scrollRefs.current[restaurant.id] = el)}
//                   display="flex"
//                   overflow="hidden"
//                   flexWrap="nowrap"
//                   style={{
//                     marginLeft: 40,
//                     marginRight: 40,
//                     width: 'calc(100% - 80px)',
//                     maxWidth: '100%',
//                   }}
//                 >
//                   {getAllDishes(restaurant).map((dish) => (
//                     <Box key={`${restaurant.id}-${dish.id}`} flex="0 0 auto" width="200px" mr={2}>
//                       <MilkCard milk={dish} />
//                       {/* <Suspense fallback={<div>Loading...</div>}>
//                         <MilkCard milk={dish} />
//                       </Suspense> */}
//                     </Box>
//                   ))}
//                 </Box>

//                 <IconButton
//                   onClick={() => scroll(restaurant.id, 1)}
//                   style={{ position: 'absolute', right: 0, zIndex: 1 }}
//                   disabled={getAllDishes(restaurant).length <= 4}
//                 >
//                   <ArrowForward />
//                 </IconButton>
//               </Box>
//             </Box>
//           </Grid>
//         ))
//       ) : (
//         <Typography variant="h6" align="center">
//           No restaurants available.
//         </Typography>
//       )}
//     </Grid>
//   );
// };

// export default MilkList;




















// import React, { useRef, useEffect, useState, useContext, lazy, Suspense } from 'react';
// import {
//   Grid,
//   Typography,
//   IconButton,
//   Box,
//   useMediaQuery,
//   useTheme,
//   Switch,
// } from '@mui/material';
// import { ArrowBack, ArrowForward, Delete } from '@mui/icons-material';
// import DishCard from './DishCard';
// import { useNavigate } from 'react-router-dom';
// import { fetchStatuses, deleteRestaurant, toggleRestaurantApproval, toggleRestaurantAvailability } from '../api';
// import { debounce } from 'lodash';
// import AuthContext from '../context/AuthContext';

// const DishList = ({ restaurants = [] }) => {
//   const { user } = useContext(AuthContext);
//   const scrollRefs = useRef({});
//   const [isHovered, setIsHovered] = useState(false);
//   const theme = useTheme();
//   const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
//   const navigate = useNavigate();
//   const vibrantColors = ['#FFD700', '#FF6347', '#32CD32', '#1E90FF', '#FF69B4', '#FF4500'];

//   const [filteredRestaurants, setFilteredRestaurants] = useState([]);
//   const [role, setRole] = useState(null);
//   const [isPollingPaused, setIsPollingPaused] = useState(false);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   // const DishCard = lazy(() => import('./DishCard'));
//   const debouncedScroll = debounce((restaurantId, direction) => {
//     scroll(restaurantId, direction);
// }, 300);

// useEffect(() => {
//   let filtered = restaurants;

//   if (user) {
//     const { role: userRole, email } = user;
//     setRole(userRole);

//     if (userRole === 'OWNER') {
//       filtered = restaurants.filter((restaurant) => restaurant.email === email);
//     }
//   }

//   setFilteredRestaurants(filtered);
// }, [user, restaurants]);
  

//   useEffect(() => {
//     if (isPollingPaused) return;

//     const intervalId = setInterval(async () => {
//         try {
//             const restaurantIds = filteredRestaurants.map((restaurant) => restaurant.id).join(',');

//             const response = await fetchStatuses(restaurantIds);

//             const statusesData = response.data || {};

//             setFilteredRestaurants((prev) =>
//                 prev.map((restaurant) => ({
//                     ...restaurant,
//                     available: statusesData[restaurant.id]?.isAvailable ?? restaurant.available,
//                     approved: statusesData[restaurant.id]?.isApproved ?? restaurant.approved,
//                 }))
//             );
//         } catch (error) {
//             console.error('Error fetching statuses:', error);
//         }
//     }, 15000); // Increased interval to 15 seconds

//     return () => clearInterval(intervalId);
// }, [filteredRestaurants, isPollingPaused]);

  
  
  

//   const scroll = (restaurantId, direction) => {
//     const scrollAmount = 200;
//     const scrollContainer = scrollRefs.current[restaurantId];
//     if (scrollContainer) {
//         const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;

//         if (scrollLeft + clientWidth >= scrollWidth) {
//             scrollContainer.scrollTo({ left: 0, behavior: 'auto' });
//         } else {
//             scrollContainer.scrollBy({ left: direction * scrollAmount, behavior: 'auto' });
//         }
//     }
// };


//   const getAllDishes = (restaurant) => restaurant.dishes || [];

//   const renderStars = (rating) => {
//     const starCount = Math.floor(rating);
//     return [...Array(5)].map((_, index) => (
//       <span key={index} style={{ color: 'black' }}>
//         {index < starCount ? '★' : '☆'}
//       </span>
//     ));
//   };

//   useEffect(() => {
//     const intervalId = setInterval(() => {
//         if (!isHovered) {
//             filteredRestaurants.forEach((restaurant) => debouncedScroll(restaurant.id, 1));
//         }
//     }, 3000);

//     return () => clearInterval(intervalId);
// }, [isHovered, filteredRestaurants, debouncedScroll]);


//   const handleNavigate = (restaurant) => {
//     if (restaurant.approved) {
//       navigate(`/restaurant/${restaurant.id}`, {
//         state: { restaurant, role },
//       });
//     }
//   };

//   const handleDelete = async (restaurantId) => {
//     try {
//       await deleteRestaurant(restaurantId);
//       setFilteredRestaurants((prev) =>
//         prev.filter((restaurant) => restaurant.id !== restaurantId)
//       );
//       alert('Restaurant deleted successfully');
//     } catch (error) {
//       console.error('Error deleting restaurant:', error);
//       alert('Failed to delete restaurant');
//     }
//   };

//   const handleToggleApproved = async (restaurantId, isApproved) => {
//     // Optimistically update the UI
//     setFilteredRestaurants((prevRestaurants) =>
//       prevRestaurants.map((restaurant) =>
//         restaurant.id === restaurantId ? { ...restaurant, approved: isApproved } : restaurant
//       )
//     );
  
//     // Temporarily stop polling
//     setIsPollingPaused(true);
  
//     try {
//       // Update the backend

//       await toggleRestaurantApproval(restaurantId, isApproved);
//       alert(`Restaurant ${isApproved ? 'approved' : 'disapproved'} successfully`);
//     } catch (error) {
//       console.error('Error toggling restaurant approval:', error);
//       alert('Failed to toggle restaurant approval');
  
//       // Revert the optimistic update in case of error
//       setFilteredRestaurants((prevRestaurants) =>
//         prevRestaurants.map((restaurant) =>
//           restaurant.id === restaurantId ? { ...restaurant, approved: !isApproved } : restaurant
//         )
//       );
//     } finally {
//       // Resume polling after a short delay
//       setTimeout(() => setIsPollingPaused(false), 2000);
//     }
//   };

//   const handleToggleAvailable = async (restaurantId, isAvailable) => {
//     // Optimistically update the UI
//     setFilteredRestaurants((prevRestaurants) =>
//       prevRestaurants.map((restaurant) =>
//         restaurant.id === restaurantId ? { ...restaurant, available: isAvailable } : restaurant
//       )
//     );
  
//     // Temporarily stop polling
//     setIsPollingPaused(true);
  
//     try {
//       // Update the backend

//       await toggleRestaurantAvailability(restaurantId, isAvailable);
//       alert(`Restaurant ${isAvailable ? 'available' : 'unavailable'} successfully`);
//     } catch (error) {
//       console.error('Error toggling restaurant availability:', error);
//       alert('Failed to toggle restaurant availability');
//     } finally {
//       // Resume polling
//       setIsPollingPaused(false);
//     }
//   };
  
  

//   return (
//     <Grid container spacing={4} direction="column" alignItems="center">
//       {filteredRestaurants.length > 0 ? (
//         filteredRestaurants.map((restaurant, index) => (
//           <Grid
//             item
//             xs={12}
//             key={restaurant.id}
//             style={{
//               width: '100%',
//               opacity:restaurant.approved? (role === 'ADMIN' ? 1 : restaurant.available ? 1 : 0.5): (role === 'ADMIN' ? 0.5 : 0.5), // Component is visible even if not approved
//               pointerEvents:restaurant.approved? 'auto': (role === 'ADMIN' ? 'auto' : 'none'), // Non-ADMIN cannot interact if not approved
//             }}
//           >
//             <Box
//               p={3}
//               mb={5}
//               borderRadius={3}
//               style={{
//                 backgroundColor: vibrantColors[index % vibrantColors.length],
//                 width: isSmallScreen ? '100%' : '95%',
//                 maxWidth: '1300px',
//                 margin: 'auto',
//                 position: 'relative',
//               }}
//             >
//               <Box display="flex" alignItems="center" justifyContent="center">
//                 <Typography variant="h6" style={{ marginRight: '10px', marginTop: '-10px' }}>
//                   {renderStars(restaurant.rating)}
//                 </Typography>

//                 <Typography
//                   variant="h5"
//                   align="center"
//                   gutterBottom
//                   onClick={() => handleNavigate(restaurant)}
//                   style={{ cursor: 'pointer' }}
//                 >
//                   {restaurant.name}
//                 </Typography>

//                 <Typography variant="h6" style={{ marginLeft: '10px', marginTop: '-10px' }}>
//                   {renderStars(restaurant.rating)}
//                 </Typography>
//               </Box>
//               {role === 'OWNER' && (
//                 <Box sx={{ position: 'absolute', top: 10, right: 10, display: 'flex', alignItems: 'center' }}>
//                   <IconButton onClick={() => handleDelete(restaurant.id)}>
//                     <Delete />
//                   </IconButton>
//                   <Switch
//                     checked={Boolean(restaurant.available)}
//                     onChange={(e) => handleToggleAvailable(restaurant.id, e.target.checked)}
//                     color="primary"
//                   />
//                 </Box>
//               )}

//               {role === 'ADMIN' && (
//                 <Box
//                   style={{
//                     position: 'absolute',
//                     top: 10,
//                     right: role === 'OWNER' ? 50 : 10,
//                   }}
//                 >
//                   <Typography variant="body2" style={{ marginBottom: 5 }}>
//                     {restaurant.approved ? 'Approved' : 'Disapproved'}
//                   </Typography>
//                   <Switch
//                     checked={Boolean(restaurant.approved)} // Always a boolean
//                     onChange={(e) => handleToggleApproved(restaurant.id, e.target.checked)}
//                   />

//                 </Box>
//               )}

//               <Box
//                 display="flex"
//                 alignItems="center"
//                 position="relative"
//                 width="100%"
//                 onMouseEnter={() => setIsHovered(true)}
//                 onMouseLeave={() => setIsHovered(false)}
//               >
//                 <IconButton
//                   onClick={() => scroll(restaurant.id, -1)}
//                   style={{ position: 'absolute', left: 0, zIndex: 1 }}
//                   disabled={getAllDishes(restaurant).length <= 4}
//                 >
//                   <ArrowBack />
//                 </IconButton>

//                 <Box
//                   ref={(el) => (scrollRefs.current[restaurant.id] = el)}
//                   display="flex"
//                   overflow="hidden"
//                   flexWrap="nowrap"
//                   style={{
//                     marginLeft: 40,
//                     marginRight: 40,
//                     width: 'calc(100% - 80px)',
//                     maxWidth: '100%',
//                   }}
//                 >
//                   {getAllDishes(restaurant).map((dish) => (
//                     <Box key={`${restaurant.id}-${dish.id}`} flex="0 0 auto" width="200px" mr={2}>
//                       <DishCard dish={dish} />
//                     </Box>
//                   ))}
//                 </Box>

//                 <IconButton
//                   onClick={() => scroll(restaurant.id, 1)}
//                   style={{ position: 'absolute', right: 0, zIndex: 1 }}
//                   disabled={getAllDishes(restaurant).length <= 4}
//                 >
//                   <ArrowForward />
//                 </IconButton>
//               </Box>
//             </Box>
//           </Grid>
//         ))
//       ) : (
//         <Typography variant="h6" align="center">
//           No restaurants available.
//         </Typography>
//       )}
//     </Grid>
//   );
// };

// export default DishList;

















// import React, { useRef, useEffect, useState, useContext } from 'react';
// import {
//   Grid,
//   Typography,
//   IconButton,
//   Box,
//   useMediaQuery,
//   useTheme,
//   Switch,
// } from '@mui/material';
// import { ArrowBack, ArrowForward, Delete } from '@mui/icons-material';
// import DishCard from './DishCard';
// import { useNavigate } from 'react-router-dom';
// import { debounce } from 'lodash';
// import AuthContext from '../context/AuthContext';

// // ✅ RTK Query restaurantApi hooks
// import {
//   useDeleteRestaurantMutation,
//   useToggleApprovalMutation,
//   useToggleAvailabilityMutation,
//   useFetchStatusesQuery,
// } from './redux/services/restaurantApi';

// const DishList = ({ restaurants = [] }) => {
//   const { user } = useContext(AuthContext);
//   const scrollRefs = useRef({});
//   const [isHovered, setIsHovered] = useState(false);
//   const theme = useTheme();
//   const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
//   const navigate = useNavigate();
//   const vibrantColors = ['#FFD700', '#FF6347', '#32CD32', '#1E90FF', '#FF69B4', '#FF4500'];

//   const [filteredRestaurants, setFilteredRestaurants] = useState([]);
//   const [role, setRole] = useState(null);
//   const [isPollingPaused, setIsPollingPaused] = useState(false);

//   // ✅ RTK Query mutations
//   const [deleteRestaurant] = useDeleteRestaurantMutation();
//   const [toggleApproval] = useToggleApprovalMutation();
//   const [toggleAvailability] = useToggleAvailabilityMutation();

//   // ✅ RTK Query fetch statuses (polling every 15s)
//   const { data: statuses } = useFetchStatusesQuery(
//     filteredRestaurants.map((r) => r.id),
//     { skip: filteredRestaurants.length === 0, pollingInterval: isPollingPaused ? 0 : 15000 }
//   );

//   // Apply user filtering (OWNER sees own restaurants)
//   useEffect(() => {
//     let filtered = restaurants;
//     if (user) {
//       const { role: userRole, email } = user;
//       setRole(userRole);
//       if (userRole === 'OWNER') {
//         filtered = restaurants.filter((restaurant) => restaurant.email === email);
//       }
//     }
//     setFilteredRestaurants(filtered);
//   }, [user, restaurants]);

//   // Apply statuses from RTK Query to restaurants
//   useEffect(() => {
//     if (statuses) {
//       setFilteredRestaurants((prev) =>
//         prev.map((restaurant) => ({
//           ...restaurant,
//           available: statuses[restaurant.id]?.isAvailable ?? restaurant.available,
//           approved: statuses[restaurant.id]?.isApproved ?? restaurant.approved,
//         }))
//       );
//     }
//   }, [statuses]);

//   const debouncedScroll = debounce((restaurantId, direction) => {
//     scroll(restaurantId, direction);
//   }, 300);

//   const scroll = (restaurantId, direction) => {
//     const scrollAmount = 200;
//     const scrollContainer = scrollRefs.current[restaurantId];
//     if (scrollContainer) {
//       const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;
//       if (scrollLeft + clientWidth >= scrollWidth) {
//         scrollContainer.scrollTo({ left: 0, behavior: 'auto' });
//       } else {
//         scrollContainer.scrollBy({ left: direction * scrollAmount, behavior: 'auto' });
//       }
//     }
//   };

//   const getAllDishes = (restaurant) => restaurant.dishes || [];

//   const renderStars = (rating) => {
//     const starCount = Math.floor(rating);
//     return [...Array(5)].map((_, index) => (
//       <span key={index} style={{ color: 'black' }}>
//         {index < starCount ? '★' : '☆'}
//       </span>
//     ));
//   };

//   // Auto-scroll carousel if not hovered
//   useEffect(() => {
//     const intervalId = setInterval(() => {
//       if (!isHovered) {
//         filteredRestaurants.forEach((restaurant) => debouncedScroll(restaurant.id, 1));
//       }
//     }, 3000);
//     return () => clearInterval(intervalId);
//   }, [isHovered, filteredRestaurants, debouncedScroll]);

//   const handleNavigate = (restaurant) => {
//     if (restaurant.approved) {
//       navigate(`/restaurant/${restaurant.id}`, {
//         state: { restaurant, role },
//       });
//     }
//   };

//   const handleDelete = async (restaurantId) => {
//     try {
//       await deleteRestaurant(restaurantId).unwrap();
//       setFilteredRestaurants((prev) =>
//         prev.filter((restaurant) => restaurant.id !== restaurantId)
//       );
//       alert('Restaurant deleted successfully');
//     } catch (error) {
//       console.error('Error deleting restaurant:', error);
//       alert('Failed to delete restaurant');
//     }
//   };

//   const handleToggleApproved = async (restaurantId, isApproved) => {
//     setFilteredRestaurants((prev) =>
//       prev.map((r) => (r.id === restaurantId ? { ...r, approved: isApproved } : r))
//     );
//     setIsPollingPaused(true);
//     try {
//       await toggleApproval({ id: restaurantId, isApproved }).unwrap();
//       alert(`Restaurant ${isApproved ? 'approved' : 'disapproved'} successfully`);
//     } catch (error) {
//       console.error('Error toggling restaurant approval:', error);
//       alert('Failed to toggle restaurant approval');
//       // Revert optimistic update
//       setFilteredRestaurants((prev) =>
//         prev.map((r) => (r.id === restaurantId ? { ...r, approved: !isApproved } : r))
//       );
//     } finally {
//       setTimeout(() => setIsPollingPaused(false), 2000);
//     }
//   };

//   const handleToggleAvailable = async (restaurantId, isAvailable) => {
//     setFilteredRestaurants((prev) =>
//       prev.map((r) => (r.id === restaurantId ? { ...r, available: isAvailable } : r))
//     );
//     setIsPollingPaused(true);
//     try {
//       await toggleAvailability({ id: restaurantId, isAvailable }).unwrap();
//       alert(`Restaurant ${isAvailable ? 'available' : 'unavailable'} successfully`);
//     } catch (error) {
//       console.error('Error toggling restaurant availability:', error);
//       alert('Failed to toggle restaurant availability');
//     } finally {
//       setIsPollingPaused(false);
//     }
//   };

//   return (
//     <Grid container spacing={4} direction="column" alignItems="center">
//       {filteredRestaurants.length > 0 ? (
//         filteredRestaurants.map((restaurant, index) => (
//           <Grid
//             item
//             xs={12}
//             key={restaurant.id}
//             style={{
//               width: '100%',
//               opacity: restaurant.approved
//                 ? role === 'ADMIN'
//                   ? 1
//                   : restaurant.available
//                   ? 1
//                   : 0.5
//                 : role === 'ADMIN'
//                 ? 0.5
//                 : 0.5,
//               pointerEvents: restaurant.approved
//                 ? 'auto'
//                 : role === 'ADMIN'
//                 ? 'auto'
//                 : 'none',
//             }}
//           >
//             <Box
//               p={3}
//               mb={5}
//               borderRadius={3}
//               style={{
//                 backgroundColor: vibrantColors[index % vibrantColors.length],
//                 width: isSmallScreen ? '100%' : '95%',
//                 maxWidth: '1300px',
//                 margin: 'auto',
//                 position: 'relative',
//               }}
//             >
//               <Box display="flex" alignItems="center" justifyContent="center">
//                 <Typography variant="h6" style={{ marginRight: '10px', marginTop: '-10px' }}>
//                   {renderStars(restaurant.rating)}
//                 </Typography>

//                 <Typography
//                   variant="h5"
//                   align="center"
//                   gutterBottom
//                   onClick={() => handleNavigate(restaurant)}
//                   style={{ cursor: 'pointer' }}
//                 >
//                   {restaurant.name}
//                 </Typography>

//                 <Typography variant="h6" style={{ marginLeft: '10px', marginTop: '-10px' }}>
//                   {renderStars(restaurant.rating)}
//                 </Typography>
//               </Box>

//               {role === 'OWNER' && (
//                 <Box sx={{ position: 'absolute', top: 10, right: 10, display: 'flex', alignItems: 'center' }}>
//                   <IconButton onClick={() => handleDelete(restaurant.id)}>
//                     <Delete />
//                   </IconButton>
//                   <Switch
//                     checked={Boolean(restaurant.available)}
//                     onChange={(e) => handleToggleAvailable(restaurant.id, e.target.checked)}
//                     color="primary"
//                   />
//                 </Box>
//               )}

//               {role === 'ADMIN' && (
//                 <Box
//                   style={{
//                     position: 'absolute',
//                     top: 10,
//                     right: role === 'OWNER' ? 50 : 10,
//                   }}
//                 >
//                   <Typography variant="body2" style={{ marginBottom: 5 }}>
//                     {restaurant.approved ? 'Approved' : 'Disapproved'}
//                   </Typography>
//                   <Switch
//                     checked={Boolean(restaurant.approved)}
//                     onChange={(e) => handleToggleApproved(restaurant.id, e.target.checked)}
//                   />
//                 </Box>
//               )}

//               <Box
//                 display="flex"
//                 alignItems="center"
//                 position="relative"
//                 width="100%"
//                 onMouseEnter={() => setIsHovered(true)}
//                 onMouseLeave={() => setIsHovered(false)}
//               >
//                 <IconButton
//                   onClick={() => scroll(restaurant.id, -1)}
//                   style={{ position: 'absolute', left: 0, zIndex: 1 }}
//                   disabled={getAllDishes(restaurant).length <= 4}
//                 >
//                   <ArrowBack />
//                 </IconButton>

//                 <Box
//                   ref={(el) => (scrollRefs.current[restaurant.id] = el)}
//                   display="flex"
//                   overflow="hidden"
//                   flexWrap="nowrap"
//                   style={{
//                     marginLeft: 40,
//                     marginRight: 40,
//                     width: 'calc(100% - 80px)',
//                     maxWidth: '100%',
//                   }}
//                 >
//                   {getAllDishes(restaurant).map((dish) => (
//                     <Box key={`${restaurant.id}-${dish.id}`} flex="0 0 auto" width="200px" mr={2}>
//                       <DishCard dish={dish} />
//                     </Box>
//                   ))}
//                 </Box>

//                 <IconButton
//                   onClick={() => scroll(restaurant.id, 1)}
//                   style={{ position: 'absolute', right: 0, zIndex: 1 }}
//                   disabled={getAllDishes(restaurant).length <= 4}
//                 >
//                   <ArrowForward />
//                 </IconButton>
//               </Box>
//             </Box>
//           </Grid>
//         ))
//       ) : (
//         <Typography variant="h6" align="center">
//           No restaurants available.
//         </Typography>
//       )}
//     </Grid>
//   );
// };

// export default DishList;












// import React, { useRef, useEffect, useState } from 'react';
// import {
//   Grid,
//   Typography,
//   IconButton,
//   Box,
//   useMediaQuery,
//   useTheme,
//   Switch,
// } from '@mui/material';
// import { ArrowBack, ArrowForward, Delete } from '@mui/icons-material';
// import DishCard from './DishCard';
// import { useNavigate } from 'react-router-dom';
// import { debounce } from 'lodash';
// import { useSelector } from 'react-redux';  // ✅ useSelector for auth
// import './DishList.css';

// // ✅ RTK Query restaurantApi hooks
// import {
//   useDeleteRestaurantMutation,
//   useToggleApprovalMutation,
//   useToggleAvailabilityMutation,
//   useFetchStatusesQuery,
// } from './redux/services/restaurantApi';

// const DishList = ({ restaurants = [] }) => {
//   // ✅ Replace AuthContext with Redux
//   const user = useSelector((state) => state.auth.user);

//   const scrollRefs = useRef({});
//   const [isHovered, setIsHovered] = useState(false);
//   const theme = useTheme();
//   const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
//   const navigate = useNavigate();
//   const vibrantColors = ['#FFD700', '#FF6347', '#32CD32', '#1E90FF', '#FF69B4', '#FF4500'];

//   const [filteredRestaurants, setFilteredRestaurants] = useState([]);
//   const [role, setRole] = useState(null);
//   const [isPollingPaused, setIsPollingPaused] = useState(false);

//   // ✅ RTK Query mutations
//   const [deleteRestaurant] = useDeleteRestaurantMutation();
//   const [toggleApproval] = useToggleApprovalMutation();
//   const [toggleAvailability] = useToggleAvailabilityMutation();

//   // ✅ RTK Query fetch statuses (polling every 15s)
//   const { data: statuses } = useFetchStatusesQuery(
//     filteredRestaurants.map((r) => r.id),
//     { skip: filteredRestaurants.length === 0, pollingInterval: isPollingPaused ? 0 : 15000 }
//   );

//   // Apply user filtering (OWNER sees own restaurants)
//   useEffect(() => {
//     let filtered = restaurants;
//     if (user) {
//       const { role: userRole, email } = user;
//       setRole(userRole);
//       if (userRole === 'OWNER') {
//         filtered = restaurants.filter((restaurant) => restaurant.email === email);
//       }
//     }
//     setFilteredRestaurants(filtered);
//   }, [user, restaurants]);

//   // Apply statuses from RTK Query to restaurants
//   useEffect(() => {
//     if (statuses) {
//       setFilteredRestaurants((prev) =>
//         prev.map((restaurant) => ({
//           ...restaurant,
//           available: statuses[restaurant.id]?.isAvailable ?? restaurant.available,
//           approved: statuses[restaurant.id]?.isApproved ?? restaurant.approved,
//         }))
//       );
//     }
//   }, [statuses]);

//   const debouncedScroll = debounce((restaurantId, direction) => {
//     scroll(restaurantId, direction);
//   }, 300);

//   const scroll = (restaurantId, direction) => {
//     const scrollAmount = 200;
//     const scrollContainer = scrollRefs.current[restaurantId];
//     if (scrollContainer) {
//       const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;
//       if (scrollLeft + clientWidth >= scrollWidth) {
//         scrollContainer.scrollTo({ left: 0, behavior: 'auto' });
//       } else {
//         scrollContainer.scrollBy({ left: direction * scrollAmount, behavior: 'auto' });
//       }
//     }
//   };

//   const getAllDishes = (restaurant) => restaurant.dishes || [];

//   const renderStars = (rating) => {
//     const starCount = Math.floor(rating);
//     return [...Array(5)].map((_, index) => (
//       <span key={index} style={{ color: 'black' }}>
//         {index < starCount ? '★' : '☆'}
//       </span>
//     ));
//   };

//   // Auto-scroll carousel if not hovered
//   useEffect(() => {
//     const intervalId = setInterval(() => {
//       if (!isHovered) {
//         filteredRestaurants.forEach((restaurant) => debouncedScroll(restaurant.id, 1));
//       }
//     }, 3000);
//     return () => clearInterval(intervalId);
//   }, [isHovered, filteredRestaurants, debouncedScroll]);

//   const handleNavigate = (restaurant) => {
//     if (restaurant.approved) {
//       navigate(`/restaurant/${restaurant.id}`, {
//         state: { restaurant, role },
//       });
//     }
//   };

//   const handleDelete = async (restaurantId) => {
//     try {
//       await deleteRestaurant(restaurantId).unwrap();
//       setFilteredRestaurants((prev) =>
//         prev.filter((restaurant) => restaurant.id !== restaurantId)
//       );
//       alert('Restaurant deleted successfully');
//     } catch (error) {
//       console.error('Error deleting restaurant:', error);
//       alert('Failed to delete restaurant');
//     }
//   };

//   const handleToggleApproved = async (restaurantId, isApproved) => {
//     setFilteredRestaurants((prev) =>
//       prev.map((r) => (r.id === restaurantId ? { ...r, approved: isApproved } : r))
//     );
//     setIsPollingPaused(true);
//     try {
//       await toggleApproval({ id: restaurantId, isApproved }).unwrap();
//       alert(`Restaurant ${isApproved ? 'approved' : 'disapproved'} successfully`);
//     } catch (error) {
//       console.error('Error toggling restaurant approval:', error);
//       alert('Failed to toggle restaurant approval');
//       // Revert optimistic update
//       setFilteredRestaurants((prev) =>
//         prev.map((r) => (r.id === restaurantId ? { ...r, approved: !isApproved } : r))
//       );
//     } finally {
//       setTimeout(() => setIsPollingPaused(false), 2000);
//     }
//   };

//   const handleToggleAvailable = async (restaurantId, isAvailable) => {
//     setFilteredRestaurants((prev) =>
//       prev.map((r) => (r.id === restaurantId ? { ...r, available: isAvailable } : r))
//     );
//     setIsPollingPaused(true);
//     try {
//       await toggleAvailability({ id: restaurantId, isAvailable }).unwrap();
//       alert(`Restaurant ${isAvailable ? 'available' : 'unavailable'} successfully`);
//     } catch (error) {
//       console.error('Error toggling restaurant availability:', error);
//       alert('Failed to toggle restaurant availability');
//     } finally {
//       setIsPollingPaused(false);
//     }
//   };

//   return (
//     <Grid container spacing={4} direction="column" alignItems="center">
//       {filteredRestaurants.length > 0 ? (
//         filteredRestaurants.map((restaurant, index) => (
//           <Grid
//             item
//             xs={12}
//             key={restaurant.id}
//             className={`restaurantGrid ${restaurant.approved
//               ? role === 'ADMIN'
//                 ? 'approved-admin'
//                 : restaurant.available
//                 ? 'approved-owner'
//                 : 'faded'
//               : role === 'ADMIN'
//               ? 'faded-admin'
//               : 'faded'
//             }`}
//           >
//             <Box
//               p={3}
//               mb={5}
//               borderRadius={3}
//               className="restaurantBox"
//               style={{ backgroundColor: vibrantColors[index % vibrantColors.length], width: isSmallScreen ? '100%' : '95%' }}
//             >
//               <Box className="restaurantHeader">
//                 <Typography variant="h6" className="starBox">
//                   {renderStars(restaurant.rating)}
//                 </Typography>

//                 <Typography
//                   variant="h5"
//                   align="center"
//                   gutterBottom
//                   onClick={() => handleNavigate(restaurant)}
//                   className="restaurantName"
//                 >
//                   {restaurant.name}
//                 </Typography>

//                 <Typography variant="h6" className="starBox">
//                   {renderStars(restaurant.rating)}
//                 </Typography>
//               </Box>

//               {role === 'OWNER' && (
//                 <Box className="ownerControls">
//                   <IconButton onClick={() => handleDelete(restaurant.id)}>
//                     <Delete />
//                   </IconButton>
//                   <Switch
//                     checked={Boolean(restaurant.available)}
//                     onChange={(e) => handleToggleAvailable(restaurant.id, e.target.checked)}
//                     color="primary"
//                   />
//                 </Box>
//               )}

//               {role === 'ADMIN' && (
//                 <Box className={`adminControls ${role === 'OWNER' ? 'shifted' : ''}`}>
//                   <Typography variant="body2" className="approvalText">
//                     {restaurant.approved ? 'Approved' : 'Disapproved'}
//                   </Typography>
//                   <Switch
//                     checked={Boolean(restaurant.approved)}
//                     onChange={(e) => handleToggleApproved(restaurant.id, e.target.checked)}
//                   />
//                 </Box>
//               )}

//               <Box
//                 className="carouselContainer"
//                 onMouseEnter={() => setIsHovered(true)}
//                 onMouseLeave={() => setIsHovered(false)}
//               >
//                 <IconButton
//                   onClick={() => scroll(restaurant.id, -1)}
//                   className="scrollBtn leftBtn"
//                   disabled={getAllDishes(restaurant).length <= 4}
//                 >
//                   <ArrowBack />
//                 </IconButton>

//                 <Box
//                   ref={(el) => (scrollRefs.current[restaurant.id] = el)}
//                   className="carouselBox"
//                 >
//                   {getAllDishes(restaurant).map((dish) => (
//                     <Box key={`${restaurant.id}-${dish.id}`} className="dishBox">
//                       <DishCard dish={dish} />
//                     </Box>
//                   ))}
//                 </Box>

//                 <IconButton
//                   onClick={() => scroll(restaurant.id, 1)}
//                   className="scrollBtn rightBtn"
//                   disabled={getAllDishes(restaurant).length <= 4}
//                 >
//                   <ArrowForward />
//                 </IconButton>
//               </Box>
//             </Box>
//           </Grid>
//         ))
//       ) : (
//         <Typography variant="h6" align="center">
//           No restaurants available.
//         </Typography>
//       )}
//     </Grid>
//   );
// };

// export default DishList;


















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
                <Box className="badgeTopLeft">One Free delivery</Box>

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
