import React from "react";
import { Box, Button, Drawer, IconButton, List, ListItem, ListItemText } from "@mui/material";
import { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import "./navbar.css"; // import the CSS file

const Navbar = ({ products, onSearchDish }) => {
  // Extract unique categories from all dishes across restaurants
  const categories = [
    "ALL",
    ...new Set(
      products
        .flatMap((restaurant) => restaurant.dishes)
        .map((dish) => dish.category)
    ),
  ];
  const [open, setOpen] = useState(false);

  // Mapping for specific category names
  const categoryMapping = {
    "North Indian": "North",
    "South Indian": "South",
  };

  // Define the desired order of categories
  const categoryOrder = [
    "ALL",
    "North Indian",
    "South Indian",
    "Bengali",
    "Chinese",
    "Japanese",
    "Side Dish",
    "Sweets",
    "Beverage",
    "Café",
  ];

  // Sort categories based on the defined order
  const sortedCategories = categoryOrder.filter((category) =>
    categories.includes(category)
  );

  console.log(sortedCategories); // for debugging

  return (
    <Box className="navbar-root">
      {/* Desktop Navbar */}
      <Box component="ul" className="navbar-desktop">
        {sortedCategories.map((category, index) => (
          <Box component="li" key={index} className="navbar-item">
            <Button
              onClick={() => onSearchDish(category)}
              className="navbar-button"
            >
              {categoryMapping[category] || category}
            </Button>
          </Box>
        ))}
      </Box>

      {/* Mobile Menu Button */}
      <Box className="navbar-mobile-btn">
        <IconButton onClick={() => setOpen(true)} className="menu-icon-btn">
          <MenuIcon />
        </IconButton>
      </Box>

      {/* Drawer for Mobile */}
      <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
        <List className="drawer-list">
          {sortedCategories.map((category, index) => (
            <ListItem
              button
              key={index}
              onClick={() => {
                onSearchDish(category);
                setOpen(false);
              }}
              className="drawer-item"
            >
              <ListItemText
                primary={categoryMapping[category] || category}
                className="drawer-text"
              />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </Box>
  );
}

export default Navbar;


