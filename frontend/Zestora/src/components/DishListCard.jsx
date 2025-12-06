import React, { useState, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import DishCard from "./DishCard";
import styles from "../styles/DishListCard.module.css"; // ✅ CSS module import
import { useTheme } from "@mui/material/styles";
import { useUpdateCartMutation } from "../redux/services/customerApi";
import { updateCartSuccess } from "../redux/slices/customerSlice";
import { useSelector, useDispatch } from "react-redux";
import RamenDiningOutlinedIcon from '@mui/icons-material/RamenDiningOutlined';

const DishListCard = ({ dish }) => {
  const imageUrl = `/${dish.imageUrl}`;
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
  const [displayText, setDisplayText] = useState("");
  const descRef = useRef(null);
  const { background } = useTheme().palette;
  const user = useSelector((state) => state.auth.user);
  const cartItems = useSelector(
    (state) => state.customer.customerData.cartItems || []
  );
  const quantity = cartItems.filter((id) => id === String(dish.id)).length;
  const dispatch = useDispatch();
  const [updateCart] = useUpdateCartMutation();
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!dish.description) return;
    const baseText = `Serves 1 | ${dish.description}`;

    if (expanded || !isMobile) {
      setDisplayText(baseText + (isMobile ? " " : ""));
      return;
    }

    const container = descRef.current;
    if (!container) {
      setDisplayText(baseText);
      return;
    }

    const style = window.getComputedStyle(container);
    const font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    context.font = font;

    const availableWidth = container.offsetWidth;
    const moreText = "...more";

    let truncated = baseText;
    if (context.measureText(baseText).width > availableWidth) {
      for (let i = baseText.length - 1; i > 0; i--) {
        const sub = baseText.slice(0, i);
        if (context.measureText(sub + moreText).width <= availableWidth) {
          truncated = sub + moreText;
          break;
        }
      }
    }
    setDisplayText(truncated);
  }, [dish.description, expanded, isMobile]);

  const handleAddToCart = async () => {
    if (!user) {
      alert("Please login first");
      return;
    }

    // Step 1: correct cart reading format
    const existingCartItems = cartItems;

    // Step 2: add ONE quantity
    const updatedCartItems = [...existingCartItems, String(dish.id)];

    // Step 3: update backend using correct format
    await updateCart({
      id: user.email,
      cart: updatedCartItems,
    });

    // Step 4: update Redux
    dispatch(updateCartSuccess({ cartItems: updatedCartItems }));

    console.log("Cart:", updatedCartItems);
  };

  const handleUpdateQty = async (type) => {
    if (!user) return alert("Please login first");

    let newCart = [...cartItems];

    if (type === "inc") {
      newCart.push(String(dish.id));
    } else if (type === "dec") {
      const index = newCart.indexOf(String(dish.id));
      if (index !== -1) newCart.splice(index, 1);
    }

    // Backend update
    await updateCart({ id: user.email, cart: newCart });

    // Redux update
    dispatch(updateCartSuccess({ cartItems: newCart }));
  };

  return (
    <>
      <Box
        className={styles.dishListCard}
        data-dish-name={dish.name} // 👈 For scrolling
        sx={{ bgcolor: background.paper }}
      >
        {/* Left Section - Dish details */}
        <Box className={styles.dishDetails}>
          <Box
            className={`${styles.vegMarker} ${
              dish.veg ? styles.veg : styles.nonVeg
            }`}
          />
          <Typography className={styles.dishName}>{dish.name}</Typography>

          <Typography className={styles.dishPrice}>
            ₹{dish.price}
            {dish.discountAvailable && dish.discount > 0 && (
              <span className={styles.discountText}> {dish.discount}% OFF</span>
            )}
          </Typography>

          {dish.rating && (
            <Typography className={styles.dishRating}>
              ⭐ {dish.rating.toFixed(1)}
            </Typography>
          )}

          {/* ✅ Smart description */}
          <Typography
            ref={descRef}
            className={styles.dishDesc}
            onClick={() => {
              if (displayText.includes("...more")) setExpanded(true);
              else if (displayText.includes(" ")) setExpanded(false);
            }}
          >
            {displayText}
          </Typography>
        </Box>

        {/* Right Section - Image + Add button */}
        <Box
          className={`${styles.dishImageBox} ${
            !dish.available ? styles.notAvailableBox : ""
          }`}
        >
          {!imageError ? (
            <img
              src={imageUrl}
              alt={dish.name}
              className={styles.dishImage}
              onClick={() => setOpen(true)}
              onError={() => setImageError(true)}
            />
          ) : (
            <Box className={styles.fallbackIcon} onClick={() => setOpen(true)}>
              <RamenDiningOutlinedIcon sx={{ fontSize: 80, color: "#aaa" }} />
            </Box>
          )}

          {/* RIGHT SECTION BUTTONS */}
          {dish.available &&
            (quantity === 0 ? (
              <Button
                variant="contained"
                className={styles.addBtn}
                onClick={() => handleUpdateQty("inc")}
              >
                ADD
              </Button>
            ) : (
              <div className={styles.controls}>
                <button
                  className={styles.controlBtn}
                  onClick={() => handleUpdateQty("dec")}
                >
                  −
                </button>
                <span className={styles.controlQty}>{quantity}</span>
                <button
                  className={styles.controlBtn}
                  onClick={() => handleUpdateQty("inc")}
                >
                  +
                </button>
              </div>
            ))}

          {!dish.available && (
            <Box className={styles.overlay}>
              <Typography className={styles.overlayText}>
                Not Available
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* Modal with DishCard */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          className={styles.modalBox}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <DishCard dish={dish} isOwner={false} />
        </Box>
      </Modal>
    </>
  );
};

export default DishListCard;
