import React, { useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Divider,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";
import {
  useLoginMutation,
  useSignupMutation,
  useVerifyOtpMutation,
} from "./redux/services/authApi";
import { useAddCustomerMutation } from "./redux/services/customerApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "./redux/slices/authSlice";
import styles from "./AuthDrawer.module.css";

const AuthDrawer = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const [mode, setMode] = useState("login");
  const [error, setError] = useState("");
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [userData, setUserData] = useState(null);

  const [login, { isLoading: loginLoading }] = useLoginMutation();
  const [signup, { isLoading: signupLoading }] = useSignupMutation();
  const [verifyOtp] = useVerifyOtpMutation();
  const [addCustomer] = useAddCustomerMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleLogin = async (data) => {
    try {
      const result = await login(data).unwrap();
      if (result.token) {
        dispatch(setCredentials(result.token));
        localStorage.setItem("token", result.token);
        onClose();
      } else setError("Invalid credentials");
    } catch {
      setError("Login failed. Please try again.");
    }
  };

  const handleSignup = async (data) => {
  try {
    setError("");
    const role = data.isOwner ? "OWNER" : "CUSTOMER";
    const payload = { ...data, role };

    const rawResponse = await signup(payload);

    // RTK Query wraps errors — check .error or .data manually
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
    } else {
      setError("Signup failed. Please try again.");
    }
  } catch (err) {
    console.error("Signup error:", err);
    setError("Signup failed. Please try again.");
  }
};


  const handleVerifyOtp = async () => {
  try {
    setError("");

    // Call verifyOtp API
    const rawResponse = await verifyOtp({ email, otp });

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


  const renderLogin = () => (
    <form className={styles.form} onSubmit={handleSubmit(handleLogin)}>
      <Typography variant="h5" className={styles.heading}>
        Welcome Back 👋
      </Typography>
      <TextField
        label="Email"
        fullWidth
        margin="normal"
        {...register("email", { required: "Email is required" })}
        error={!!errors.email}
        helperText={errors.email?.message}
      />
      <TextField
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        {...register("password", { required: "Password is required" })}
        error={!!errors.password}
        helperText={errors.password?.message}
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
      <Button
        variant="outlined"
        fullWidth
        className={styles.secondaryBtn}
        onClick={() => setMode("signup")}
      >
        New User? Sign Up
      </Button>
    </form>
  );

  const renderSignup = () => (
    <form className={styles.form} onSubmit={handleSubmit(handleSignup)}>
      <Typography variant="h5" className={styles.heading}>
        Create Account ✨
      </Typography>
      <TextField
        label="First Name"
        fullWidth
        margin="normal"
        {...register("firstName", { required: "First Name is required" })}
        error={!!errors.firstName}
        helperText={errors.firstName?.message}
      />
      <TextField
        label="Last Name"
        fullWidth
        margin="normal"
        {...register("lastName", { required: "Last Name is required" })}
        error={!!errors.lastName}
        helperText={errors.lastName?.message}
      />
      <TextField
        label="Email"
        fullWidth
        margin="normal"
        {...register("email", { required: "Email is required" })}
        error={!!errors.email}
        helperText={errors.email?.message}
      />
      <TextField
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        {...register("password", { required: "Password is required" })}
        error={!!errors.password}
        helperText={errors.password?.message}
      />
      <FormControlLabel
        control={<Checkbox {...register("isOwner")} />}
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
      <Button
        variant="outlined"
        fullWidth
        className={styles.secondaryBtn}
        onClick={() => setMode("login")}
      >
        Already have an account? Login
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
        onClick={handleVerifyOtp}
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
        <Typography variant="h6" className={styles.title}>
          {mode === "login"
            ? "Sign In"
            : mode === "signup"
            ? "Sign Up"
            : "Verify OTP"}
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider className={styles.divider} />
      {mode === "login"
        ? renderLogin()
        : mode === "signup"
        ? renderSignup()
        : renderOtp()}
    </Drawer>
  );
};

export default AuthDrawer;
