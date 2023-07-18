import { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox } from '@mui/material';
import { LoadingButton } from '@mui/lab';
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

  const [user, setUser] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  // useEffect(() => {
  //     userRef.current.focus();
  // }, [])

  // useEffect(() => {
  //     setErrMsg('');
  // }, [email, password])

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post(
        'https://bids-api-testing.azurewebsites.net/api/Login/login',
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
          case 'Auctioneer':
            return navigate('/home', { replace: true });
          case 'Staff':
            return navigate('/dashboard/app', { replace: true });
          case 'Bidder':
            return navigate('/home', { replace: true });
          default:
            return null;
      }
    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response');
      } else if (err.response?.status === 400) {
        setErrMsg('Bạn nhập sai email hoặc mật khẩu');
        console.log('Wrong Username or Password');
      } else if (err.response?.status === 401) {
        setErrMsg('Không có quyền đăng nhập');
        console.log('Unauthorized');
      } else {
        setErrMsg('Login Failed');
        console.log('Login Failed');
      }
      errRef.current.focus();
      navigate('/login', { replace: true });
    }
    return null;
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
          <Checkbox name="remember" label="Remember me" />
          <Link variant="subtitle2" underline="hover">
            Quên mật khẩu?
          </Link>
        </Stack>

        <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleSubmit}>
          Đăng nhập
        </LoadingButton>
      </form>
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
