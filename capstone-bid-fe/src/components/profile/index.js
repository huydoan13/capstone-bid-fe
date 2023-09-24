import React, { useEffect, useRef, useState } from 'react';
import { Avatar, Box, Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import SyncLockOutlinedIcon from '@mui/icons-material/SyncLockOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import CircularProgress from '@mui/material/CircularProgress';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import axios from 'axios';
import styled from '@emotion/styled';

const ProfilePage = () => {
    const [profileData, setProfileData] = useState({});
    const [passwordMatchError, setPasswordMatchError] = useState(false);
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('loginUser');
    const jsonUser = JSON.parse(user)
    const [open, setOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [error, setError] = useState();
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);
    const oldPasswordRef = useRef('');
    const newPasswordRef = useRef('');
    const reNewPassword = useRef('');
    const reUserName = useRef('');
    const reAddress = useRef('');
    const rePhone = useRef('');
    const rePaypalAccount = useRef('');
    const [maxWidth, setMaxWidth] = React.useState('sm');
    const [isUpdating, setIsUpdating] = useState(false);


    const ChangePasswordApi = `https://bids-online.azurewebsites.net/api/Users/update_password`
    const api = `https://bids-online.azurewebsites.net/api/Users/by_id?id=${jsonUser.Id}`
    const apiUpdateInfo = `https://bids-online.azurewebsites.net/api/Users`
    const apiUpdatePaypal = `https://bids-online.azurewebsites.net/api/UserPaymentInformation`


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



    const handleErrorDialogClose = () => {
        setErrorDialogOpen(false);

    };

    const handleOpenDialog = () => {
        setOpen(true);
        setPasswordError(false);
    };

    const handleCloseDialog = () => {
        setOpen(false);
        // setPasswordError(false);
    };

    const handleOpenSuccessDialog = () => {
        setDialogOpen(true);
    };

    const handleCloseSuccessDialog = () => {
        fetchProfileData();
        setDialogOpen(false);
        // setPasswordError(false);
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


    const handleUpdatePalpay = () => {
        setIsUpdating(true);
        const userId = jsonUser.Id;
        const payPalAccount = rePaypalAccount.current.value;
        console.log(payPalAccount);
        const requestbody = {
            userId, payPalAccount,
        };
        axios
            .put(apiUpdatePaypal, requestbody, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                // Handle the response (success or failure)
                // You can add your logic here, e.g., show a success message
                setDialogMessage("Tài Khoản paypal của bạn đã được cập nhật thành công");
                setDialogOpen(true);
                console.log('PUT request successful:', response);
                setIsUpdating(false);
            })
            .catch((error) => {
                // Set the error message in the state
                setError(error?.response?.data || 'An error occurred.');

                // Open the error dialog
                setErrorDialogOpen(true);
                setIsUpdating(false);
                console.error('Error making PUT request:', error);
            });
    }

    const handleUpdateInfo = () => {
        setIsUpdating(true);
        const userId = jsonUser.Id;
        const userName = reUserName.current.value;
        const address = reAddress.current.value;
        const phone = rePhone.current.value;
        const password = profileData?.password;
        const avatar = profileData?.avatar;
        const requestBody = {
            userId, userName, password, address, phone, avatar
        };
        axios
            .put(apiUpdateInfo, requestBody, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                // Handle the response (success or failure)
                // You can add your logic here, e.g., show a success message
                // handleUpdatePalpay();
                setDialogMessage("Thông tin cá nhân của bạn đã được cập nhật thành công");
                setDialogOpen(true);
                console.log('PUT request successful:', response);
                setIsUpdating(false);
                console.log('PUT request successful:', response);
            })
            .catch((error) => {
                // Set the error message in the state
                setError(error?.response?.data || 'An error occurred.');

                // Open the error dialog
                setErrorDialogOpen(true);
                setIsUpdating(false);
                console.error('Error making PUT request:', error);
            });
    }

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

    useEffect(() => {
        fetchProfileData();
    }, []);

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




    const handleChangePassword = async () => {

        try {
            const oldPasswordValue = oldPasswordRef.current.value;
            const newPasswordValue = newPasswordRef.current.value;
            const reNewPasswordValue = reNewPassword.current.value;

            // Validate that the new password matches the re-entered password
            if (newPasswordValue !== reNewPasswordValue) {
                setPasswordMatchError(true);
                return;
            }

            if (newPasswordValue.length < 8) {
                setPasswordMatchError(false); // Reset the match error
                setPasswordError(true); // Set a new error for password length
                return;
            }
            // Validate the old password before making the API call
            if (oldPasswordValue !== profileData.password) {
                setPasswordError(true);
                return;
            }
            if (!oldPasswordValue || !newPasswordValue || !reNewPasswordValue) {
                // Handle the case where any of the fields are empty
                // You can display an error message or handle it as needed
                // For now, let's just return and do nothing
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
            setError('Không đổi được mật khẩu. Vui lòng thử lại.');
            setErrorDialogOpen(true)
            console.log('Lỗi đổi mật khẩu:', error);
            setDialogOpen(true);
        }
    };


    return profileData && (
        <Product >
            <CardContent>
                <Box display="flex" alignItems="center" justifyContent="center" mb={3}>
                    <Avatar src={profileData.avatar} alt="Avatar" sx={{ width: 150, height: 150, borderRadius: '50%' }} />
                </Box>
                <Grid container spacing={3}>

                    <Grid container spacing={3} sx={{ marginTop: "25px", marginLeft: "2px" }}>
                        <Grid item xs={6}>
                            <TextField inputRef={reUserName}
                                label="Tên Tài Khoản"
                                fullWidth
                                defaultValue={profileData.userName || ''} />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField label="Email" fullWidth value={profileData.email || ''} />
                        </Grid>
                    </Grid>

                    <Grid container spacing={3} sx={{ marginTop: "5px", marginLeft: "2px" }}>
                        <Grid item xs={6}>
                            <TextField label="Role" disabled fullWidth value={profileData.role || ''} />
                        </Grid>

                        <Grid item xs={6}>
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
                    </Grid>


                    <Grid container sx={{marginTop:"25px" , marginLeft:"3%"}}>
                        <Grid xs={8}>
                            <TextField
                                label="Tài Khoản Paypal"
                                fullWidth
                                defaultValue={profileData?.payPalAccount?.[0]?.payPalAccount || ''}
                                inputRef={rePaypalAccount}

                            />

                        </Grid>
                        <Grid xs={4}>
                            <Button
                                onClick={handleUpdatePalpay}
                                sx={{ marginLeft: "5%" , marginTop:"3%"}}
                                variant='contained'
                                color="primary"
                                style={{ width: "150px" }}
                                disabled={isUpdating} // Disable the button when updating
                            >
                                {isUpdating ? <CircularProgress size={24} color="inherit" /> : 'Cập Nhập'}
                            </Button>
                        </Grid>
                    </Grid>


                    <Grid container spacing={3} sx={{ marginTop: "5px", marginLeft: "2px" }}>
                        <Grid item xs={6}>
                            <TextField
                                label="Số Điện Thoại"
                                fullWidth
                                defaultValue={profileData.phone || ''}
                                inputRef={rePhone}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField label="Số CCCD" fullWidth value={profileData.cccdnumber || ''} />
                        </Grid>
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            label="Địa Chỉ"
                            multiline rows={4}
                            fullWidth
                            defaultValue={profileData.address || ''}
                            inputRef={reAddress}
                        />
                    </Grid>
                    <Grid container spacing={3} sx={{ marginTop: "5px", marginLeft: "2px" }}>
                        <Grid item xs={6}>
                            <TextField label="Ngày Sinh" InputLabelProps={{ shrink: true }} type="date" fullWidth value={profileData.dateOfBirth || ''} />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField disabled label="Ngày Tạo" InputLabelProps={{ shrink: true }} type="date" fullWidth value={profileData.createDate || ''} />
                        </Grid>
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
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            onClick={handleUpdateInfo}
                            sx={{ marginLeft: "40%" }}
                            variant='contained'
                            color="primary"
                            style={{ width: "150px" }}
                            disabled={isUpdating} // Disable the button when updating
                        >
                            {isUpdating ? <CircularProgress size={24} color="inherit" /> : 'Cập Nhập'}
                        </Button>
                    </Grid>

                </Grid>
            </CardContent>

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

            <Dialog open={open} onClose={handleCloseDialog}>
                <DialogContent>
                    <DialogTitle align='center' variant='h4'>Thay Đổi Mật Khẩu</DialogTitle>
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
                        error={passwordError || passwordMatchError} // Highlight the field for both errors
                        helperText={
                            passwordError
                                ? 'Mật khẩu phải có ít nhất 8 ký tự'
                                : passwordMatchError
                                    ? 'Mật khẩu không khớp'
                                    : ''
                        }
                    />

                    <TextField
                        label="Nhập lại Mật Khẩu mới"
                        type="password"
                        fullWidth
                        inputRef={reNewPassword}
                        sx={{ marginBottom: '16px' }}
                        error={passwordMatchError} // Highlight the field if there's a match error
                        helperText={passwordMatchError ? 'Mật khẩu không khớp' : ''}
                    />
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleCloseDialog} color="secondary">
                        Thoát
                    </Button>
                    <Button onClick={handleChangePassword} color="primary">
                        Đồng ý
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog fullWidth maxWidth={maxWidth} open={errorDialogOpen} onClose={handleErrorDialogClose}>
                <DialogTitle sx={{ textAlign: 'center' }}>
                    <ErrorOutlineOutlinedIcon style={styles.errorIcon} />
                </DialogTitle>
                <DialogTitle variant='h3' align='center' >Đã có lỗi xảy ra lỗi </DialogTitle>
                <DialogContent>
                    <Typography Typography variant='subtitle2' sx={{ marginBottom: "25px" }} align='center'>
                        {error}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleErrorDialogClose}>OK</Button>
                </DialogActions>
            </Dialog>

        </Product>
    );
};

export default ProfilePage;
