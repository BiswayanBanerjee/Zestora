import React, { useState, useEffect, useCallback } from "react";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import InputAdornment from "@mui/material/InputAdornment";
import Modal from "@mui/material/Modal";
import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";
import {
  useLoginMutation,
  useSignupMutation,
  useVerifyOtpMutation,
  useGoogleLoginMutation,
} from "../redux/services/authApi";
import { useAddCustomerMutation } from "../redux/services/customerApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "../redux/slices/authSlice";
import styles from "../styles/AuthDrawer.module.css";
import { auth, provider } from "../config/firebaseConfig";
import { signInWithPopup } from "firebase/auth";
import { customerApi } from "../redux/services/customerApi";
import { useLazyCheckUserQuery } from "../redux/services/authApi";
import { setCustomer, setCustomerData } from "../redux/slices/customerSlice";
import { store } from "../redux/store";

const AuthDrawer = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const [mode, setMode] = useState("login");
  const [error, setError] = useState("");
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [userData, setUserData] = useState(null);
  const [login, { isLoading: loginLoading }] = useLoginMutation();
  const [signup, { isLoading: signupLoading }] = useSignupMutation();
  const [verifyEmailOtp] = useVerifyOtpMutation();
  const [addCustomer] = useAddCustomerMutation();
  const [googleLogin] = useGoogleLoginMutation();
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [googleUserData, setGoogleUserData] = useState(null);
  const [userCheckResult, setUserCheckResult] = useState(null);
  const [loadingCheck, setLoadingCheck] = useState(false);
  const [triggerCheckUser] = useLazyCheckUserQuery();

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
    reset,
  } = useForm({ mode: "onChange", reValidateMode: "onBlur" });
  const {
    register: registerSignup,
    handleSubmit: handleSignupSubmit,
    formState: { errors: signupErrors },
    reset: resetSignup,
  } = useForm({ mode: "onChange", reValidateMode: "onBlur" });
  const {
    register: registerEmailCheck,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors },
    reset: resetEmailForm,
  } = useForm({ mode: "onChange", reValidateMode: "onBlur" });
  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
    reset: resetLoginForm,
  } = useForm({ mode: "onChange", reValidateMode: "onBlur" });

  // ✅ After all your useState and useForm hooks
  useEffect(() => {
    if (!open) {
      resetEmailForm();
      setUserCheckResult(null);
      setMode(null);
      setEmail("");
    }
  }, [open]);

  const handleCheckUser = async (data) => {
    try {
      setLoadingCheck(true);

      const result = await triggerCheckUser(data.email).unwrap();

      console.log("Check User Response:", result);
      setUserCheckResult(result);

      if (!result.exists) setMode("signup");
      else if (result.isGoogleUser) setMode("googleLogin");
      else setMode("login");
    } catch (err) {
      console.error("Check user error:", err);
    } finally {
      setLoadingCheck(false);
    }
  };

  const handleLogin = async (data) => {
    try {
      const result = await login(data).unwrap();
      console.log("RAW LOGIN RESPONSE:", result);

      // Extract token
      const token = result.token;

      if (!token) {
        setError("Token missing in response");
        return;
      }

      // Build user from backend response
      const user = {
        email: result.email,
        role: result.role,
      };

      // 1️⃣ Save ONLY token in localStorage
      localStorage.setItem("token", token);

      // 2️⃣ Update auth slice (will decode token → creates user)
      dispatch(setCredentials({ token }));

      // 3️⃣ Save user basics in customer slice
      dispatch(setCustomer(user));

      // 4️⃣ Fetch full customer profile (has firstName, lastName, cart)
      const profileRes = await fetch(
        `${import.meta.env.VITE_CUSTOMER_API_BASE_URL}/api/customers/${user.email}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const fullProfile = await profileRes.json();
      dispatch(setCustomerData(fullProfile));

      onClose();
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Please try again");
    }
  };

  const handleSignup = async (data) => {
    try {
      setError("");
      const role = data.isOwner ? "OWNER" : "CUSTOMER";
      const [firstName, ...lastNameParts] = data.fullName.trim().split(" ");
      const lastName = lastNameParts.join(" ") || "";

      const payload = {
        firstName,
        lastName,
        email: data.email,
        phone: `+91${data.mobile}`,
        password: data.password,
        role,
      };

      const rawResponse = await signup(payload);

      let message = "";
      if (rawResponse?.data) message = rawResponse.data;
      else if (rawResponse?.error?.data) message = rawResponse.error.data;
      else if (rawResponse?.error?.originalStatus === 200)
        message = "OTP sent to email for verification";

      console.log("Signup response:", rawResponse);

      if (
        typeof message === "string" &&
        message.toLowerCase().includes("otp sent")
      ) {
        setUserData(payload);
        setEmail(payload.email);
        setMode("verify");
        reset();
      } else {
        setError("Signup failed. Please try again.");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError("Signup failed. Please try again.");
    }
  };

  const handleVerifyEmailOtp = async () => {
    try {
      setError("");

      // Call verifyOtp API
      const rawResponse = await verifyEmailOtp({ email, otp });

      // RTK Query may wrap responses differently depending on content type
      let message = "";
      if (rawResponse?.data) message = rawResponse.data;
      else if (rawResponse?.error?.data) message = rawResponse.error.data;
      else if (rawResponse?.error?.originalStatus === 200)
        message = "OTP verified successfully.";

      console.log("Verify OTP response:", rawResponse);

      // Accept plain text success message like in handleSignup
      if (
        typeof message === "string" &&
        message.toLowerCase().includes("otp verified")
      ) {
        if (userData) {
          await addCustomer(userData).unwrap();
        }
        setMode("login");
      } else {
        setError("OTP verification failed. Please try again.");
      }
    } catch (err) {
      console.error("Verify OTP error:", err);
      setError("OTP verification failed. Please try again.");
    }
  };

  const handleGoogleAuth = useCallback(async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const idToken = await user.getIdToken();

      // Split Google displayName into first and last name
      const [firstName, ...lastNameParts] = (user.displayName || "")
        .trim()
        .split(" ");
      const lastName = lastNameParts.join(" ") || "";

      // Send token + first/last name to backend (auth-api)
      const data = await googleLogin({
        token: idToken,
        firstName,
        lastName,
        email: user.email,
      }).unwrap();

      // ✅ Fetch customer data to check if phone exists
      const { data: existingCustomer } = await store.dispatch(
        customerApi.endpoints.getCustomerById.initiate(data.user.email)
      );

      if (!existingCustomer?.phone || existingCustomer.phone === "+91") {
        // No phone — show modal
        setGoogleUserData({ ...data });
        setShowPhoneModal(true);
      } else {
        // Already has phone — proceed normally
        dispatch(setCredentials({ token: data.jwt, user: data.user }));
        localStorage.setItem("token", data.jwt);
        localStorage.setItem("user", JSON.stringify(data.user));
        onClose();
      }

      const { jwt, user: backendUser } = data;

      // ✅ Only show modal for new Google users (first-time sign-in)
      if (!existingCustomer) {
        setGoogleUserData({
          jwt,
          user: backendUser,
          firstName,
          lastName,
        });
        setShowPhoneModal(true);
      }
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      setError("Google Sign-In failed. Please try again.");
    }
  }, []);

  const handlePhoneSubmit = async (phoneNumber) => {
    try {
      // ✅ Add/update customer in customer-api
      await addCustomer({
        firstName: googleUserData.firstName,
        lastName: googleUserData.lastName,
        email: googleUserData.user.email,
        phone: `+91${phoneNumber}`,
        password: "GOOGLE_USER",
        role: googleUserData.user.role,
      }).unwrap();

      // ✅ Save credentials locally
      dispatch(
        setCredentials({
          token: googleUserData.jwt,
          user: { ...googleUserData.user, phone: `+91${phoneNumber}` },
        })
      );
      localStorage.setItem("token", googleUserData.jwt);
      localStorage.setItem(
        "user",
        JSON.stringify({ ...googleUserData.user, phone: `+91${phoneNumber}` })
      );

      setShowPhoneModal(false);
      onClose();
    } catch (err) {
      console.error("Error saving phone:", err);
      alert("Failed to save phone number. Try again.");
    }
  };

  const renderLogin = () => (
    <form className={styles.form} onSubmit={handleLoginSubmit(handleLogin)}>
      {/* <Typography variant="h5" className={styles.heading}>
        Sign In
      </Typography> */}
      <TextField
        label="Email"
        fullWidth
        margin="normal"
        {...registerLogin("email", { required: "Email is required" })}
        error={!!loginErrors.email}
        helperText={loginErrors.email?.message}
      />

      <TextField
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        {...registerLogin("password", { required: "Password is required" })}
        error={!!loginErrors.password}
        helperText={loginErrors.password?.message}
      />

      {error && <Typography className={styles.error}>{error}</Typography>}
      <Button
        type="submit"
        variant="contained"
        fullWidth
        className={styles.primaryBtn}
        disabled={loginLoading}
      >
        {loginLoading ? "Logging in..." : "Login"}
      </Button>
      {/* <Button
        variant="outlined"
        fullWidth
        className={styles.secondaryBtn}
        onClick={() => setMode("signup")}
      >
        New User? Sign Up
      </Button>
      <Typography align="center" sx={{ mt: 2, mb: 1 }}>
        — or —
      </Typography> */}

      {/* <Button
        variant="outlined"
        fullWidth
        startIcon={
          <img
            src="https://www.svgrepo.com/show/355037/google.svg"
            alt="Google"
            width={20}
          />
        }
        onClick={handleGoogleAuth}
      >
        Continue with Google
      </Button> */}
    </form>
  );

  const renderSignup = () => (
    <form className={styles.form} onSubmit={handleSignupSubmit(handleSignup)}>
      {/* <Typography variant="h5" className={styles.heading}>
        Create Account ✨
      </Typography> */}

      {/* Full Name */}
      <TextField
        label="Full Name"
        fullWidth
        margin="normal"
        {...registerSignup("fullName", {
          required: "Full Name is required",
          pattern: {
            value: /^[A-Za-z]+(\s[A-Za-z]+)+$/,
            message:
              "Please enter your full name with a space (e.g., John Doe)",
          },
        })}
        error={!!errors.fullName}
        helperText={errors.fullName?.message}
      />

      {/* Email */}
      <TextField
        label="Email"
        fullWidth
        margin="normal"
        {...registerSignup("email", {
          required: "Email is required",
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Enter a valid email address",
          },
        })}
        error={!!errors.email}
        helperText={errors.email?.message}
      />

      {/* Mobile Number */}
      <TextField
        label="Mobile Number"
        fullWidth
        variant="outlined"
        margin="normal"
        InputProps={{
          startAdornment: <InputAdornment position="start">+91</InputAdornment>,
        }}
        {...registerSignup("mobile", {
          required: "Mobile number is required",
          pattern: {
            value: /^[0-9]{10}$/,
            message: "Enter a valid 10-digit mobile number",
          },
        })}
        error={!!errors.mobile}
        helperText={errors.mobile?.message}
      />

      {/* Password */}
      <TextField
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        {...registerSignup("password", { required: "Password is required" })}
        error={!!errors.password}
        helperText={errors.password?.message}
      />

      {/* Owner checkbox */}
      <FormControlLabel
        control={<Checkbox {...registerSignup("isOwner")} />}
        label="Register as restaurant owner?"
      />

      {error && <Typography className={styles.error}>{error}</Typography>}

      <Button
        type="submit"
        variant="contained"
        fullWidth
        className={styles.primaryBtn}
        disabled={signupLoading}
      >
        {signupLoading ? "Signing up..." : "Sign Up"}
      </Button>

      {/* <Button
        variant="outlined"
        fullWidth
        className={styles.secondaryBtn}
        onClick={() => setMode("login")}
      >
        Already have an account? Login
      </Button> */}
      <Divider className={styles.divider} />

      <Button
        variant="outlined"
        fullWidth
        startIcon={
          <img
            src="https://www.svgrepo.com/show/355037/google.svg"
            alt="Google"
            width={20}
          />
        }
        onClick={handleGoogleAuth}
      >
        Continue with Google
      </Button>
    </form>
  );

  const renderOtp = () => (
    <Box className={styles.form}>
      <Typography variant="h5" className={styles.heading}>
        Verify OTP 🔐
      </Typography>
      <Typography>Enter OTP sent to {email}</Typography>
      <TextField
        label="OTP"
        fullWidth
        margin="normal"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      {error && <Typography className={styles.error}>{error}</Typography>}
      <Button
        variant="contained"
        fullWidth
        className={styles.primaryBtn}
        onClick={handleVerifyEmailOtp}
      >
        Verify OTP
      </Button>
      <Button
        variant="text"
        fullWidth
        className={styles.textBtn}
        onClick={() => setMode("signup")}
      >
        Back to Signup
      </Button>
    </Box>
  );

  useEffect(() => {
    if (mode === "googleLogin") {
      handleGoogleAuth();
    }
  }, [mode, handleGoogleAuth]);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        className: styles.drawerPaper,
      }}
    >
      <Box className={styles.header}>
        <Typography variant="h4" className={styles.heading}>
          {mode === "login"
            ? "Sign In"
            : mode === "signup"
            ? "Create Account"
            : "Sign In"}
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider className={styles.divider} />
      {/* Step 1: Ask for email before deciding login/signup/google */}
      {!userCheckResult ? (
        <form
          onSubmit={handleEmailSubmit(handleCheckUser)}
          className={styles.form}
        >
          {/* <Typography variant="h5" className={styles.heading}>
            Sign In or Sign Up
          </Typography> */}

          <TextField
            label="Email Address"
            fullWidth
            margin="normal"
            {...registerEmailCheck("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email address",
              },
            })}
            error={!!emailErrors.email}
            helperText={emailErrors.email?.message}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            className={styles.primaryBtn}
            disabled={loadingCheck}
          >
            {loadingCheck ? "Checking..." : "Login"}
          </Button>
        </form>
      ) : (
        <>
          {mode === "login"
            ? renderLogin()
            : mode === "signup"
            ? renderSignup()
            : mode === "googleLogin"
            ? // <Button
              //   variant="outlined"
              //   fullWidth
              //   startIcon={
              //     <img
              //       src="https://www.svgrepo.com/show/355037/google.svg"
              //       alt="Google"
              //       width={20}
              //     />
              //   }
              //   style={{marginTop:"15px"}}
              //   onClick={handleGoogleAuth}
              // >
              //   Continue with Google
              // </Button>
              null
            : renderOtp()}
        </>
      )}

      <Modal
        open={showPhoneModal}
        onClose={(event, reason) => {
          // ❌ Prevent closing on backdrop click or ESC
          if (reason === "backdropClick" || reason === "escapeKeyDown") return;
        }}
        disableEscapeKeyDown
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 3,
            width: 320,
            textAlign: "center",
          }}
          onClick={(e) => e.stopPropagation()} // Prevent accidental backdrop close
        >
          <form
            onSubmit={handleSubmit((data) =>
              handlePhoneSubmit(data.phoneNumber)
            )}
          >
            <TextField
              label="Mobile Number"
              fullWidth
              margin="normal"
              {...register("phoneNumber", {
                required: "Mobile number is required",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Enter a valid 10-digit mobile number",
                },
              })}
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">+91</InputAdornment>
                ),
              }}
            />

            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
              Save & Continue
            </Button>
          </form>
        </Box>
      </Modal>
    </Drawer>
  );
};

export default AuthDrawer;
