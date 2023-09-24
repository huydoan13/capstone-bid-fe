import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox, FormControlLabel, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, Button, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
// eslint-disable-next-line camelcase
import jwt_decode from 'jwt-decode';
import axiosInstance from '../../../services/axios-instance';
// components
import Iconify from '../../../components/iconify';
// import AuthContext from '../../../context/RolesAuthRoute';
import './LoginForm.less';


// ----------------------------------------------------------------------

export default function LoginForm() {
  // const { setAuth } = useContext(AuthContext);

  const errorStyle = {
    color: 'red',
  };

  const userRef = useRef();
  const errRef = useRef();
  const reEmail = useRef();
  const [user, setUser] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [open, setOpen] = useState(false);
  const [maxWidth, setMaxWidth] = React.useState('sm');
  const [successMessage, setsuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleErrorDialogClose = () => {
    setErrorDialogOpen(false);

  };

  const handleCloseSuccessDialog = () => {
    setOpen(false);
    setDialogOpen(false);
    // setPasswordError(false);
  };

  // useEffect(() => {
  //     userRef.current.focus();
  // }, [])

  // useEffect(() => {
  //     setErrMsg('');
  // }, [email, password])

  const handleForgetPass = () => {
    const emailValue = reEmail.current.value.trim(); // Remove leading/trailing whitespace
    if (!emailValue) {
      // Display an error message or take appropriate action for empty email
      setError('Địa chỉ Email không được bỏ trống');
      setErrorDialogOpen(true);
      return;
    }
    const api = `https://bids-online.azurewebsites.net/api/Login/reset_password/sdfsdfsdf%40gmail.com?email=${emailValue}`;

    axios
      .put(api)
      .then((response) => {
        // Handle the response (success or failure)
        // You can add your logic here, e.g., show a success message
        setDialogMessage("Mật khẩu mới đã được gửi đến địa chỉ Email của bạn")
        setDialogOpen(true);
        console.log('PUT request successful:', response);

      })
      .catch((error) => {
        // Set the error message in the state
        setError(error?.response?.data || 'An error occurred.');

        // Open the error dialog
        setErrorDialogOpen(true);
        console.error('Error making PUT request:', error);
      });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axiosInstance.post(
        'https://bids-online.azurewebsites.net/api/Login/login',
        JSON.stringify({ email, password }),
        {
          headers: { 'Content-Type': 'application/json' },
          // withCredentials: true,
        }
      );
      console.log(JSON.stringify(response?.data));
      const token = response?.data?.token;
      const decoded = jwt_decode(token);
      localStorage.setItem('token', token);
      localStorage.setItem('loginUser', JSON.stringify(decoded));
      navigate('/dashboard/app', { replace: true });
      const role = response?.data?.role;
      console.log(decoded.role);
      // setAuth({ email, password, role, token });
      setEmail('');
      setPassword('');
      setSuccess(true);
      switch (decoded.Role) {
        case 'Admin':
          return navigate('/dashboard/app', { replace: true });
        case 'User':
          return navigate('/home', { replace: true });
        case 'Staff':
          return navigate('/dashboard/app', { replace: true });
        default:
          return null;
      }
    } catch (err) {
      if (!err?.response) {
        setError('No Server Response');
        setErrorDialogOpen(true);
      } else if (err.response?.status === 400) {
        setError('Địa chỉ email hoặc mặt khẩu không đúng');
        setErrorDialogOpen(true);
        console.log('Wrong Username or Password');
      } else if (err.response?.status === 401) {
        setError('Không có quyền đăng nhập');
        setErrorDialogOpen(true);
        console.log('Unauthorized');
      } else {
        setError('Login Failed');
        setErrorDialogOpen(true);
        console.log('Login Failed');
      }
      errRef.current.focus();
      navigate('/login', { replace: true });
    } finally {
      setLoading(false); // Reset loading state when API call is done
    }
    return null;
  };

  const styles = {
    TaskAltIcon: {
      fontSize: '150px',
      color: '#C3E1AE'
    },
    errorIcon: {
      fontSize: '150px',
      color: '#B5E4EB' // Adjust the size as needed // To center it vertically
    },
  };

  return (
    <>
      <form>
        <Stack spacing={3}>
          <p style={errorStyle} ref={errRef} className={errMsg ? 'errmsg' : 'offscreen'} aria-live="assertive">
            {errMsg}
          </p>
          <TextField required name="email" label="Email" value={email} onChange={handleEmailChange} />

          <TextField
            name="password"
            label="Mật khẩu"
            value={password}
            onChange={handlePasswordChange}
            autoComplete="on"
            required
            type={showPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
          <FormControlLabel required control={<Checkbox />} label="Remember me" />
          <Link onClick={handleClickOpen} variant="subtitle2" underline="hover">
            Quên mật khẩu?
          </Link>
        </Stack>

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          onClick={handleSubmit}
          loading={loading} // Use the loading prop to control the loading state
        >
          Đăng nhập
        </LoadingButton>
      </form>

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth={maxWidth}
      >
        <DialogTitle variant="h4" align='center' >
          Quên mật khẩu ?
        </DialogTitle>
        <DialogContent>
          <TextField
            sx={{ marginTop: "10px" }}
            fullWidth
            label="Địa chỉ Email"
            type="text"
            inputRef={reEmail}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Thoát</Button>
          <Button onClick={handleForgetPass} autoFocus>
            Đồng ý
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog fullWidth maxWidth={maxWidth} open={errorDialogOpen} onClose={handleErrorDialogClose}>
        <DialogTitle sx={{ textAlign: 'center' }}>
          <ErrorOutlineOutlinedIcon style={styles.errorIcon} />
        </DialogTitle>
        <DialogTitle variant='h3' align='center' >Đã có lỗi xảy ra </DialogTitle>
        <DialogContent>
          <Typography Typography variant='subtitle2' sx={{ marginBottom: "25px" }} align='center'>
            {error}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleErrorDialogClose}>OK</Button>
        </DialogActions>
      </Dialog>

      <Dialog fullWidth maxWidth={maxWidth} open={dialogOpen} onClose={handleCloseSuccessDialog}>
        <DialogTitle sx={{ marginTop: '25px', textAlign: 'center', }}> <TaskAltIcon style={styles.TaskAltIcon} /> </DialogTitle>
        <DialogTitle align='center' variant='h4'>Thành Công</DialogTitle>
        <DialogContent>
          <Typography align='center' variant="subtitle2">{dialogMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSuccessDialog} color="primary">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

    </>

  );



  //   // return (
  //   //   <>
  //   //       {success ? (
  //   //           <section>
  //   //               <h1>You are logged in!</h1>
  //   //               <br />
  //   //               <p>
  //   //                   <a href="#">Go to Home</a>
  //   //               </p>
  //   //           </section>
  //   //       ) : (
  //   //         <section>
  //   //               <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
  //   //               <h1>Sign In</h1>
  //   //               <form onSubmit={handleSubmit}>
  //   //                   <label htmlFor="email">Email:

  //   //                   <input
  //   //                       type="text"
  //   //                       id="email"
  //   //                       ref={userRef}
  //   //                       autoComplete="off"
  //   //                       onChange={(e) => setEmail(e.target.value)}
  //   //                       value={email}
  //   //                       required
  //   //                       />
  //   //                   </label>

  //   //                   <label htmlFor="password">Password:

  //   //                   <input
  //   //                       type="password"
  //   //                       id="password"
  //   //                       onChange={(e) => setPassword(e.target.value)}
  //   //                       value={password}
  //   //                       required
  //   //                   />
  //   //                   </label>
  //   //                   <button>Sign In</button>
  //   //               </form>
  //   //               <p>
  //   //                   Need an Account?<br />
  //   //                   <span className="line">
  //   //                       <a href="#">Sign Up</a>
  //   //                   </span>
  //   //               </p>
  //   //           </section>
  //   //       )}
  //     </>
  // )
}
