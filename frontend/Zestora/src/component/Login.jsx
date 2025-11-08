import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button, Box, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useLoginMutation } from './redux/services/authApi'; // ✅ RTK Query
import { useDispatch } from 'react-redux';
import { setCredentials } from './redux/slices/authSlice'; // ✅ save token+user

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();

  const onSubmit = async (data) => {
    try {
      const result = await login(data).unwrap();

      if (result.token) {
        // ✅ Save token + user in Redux store
        dispatch(setCredentials(result.token));
        localStorage.setItem('token', result.token);

        // ✅ Redirect after login (role-based if you want)
        navigate('/');
      } else {
        setLoginError('Invalid credentials');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setLoginError('Login failed. Please try again.');
    }
  };

  return (
    <Box 
      display="flex" 
      justifyContent="center" 
      alignItems="center" 
      minHeight="100vh" 
      bgcolor='background.paper'
    >
      <Paper 
        elevation={4} 
        sx={{
          padding: '40px',
          width: '100%',
          maxWidth: '400px',
          borderRadius: '12px',
          textAlign: 'center',
        }}
      >
        <Typography variant="h4" gutterBottom color="primary">
          Welcome Back
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" gutterBottom>
          Please login to continue
        </Typography>
        
        <form onSubmit={handleSubmit(onSubmit)} style={{ marginTop: '20px' }}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            {...register('email', { required: 'Email is required' })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            {...register('password', { required: 'Password is required' })}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          {loginError && (
            <Typography color="error" sx={{ mt: 1 }}>
              {loginError}
            </Typography>
          )}
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            fullWidth 
            sx={{ mt: 3, py: 1.5 }}
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            onClick={() => navigate('/signup')}
            sx={{ mt: 2, py: 1.5 }}
          >
            New User? Sign Up
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Login;
