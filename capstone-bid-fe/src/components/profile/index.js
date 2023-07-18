import React, { useEffect, useRef, useState } from 'react';
import { Avatar, Box, Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, InputAdornment, TextField } from '@mui/material';
import SyncLockOutlinedIcon from '@mui/icons-material/SyncLockOutlined';
import axios from 'axios';
import styled from '@emotion/styled';

const ProfilePage = () => {
    const [profileData, setProfileData] = useState({});
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('loginUser');
    const jsonUser = JSON.parse(user)
    const [open, setOpen] = useState(false);

    const [passwordError, setPasswordError] = useState(false);


    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const oldPasswordRef = useRef('');
    const newPasswordRef = useRef('');

    const ChangePasswordApi = `https://bids-api-testing.azurewebsites.net/api/Users/update_password/${jsonUser.Id}`
    const api = `https://bids-api-testing.azurewebsites.net/api/Users/${jsonUser.Id}`
    const UpdateRoleApi = `https://bids-api-testing.azurewebsites.net/api/Users/update_role_account/${jsonUser.Id}`


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

    useEffect(() => {
        fetchProfileData();
    }, []);

    const handleOpenDialog = () => {
        setOpen(true);
        setPasswordError(false);
    };

    const handleCloseDialog = () => {
        setOpen(false);
        // setPasswordError(false);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
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

    const fetchProfileData = async () => {
        // try {
        //     const response = await axios.get(api, {headers: { Authorization: `Bearer ${token}` },});
        //     setProfileData(response.data);
        // } catch (error) {
        //     console.log('Error fetching profile data:', error);
        // }

        try {
            const response = await axios.get(api, { headers: { Authorization: `Bearer ${token}` }, });
            const formattedData = formatProfileData(response.data);
            setProfileData(formattedData);
        } catch (error) {
            console.log('Error fetching profile data:', error);
        }
    };

    const handleUpgradeToAuctioneer = async () => {
        try {
            // Make the PUT request to upgrade the user's role to "Auctioneer"
            await axios.put(UpdateRoleApi, null, { headers: { Authorization: `Bearer ${token}` } }
            );

            // After the successful API call, update the profileData to reflect the new role
            // setProfileData((prevData) => ({ ...prevData, role: 'Auctioneer' }));
            setDialogMessage('Đã cập nhật vai trò thành công, vui lòng làm mới trang.!');
            setDialogOpen(true);
        } catch (error) {
            setDialogMessage('Đã sảy ra lỗi, xin vui lòng thử lại!');
            setDialogOpen(true);
        }
    };




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
        <Product >
            <CardContent>
                <Box display="flex" alignItems="center" justifyContent="center" mb={3}>
                    <Avatar src={profileData.avatar} alt="Avatar" sx={{ width: 150, height: 150, borderRadius: '50%' }} />
                </Box>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField label="Tên Tài Khoản" fullWidth value={profileData.userName || ''} />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField label="Email" fullWidth value={profileData.email || ''} />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField label="Role" fullWidth value={profileData.role || ''} />
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

                    <Dialog open={dialogOpen} onClose={handleDialogClose}>
                        <DialogContent>
                            <p>{dialogMessage}</p>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleDialogClose} color="primary">
                                Đóng
                            </Button>
                        </DialogActions>
                    </Dialog>



                    <Grid item xs={12}>
                        <TextField label="Địa Chỉ" multiline rows={4} fullWidth value={profileData.address || ''} />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField label="Số Điện Thoại" fullWidth value={profileData.phone || ''} />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField label="Ngày Sinh" InputLabelProps={{ shrink: true }} type="date" fullWidth value={profileData.dateOfBirth || ''} />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField label="Ngày Tạo" InputLabelProps={{ shrink: true }} type="date" fullWidth value={profileData.createDate || ''} />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField label="Số CCCD" fullWidth value={profileData.cccdNumber || ''} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <img
                            src={profileData.cccdFrontImage}
                            alt="CCCD Front"
                            style={{ width: '100%', height: '250px', border: '1px dashed #ccc', borderRadius: '4px', padding: '4px' }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <img
                            src={profileData.cccdBackImage}
                            alt="CCCD Back"
                            style={{ width: '100%', height: '250px', border: '1px dashed #ccc', borderRadius: '4px', padding: '4px' }}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Box display="flex" alignItems="center" justifyContent="flex-end">
                            <DialogActions>
                                <Grid container spacing={2} justifyContent="center">
                                    <Grid item>
                                        <Button
                                            variant="contained"
                                            color="info"
                                            disabled={isAuctioneer}
                                            style={{ width: '100%', borderRadius: '20px' }}
                                            onClick={handleUpgradeToAuctioneer}
                                        >
                                            Thăng Cấp Thành Người Bán
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        {/* Styled Disabled Button */}
                                        <Button href='/addproduct' color="info" variant="contained" disabled={!isAuctioneer} style={{ width: '100%', borderRadius: '20px' }}>
                                            Thêm Sản Phẩm Đấu giá
                                        </Button>
                                    </Grid>
                                </Grid>
                            </DialogActions>

                            <Dialog open={dialogOpen} onClose={handleDialogClose}>
                                <DialogContent>
                                    <p>{dialogMessage}</p>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleDialogClose} color="primary">
                                        Đóng
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </Box>
                    </Grid>
                </Grid>
            </CardContent>
        </Product>
    );
};

export default ProfilePage;
