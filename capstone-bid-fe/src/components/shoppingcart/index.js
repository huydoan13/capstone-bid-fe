import * as React from 'react';
import { useState, useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import Paper from '@mui/material/Paper';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Colors } from '../../style/theme';


const ShoppingCartForm = () => {
    const [items, setItems] = useState([]);
    const user = localStorage.getItem('loginUser');
    const jsonUser = JSON.parse(user);
    const token = localStorage.getItem('token');
    const [dialogOpen, setDialogOpen] = useState(false); // State for dialog visibility
    const [selectedItem, setSelectedItem] = useState(null);
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('md'))
    const [link, setPaymentlink] = useState();
    const [maxWidth, setMaxWidth] = React.useState('sm');
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [successDialogOpen, setSuccessDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // State for loading indicator
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);
    const [error, setError] = useState()

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


    const api = `https://bids-online.azurewebsites.net/api/Sessions/by_user_for_payment?id=${jsonUser.Id}`;
    const rejectPayment = `https://bids-online.azurewebsites.net/api/Sessions/reject_payment`;
    const paymentAPI = `https://bids-online.azurewebsites.net/api/Login/payment_complete?sessionId=${selectedItem?.sessionId}&payerId=${jsonUser?.Id}&urlSuccess=https://capstone-bid-fe.vercel.app/payment-success&urlFail=https://capstone-bid-fe.vercel.app/payment-fail`

    useEffect(() => {
        setIsLoading(true); // Set loading to true before making the request
        axios.get(api, { headers: { Authorization: `Bearer ${token}` } })
            .then(response => {
                setItems(response.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            })
            .finally(() => {
                setIsLoading(false); // Set loading to false when the request is complete
            });
    }, []);

    // console.log(selectedItem?.sessionId);
    // console.log(link)

    const handleOpen = (item) => {
        setSelectedItem(item);
        setOpen(true);

    }

    const handleCloseDialog = () => {

        setOpen(false);

    }

    const handleClose = () => {

        handleRejectPayment();
        setOpen(false);

    }

    const handleSuccessDialogOpen = (item) => {

        setSuccessDialogOpen(true);
    }

    const handleSuccessDialogClose = () => {


        setSuccessDialogOpen(false);
    }


    const handleRejectPayment = async () => {
        setIsLoading(true);
        if (selectedItem) {
            const sessionID = selectedItem?.sessionId;
            console.log(sessionID);
            const requestBody = {
                sessionID,
            };
            try {
                const response = axios.put(rejectPayment, requestBody, { headers: { Authorization: `Bearer ${token}` }, })
                    .then((response) => {
                        // Handle the response (success or failure)
                        // You can add your logic here, e.g., show a success message
                        setIsLoading(false);
                        setSuccessDialogOpen(true);
                        console.log('PUT request successful:', response);

                    })
                    .catch((error) => {
                        // Set the error message in the state
                        setError(error?.response?.data || 'An error occurred.');
                        setIsLoading(false);
                        // Open the error dialog
                        setErrorDialogOpen(true);

                        console.error('Error making PUT request:', error);
                    });

            } catch (error) {
                console.error('Error making PUT request:', error);
            }
        };
    }
    const handlePayment = async () => {
        if (selectedItem) {
            try {
                console.log("check")
                const response = await axios.post(paymentAPI, null, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                // Assuming the API response contains the payment link
                const paymentLink = response.data;
                setPaymentlink(paymentLink);
                // Redirect the user to the payment link
                window.location.href = paymentLink;
                navigate(`/payment-success/${selectedItem.sessionId}`);
            } catch (error) {
                console.error('Error processing payment:', error);
                // Handle error, show a message to the user, etc.
            }
        }
    };

    const handleErrorDialogClose = () => {
        setIsLoading(false);
        setErrorDialogOpen(false);

    };


    const openDialog = async (item) => {
        setSelectedItem(item); // Set the selected item first
        await handlePayment(); // Wait for the payment processing
        setDialogOpen(true); // Finally, open the dialog
    };

    const closeDialog = () => {
        setSelectedItem(null);
        setDialogOpen(false);
    };

    return (
        <>
            {/* {isLoading && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <CircularProgress color="primary" size={60} />
                </div>
            )} */}

            {isLoading && (
                <Dialog fullWidth maxWidth={maxWidth} open={isLoading}>
                    <DialogTitle align='center'>Đang tải</DialogTitle>
                    <DialogContent>
                        {/* You can customize the loading message or add a spinner here */}
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <CircularProgress color="primary" size={60} />
                        </div>
                    </DialogContent>
                </Dialog>
            )}
            <Stack sx={{
                boxShadow: 12,
                padding: 2,
                background: Colors.white,
            }}

                justifyContent={"center"}
                alignItems={"center"}>
                <TableContainer sx={{ width: matches ? '100%' : '60%' }} component={Paper}>
                    <Table sx={{ width: '100%', maxWidth: '100%' }} aria-label="spanning table">
                        <TableHead>
                            <TableRow>
                                {/* Checkbox column */}
                                <TableCell align="center">Hình ảnh</TableCell>
                                <TableCell>Tên Sản Phẩm</TableCell>
                                <TableCell>Thông Tin Sản Phẩm</TableCell>
                                <TableCell align="right">Tổng</TableCell>
                                <TableCell> </TableCell>
                                <TableCell> </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {items.map((item) => (
                                <TableRow key={item.sessionId}>
                                    <TableCell align="center">
                                        {item.images && item.images.length > 0 && (
                                            <img src={item.images[0].detail} alt="Product" style={{ height: '100px', width: '150px' }} />
                                        )}
                                    </TableCell>
                                    <TableCell>{item.itemName}</TableCell>
                                    <TableCell style={{ height: '100px', width: '250px' }}>{item.description}</TableCell>
                                    <TableCell align="right">{item.deposit ? (
                                        (item.finalPrice - item.firstPrice * item.depositFee).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
                                    ) : (
                                        item.finalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
                                    )}</TableCell>
                                    <TableCell>
                                        <Button sx={{ marginBottom: "5px" }} fullWidth variant='contained' onClick={() => openDialog(item)}>
                                            Thanh Toán
                                        </Button>
                                        <Button fullWidth variant='contained' color="error" onClick={() => handleOpen(item)}>
                                            Hủy Thanh Toán
                                        </Button>
                                    </TableCell>

                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Dialog fullWidth maxWidth={maxWidth} open={dialogOpen} onClose={closeDialog}>
                    <DialogTitle align='center' variant='h3'>Chi Tiết Đơn Hàng</DialogTitle>
                    <DialogContent>
                        {selectedItem && (
                            <>
                                <Grid marginTop={"30px"} marginBottom={"30px"} container sx={12}>
                                    <Grid margin={1}>
                                        {selectedItem.images && selectedItem.images.length > 0 && (
                                            <img src={selectedItem.images[0].detail} alt="Product" style={{ height: matches ? "50px" : "100px", width: matches ? "50px" : '100px' }} />
                                        )}
                                    </Grid>
                                    <Grid margin={1}>
                                        <Typography variant='h4'>
                                            {selectedItem.itemName}
                                        </Typography>
                                        <Typography variant='subtitle1'>
                                            {selectedItem.description}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Divider variant="inset" />
                                <Typography marginTop={"50px"} marginBottom={"50px"}>

                                    <Typography sx={{ mt: 1, mb: 1, display: "flex", justifyContent: "space-between" }}>
                                        <Typography margin={'1%'} align="inherit" variant="subtitle1">Tổng phụ</Typography>
                                        <Typography margin={'1%'} align="right" variant="subtitle1"> {selectedItem?.finalPrice?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })} </Typography>
                                    </Typography>
                                    <Typography sx={{ mt: 1, mb: 1, display: "flex", justifyContent: "space-between" }}>
                                        <Typography margin={'1%'} align="inherit" variant="subtitle1">Phí đặt cọc</Typography>
                                        <Typography margin={'1%'} align="right" variant="subtitle1"> {selectedItem?.deposit ? (
                                        (selectedItem.firstPrice * selectedItem.depositFee).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
                                    ) : (
                                        "--"
                                    )}</Typography>
                                    </Typography>
                                    <Typography sx={{ mt: 1, mb: 1, display: "flex", justifyContent: "space-between" }}>
                                        <Typography margin={'1%'} align="inherit" variant="subtitle1">Phí Vận Chuyển</Typography>
                                        <Typography margin={'1%'} align="right" variant="subtitle1"> -- </Typography>
                                    </Typography>
                                    <Typography sx={{ mt: 1, mb: 1, display: "flex", justifyContent: "space-between" }}>
                                        <Typography margin={'1%'} align="inherit" variant="subtitle1">Thuế</Typography>
                                        <Typography margin={'1%'} align="right" variant="subtitle1"> -- </Typography>
                                    </Typography>
                                    <Typography sx={{ mt: 1, mb: 1, display: "flex", justifyContent: "space-between" }}>
                                        <Typography margin={'1%'} color={"#4688F4"} align="inherit" variant="subtitle1">Khuyến Mãi/ Mã Quà Tặng </Typography>
                                    </Typography>
                                </Typography>

                                <Divider variant="inset" />
                                <Typography sx={{ display: "flex", justifyContent: "space-between" }}>
                                    <Typography margin={'1%'} align="inherit" variant="subtitle1">Tổng tiền phải trả</Typography>
                                    <Typography margin={'1%'} align="right" variant="h4"> {selectedItem?.deposit ? (
                                         (selectedItem?.finalPrice - selectedItem?.firstPrice * selectedItem?.depositFee).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
                                    ) : (
                                        (selectedItem?.finalPrice).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
                                    )} </Typography>
                                </Typography>
                            </>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={closeDialog} color="primary">
                            Thoát
                        </Button>
                        <Button onClick={handlePayment} color="primary">
                            Thanh toán bằng PayPal
                        </Button>
                    </DialogActions>
                </Dialog>

            </Stack>

            <Dialog fullWidth maxWidth={maxWidth} open={open} onClose={handleCloseDialog}>
                <DialogTitle sx={{ marginTop: '25px', textAlign: 'center', }}> <ErrorOutlineOutlinedIcon style={styles.errorIcon} /> </DialogTitle>
                <DialogTitle DialogTitle variant='h3' align='center'>Bạn có Đồng ý hủy thanh toán.</DialogTitle>
                <DialogContent>
                    <Typography align='center' variant="subtitle2">Sau khi hủy thanh toán bạn sẽ mất hoàn toàn tiền đã đặt cọc của sản phẩm và bạn có nguy cơ bị khóa tài khoản. </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Thoát</Button>
                    <Button onClick={handleClose}>Đồng ý</Button>
                </DialogActions>
            </Dialog>

            <Dialog fullWidth maxWidth={maxWidth} open={successDialogOpen} onClose={handleSuccessDialogClose}>
                <DialogTitle sx={{ marginTop: '25px', textAlign: 'center', }}> <TaskAltIcon style={styles.TaskAltIcon} /> </DialogTitle>
                <DialogTitle DialogTitle variant='h3' align='center'>Đã hủy thanh toán sản phẩm thành công.</DialogTitle>

                <DialogActions>
                    <Button onClick={handleSuccessDialogClose}>OK</Button>
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
        </>
    );
}


export default ShoppingCartForm
