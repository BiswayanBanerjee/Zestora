import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import styles from "./TopCategories.module.css";

const categories = [
  { name: "Biryani", img: "/categories/biryani.png" },
  { name: "Pizzas", img: "/categories/pizza.png" },
  { name: "Chinese", img: "/categories/chinese.png" },
  { name: "Momos", img: "/categories/momos.png" },
  { name: "Cakes", img: "/categories/cake.png" },
  { name: "Rolls", img: "/categories/rolls.png" },
  { name: "North Indian", img: "/categories/north.png" },
];

export default function TopCategories({ onSelect }) {
  return (
    <Box className={styles.container}>
      <Typography className={styles.heading}>
        Discover Delicious Options
      </Typography>

      <Box className={styles.grid}>
        {categories.map((cat) => (
          <Box
            key={cat.name}
            className={styles.category}
            onClick={() => onSelect(cat.name)}
          >
            <img
              src={cat.img}
              alt={cat.name}
              className={`${styles.icon} ${
                cat.name === "Pizzas" ? styles.pizzaIcon : ""
              }`}
            />
            <Typography className={styles.label}>{cat.name}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
