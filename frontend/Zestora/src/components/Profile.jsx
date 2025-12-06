import React, { useState, useEffect } from "react";
import {
  Avatar,
  Button,
  IconButton,
  Drawer,
  Divider,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { supabase } from "../config/supabaseClient";
import {
  useGetCustomerByIdQuery,
  useUpdateCustomerMutation,
} from "../redux/services/customerApi";
import { setCustomer } from "../redux/slices/customerSlice";
import styles from "../styles/Profile.module.css";

const Profile = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [isEditing, setIsEditing] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [otp, setOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [editingAddressIndex, setEditingAddressIndex] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [newAddress, setNewAddress] = useState({
    receiverDetails: "",
    saveAddressAs: "",
    house_number: "",
    street: "",
    landMark: "",
    postcode: "",
    city: "",
    state: "",
    country: "",
    location: [],
  });

  const {
    data: customerData,
    isLoading,
    refetch,
  } = useGetCustomerByIdQuery(user?.email, {
    skip: !user?.email,
  });

  const [updateCustomer] = useUpdateCustomerMutation();
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    if (customerData) {
      setUserProfile(customerData);
      dispatch(setCustomer(customerData));
    }
  }, [customerData, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress({ ...newAddress, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setUserProfile({ ...userProfile, profileImageUrl: `profile/${file.name}` });
    }
  };

  const fetchLocationData = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${import.meta.env.VITE_OPENCAGEDATA_KEY}`
      );
      const data = await response.json();
      const { country, state, city, postcode, house_number, street } =
        data.results[0].components;
      setNewAddress((prev) => ({
        ...prev,
        street: street || "",
        house_number: house_number || "",
        postcode: postcode || "",
        city: city || "",
        state: state || "",
        country: country || "",
        location: [longitude, latitude],
      }));
    } catch (error) {
      console.error("Error fetching location:", error);
    }
  };

  const handleLocationFetch = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => fetchLocationData(coords.latitude, coords.longitude),
        (error) => console.error("Geolocation error:", error)
      );
    } else {
      alert("Geolocation not supported.");
    }
  };

  const handleDeleteAddress = async (index) => {
    const updated = userProfile.customerAddress.filter((_, i) => i !== index);
    await handleSaveProfile({ ...userProfile, customerAddress: updated });
  };

  const handleEditAddress = (index) => {
    setNewAddress(userProfile.customerAddress[index]);
    setIsAddingAddress(true);
    setEditingAddressIndex(index);
  };

  const handleSaveAddress = async () => {
    const updatedAddresses = [...(userProfile.customerAddress || [])];
    if (editingAddressIndex !== null) {
      updatedAddresses[editingAddressIndex] = { ...newAddress };
    } else {
      updatedAddresses.push({ ...newAddress });
    }

    await handleSaveProfile({ ...userProfile, customerAddress: updatedAddresses });

    setIsAddingAddress(false);
    setEditingAddressIndex(null);
    setNewAddress({
      receiverDetails: "",
      house_number: "",
      street: "",
      landMark: "",
      postcode: "",
      city: "",
      state: "",
      country: "",
      location: [],
    });
  };

  const handleSaveProfile = async (updatedProfile = userProfile) => {
    try {
      let profileToSave = { ...updatedProfile };

      if (imageFile) {
        const { data, error } = await supabase.storage
          .from("profiles")
          .upload(`profile/${imageFile.name}`, imageFile);
        if (error) throw error;
        profileToSave.profileImageUrl = data.path;
      }

      await updateCustomer({ id: userProfile.email, data: profileToSave });
      alert("Profile updated successfully");
      setUserProfile(profileToSave);
      refetch();
      dispatch(setCustomer(profileToSave));
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  // Supabase OTP logic
  const sendOtp = async () => {
    setOtpLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      phone: userProfile.phone,
    });
    if (error) alert("Error sending OTP: " + error.message);
    else {
      alert("OTP sent! Check your phone.");
      setIsOtpSent(true);
    }
    setOtpLoading(false);
  };

  const verifyOtp = async () => {
    setIsVerifying(true);
    const { error } = await supabase.auth.verifyOtp({
      phone: userProfile.phone,
      token: otp,
      type: "sms",
    });
    if (error) alert("Verification failed.");
    else alert("Phone number verified successfully!");
    setIsVerifying(false);
  };

  if (isLoading || !userProfile)
    return <div className={styles.loading}>Loading profile...</div>;

  return (
    <Drawer
  anchor="right"
  open={open}
  onClose={onClose}
  PaperProps={{
    sx: {
      width: 360,
      backgroundColor: "var(--mui-palette-background-paper)",
      color: "var(--mui-palette-text-primary)",
      p: 3,
    },
  }}
>
  <div className={styles.drawerHeader}>
    <div className={styles.headerLeft}>
      <Avatar
        src={userProfile.profileImageUrl}
        alt="Profile"
        sx={{ width: 70, height: 70 }}
      />
      <div className={styles.headerText}>
        <h2>{`${userProfile.firstName} ${userProfile.lastName}`}</h2>
        <p>{userProfile.email}</p>
      </div>
    </div>
    <IconButton onClick={onClose}>
      <CloseIcon />
    </IconButton>
  </div>

  <Divider sx={{ my: 2 }} />

  <div className={styles.profileSection}>
    {/* Phone */}
    <div className={styles.profileField}>
      <p className={styles.label}>Phone number</p>
      <div className={styles.fieldRow}>
        {editingField === "phone" ? (
          <input
            className={styles.editInput}
            name="phone"
            value={userProfile.phone || ""}
            onChange={handleChange}
          />
        ) : (
          <p>{userProfile.phone || "Not set"}</p>
        )}
        <IconButton
          onClick={() =>
            setEditingField(editingField === "phone" ? null : "phone")
          }
        >
          <EditIcon sx={{ color: "#fc8019" }} />
        </IconButton>
      </div>
      <Divider sx={{ my: 1 }} />
    </div>

    {/* Email */}
    <div className={styles.profileField}>
      <p className={styles.label}>Email id</p>
      <div className={styles.fieldRow}>
        {editingField === "email" ? (
          <input
            className={styles.editInput}
            name="email"
            value={userProfile.email || ""}
            onChange={handleChange}
          />
        ) : (
          <p>{userProfile.email}</p>
        )}
        <IconButton
          onClick={() =>
            setEditingField(editingField === "email" ? null : "email")
          }
        >
          <EditIcon sx={{ color: "#fc8019" }} />
        </IconButton>
      </div>
      <Divider sx={{ my: 1 }} />
    </div>

    {/* Gender */}
    <div className={styles.profileField}>
      <p className={styles.label}>Gender</p>
      <div className={styles.fieldRow }>
        {editingField === "gender" ? (
          <input
            className={styles.editInput}
            name="gender"
            value={userProfile.gender || ""}
            onChange={handleChange}
          />
        ) : (
          <p>{userProfile.gender || "Not specified"}</p>
        )}
        <IconButton
          onClick={() =>
            setEditingField(editingField === "gender" ? null : "gender")
          }
        >
          <EditIcon sx={{ color: "#fc8019" }} />
        </IconButton>
      </div>
      <Divider sx={{ my: 1 }} />
    </div>

    {/* Save button (only visible when something is edited) */}
    {editingField && (
      <Button
        variant="contained"
        sx={{
          mt: 2,
          backgroundColor: "#fc8019",
          "&:hover": { backgroundColor: "#e56f11" },
        }}
        onClick={() => {
          handleSaveProfile();
          setEditingField(null);
        }}
      >
        Save Changes
      </Button>
    )}
  </div>
</Drawer>

  );
};

export default Profile;
