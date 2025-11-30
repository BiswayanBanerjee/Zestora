import React, {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback,
} from "react";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import RoomIcon from "@mui/icons-material/Room";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Map from "react-map-gl/maplibre";
import axios from "axios";
import styles from "./AddAddressDrawer.module.css";
import "maplibre-gl/dist/maplibre-gl.css";
import { useSelector } from "react-redux";
import { useTheme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import {
  useAddAddressMutation,
  useUpdateAddressMutation,
} from "./redux/services/customerApi";

const AddAddressDrawer = ({ open, onClose, onSave, editingAddress }) => {
  const mapRef = useRef();
  const muiTheme = useTheme();
  const isDarkMode = muiTheme.palette.mode === "dark";
  const mapWrapperRef = useRef(null);
  const customer = useSelector((state) => state.customer.customer);
  const [addAddress] = useAddAddressMutation();
  const [updateAddress] = useUpdateAddressMutation();
  const [mapVisible, setMapVisible] = useState(false);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [showScrollNotice, setShowScrollNotice] = useState(true);
  const isEditing = Boolean(editingAddress);

  const [form, setForm] = useState({
    receiverName: "",
    house_number: "",
    landMark: "",
    address: "",
    saveAddressAs: "",
    location: { type: "Point", coordinates: [88.3639, 22.5726] }, // Default: Kolkata
  });

  const [viewport, setViewport] = useState({
    latitude: 22.5726,
    longitude: 88.3639,
    zoom: 14,
  });

  useEffect(() => {
    if (open && editingAddress) {
      // Build readable address string for the "Address" field
      const fullAddress = [
        editingAddress.house_number,
        editingAddress.street,
        editingAddress.city,
        editingAddress.state,
        editingAddress.country,
        editingAddress.postcode,
      ]
        .filter(Boolean)
        .join(", ");

      setForm({
        receiverName: editingAddress.receiverName || "",
        house_number: editingAddress.house_number || "",
        street: editingAddress.street || "",
        landMark: editingAddress.landMark || "",
        postcode: editingAddress.postcode || "",
        city: editingAddress.city || "",
        state: editingAddress.state || "",
        country: editingAddress.country || "",
        saveAddressAs: editingAddress.saveAddressAs || "",
        address: editingAddress.address || fullAddress || "", // ✅ Prefill this
        location: editingAddress.location || {
          type: "Point",
          coordinates: [88.3639, 22.5726],
        },
      });

      const [lng, lat] = editingAddress.location?.coordinates || [
        88.3639, 22.5726,
      ];
      setViewport({ latitude: lat, longitude: lng, zoom: 14 });
    }
  }, [open, editingAddress]);

  // 🕒 Delay map render to avoid white flash
  useLayoutEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        setMapVisible(true);
        mapRef.current?.resize();
      }, 400);
      return () => clearTimeout(timer);
    } else {
      setMapVisible(false);
    }
  }, [open]);

  useEffect(() => {
    if (open && customer) {
      const name = [customer.firstName, customer.lastName]
        .filter(Boolean)
        .join(" ");
      setForm((prev) => ({ ...prev, receiverName: name }));
    }
  }, [open, customer]);

  // 🧭 Center map on user's location
  const goToCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          mapRef.current?.flyTo({
            center: [longitude, latitude],
            zoom: 15,
            duration: 1000,
          });
          setForm((prev) => ({
            ...prev,
            location: { type: "Point", coordinates: [longitude, latitude] },
          }));
        },
        () => alert("Location permission denied.")
      );
    }
  }, []);

  // 🌍 Auto-load user's location on open
  useEffect(() => {
    if (open) goToCurrentLocation();
  }, [open, goToCurrentLocation]);

  // 🔁 Reverse geocode when map stops moving
  // Reverse geocode when map stops moving
  const handleMoveEnd = useCallback(async (evt) => {
    const { lng, lat } = evt.target.getCenter();
    setLoadingAddress(true);
    try {
      const res = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${
          import.meta.env.VITE_OPENCAGEDATA_KEY
        }`
      );

      const comp = res.data.results[0].components;
      const fullAddress = [
        comp.house_number,
        comp.road,
        comp.city || comp.town,
        comp.state,
        comp.country,
        comp.postcode,
      ]
        .filter(Boolean)
        .join(", ");

      setForm((prev) => ({
        ...prev,
        address: fullAddress,
        house_number: comp.house_number || "",
        street: comp.road || "",
        landMark: comp.suburb || "",
        postcode: comp.postcode || "",
        city: comp.city || comp.town || "",
        state: comp.state || "",
        country: comp.country || "",
        location: { type: "Point", coordinates: [lng, lat] },
      }));
    } catch (err) {
      console.error("Reverse geocode failed:", err);
    } finally {
      setLoadingAddress(false);
    }
  }, []);

  const handleZoomIn = () => {
    const zoom = mapRef.current?.getZoom();
    mapRef.current?.zoomTo(zoom + 1);
  };

  const handleZoomOut = () => {
    const zoom = mapRef.current?.getZoom();
    mapRef.current?.zoomTo(zoom - 1);
  };

  const handleSave = async () => {
    if (!customer || !customer.email) {
      alert("No customer found.");
      return;
    }

    try {
      const newAddress = {
        ...form,
        addressId:
          editingAddress?.addressId ||
          String((customer.customerAddress?.length || 0) + 1),
        location: form.location,
      };

      if (isEditing) {
        await updateAddress({
          id: customer._id || customer.email,
          addressId: editingAddress.addressId,
          address: newAddress,
        }).unwrap();
        alert("Address updated successfully!");
      } else {
        await addAddress({
          id: customer._id || customer.email,
          address: newAddress,
        }).unwrap();
        alert("Address added successfully!");
      }

      onSave(newAddress);
      onClose();
    } catch (err) {
      console.error("Error saving address:", err);
      alert("Failed to save address.");
    }
  };

  // 🚫 Prevent browser zoom when pressing Ctrl + Scroll
  useEffect(() => {
    const handleWheel = (e) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);

  const handleClose = () => {
    setForm({
      receiverName: "",
      house_number: "",
      landMark: "",
      address: "",
      saveAddressAs: "",
      location: { type: "Point", coordinates: [88.3639, 22.5726] },
    });
    setMapVisible(false);
    onClose(); // call parent close
  };

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          width: 400,
          p: 2,
          backgroundColor: "var(--mui-palette-background-paper)",
        },
      }}
    >
      <div className={styles.drawerHeader}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Add New Address
        </Typography>
        <IconButton
          onClick={handleClose}
          className={styles.closeButton}
          size="small"
        >
          <CloseIcon />
        </IconButton>
      </div>
      <div ref={mapWrapperRef} className={styles.mapContainer}>
        {mapVisible ? (
          <>
            <Map
              ref={mapRef}
              initialViewState={viewport}
              style={{ width: "100%", height: "100%" }}
              mapStyle={`https://api.maptiler.com/maps/${
                isDarkMode ? "streets-v2-dark" : "streets"
              }/style.json?key=${import.meta.env.VITE_MAPTILER_KEY}`}
              onMove={(evt) => setViewport(evt.viewState)}
              onMoveEnd={handleMoveEnd}
              onLoad={() => {
                const map = mapRef.current.getMap();

                // Completely disable scroll zoom initially
                map.scrollZoom.disable();

                // 🔧 Enforce "Ctrl + Scroll" behavior
                const container = map.getCanvasContainer();

                const handleWheel = (e) => {
                  const hasModifier = e.ctrlKey || e.metaKey;

                  if (!hasModifier) {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowScrollNotice(true);
                    return false;
                  }

                  // If modifier is pressed → temporarily enable zoom
                  setShowScrollNotice(false);
                  if (!map.scrollZoom.isEnabled()) {
                    map.scrollZoom.enable();
                  }

                  clearTimeout(window._scrollZoomTimeout);
                  window._scrollZoomTimeout = setTimeout(() => {
                    if (map.scrollZoom.isEnabled()) map.scrollZoom.disable();
                  }, 300); // disables soon after last scroll
                };

                container.addEventListener("wheel", handleWheel, {
                  passive: false,
                });

                // Disable again if user moves map manually
                map.on("dragstart", () => map.scrollZoom.disable());
                map.on("zoomend", () => map.scrollZoom.disable());
                map.on("resize", () => map.scrollZoom.disable());

                // Cleanup
                return () => {
                  container.removeEventListener("wheel", handleWheel);
                  clearTimeout(window._scrollZoomTimeout);
                  map.off("dragstart");
                  map.off("zoomend");
                  map.off("resize");
                };
              }}
            />

            {/* 📍 Fixed center pin */}
            <div className={styles.pinIcon}>
              <RoomIcon sx={{ color: "red", fontSize: 42 }} />
            </div>

            {/* 🧭 GPS Button */}
            <IconButton
              className={styles.gpsButton}
              onClick={goToCurrentLocation}
            >
              <MyLocationIcon />
            </IconButton>

            {/* ➕ ➖ Zoom Buttons */}
            <div className={styles.zoomControls}>
              <IconButton size="small" onClick={handleZoomIn}>
                <AddIcon />
              </IconButton>
              <IconButton size="small" onClick={handleZoomOut}>
                <RemoveIcon />
              </IconButton>
            </div>

            {/* 🖱 Scroll Notice Overlay */}
            {showScrollNotice && (
              <div className={styles.scrollNotice}>
                Use <b>Ctrl + scroll</b> to zoom
              </div>
            )}

            {/* 🔄 Address Loading */}
            {loadingAddress && (
              <div className={styles.loader}>
                <CircularProgress size={22} color="inherit" />
                <span style={{ marginLeft: 6 }}>Fetching address...</span>
              </div>
            )}
          </>
        ) : (
          <div
            style={{ height: 420, background: "#dcdcdc", borderRadius: 8 }}
          />
        )}
      </div>

      <div className={styles.formFields}>
        <TextField
          label="Save as (Home, Work...)"
          name="saveAddressAs"
          value={form.saveAddressAs}
          onChange={(e) => setForm({ ...form, saveAddressAs: e.target.value })}
          fullWidth
          margin="dense"
        />
        <TextField
          label="House No. / Flat No."
          name="house_number"
          value={form.house_number}
          onChange={(e) => setForm({ ...form, house_number: e.target.value })}
          fullWidth
          margin="dense"
        />
        <TextField
          label="Landmark"
          name="landMark"
          value={form.landMark}
          onChange={(e) => setForm({ ...form, landMark: e.target.value })}
          fullWidth
          margin="dense"
        />
        <TextField
          label="Address"
          name="address"
          value={form.address}
          fullWidth
          margin="dense"
          multiline
          minRows={1}
          InputProps={{ readOnly: true }}
          helperText="Drag the map to select location"
        />
      </div>

      <Button
        variant="contained"
        color="success"
        fullWidth
        sx={{ mt: 2 }}
        onClick={handleSave}
      >
        Save Address
      </Button>
    </Drawer>
  );
};

export default AddAddressDrawer;
