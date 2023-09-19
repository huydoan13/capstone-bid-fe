import * as React from 'react';
import { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, Stack, Typography, useMediaQuery,useTheme } from '@mui/material';
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
    const [link,setPaymentlink] = useState();
    const [maxWidth, setMaxWidth] = React.useState('sm');
    const navigate = useNavigate()

    const api = `https://bids-online.azurewebsites.net/api/Sessions/by_user_for_payment?id=${jsonUser.Id}`;

    const paymentAPI =  `https://bids-online.azurewebsites.net/api/Login/payment_complete?sessionId=${selectedItem?.sessionId}&payerId=${jsonUser?.Id}&urlSuccess=https://capstone-bid-fe.vercel.app/payment-success&urlFail=https://capstone-bid-fe.vercel.app/payment-fail`
    useEffect(() => {
        axios.get(api, { headers: { Authorization: `Bearer ${token}` } })
            .then(response => {
                setItems(response.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    console.log(selectedItem?.sessionId);
    console.log(link)
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
        <Stack sx={{
            boxShadow: 12,
            padding: 2,
            background: Colors.white,
        }}

            justifyContent={"center"}
            alignItems={"center"}>
            <TableContainer sx={{ width: matches? '100%':'60%'}} component={Paper}>
                <Table sx={{ maxWidth: '100%' }} aria-label="spanning table">
                    <TableHead>
                        <TableRow>
                            {/* Checkbox column */}
                            <TableCell align="center">Hình ảnh</TableCell>
                            <TableCell>Tên Sản Phẩm</TableCell>
                            <TableCell>Thông Tin Sản Phẩm</TableCell>
                            <TableCell align="right">Tổng</TableCell>
                            <TableCell> </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items.map((item) => (
                            <TableRow key={item.sessionId}>
                                <TableCell align="center">
                                    {item.images && item.images.length > 0 && (
                                        <img src={item.images[0].detail} alt="Product" style={{ height: '100px', width: '200px' }} />
                                    )}
                                </TableCell>
                                <TableCell>{item.itemName}</TableCell>
                                <TableCell>{item.description}</TableCell>
                                <TableCell align="right">{item.finalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</TableCell>
                                <TableCell>
                                    <Button fullWidth variant='contained' onClick={() => openDialog(item)}>
                                        Thanh Toán
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
                                        <img src={selectedItem.images[0].detail} alt="Product" style={{ height:matches ?"50px" : "100px", width: matches ?"50px" : '100px' }} />
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
                                <Typography margin={'1%'} align="right" variant="h4"> {selectedItem?.finalPrice?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })} </Typography>
                            </Typography>
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog} color="primary">
                        Thoát
                    </Button>
                    <Button onClick={handlePayment}  color="primary">
                        Thanh toán bằng PayPal
                    </Button>
                </DialogActions>
            </Dialog>

        </Stack>
    );
}


export default ShoppingCartForm
