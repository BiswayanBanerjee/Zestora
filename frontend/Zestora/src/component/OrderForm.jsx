import React, { useEffect, useState, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import {
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  IconButton,
  Grid,
  Box,
} from "@mui/material";
import axios from "axios";
import HomeIcon from "@mui/icons-material/Home";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Add, Remove, Delete } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import styles from "./OrderForm.module.css";
import { useTheme } from "@mui/material/styles";
import AddAddressDrawer from "./AddAddressDrawer";
import { updateCartSuccess } from "./redux/slices/customerSlice";

// RTK Query imports
import {
  useGetCustomerByIdQuery,
  useUpdateCartMutation,
  useGetOrdersQuery,
  useAddOrderMutation,
} from "./redux/services/customerApi";
import { useGetDishesQuery } from "./redux/services/dishApi";
import { useGetRestaurantsQuery } from "./redux/services/restaurantApi";

const getDistanceTime = async (start, end) => {
  try {
    const res = await axios.get(
      `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${
        import.meta.env.VITE_OPENROUTE_KEY
      }=&start=${start}&end=${end}`
    );

    const features = res.data?.features?.[0];
    const segments = features?.properties?.segments?.[0];

    if (!segments) {
      console.warn("No route segments found for:", start, end);
      return { distance: 0, time: 0 };
    }

    const { distance, duration } = segments;
    return {
      distance: (distance / 1000).toFixed(1), // km
      time: Math.round(duration / 60), // mins
    };
  } catch (err) {
    console.error(
      "Failed to fetch distance/time:",
      err.response?.data || err.message
    );
    return { distance: 0, time: 0 };
  }
};
const getAddressKey = (addr) =>
  addr?._id || addr?.addressId || addr?.id || null;

const OrderForm = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const { register, handleSubmit, setValue } = useForm();
  const [cartElements, setCartElements] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const theme = useTheme();
  const [showAddressSelector, setShowAddressSelector] = useState(false);
  const [showAddAddressDrawer, setShowAddAddressDrawer] = useState(false);
  const [distanceData, setDistanceData] = useState({});
  const [selectedAddress, setSelectedAddress] = useState(null);
  const customerId = user?.email;
  const dispatch = useDispatch();

  // Queries
  const { data: customerData } = useGetCustomerByIdQuery(customerId, {
    skip: !customerId,
  });
  const cartItems = useSelector(
    (state) => state.customer.customerData?.cartItems || []
  );
  const { data: dishes = [] } = useGetDishesQuery();
  const { data: orders = [] } = useGetOrdersQuery(customerId, {
    skip: !customerId,
  });
  const { data: restaurants = [] } = useGetRestaurantsQuery();

  const safeCartData = useMemo(
    () => (Array.isArray(cartItems) ? cartItems : []),
    [cartItems]
  );
  const safeDishes = useMemo(
    () => (Array.isArray(dishes) ? dishes : []),
    [dishes]
  );
  const safeOrders = useMemo(
    () => (Array.isArray(orders) ? orders : []),
    [orders]
  );
  const safeRestaurants = useMemo(
    () => (Array.isArray(restaurants) ? restaurants : []),
    [restaurants]
  );

  // Mutations
  const [updateCart] = useUpdateCartMutation();
  const [addOrder] = useAddOrderMutation();

  const dishLookup = useMemo(() => {
    const map = new Map();
    if (Array.isArray(safeDishes)) {
      for (const d of safeDishes) {
        const id = d._id || d.id;
        if (id) map.set(id, { dish: d });
      }
    }
    if (Array.isArray(safeRestaurants)) {
      for (const rest of safeRestaurants) {
        if (!Array.isArray(rest.safeDishes)) continue;
        for (const dish of rest.safeDishes) {
          const id = dish._id || dish.id;
          if (!id) continue;
          if (!map.has(id)) map.set(id, { dish, restaurant: rest });
          else {
            const existing = map.get(id);
            if (existing && !existing.restaurant) existing.restaurant = rest;
          }
        }
      }
    }
    return map;
  }, [safeDishes, safeRestaurants]);

  // Prefill user data and addresses
  useEffect(() => {
    if (customerData) {
      setValue("firstName", customerData.firstName || "");
      setValue("lastName", customerData.lastName || "");
      setValue("email", customerData.email || "");
      setValue("phone", customerData.phone || "");
      setAddresses(customerData.customerAddress || []);
    }
  }, [customerData, setValue]);

  // Build cart with dish details
  useEffect(() => {
    if (safeCartData.length && safeDishes.length) {
      const itemCounts = {};
      safeCartData.forEach((itemId) => {
        itemCounts[itemId] = (itemCounts[itemId] || 0) + 1;
      });

      const cartItemsWithDetails = Object.keys(itemCounts)
        .map((id) => {
          const info = dishLookup.get(id);
          if (!info) return undefined;

          const dish = info.dish;
          const restaurantName = info.restaurant?.name || "Unknown Restaurant";
          const restaurantAddress =
            info.restaurant?.address ||
            info.restaurant?.location ||
            info.restaurant?.street ||
            "";

          return {
            ...dish,
            quantity: itemCounts[id],
            restaurantName,
            restaurantAddress, // ✅ added
          };
        })
        .filter(Boolean);

      setCartElements(cartItemsWithDetails);
      calculateTotalPrice(cartItemsWithDetails);
    }
  }, [safeCartData, safeDishes, dishLookup]);

  const calculateTotalPrice = (items) => {
    const total = items.reduce((acc, item) => {
      const itemTotalPrice = item.price * item.quantity;
      const itemTotalDiscount = item.discount * item.quantity;
      return acc + (itemTotalPrice - itemTotalDiscount);
    }, 0);
    const discount = items.reduce(
      (acc, item) => acc + item.discount * item.quantity,
      0
    );

    setTotalPrice(total);
    setTotalDiscount(discount);
  };

  const syncCart = async (updatedItems) => {
    await updateCart({
      id: customerId,
      cart: updatedItems.flatMap((item) => Array(item.quantity).fill(item.id)),
    });
  };

  const increaseQuantity = (index) => {
    const updatedCart = [...cartElements];
    updatedCart[index].quantity += 1;

    setCartElements(updatedCart);
    calculateTotalPrice(updatedCart);

    const flatList = updatedCart.flatMap((item) =>
      Array(item.quantity).fill(String(item.id))
    );

    dispatch(updateCartSuccess({ cartItems: flatList })); // 🔥 FIX HERE
    syncCart(updatedCart);
  };

  const decreaseQuantity = (index) => {
    const updatedCart = [...cartElements];

    if (updatedCart[index].quantity > 1) {
      updatedCart[index].quantity -= 1;

      setCartElements(updatedCart);
      calculateTotalPrice(updatedCart);

      const flatList = updatedCart.flatMap((item) =>
        Array(item.quantity).fill(String(item.id))
      );

      dispatch(updateCartSuccess({ cartItems: flatList })); // 🔥 FIX HERE
      syncCart(updatedCart);
    } else {
      deleteItem(index);
    }
  };

  const deleteItem = (index) => {
    const updatedCart = cartElements.filter((_, i) => i !== index);

    setCartElements(updatedCart);
    calculateTotalPrice(updatedCart);

    const flatList = updatedCart.flatMap((item) =>
      Array(item.quantity).fill(String(item.id))
    );

    dispatch(updateCartSuccess({ cartItems: flatList })); // 🔥 FIX HERE
    syncCart(updatedCart);
  };

  const onSubmit = async (data) => {
    try {
      const newOrderId = (safeOrders?.length || 0) + 1;
      const newCustomerOrder = {
        orderId: newOrderId.toString(),
        customerEmail: customerId,
        dishIds: cartElements.map((item) => item.id),
        totalAmount: totalPrice,
        deliveryAddress: data.deliveryAddress || "Saved Address",
        status: "orderAccepted",
        orderDate: new Date().toISOString(),
        deliveryInstruction: data.description || "",
        customerOrders: cartElements.reduce((acc, item) => {
          acc[item.id] = item.quantity;
          return acc;
        }, {}),
      };

      await addOrder({ id: customerId, order: newCustomerOrder }).unwrap();

      setCartElements([]);
      // 1️⃣ Clear Redux cart
      dispatch(updateCartSuccess({ cartItems: [] }));

      // 2️⃣ Clear backend cart
      await updateCart({ id: customerId, cart: [] });

      navigate("/order-success");
    } catch (error) {
      console.error("Order submission failed", error);
    }
  };
  const distanceCacheRef = useRef(
    JSON.parse(localStorage.getItem("distanceCache") || "{}")
  );

  useEffect(() => {
    if (!addresses.length || !cartElements.length || !safeRestaurants.length)
      return;

    const fetchDistances = async () => {
      const results = {}; // no distanceData dependency
      const cachedData = distanceCacheRef.current;

      const firstCartItem = cartElements[0];
      const restaurantName = firstCartItem?.restaurantName;
      const restaurantData = safeRestaurants.find(
        (r) => r.name === restaurantName
      );

      if (!restaurantData?.location?.coordinates) return;
      const restCoords = restaurantData.location.coordinates;

      for (const addr of addresses) {
        const custCoords = addr?.location?.coordinates;
        const addressKey = getAddressKey(addr);
        if (!custCoords || !addressKey) continue;

        const cacheKey = `${restaurantName}_${custCoords[0]}_${custCoords[1]}`;

        // ✅ Use cached value if available
        if (cachedData[cacheKey]) {
          results[addressKey] = cachedData[cacheKey];
          continue;
        }

        const distTime = await getDistanceTime(
          `${custCoords[0]},${custCoords[1]}`,
          `${restCoords[0]},${restCoords[1]}`
        );

        results[addressKey] = distTime;
        cachedData[cacheKey] = distTime;
      }

      // ✅ Persist updated cache
      distanceCacheRef.current = cachedData;
      localStorage.setItem("distanceCache", JSON.stringify(cachedData));
      setDistanceData(results);
    };

    fetchDistances();
  }, [addresses, cartElements, safeRestaurants]);

  const formattedDistances = useMemo(() => {
    const result = {};
    for (const [key, data] of Object.entries(distanceData)) {
      result[key] = `${data.distance} km • ${data.time} mins`;
    }
    return result;
  }, [distanceData]);

  return (
    <div
      className={styles.container}
      style={{
        background: theme.palette.background.default,
        color: theme.palette.text.primary,
      }}
    >
      {/* LEFT SECTION: Address + Payment */}
      <div className={styles.leftSection}>
        <div
          className={styles.deliveryBox}
          style={{
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            borderRadius: "10px",
          }}
        >
          <div className={styles.deliveryHeader}>
            <h3>Delivery address</h3>
            <button
              className={styles.changeBtn}
              onClick={() => setShowAddressSelector(!showAddressSelector)}
            >
              {showAddressSelector ? "CLOSE" : "CHANGE"}
            </button>
          </div>

          {showAddressSelector ? (
            <div className={styles.addressGrid}>
              {addresses.map((addr, i) => (
                <div
                  key={i}
                  className={styles.addressCard}
                  style={{
                    backgroundColor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                    borderColor: theme.palette.divider,
                    boxShadow:
                      theme.palette.mode === "dark"
                        ? "0 2px 4px rgba(255,255,255,0.05)"
                        : "0 2px 4px rgba(0,0,0,0.05)",
                  }}
                >
                  <div className={styles.addressHeader}>
                    <span className={styles.addressIcon}>
                      {addr.saveAddressAs?.toLowerCase() === "home" ? (
                        <HomeIcon />
                      ) : (
                        <LocationOnIcon />
                      )}
                    </span>
                    <span className={styles.addressLabel}>
                      <h4>
                        {addr.saveAddressAs
                          ? addr.saveAddressAs.charAt(0).toUpperCase() +
                            addr.saveAddressAs.slice(1).toLowerCase()
                          : "Other"}
                      </h4>
                    </span>
                  </div>
                  <p className={styles.addressText}>
                    {addr.house_number} {addr.street}, {addr.city}, {addr.state}{" "}
                    {addr.postcode}
                  </p>
                  <p className={styles.deliveryMins}>
                    {formattedDistances[getAddressKey(addr)] ||
                      "Calculating..."}
                  </p>

                  <button
                    className={`${styles.deliverHereBtn} ${
                      getAddressKey(selectedAddress) === getAddressKey(addr)
                        ? styles.disabledBtn
                        : ""
                    }`}
                    onClick={() => {
                      setSelectedAddress(addr);
                      setValue(
                        "deliveryAddress",
                        `${addr.house_number} ${addr.street}, ${addr.city}, ${addr.state} ${addr.postcode}`
                      );
                      setShowAddressSelector(false);
                    }}
                    disabled={
                      getAddressKey(selectedAddress) === getAddressKey(addr)
                    }
                  >
                    {getAddressKey(selectedAddress) === getAddressKey(addr)
                      ? "SELECTED"
                      : "DELIVER HERE"}
                  </button>
                </div>
              ))}
              <div
                className={`${styles.addressCard} ${styles.addNew}`}
                style={{
                  backgroundColor: theme.palette.background.paper,
                  color: theme.palette.text.primary,
                  borderColor: theme.palette.divider,
                  boxShadow:
                    theme.palette.mode === "dark"
                      ? "0 2px 4px rgba(255,255,255,0.05)"
                      : "0 2px 4px rgba(0,0,0,0.05)",
                }}
              >
                <div className={styles.addNewHeader}>
                  <div className={styles.addNewIconWrapper}>
                    <LocationOnIcon className={styles.locationIcon} />
                    <div className={styles.plusBadge}>
                      <AddIcon fontSize="small" />
                    </div>
                  </div>
                  <h4>Add New Address</h4>
                </div>
                <button
                  className={styles.deliverHereBtn}
                  onClick={() => setShowAddAddressDrawer(true)}
                >
                  ADD NEW ADDRESS
                </button>
              </div>
              {/* ✅ Keep the drawer mounted here */}
              <AddAddressDrawer
                open={showAddAddressDrawer}
                onClose={() => setShowAddAddressDrawer(false)}
                onSave={(newAddress) => {
                  setAddresses((prev) => [...prev, newAddress]);
                }}
              />
            </div>
          ) : (
            <>
              {selectedAddress ? (
                <div>
                  <p className={styles.addressTitle}>
                    {selectedAddress.label ||
                      selectedAddress.saveAddressAs ||
                      "Saved Address"}
                  </p>
                  <p className={styles.addressDetails}>
                    {selectedAddress.house_number} {selectedAddress.street},{" "}
                    {selectedAddress.city}, {selectedAddress.state}{" "}
                    {selectedAddress.postcode}
                  </p>
                  <p className={styles.deliveryTime}>
                    {distanceData[getAddressKey(selectedAddress)]
                      ? `${
                          distanceData[getAddressKey(selectedAddress)].time
                        } MINS`
                      : "Calculating..."}
                  </p>
                </div>
              ) : Array.isArray(addresses) && addresses.length > 0 ? (
                <div>
                  <p className={styles.addressTitle}>
                    {addresses[0].label ||
                      addresses[0].saveAddressAs ||
                      "Saved Address"}
                  </p>
                  <p className={styles.addressDetails}>
                    {addresses[0].house_number} {addresses[0].street},{" "}
                    {addresses[0].city}, {addresses[0].state}{" "}
                    {addresses[0].postcode}
                  </p>
                  <p className={styles.deliveryTime}>
                    {distanceData[getAddressKey(addresses[0])]
                      ? `${distanceData[getAddressKey(addresses[0])].time} MINS`
                      : "Calculating..."}
                  </p>
                </div>
              ) : (
                <p>No saved address found</p>
              )}
            </>
          )}
        </div>

        <div
          className={styles.paymentBox}
          style={{
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            borderRadius: "10px",
          }}
        >
          <h3>Choose payment method</h3>
          <Button
            variant="contained"
            color="success"
            fullWidth
            className={styles.proceedBtn}
            type="submit"
            onClick={handleSubmit(onSubmit)}
            disabled={!Array.isArray(cartElements) || cartElements.length === 0}
          >
            PROCEED TO PAY
          </Button>
        </div>
      </div>

      {/* RIGHT SECTION: Cart Summary */}
      <div
        className={styles.rightSection}
        style={{
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
        }}
      >
        {/* <div className={styles.cartHeader}>
          <h3>{user?.firstName || "Your"}'s Cart</h3>
        </div> */}

        {cartElements.length > 0 ? (
          <>
            {cartElements.map((item, index) => {
              const itemTotal = (item.price - item.discount) * item.quantity;
              return (
                <div key={item.id} className={styles.cartCard}>
                  <CardContent className={styles.cardContent}>
                    <div className={styles.itemInfo}>
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className={styles.itemImage}
                      />
                      <div className={styles.itemDetails}>
                        {item.restaurantName && (
                          <>
                            <Typography
                              variant="subtitle1"
                              className={styles.restaurantName}
                            >
                              {item.restaurantName}
                            </Typography>
                            {item.restaurantAddress && (
                              <Typography
                                variant="body2"
                                className={styles.restaurantAddress}
                              >
                                {item.restaurantAddress}
                              </Typography>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>

                  <div className={styles.itemDetailss}>
                    <div className={styles.itemText}>
                      <Typography variant="body2" className={styles.itemName}>
                        {item.name}
                      </Typography>
                    </div>
                    <div className={styles.itemActions}>
                      <Typography variant="body2" className={styles.itemPrice}>
                        ₹{itemTotal}
                      </Typography>
                      <div className={styles.controls}>
                        <IconButton
                          size="small"
                          onClick={() => decreaseQuantity(index)}
                        >
                          <Remove fontSize="small" />
                        </IconButton>
                        <span className={styles.quantityValue}>
                          {item.quantity}
                        </span>
                        <IconButton
                          size="small"
                          onClick={() => increaseQuantity(index)}
                        >
                          <Add fontSize="small" />
                        </IconButton>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            <div className={styles.billBox}>
              <h5>Bill Details</h5>
              <p className={styles.billRow}>
                <span>Item Total</span>
                <span>₹{(totalPrice + totalDiscount).toFixed(2)}</span>
              </p>
            </div>

            <div className={styles.discountBox}>
              <p className={styles.billRow}>
                <span>Discount</span>
                <span>−₹{totalDiscount.toFixed(2)}</span>
              </p>
              <p className={`${styles.billRow} ${styles.freeDelivery}`}>
                <span>Delivery Fee</span>
                <span className={styles.free}>FREE</span>
              </p>
            </div>

            <div className={styles.totalPay}>
              <span>TO PAY</span>
              <span>₹{totalPrice.toFixed(2)}</span>
            </div>
          </>
        ) : (
          <Typography>No items in cart</Typography>
        )}
      </div>
    </div>
  );
};

export default OrderForm;
