import React, { useEffect, useRef, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
} from '@mui/material';
import SyncLockOutlinedIcon from '@mui/icons-material/SyncLockOutlined';
import axios from 'axios';
import styled from '@emotion/styled';
import { getStaffById } from '../../services/staff-actions';

const StaffProfile = () => {
  const [profileData, setProfileData] = useState({});
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('loginUser');
  const jsonUser = JSON.parse(user);
  const [open, setOpen] = useState(false);

  const [passwordError, setPasswordError] = useState(false);

  const [otpDialogOpen, setOtpDialogOpen] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [otpError, setOtpError] = useState(false);
  const [updateRoleMessage, setUpdateRoleMessage] = useState('');

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [dialogOpen2, setDialogOpen2] = useState(false); // Rename the state variable
  const [dialogMessage2, setDialogMessage2] = useState('');
  const oldPasswordRef = useRef('');
  const newPasswordRef = useRef('');
  const otpInputRef = useRef('');

  const ChangePasswordApi = `https://bids-online.azurewebsites.net/api/Users/update_password/${jsonUser.Id}`;
  const api = `https://bids-online.azurewebsites.net/api/Users/by_id?id=${jsonUser.Id}`;
  const confirm = `https://bids-online.azurewebsites.net/api/Users/confirm_email?email=${jsonUser.Email}`;
  const UpdateRoleApi = `https://bids-online.azurewebsites.net/api/Users/update_role_user`;

  const handleOpenOtpDialog = () => {
    handleOtpSubmit();
    setOtpDialogOpen(true);
    setOtpValue('');
    setOtpError(false);
  };

  const handleCloseOtpDialog = () => {
    setOtpDialogOpen(false);
    setOtpValue('');
    setOtpError(false);
  };

  const handleOtpInputChange = (event) => {
    setOtpError(false);
  };

  const Product = styled(Card)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '65%',
    height: '100%',
    margin: 'auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  }));

  const handleOpenDialog = () => {
    setOpen(true);
    setPasswordError(false);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    // setPasswordError(false);
  };

  const handleDialogClose1 = () => {
    setDialogOpen(false);
    setUpdateRoleMessage(''); // If needed to clear the updateRoleMessage state
  };

  const isAuctioneer = profileData.role === 'Auctioneer';

  const formatProfileData = (data) => {
    const formattedDateOfBirth = formatDate(data.dateOfBirth);
    const formattedCreateDate = formatDate(data.createDate);

    return {
      ...data,
      dateOfBirth: formattedDateOfBirth,
      createDate: formattedCreateDate,
    };
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    month = month < 10 ? `0${month}` : month;
    day = day < 10 ? `0${day}` : day;

    return `${year}-${month}-${day}`;
  };
  const handleOtpSubmit = () => {
    axios
      .put(confirm, null, { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => {
        // If the API response has no error, proceed to update the user's role
        setOtpError(false);
        setUpdateRoleMessage('');
        // return handleUpgradeToAuctioneer();
      })
      .catch((error) => {
        setOtpError(true);
        setUpdateRoleMessage('');
      });
  };

  useEffect(() => {
    getStaffById(jsonUser.Id).then((response) => {
      const data = response.data;
      const formattedData = formatProfileData(data);
      setProfileData(formattedData);
    });
  }, []);

//   const handleUpgradeToAuctioneer = async () => {
//     const otpValue = otpInputRef.current.value; // Get the OTP value from the ref

//     try {
//       // Make the PUT request to upgrade the user's role to "Auctioneer"
//       const response = await axios.put(
//         UpdateRoleApi,
//         {
//           email: jsonUser.Email,
//           code: otpValue,
//         },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       if (response.status === 200) {
//         setUpdateRoleMessage('Xác Thực Email Thành Công');
//         fetchProfileData();
//         setOtpError(false);
//       } else {
//         setOtpError(true);
//       }
//     } catch (error) {
//       setOtpError(true);
//     }
//   };

  const handleChangePassword = async () => {
    try {
      const oldPasswordValue = oldPasswordRef.current.value;
      const newPasswordValue = newPasswordRef.current.value;
      // Validate the old password before making the API call
      if (oldPasswordValue !== profileData.password) {
        setPasswordError(true);
        return;
      }

      // Make the PUT request to update the password
      await axios.put(
        ChangePasswordApi,
        { id: jsonUser.Id, newPassword: newPasswordValue, oldPassword: oldPasswordValue },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Close the dialog and clear the form fields after successful password change
      setOpen(false);
      oldPasswordRef.current.value = '';
      newPasswordRef.current.value = '';
      setDialogMessage('Mật khẩu đã thay đổi thành công!');
      setDialogOpen(true);
    } catch (error) {
      setDialogMessage('Không đổi được mật khẩu. Vui lòng thử lại.');
      console.log('Lỗi đổi mật khẩu:', error);
      setDialogOpen(true);
    }
  };

  return (
    <Product>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="center" mb={3}>
          <Avatar src={profileData.avatar} alt="Avatar" sx={{ width: 150, height: 150, borderRadius: '50%' }} />
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField label="Tên Tài Khoản" fullWidth value={profileData.staffName || ''} />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Email" fullWidth value={profileData.email || ''} />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Password"
              type="password"
              fullWidth
              value={profileData.password || ''}
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <InputAdornment position="end">
                    {/* "Đổi mật khẩu" Icon Button */}
                    <IconButton onClick={handleOpenDialog} size="small">
                      <SyncLockOutlinedIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Dialog open={open} onClose={handleCloseDialog}>
            <DialogContent>
              <DialogTitle>Thay Đổi Mật Khẩu</DialogTitle>
              <TextField
                label="Mật Khẩu cũ"
                type="password"
                fullWidth
                inputRef={oldPasswordRef}
                error={passwordError}
                helperText={passwordError ? 'Mật khẩu cũ không đúng' : ''}
                sx={{ marginBottom: '16px' }}
              />
              <TextField
                label="Mật Khẩu mới"
                type="password"
                fullWidth
                inputRef={newPasswordRef}
                sx={{ marginBottom: '16px' }}
              />
            </DialogContent>

            <DialogActions>
              <Button onClick={handleCloseDialog} color="secondary">
                Cancel
              </Button>
              <Button onClick={handleChangePassword} color="primary">
                Save
              </Button>
            </DialogActions>
          </Dialog>

          {/* <Dialog open={dialogOpen} onClose={handleDialogClose}>
                        <DialogContent>
                            <p>{dialogMessage}</p>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleDialogClose} color="primary">
                                Đóng
                            </Button>
                        </DialogActions>
                    </Dialog> */}

          <Grid item xs={12}>
            <TextField label="Địa Chỉ" multiline rows={4} fullWidth value={profileData.address || ''} />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Số Điện Thoại" fullWidth value={profileData.phone || ''} />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Ngày Sinh"
              InputLabelProps={{ shrink: true }}
              type="date"
              fullWidth
              value={profileData.dateOfBirth || ''}
            />
          </Grid>
          {/* <Grid item xs={12}>
            <TextField
              label="Ngày Tạo"
              InputLabelProps={{ shrink: true }}
              type="date"
              fullWidth
              value={profileData.createDate || ''}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Số CCCD" fullWidth value={profileData.cccdnumber || ''} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <img
              src={profileData.cccdfrontImage}
              alt="CCCD Front"
              style={{ width: '100%', height: '250px', border: '1px dashed #ccc', borderRadius: '4px', padding: '4px' }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <img
              src={profileData.cccdbackImage}
              alt="CCCD Back"
              style={{ width: '100%', height: '250px', border: '1px dashed #ccc', borderRadius: '4px', padding: '4px' }}
            />
          </Grid> */}
        </Grid>
      </CardContent>
    </Product>
  );
};

export default StaffProfile;
