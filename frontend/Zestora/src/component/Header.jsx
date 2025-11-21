import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  IconButton,
  Typography,
  Badge,
  Button,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
} from "@mui/material";
import AuthDrawer from "./AuthDrawer";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ClearIcon from "@mui/icons-material/Clear";
import RoomIcon from "@mui/icons-material/Room"; // 📍 Location icon
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"; // ▼ Dropdown
import SearchIcon from "@mui/icons-material/Search";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearCredentials } from "./redux/slices/authSlice";
import { useGetCartQuery } from "./redux/services/customerApi";
import { setCustomerData, clearCustomer } from "./redux/slices/customerSlice"; // ✅ new
import styles from "./Header.module.css";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import MonitorIcon from "@mui/icons-material/Monitor";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import { useGetRestaurantsQuery } from "./redux/services/restaurantApi";
import { updateCartSuccess } from "./redux/slices/customerSlice";

const Header = ({ setThemePreference }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ Auth + Customer state
  const { token, user } = useSelector((state) => state.auth);
  const customerData = useSelector((state) => state.customer.customerData);

  // 🔥 Auto load customer profile on page reload
  useEffect(() => {
    if (!user?.email || !token) return;

    const loadCustomerProfile = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_CUSTOMER_API_BASE_URL}/api/customers/${
            user.email
          }`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.ok) {
          const fullProfile = await res.json();

          // store full profile
          dispatch(setCustomerData(fullProfile));

          // restore cart instantly
          if (Array.isArray(fullProfile.customerCart)) {
            dispatch(
              updateCartSuccess({ cartItems: fullProfile.customerCart })
            );
          }
        }
      } catch (err) {
        console.error("Auto-load customer profile failed:", err);
      }
    };

    loadCustomerProfile();
  }, [user?.email, token]);

  const [searchTerm, setSearchTerm] = useState("");
  const [theme, setTheme] = useState(
    localStorage.getItem("themePreference") || "system"
  );
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const { data: allRestaurants = [] } = useGetRestaurantsQuery(); // fetch all
  const [authOpen, setAuthOpen] = useState(false);
  // City dropdown
  const [cityAnchorEl, setCityAnchorEl] = useState(null);
  const isCityMenuOpen = Boolean(cityAnchorEl);
  const primaryAddress = customerData?.customerAddress?.[0] || null;
  const customerCity = primaryAddress?.city || "Select City";

  const [selectedCity, setSelectedCity] = useState(
    customerCity || "Select City"
  );
  const firstName = customerData?.firstName;
  // ✅ Extract primary city

  // Profile dropdown
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const isProfileMenuOpen = Boolean(profileAnchorEl);
  const cityAnchorRef = useRef(null);
  const [cityMenuWidth, setCityMenuWidth] = useState(0);
  const dropdownRef = useRef(null);
  const [etaData, setEtaData] = useState({});
  const currentLocationRef = useRef(null);
  const etaCacheRef = useRef(
    JSON.parse(localStorage.getItem("etaCache") || "{}")
  );

  const majorCities = [
    "Mumbai",
    "Delhi",
    "Bangalore",
    "Hyderabad",
    "Chennai",
    "Kolkata",
    "Pune",
    "Ahmedabad",
    "Jaipur",
    "Lucknow",
    "Chandigarh",
    "Surat",
    "Indore",
    "Bhubaneswar",
    "Guwahati",
  ];

  const handleCityClick = (event) => {
    if (cityAnchorEl) {
      setCityAnchorEl(null); // if already open → close it
    } else {
      setCityAnchorEl(event.currentTarget); // if closed → open it
      if (cityAnchorRef.current) {
        setCityMenuWidth(cityAnchorRef.current.offsetWidth);
      }
    }
  };

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setCityAnchorEl(null); // ✅ closes the dropdown instantly

    localStorage.removeItem("etaCache");
    setEtaData({});
  };

  useEffect(() => {
    if (cityAnchorRef.current) {
      setCityMenuWidth(cityAnchorRef.current.offsetWidth);
    }
  }, [selectedCity]);

  const isLoggedIn = !!token;

  // ✅ Cart count from RTK Query
  // ✅ Cart count from RTK Query
  const cartItems = useSelector(
    (state) => state.customer.customerData?.cartItems || []
  );
  const cartCount = cartItems.length;

  // // ✅ Sync customer data once user logs in
  // useEffect(() => {
  //   if (!user?.email) {
  //     dispatch(clearCustomer());
  //     return;
  //   }

  //   // Instead of calling RTK Query hook here, you can fetch once during login
  //   // For safety, fallback: fetch via RTK Query dynamically
  //   const fetchCustomer = async () => {
  //     try {
  //       const res = await fetch(
  //         `${import.meta.env.VITE_CUSTOMER_API_BASE_URL}/customers/${
  //           user.email
  //         }`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${localStorage.getItem("token")}`,
  //           },
  //         }
  //       );
  //       if (res.ok) {
  //         const data = await res.json();
  //         dispatch(setCustomer(data));
  //       }
  //     } catch (err) {
  //       console.error("Failed to fetch customer", err);
  //     }
  //   };

  //   fetchCustomer();
  // }, [user, dispatch]);

  // Handle Logout
  const handleLogout = () => {
    dispatch(clearCredentials());
    dispatch(clearCustomer()); // ✅ clear customer data too
    localStorage.removeItem("token");
    console.clear();
  };

  // Handle Login
  const handleLogin = () => setAuthOpen(true);

  // Handle search
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (!value.trim()) {
      setFilteredRestaurants([]);
      return;
    }

    const term = value.toLowerCase();

    // ✅ Extract city after comma from address
    const extractCity = (address) => {
      if (!address) return "";
      const parts = address.split(",");
      return parts[1]?.trim().toLowerCase() || "";
    };

    const selected = selectedCity?.toLowerCase();

    // ✅ Filter restaurants in selected city first
    const cityRestaurants = allRestaurants.filter((rest) => {
      const restCity = extractCity(rest.address);
      return selected && restCity.includes(selected);
    });

    // ✅ Now do your original search but only inside that city
    const results = cityRestaurants.flatMap((restaurant) => {
      const matchedDishes =
        restaurant.dishes?.filter((dish) =>
          dish.name.toLowerCase().includes(term)
        ) || [];

      if (matchedDishes.length > 0) {
        return [
          {
            type: "dishGroup",
            restaurantId: restaurant.id,
            restaurantName: restaurant.name,
            imageUrl: restaurant.imageUrl,
            address: restaurant.address,
            dishes: matchedDishes,
          },
        ];
      }

      if (restaurant.name.toLowerCase().includes(term)) {
        return [
          {
            type: "restaurant",
            id: restaurant.id,
            name: restaurant.name,
            imageUrl: restaurant.imageUrl,
            address: restaurant.address,
            available: restaurant.available,
          },
        ];
      }

      return [];
    });

    setFilteredRestaurants(results);

    // ✅ calculate ETA for dropdown items
    // ✅ calculate ETA for dropdown items
    // ✅ calculate ETA for dropdown items
    // (async () => {
    //   console.log("DEBUG currentLocationRef:", currentLocationRef.current);
    //   console.log("RESULTS FOR ETA:", results);

    //   if (!currentLocationRef.current) {
    //     console.log("GPS NOT READY, ETA LOOP STOPPED");
    //     return;
    //   }

    //   const etaResults = {};
    //   const cache = etaCacheRef.current;

    //   for (let item of results) {
    //     console.log("Loop item raw:", item);

    //     // ✅ support both restaurant + dishGroup
    //     const restaurantId =
    //       item.type === "restaurant" ? item.id : item.restaurantId;

    //     if (!restaurantId) {
    //       console.log("⚠️ NO RESTAURANT ID, SKIPPING", item);
    //       continue;
    //     }

    //     const rest = allRestaurants.find(
    //   (r) => r.id === restaurantId || r._id === restaurantId
    // );

    //     // ✅ Debug when lookup fails
    // if (!rest) {
    //   console.log("❌ REST NOT FOUND IN ALL RESTAURANTS:", restaurantId);
    //   console.log("✅ AVAILABLE RESTAURANT IDS:", allRestaurants.map(r => r.id || r._id));
    //   continue;
    // }
    // console.log("checking coords of", restaurantId, rest.location);

    // if (!Array.isArray(rest.location.coordinates) || rest.location.coordinates.length < 2) {
    //   console.log("⚠️ INVALID COORDS:", rest.location.coordinates);
    //   continue;
    // }

    //     const restCoords = rest.location.coordinates;
    //     const cust = currentLocationRef.current;
    //     const cacheKey = `${cust[0]}_${cust[1]}_${restCoords[0]}_${restCoords[1]}`;

    //     // ✅ Cache hit → use stored ETA
    //     if (cache[cacheKey]) {
    //       etaResults[restaurantId] = cache[cacheKey];
    //       continue;
    //     }

    //     console.log("✅ Reached ETA loop for restaurant", restaurantId);
    // console.log("rest found:", rest);
    // console.log("coords:", rest.location.coordinates);

    //     // ✅ Fetch ETA from API
    //     const distTime = await getDistanceTime(
    //       `${cust[0]},${cust[1]}`,
    //       `${restCoords[0]},${restCoords[1]}`
    //     );

    //     etaResults[restaurantId] = distTime;
    //     cache[cacheKey] = distTime;

    //     console.log("ETA DEBUG ✅", {
    //       restaurantId,
    //       restaurantName: rest?.name,
    //       coords: restCoords,
    //       ETA: distTime,
    //     });
    //   }

    //   etaCacheRef.current = cache;
    //   localStorage.setItem("etaCache", JSON.stringify(cache));
    //   setEtaData((prev) => ({ ...prev, ...etaResults }));
    //   setFilteredRestaurants([...results]); // force UI refresh
    // })();

    // ✅ pull ETA only from cache/state
    setFilteredRestaurants(results);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setFilteredRestaurants([]); // ✅ this line closes the dropdown instantly
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !e.target.closest(".MuiOutlinedInput-root") // ignore clicks inside search bar
      ) {
        setFilteredRestaurants([]); // ✅ close dropdown
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Theme toggle
  const handleThemeChange = () => {
    let newTheme;
    if (theme === "system") newTheme = "light";
    else if (theme === "light") newTheme = "dark";
    else newTheme = "system";

    setTheme(newTheme);
    setThemePreference(newTheme);
    localStorage.setItem("themePreference", newTheme);
  };

  // Auto detect current city
  useEffect(() => {
    if (selectedCity !== "Select City") return; // if user already selected, don't override

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;

          try {
            const res = await fetch(
              `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${
                import.meta.env.VITE_OPENCAGEDATA_KEY
              }`
            );

            const data = await res.json();
            const comp = data.results[0].components;

            const autoCity =
              comp.city || comp.town || comp.village || comp.state_district;

            if (autoCity) {
              setSelectedCity(autoCity);
            }
          } catch (err) {
            console.error("City fetch error:", err);
          }
        },
        () => {
          console.warn("Location permission denied.");
        }
      );
    }
  }, []);

  // ✅ Get current GPS for ETA calculation
  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        currentLocationRef.current = [
          pos.coords.longitude,
          pos.coords.latitude,
        ];
      },
      () => {
        console.warn("GPS access denied for ETA");
      }
    );
  }, []);

  const getDistanceTime = async (start, end) => {
    try {
      const res = await fetch(
        `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${
          import.meta.env.VITE_OPENROUTE_KEY
        }&start=${start}&end=${end}`
      );

      const json = await res.json();

      // ✅ Debug output
      console.log("ORS response for start/end:", start, end, json);

      const seg = json?.features?.[0]?.properties?.segments?.[0];

      if (!seg) {
        console.warn("⚠️ ORS returned no segment, fallback to 0 ETA");
        return { distance: 0, time: 0 };
      }

      return {
        distance: (seg.distance / 1000).toFixed(1),
        time: Math.round(seg.duration / 60),
      };
    } catch (err) {
      console.error("ORS FETCH FAILED", err);
      return { distance: 0, time: 0 };
    }
  };

  // ✅ Pre-fetch ETA for all restaurants in selected city
  useEffect(() => {
    if (!selectedCity || selectedCity === "Select City") return;
    if (!currentLocationRef.current) return;
    if (!allRestaurants.length) return;

    const cache = JSON.parse(localStorage.getItem("etaCache") || "{}");
    const userCity = selectedCity.toLowerCase();

    // ✅ Filter restaurants by city text
    const cityRestaurants = allRestaurants.filter((r) =>
      r.address?.toLowerCase().includes(userCity)
    );

    if (!cityRestaurants.length) return;

    const fetchETAs = async () => {
      for (const rest of cityRestaurants) {
        const coords = rest.location?.coordinates;
        if (!coords) continue;

        const cust = currentLocationRef.current;
        const cacheKey = `${selectedCity}_${rest.id}`;

        // ✅ Cache hit, skip fetch
        if (cache[cacheKey]) {
          setEtaData((prev) => ({
            ...prev,
            [rest.id]: cache[cacheKey],
          }));
          continue;
        }

        // ✅ Fetch ETA once per restaurant
        const distTime = await getDistanceTime(
          `${cust[0]},${cust[1]}`,
          `${coords[0]},${coords[1]}`
        );

        cache[cacheKey] = distTime;

        setEtaData((prev) => ({
          ...prev,
          [rest.id]: distTime,
        }));
      }

      localStorage.setItem("etaCache", JSON.stringify(cache));
    };

    fetchETAs();
  }, [selectedCity, allRestaurants]);

  return (
    <Box
      className={`${styles.header} ${isSearchOpen ? styles.searchActive : ""}`}
      sx={{ bgcolor: "background.paper", boxShadow: 1 }}
    >
      <div className={styles.headerInner}>
        {/* Logo */}
        {!isSearchOpen && (
          <Box className={styles.logoContainer}>
            <Link to="/" className={styles.noDecoration}>
              <Typography variant="h1" className={styles.logo}>
                Zestora
              </Typography>
            </Link>
          </Box>
        )}

        {/* Search */}
        <Box
          className={`${styles.searchBox} ${
            isSearchOpen ? styles.expanded : ""
          }`}
        >
          <TextField
            variant="outlined"
            placeholder="Search for restaurant and food"
            value={searchTerm}
            onChange={handleSearchChange}
            className={styles.searchField}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "4px",
                bgcolor: "background.paper", // ✅ uses theme.palette.background.paper
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
                transition: "box-shadow 0.2s ease-in-out",
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Box
                    ref={cityAnchorRef}
                    className={styles.searchLocationBox}
                    onClick={handleCityClick}
                    sx={{ cursor: "pointer" }}
                  >
                    <Menu
                      anchorEl={cityAnchorEl}
                      open={Boolean(cityAnchorEl)}
                      onClose={(e) => {
                        e.stopPropagation(); // ✅ prevents parent reopening
                        setCityAnchorEl(null);
                      }} // ✅ ensures it closes on outside click
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                      }}
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "left",
                      }}
                      PaperProps={{
                        style: {
                          width: `${cityMenuWidth + 11}px`,
                          marginLeft: "-15px",
                          marginTop: "16px",
                          borderRadius: "0 0 8px 8px",
                          transition: "none",
                        },
                      }}
                    >
                      {majorCities.map((city) => (
                        <MenuItem
                          key={city}
                          onClick={(e) => {
                            e.stopPropagation(); // ✅ prevents re-triggering Box click
                            handleCitySelect(city);
                          }} // ✅ closes on click
                          selected={city === selectedCity}
                          sx={{ justifyContent: "center", textAlign: "center" }}
                        >
                          {city}
                        </MenuItem>
                      ))}
                    </Menu>

                    <RoomIcon className={styles.roomIcon} />
                    <Typography variant="body2" className={styles.customerCity}>
                      {selectedCity}
                    </Typography>
                    <ArrowDropDownIcon className={styles.arrowDownIcon} />
                    <Box className={styles.locationDivider} />
                  </Box>
                </InputAdornment>
              ),

              endAdornment: (
                <InputAdornment position="end">
                  {searchTerm && (
                    <IconButton onClick={clearSearch} edge="end">
                      <ClearIcon />
                    </IconButton>
                  )}
                  {isSearchOpen && (
                    <IconButton
                      onClick={() => setIsSearchOpen(false)}
                      edge="end"
                    >
                      ✕
                    </IconButton>
                  )}
                </InputAdornment>
              ),
            }}
          />
          {filteredRestaurants.length > 0 && (
            <Box
              className={styles.dropdownBox}
              ref={dropdownRef}
              sx={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                zIndex: 999,
                maxHeight: "calc(100vh - 180px)",
                overflowY: "auto",
              }}
            >
              <Paper
                elevation={0}
                className={styles.dropdownPaper}
                sx={{
                  boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)",
                }}
              >
                {filteredRestaurants.map((item, index) => {
                  // 🏢 RESTAURANT RESULTS
                  if (item.type === "restaurant") {
                    return (
                      <Box
                        key={item.id || index}
                        className={styles.restaurantItem}
                        onClick={() => {
                          navigate(`/restaurant/${item.id}`);
                          clearSearch();
                        }}
                        sx={{ cursor: "pointer" }}
                      >
                        <img
                          src={
                            item.imageUrl?.startsWith("http")
                              ? item.imageUrl
                              : `/${item.imageUrl}` // 👈 always absolute from public/
                          }
                          alt={item.name}
                          className={styles.restaurantImage}
                        />

                        <Box className={styles.restaurantDetails}>
                          <Typography
                            variant="h6"
                            className={styles.restaurantName}
                          >
                            {item.name}
                            <span className={styles.iconWrapper}>🏠</span>{" "}
                            {/* Restaurant icon */}
                          </Typography>

                          <Box className={styles.ratingRow}>
                            {item.isNew && (
                              <span
                                className={`${styles.badge} ${styles.newBadge}`}
                              >
                                New
                              </span>
                            )}
                            <span
                              className={`${styles.badge} ${styles.diningBadge}`}
                            >
                              ⭐ {item.rating?.dining || item.rating || "–"}{" "}
                              Dining
                            </span>
                            <span
                              className={`${styles.badge} ${styles.deliveryBadge}`}
                            >
                              🚗 {item.rating?.delivery || item.rating || "–"}{" "}
                              Delivery
                            </span>
                          </Box>

                          <Typography
                            variant="body2"
                            className={styles.restaurantAddress}
                          >
                            {item.address}
                          </Typography>

                          <Typography
                            variant="body2"
                            className={
                              item.available
                                ? styles.availableText
                                : styles.notAvailableText
                            }
                          >
                            {item.available
                              ? etaData[item.id]?.time
                                ? `Delivery in ${etaData[item.id].time} min`
                                : "Fetching ETA…" // ✅ no live fetch; waiting for preload
                              : "Currently not accepting orders"}
                          </Typography>
                        </Box>
                      </Box>
                    );
                  }

                  // 🍛 DISH RESULTS
                  if (item.type === "dishGroup") {
                    return item.dishes.map((dish, i) => (
                      <Box
                        key={`${index}-${i}`}
                        className={styles.restaurantItem}
                        onClick={() => {
                          navigate(`/restaurant/${item.restaurantId}`, {
                            state: { scrollToDish: dish.name },
                          });
                          clearSearch();
                        }}
                        sx={{ cursor: "pointer" }}
                      >
                        <img
                          src={
                            item.imageUrl?.startsWith("http")
                              ? item.imageUrl
                              : `/${item.imageUrl}` // 👈 always absolute from public/
                          }
                          alt={item.name}
                          className={styles.restaurantImage}
                        />

                        <Box className={styles.restaurantDetails}>
                          <Typography
                            variant="h6"
                            className={styles.restaurantName}
                          >
                            {dish.name}
                            <span className={styles.iconWrapper}>🍛</span>{" "}
                            {/* Dish icon */}
                          </Typography>

                          <Box className={styles.ratingRow}>
                            <span
                              className={`${styles.badge} ${styles.diningBadge}`}
                            >
                              ⭐ {item.rating?.dining || "4"} Dining
                            </span>
                            <span
                              className={`${styles.badge} ${styles.deliveryBadge}`}
                            >
                              🚗 {item.rating?.delivery || "4"} Delivery
                            </span>
                          </Box>

                          <Typography
                            variant="body2"
                            className={styles.restaurantAddress}
                          >
                            {item.restaurantName} — {item.address}
                          </Typography>

                          <Typography
                            variant="body2"
                            className={styles.availableText}
                          >
                            {etaData[item.restaurantId || item.id]?.time
                              ? `Delivery in ${
                                  etaData[item.restaurantId || item.id].time
                                } min`
                              : "Fetching ETA…"}
                          </Typography>
                        </Box>
                      </Box>
                    ));
                  }

                  return null;
                })}
              </Paper>
            </Box>
          )}
        </Box>

        {/* Right controls */}
        {!isSearchOpen && (
          <Box className={styles.rightControls}>
            <IconButton onClick={handleThemeChange}>
              {theme === "light" && (
                <LightModeIcon className={styles.themeIconLight} />
              )}
              {theme === "dark" && (
                <DarkModeIcon className={styles.themeIconDark} />
              )}
              {theme === "system" && (
                <MonitorIcon className={styles.themeIconSystem} />
              )}
            </IconButton>

            <Box className={styles.searchIconContainer}>
              <IconButton onClick={() => setIsSearchOpen(true)}>
                <SearchIcon />
              </IconButton>
            </Box>

            <IconButton
              className={styles.cartIconContainer}
              onClick={() => navigate("/checkout")}
            >
              <Badge badgeContent={cartCount} color="primary">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>

            <Box
              className={styles.profileContainer}
              onMouseEnter={
                isLoggedIn
                  ? (e) => setProfileAnchorEl(e.currentTarget)
                  : undefined
              }
              onClick={() => {
                if (!isLoggedIn) handleLogin();
              }}
            >
              <AccountCircleIcon className={styles.profileIcon} />
              <Typography variant="body2" className={styles.userName}>
                {isLoggedIn ? firstName : "Sign In"}
              </Typography>
            </Box>

            {isLoggedIn && (
              <Menu
                anchorEl={profileAnchorEl}
                open={isProfileMenuOpen}
                onClose={() => setProfileAnchorEl(null)}
                MenuListProps={{
                  onMouseLeave: () => setProfileAnchorEl(null),
                }}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                transformOrigin={{ vertical: "top", horizontal: "center" }}
                classes={{ paper: styles.profileMenu }}
              >
                <MenuItem
                  className={styles.profileMenuItem}
                  onClick={() => {
                    navigate("/profile");
                    setProfileAnchorEl(null);
                  }}
                >
                  Profile
                </MenuItem>

                <MenuItem className={styles.profileMenuItem}>Orders</MenuItem>
                <MenuItem className={styles.profileMenuItem}>
                  Favourites
                </MenuItem>

                <MenuItem
                  className={styles.profileMenuItemLogoutItem}
                  onClick={() => {
                    handleLogout();
                    setProfileAnchorEl(null);
                  }}
                >
                  Logout
                </MenuItem>
              </Menu>
            )}
          </Box>
        )}
      </div>
      <AuthDrawer open={authOpen} onClose={() => setAuthOpen(false)} />
    </Box>
  );
};

export default Header;
