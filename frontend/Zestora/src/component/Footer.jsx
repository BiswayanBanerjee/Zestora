// import React from 'react';
// import { Box, Typography, IconButton, Grid } from '@mui/material';
// import FacebookIcon from '@mui/icons-material/Facebook';
// import InstagramIcon from '@mui/icons-material/Instagram';
// import LinkedInIcon from '@mui/icons-material/LinkedIn';



// const Footer = () => {
//   return (
//     <Box sx={{ p: 2, backgroundColor: 'white', color: 'black', borderTop: '1px solid #000' }}>
//       <Grid container spacing={4} justifyContent="space-around">
        
//         <Grid item xs={12} sm={4}>
//           <Box>
//             <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
//               <IconButton href="https://www.facebook.com" target="_blank" color="inherit">
//                 <FacebookIcon />
//               </IconButton>
//               <IconButton href="https://www.instagram.com" target="_blank" color="inherit">
//                 <InstagramIcon />
//               </IconButton>
//               <IconButton href="https://www.linkedin.com" target="_blank" color="inherit">
//                 <LinkedInIcon />
//               </IconButton>
//             </Box>
//             <Typography variant="body2" align="center">
//               © 2024 <i style={{ fontFamily: 'pacific' }}>Swigato</i>
//             </Typography>
//             <Typography variant="body2" align="center">
//               All Rights Reserved.
//             </Typography>
//           </Box>
//         </Grid>
        
//         <Grid item xs={12} sm={4}>
//           <Box>
//             <Typography variant="h6" align="center" gutterBottom>
//               Know Us
//             </Typography>
//             <Typography variant="body2" align="center">Contact Us</Typography>
//             <Typography variant="body2" align="center">About Us</Typography>
//           </Box>
//         </Grid>
        
//         <Grid item xs={12} sm={4}>
//           <Box>
//             <Typography variant="h6" align="center" gutterBottom>
//               Need Help
//             </Typography>
//             <Typography variant="body2" align="center">FAQ</Typography>
//             <Typography variant="body2" align="center">Terms and Conditions</Typography>
//           </Box>
//         </Grid>
        
//       </Grid>
//     </Box>
//   );
// };

// export default Footer;


import React from 'react';
import { Box, Typography, IconButton, Grid } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const Footer = () => {
  return (
    <Box 
      sx={{ 
        p: 2, 
         // Use theme background color
        color: 'text.primary', // Use theme text color
        borderTop: '1px solid', 
        borderColor: 'divider', // Use theme divider color for the border
      }}
    >
      <Grid container spacing={4} justifyContent="space-around">
        
        <Grid item xs={12} sm={4}>
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <IconButton href="https://www.facebook.com" target="_blank" color="inherit">
                <FacebookIcon />
              </IconButton>
              <IconButton href="https://www.instagram.com" target="_blank" color="inherit">
                <InstagramIcon />
              </IconButton>
              <IconButton href="https://www.linkedin.com" target="_blank" color="inherit">
                <LinkedInIcon />
              </IconButton>
            </Box>
            <Typography variant="body2" align="center">
              © 2024 <i style={{ fontFamily: 'pacific' }}>Swigato</i>
            </Typography>
            <Typography variant="body2" align="center">
              All Rights Reserved.
            </Typography>
          </Box>
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <Box>
            <Typography variant="h6" align="center" gutterBottom>
              Know Us
            </Typography>
            <Typography variant="body2" align="center">Contact Us</Typography>
            <Typography variant="body2" align="center">About Us</Typography>
          </Box>
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <Box>
            <Typography variant="h6" align="center" gutterBottom>
              Need Help
            </Typography>
            <Typography variant="body2" align="center">FAQ</Typography>
            <Typography variant="body2" align="center">Terms and Conditions</Typography>
          </Box>
        </Grid>
        
      </Grid>
    </Box>
  );
};

export default Footer;

