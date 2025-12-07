import React, { useEffect, useMemo, useState } from "react";
import { Avatar, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import OrdersIcon from "@mui/icons-material/MenuBook";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PaymentIcon from "@mui/icons-material/Payment";
import AddressIcon from "@mui/icons-material/Home";
import SettingsIcon from "@mui/icons-material/Settings";
import SearchIcon from "@mui/icons-material/Search";
import { useSelector, useDispatch } from "react-redux";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {
  useGetCustomerByIdQuery,
  useAddOrderMutation,
} from "../redux/services/customerApi";
import { useGetRestaurantsQuery } from "../redux/services/restaurantApi";
import { useGetDishesQuery } from "../redux/services/dishApi";
import { setCustomer } from "../redux/slices/customerSlice";
import Profile from "./Profile";
import styles from "../styles/AccountDashboard.module.css";
import { useDeleteAddressMutation } from "../redux/services/customerApi";
import AddAddressDrawer from "./AddAddressDrawer";
import { useLocation, useNavigate } from "react-router-dom";
// const AddAddressDrawer = React.lazy(() => import("./AddAddressDrawer"));

const TABS = [
  { key: "orders", label: "Orders", Icon: OrdersIcon },
  { key: "favourites", label: "Favourites", Icon: FavoriteIcon },
  { key: "payments", label: "Payments", Icon: PaymentIcon },
  { key: "addresses", label: "Addresses", Icon: AddressIcon },
  { key: "settings", label: "Settings", Icon: SettingsIcon },
];

const safePostcode = (pc) => {
  if (!pc && pc !== 0) return "";
  if (typeof pc === "object" && pc.$numberLong) return pc.$numberLong;
  if (typeof pc === "object" && pc.$oid) return pc.$oid;
  return pc;
};

const extractId = (obj) => {
  if (!obj) return null;
  if (typeof obj === "string") return obj;
  if (obj._id && typeof obj._id === "string") return obj._id;
  if (obj.id && typeof obj.id === "string") return obj.id;
  if (obj._id && typeof obj._id === "object" && obj._id.$oid)
    return obj._id.$oid;
  if (obj.$oid) return obj.$oid;
  return null;
};

export default function AccountDashboard() {
  const dispatch = useDispatch();
  const auth = useSelector((s) => s.auth);
  const muiTheme = useTheme(); // kept for safe inline fallbacks only
  const userEmail = auth?.user?.email || auth?.user?.sub || null;
  const [openProfile, setOpenProfile] = useState(false);
  const location = useLocation();
  const initialTab = location.state?.tab || "orders";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [deleteAddress] = useDeleteAddressMutation();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [editingAddress, setEditingAddress] = useState(null);
  const navigate = useNavigate();
  // Data hooks (always called)
  const {
    data: customer,
    isLoading: customerLoading,
    refetch: refetchCustomer,
  } = useGetCustomerByIdQuery(userEmail, { skip: !userEmail });
  const { data: restaurants = [], isLoading: restaurantsLoading } =
    useGetRestaurantsQuery();
  const { data: allDishes = [], isLoading: dishesLoading } =
    useGetDishesQuery();
  const [addOrder, { isLoading: addingOrder }] = useAddOrderMutation();

  useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
    }
  }, [location.state]);

  // dish lookup (from dishes API first, restaurants second)
  const dishLookup = useMemo(() => {
    const map = new Map();
    if (Array.isArray(allDishes)) {
      for (const d of allDishes) {
        const id = extractId(d);
        if (id) map.set(id, { dish: d });
      }
    }
    if (Array.isArray(restaurants)) {
      for (const rest of restaurants) {
        if (!Array.isArray(rest.dishes)) continue;
        for (const dish of rest.dishes) {
          const id = extractId(dish);
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
  }, [allDishes, restaurants]);

  // collect missing dish ids for debugging
  const missingDishIds = useMemo(() => {
    const missing = new Set();
    if (!customer || !Array.isArray(customer.customerOrders)) return [];
    for (const order of customer.customerOrders) {
      const ids = order.customerOrders
        ? Object.keys(order.customerOrders)
        : order.dishIds || [];
      for (const did of ids) {
        const id = extractId(did) || String(did);
        if (!dishLookup.has(id)) missing.add(id);
      }
    }
    return Array.from(missing);
  }, [customer, dishLookup]);

  // --- FAVOURITES HOOKS (must be BEFORE any return!) ---
  const favouriteIds = useSelector(
    (state) => state.customer.customerData.favourites
  );

  // Build lookup maps
  const restaurantMap = useMemo(() => {
    const map = new Map();
    restaurants.forEach((r) => map.set(String(r.id), r));
    return map;
  }, [restaurants]);

  const dishMap = useMemo(() => {
    const map = new Map();
    allDishes.forEach((d) => map.set(String(d.id), d));
    return map;
  }, [allDishes]);

  // Split favourites by entity type
  const favouriteRestaurants = favouriteIds
    .map((id) => restaurantMap.get(String(id)))
    .filter(Boolean);

  const favouriteDishes = favouriteIds
    .map((id) => dishMap.get(String(id)))
    .filter(Boolean);

  useEffect(() => {
    if (customer) dispatch(setCustomer(customer));
    if (missingDishIds.length > 0) {
      // eslint-disable-next-line no-console
      console.warn(
        "Missing dish ids (not found in APIs):",
        missingDishIds.slice(0, 30)
      );
    }
  }, [customer, dispatch, missingDishIds]);

  // Wait for all data to be ready before rendering main UI
  if (customerLoading || restaurantsLoading || dishesLoading || !customer) {
    return <div className={styles.loading}>Loading account...</div>;
  }

  const formatOrderDate = (od) => {
    try {
      if (!od) return "";
      const d = od.$date ? new Date(od.$date) : new Date(od);

      // Format: "Oct 6, 2025"
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return String(od);
    }
  };

  const handleReorder = async (order) => {
    if (!customer || !customer.email) return alert("No customer found.");
    try {
      const reorderPayload = {
        _id: String(Date.now()),
        customerEmail: customer.email,
        dishIds: order.dishIds || [],
        totalAmount: order.totalAmount || 0,
        deliveryAddress:
          order.deliveryAddress ||
          customer.customerAddress?.[0]?.house_number ||
          "",
        status: "orderPlaced",
        orderDate: { $date: new Date().toISOString() },
        deliveryInstruction: order.deliveryInstruction || "",
        customerOrders: order.customerOrders || {},
      };

      await addOrder({
        id: customer._id || customer.email,
        order: reorderPayload,
      }).unwrap();
      alert("Order placed (reorder) successfully.");
      refetchCustomer();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Reorder failed:", err);
      alert("Reorder failed. Check console.");
    }
  };

  // --- render helpers (no hooks here) ---
  const renderSidebar = () => (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarContent}>
        {/* <div className={styles.sidebarHeader}>
        <Avatar className={styles.sidebarAvatar} src={customer.profileImageUrl || ""}>
          {customer.firstName ? customer.firstName[0] : "U"}
        </Avatar>
        <div className={styles.sidebarName}>
          <div className={styles.nameText}>{customer.firstName} {customer.lastName}</div>
          <div className={styles.smallText}>{customer.phone}</div>
        </div>
      </div> */}

        <nav className={styles.menu}>
          {TABS.map((t) => {
            const IconComp = t.Icon;
            return (
              <button
                key={t.key}
                className={`${styles.menuItem} ${
                  activeTab === t.key ? styles.menuItemActive : ""
                }`}
                onClick={() => setActiveTab(t.key)}
              >
                <span className={styles.iconWrap}>
                  <IconComp />
                </span>
                <span className={styles.label}>{t.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );

  const renderHeader = () => (
    <header
      className={styles.headerBanner}
      style={{ backgroundColor: "var(--swiggy-banner, #2f6f7f)" }}
    >
      <div className={styles.headerInner}>
        <div className={styles.headerAvatarRow}>
          <Avatar
            className={styles.sidebarAvatarRow}
            src={customer.profileImageUrl || ""}
          >
            {customer.firstName ? customer.firstName[0] : "U"}
          </Avatar>
          <div>
            <h1 className={styles.profileTitle}>
              {customer.firstName} {customer.lastName}
            </h1>
            <div className={styles.profileSub}>
              <span>{customer.phone}</span>
              <span className={styles.dot}>·</span>
              <span>{customer.email}</span>
            </div>
          </div>
        </div>
        <div className={styles.headerActions}>
          <Button
            variant="outlined"
            className={styles.editBtn}
            onClick={() => setOpenProfile(true)}
          >
            EDIT PROFILE
          </Button>
        </div>
      </div>
    </header>
  );

  const renderOrders = () => {
    const orders = Array.isArray(customer.customerOrders)
      ? customer.customerOrders
          .slice()
          .reverse()
          .filter((order) => {
            if (!searchTerm) return true;
            const lower = searchTerm.trim().toLowerCase();

            // Match dish names
            const dishMatch = (order.dishIds || []).some((did) => {
              const info = dishLookup.get(did);
              return info?.dish?.name?.toLowerCase().includes(lower);
            });

            // Match restaurant name (check dishes' parent restaurant)
            const restaurantMatch = (order.dishIds || []).some((did) => {
              const info = dishLookup.get(did);
              const restName = info?.restaurant?.name?.toLowerCase() || "";
              return restName.includes(lower);
            });

            return dishMatch || restaurantMatch;
          })
      : [];

    if (orders.length === 0)
      return <div className={styles.empty}>No past orders.</div>;

    return (
      <section className={styles.ordersList}>
        {/* <h2 className={styles.sectionTitle}>Past Orders</h2> */}
        {orders.map((order) => {
          const dishItems = (order.dishIds || [])
            .map((did) => dishLookup.get(extractId(did) || String(did)))
            .filter(Boolean);

          const restaurantName =
            dishItems.length > 0
              ? dishItems[0].restaurant?.name ||
                dishItems[0].dish?.restaurantName ||
                ""
              : order.restaurantName || "Unknown Restaurant";

          const restaurantAddress =
            dishItems.length > 0
              ? dishItems[0].restaurant?.address ||
                dishItems[0].restaurant?.location ||
                ""
              : "";

          return (
            <article key={order._id} className={styles.orderCard}>
              <div className={styles.orderCardTop}>
                <div className={styles.thumb}>
                  {dishItems[0] && dishItems[0].dish?.imageUrl ? (
                    <img
                      src={dishItems[0].dish.imageUrl}
                      alt={dishItems[0].dish.name || ""}
                    />
                  ) : (
                    <div className={styles.thumbPlaceholder} />
                  )}
                </div>

                <div className={styles.orderMeta}>
                  <div className={styles.restaurantInfo}>
                    <h3 className={styles.restaurantTitle}>{restaurantName}</h3>
                    <div className={styles.restaurantSub}>
                      {restaurantAddress || "Address not available"}
                    </div>

                    <div className={styles.orderId}>
                      ORDER #{order._id} | {formatOrderDate(order.orderDate)}
                    </div>
                    <div className={styles.viewDetails}>VIEW DETAILS</div>
                  </div>
                  <div className={styles.orderStatuss}>
                    <div className={styles.deliveredText}>Delivered</div>
                    <div className={styles.statusDott} />
                  </div>
                </div>
                <div className={styles.orderSummary}>
                  <div className={styles.orderStatus}>
                    <div className={styles.deliveredText}>Delivered</div>
                    <div className={styles.statusDot} />
                  </div>
                  <div className={styles.totalPaidd}>
                    ₹{order.totalAmount}
                    <ChevronRightIcon className={styles.priceArrow} />
                  </div>
                </div>
              </div>

              <div className={styles.orderCardMiddle}>
                <div className={styles.itemsTextt}>
                  {order.customerOrders
                    ? Object.entries(order.customerOrders)
                        .map(([dishId, qty]) => {
                          const id = extractId(dishId) || String(dishId);
                          const info = dishLookup.get(id);
                          const name = info?.dish?.name || info?.name || id;
                          return `${name} x ${qty}`;
                        })
                        .join(", ")
                    : (order.dishIds || [])
                        .map((did) => {
                          const id = extractId(did) || String(did);
                          const info = dishLookup.get(id);
                          const nm = info?.dish?.name || info?.name || id;
                          return nm;
                        })
                        .join(", ")}
                </div>
                <div className={styles.orderIdd}>
                  {formatOrderDate(order.orderDate)}
                </div>
              </div>

              <div className={styles.orderCardBottom}>
                <div className={styles.itemsText}>
                  {(order.customerOrders &&
                    Object.entries(order.customerOrders).map(
                      ([dishId, qty]) => {
                        const id = extractId(dishId) || String(dishId);
                        const info = dishLookup.get(id);
                        const name = info?.dish?.name || info?.name || id;
                        return (
                          <div key={id}>
                            {name} x {qty}
                          </div>
                        );
                      }
                    )) || (
                    <div>
                      {(order.dishIds || []).map((did) => {
                        const id = extractId(did) || String(did);
                        const info = dishLookup.get(id);
                        const nm = info?.dish?.name || info?.name || id;
                        return (
                          <span key={id} style={{ marginRight: 8 }}>
                            {nm}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className={styles.orderActions}>
                  <div className={styles.totalPaid}>
                    Total Paid: ₹ {order.totalAmount}
                  </div>
                  <div className={styles.actionButtons}>
                    <Button variant="outlined">HELP</Button>
                    <Button
                      variant="contained"
                      onClick={() => handleReorder(order)}
                      disabled={addingOrder}
                    >
                      REORDER
                    </Button>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </section>
    );
  };

  const renderFavourites = () => {
    const hasRestaurants = favouriteRestaurants.length > 0;
    const hasDishes = favouriteDishes.length > 0;

    if (!hasRestaurants && !hasDishes) {
      return (
        <section>
          <div className={styles.empty}>No favourites yet.</div>
        </section>
      );
    }

    const lower = searchTerm.trim().toLowerCase();

    const filteredFavouriteRestaurants = favouriteRestaurants.filter((rest) =>
      rest.name.toLowerCase().includes(lower)
    );

    const filteredFavouriteDishes = favouriteDishes.filter((dish) =>
      dish.name.toLowerCase().includes(lower)
    );

    return (
      <section>
        {/* ❤️ Favourite Restaurants */}
        {hasRestaurants && (
          <>
            <h3 className={styles.sectionTitle}>Restaurants</h3>
            <div className={styles.favGrid}>
              {filteredFavouriteRestaurants.map((rest) => (
                <div
                  key={rest.id}
                  className={styles.favCard}
                  onClick={() =>
                    navigate(`/restaurant/${rest.id}`, {
                      state: { restaurant: rest },
                    })
                  }
                >
                  <div className={styles.favThumb}>
                    <img src={rest.imageUrl} alt={rest.name} />
                  </div>
                  <div className={styles.favInfo}>
                    <div className={styles.favName}>{rest.name}</div>
                    <div className={styles.favSub}>{rest.address}</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ❤️ Favourite Dishes */}
        {hasDishes && (
          <>
            <h3 className={styles.sectionTitle}>Dishes</h3>
            <div className={styles.favGrid}>
              {filteredFavouriteDishes.map((dish) => (
                <div
                  key={dish.id}
                  className={styles.favCard}
                  onClick={() => {
                    const parentRestaurant = restaurants.find((r) =>
                      r.dishes?.some((d) => String(d.id) === String(dish.id))
                    );

                    if (parentRestaurant) {
                      navigate(`/restaurant/${parentRestaurant.id}`, {
                        state: { scrollToDish: dish.name }, // VERY IMPORTANT
                      });
                    }
                  }}
                >
                  <div className={styles.favThumb}>
                    <img src={dish.imageUrl} alt={dish.name} />
                  </div>
                  <div className={styles.favInfo}>
                    <div className={styles.favName}>{dish.name}</div>
                    <div className={styles.favSub}>₹{dish.price}</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    );
  };

  const renderPayments = () => (
    <section className={styles.placeholder}>
      <h2 className={styles.sectionTitle}>Payments</h2>
      <p>Coming soon — saved cards, wallets & payment options.</p>
    </section>
  );

  const renderAddresses = () => {
    const handleDeleteAddress = async (addr) => {
      if (!customer || !customer.email) return alert("No customer found.");
      if (!addr?.addressId) return alert("Invalid address ID.");

      try {
        await deleteAddress({
          id: customer._id || customer.email,
          index: addr.addressId, // backend expects string addressId
        }).unwrap();

        alert("Address deleted successfully!");
        refetchCustomer(); // refresh address list
      } catch (err) {
        console.error("Error deleting address:", err);
        alert("Failed to delete address. Check console for details.");
      }
    };

    return (
      <section className={styles.addresses}>
        {/* Show form when adding a new address */}
        {Array.isArray(customer.customerAddress) &&
        customer.customerAddress.length ? (
          customer.customerAddress.map((addr, idx) => (
            <div key={addr.addressId || idx} className={styles.addressCard}>
              <div className={styles.addressType}>
                <div className={styles.addressLabel}>
                  <div className={styles.addressReceiver}>
                    {Array.isArray(addr.receiverName)
                      ? addr.receiverName.join(", ")
                      : addr.receiverName}
                  </div>
                  <div className={styles.smallText}>
                    {addr.house_number || ""} {addr.street || ""}{" "}
                    {addr.landMark || ""}
                  </div>
                  <div className={styles.smallText}>
                    {addr.city || ""}, {addr.state || ""} -{" "}
                    {safePostcode(addr.postcode)} {addr.country || ""}
                  </div>
                </div>
                <div className={styles.addressActionss}>
                  <Button
                    variant="outlined"
                    onClick={() => handleDeleteAddress(addr)}
                    style={{ margin: "0", height: "36px" }}
                  >
                    Delete
                  </Button>
                  <div>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setEditingAddress(addr);
                        setIsAddDrawerOpen(true);
                      }}
                      style={{ margin: "0", height: "36px" }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      style={{ height: "36px", marginLeft: "10px" }}
                    >
                      Deliver
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.empty}>No saved addresses.</div>
        )}
      </section>
    );
  };

  const renderSettings = () => (
    <section className={styles.placeholder}>
      <h2 className={styles.sectionTitle}>Settings</h2>
      <p>
        Account settings, password, notifications and preferences will appear
        here.
      </p>
    </section>
  );

  const renderMain = () => {
    switch (activeTab) {
      case "orders":
        return renderOrders();
      case "favourites":
        return renderFavourites();
      case "payments":
        return renderPayments();
      case "addresses":
        return renderAddresses();
      case "settings":
        return renderSettings();
      default:
        return renderOrders();
    }
  };

  const renderHeaderRow = () => {
    switch (activeTab) {
      case "orders":
        return (
          <div className={styles.ordersHeaderRow}>
            <h2 className={styles.sectionTitle}>Past Orders</h2>
            <div className={styles.searchBox}>
              <SearchIcon />
              <input
                type="text"
                placeholder="Search orders or restaurants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        );
      case "favourites":
        return (
          <div className={styles.ordersHeaderRow}>
            <h2 className={styles.sectionTitle}>Favourites</h2>
            <div className={styles.searchBox}>
              <SearchIcon />
              <input
                type="text"
                placeholder="Search favourite dishes or restaurants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        );
      case "payments":
        return (
          <div className={styles.ordersHeaderRow}>
            <h2 className={styles.sectionTitle}>Payments</h2>
          </div>
        );
      case "addresses":
        return (
          <div className={styles.ordersHeaderRow}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Addresses</h2>
              <Button
                variant="contained"
                onClick={() => {
                  setEditingAddress(null);
                  setIsAddDrawerOpen(true);
                }}
              >
                ADD
              </Button>
            </div>
          </div>
        );
      case "settings":
        return (
          <div className={styles.ordersHeaderRow}>
            <h2 className={styles.sectionTitle}>Account Settings</h2>
          </div>
        );
      default:
        return null;
    }
  };

  // Use CSS variables set globally by theme.js; provide inline fallback from MUI theme
  return (
    <div
      className={styles.pageWrap}
      style={{
        color: "var(--mui-palette-text-primary)",
        // fallback to MUI theme if variables not present
        ...(muiTheme?.palette
          ? {
              backgroundColor: "var(--mui-palette-background-default)",
              color: "var(--mui-palette-text-primary)",
            }
          : {}),
      }}
    >
      {renderHeader()}
      <div className={styles.contentWrap}>
        {renderSidebar()}
        <main className={styles.mainContent}>
          {renderHeaderRow()}
          {renderMain()}
        </main>
      </div>
      <Profile open={openProfile} onClose={() => setOpenProfile(false)} />
      <AddAddressDrawer
        open={isAddDrawerOpen}
        onClose={() => setIsAddDrawerOpen(false)}
        editingAddress={editingAddress}
        onSave={(updatedAddress) => {
          if (editingAddress) {
            // Update existing address in UI
            setAddresses((prev) =>
              prev.map((addr) =>
                addr.addressId === updatedAddress.addressId
                  ? updatedAddress
                  : addr
              )
            );
          } else {
            // Add new address
            setAddresses((prev) => [...prev, updatedAddress]);
          }

          setIsAddDrawerOpen(false);
          setEditingAddress(null);
          // Refresh customer data from backend
          refetchCustomer();
        }}
      />
    </div>
  );
}
