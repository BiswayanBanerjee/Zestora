import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  TextField,
  Button,
  Box,
  Typography,
  FormControlLabel,
  Checkbox,
  Paper,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  useSignupMutation,
  useResendOtpMutation,
  useVerifyOtpMutation,
} from '../redux/services/authApi';
import { useAddCustomerMutation } from '../redux/services/customerApi';

const Signup = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [signupError, setSignupError] = useState('');
  const [isRestaurantOwner, setIsRestaurantOwner] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const [addCustomer] = useAddCustomerMutation();

  // ✅ RTK Query hooks
  const [signup] = useSignupMutation();
  const [resendOtp] = useResendOtpMutation();
  const [verifyOtp] = useVerifyOtpMutation();

  useEffect(() => {
    let timer;
    if (isOtpSent && isResendDisabled && countdown > 0) {
      timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    } else if (countdown === 0) {
      setIsResendDisabled(false);
      setCountdown(60);
    }
    return () => clearInterval(timer);
  }, [countdown, isOtpSent, isResendDisabled]);

  const onSubmit = async (data) => {
    try {
      setSignupError('');
      const role = isRestaurantOwner ? 'OWNER' : 'CUSTOMER';

      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        role,
      };

      const response = await signup(payload).unwrap();
      if (response) {
        setUserData({ ...data });
        setEmail(data.email);
        setIsOtpSent(true);
        setIsResendDisabled(true);
        setCountdown(60);
      }
    } catch (error) {
      console.error('Signup error:', error);
      setSignupError('Signup failed. Please try again.');
    }
  };

  const handleResendOtp = async () => {
    try {
      setIsResendDisabled(true);
      setCountdown(60);
      await resendOtp(email).unwrap();
    } catch {
      setSignupError('Failed to resend OTP. Please try again.');
    }
  };

  const handleVerifyOtp = async () => {
  try {
    const response = await verifyOtp({ email, otp }).unwrap();
    if (response && userData) {
      // Instead of axios.post:
      await addCustomer({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
      }).unwrap();

      navigate('/login');
    }
  } catch (error) {
    setSignupError('OTP verification failed. Please try again.');
  }
};

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        pt: 16,
        pb: 16,
        backgroundColor: 'background.paper',
      }}
    >
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Sign Up
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="First Name"
            fullWidth
            margin="normal"
            variant="outlined"
            {...register('firstName', { required: 'First Name is required' })}
            error={Boolean(errors.firstName)}
            helperText={errors.firstName?.message}
          />
          <TextField
            label="Last Name"
            fullWidth
            margin="normal"
            variant="outlined"
            {...register('lastName', { required: 'Last Name is required' })}
            error={Boolean(errors.lastName)}
            helperText={errors.lastName?.message}
          />
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            variant="outlined"
            {...register('email', { required: 'Email is required' })}
            error={Boolean(errors.email)}
            helperText={errors.email?.message}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            variant="outlined"
            {...register('password', { required: 'Password is required' })}
            error={Boolean(errors.password)}
            helperText={errors.password?.message}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={isRestaurantOwner}
                onChange={() => setIsRestaurantOwner(!isRestaurantOwner)}
              />
            }
            label="Register as a restaurant owner?"
          />
          {signupError && (
            <Typography color="error" sx={{ mt: 1 }}>
              {signupError}
            </Typography>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2, py: 1.5 }}
          >
            Sign Up
          </Button>
        </form>

        {isOtpSent && (
          <Box mt={3}>
            <Typography variant="h6">Enter OTP:</Typography>
            <TextField
              label="OTP"
              fullWidth
              margin="normal"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              variant="outlined"
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2, py: 1.5 }}
              onClick={handleVerifyOtp}
            >
              Verify OTP
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              sx={{ mt: 2, py: 1.5 }}
              onClick={handleResendOtp}
              disabled={isResendDisabled}
            >
              Resend OTP {isResendDisabled && `(${countdown}s)`}
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default Signup;
