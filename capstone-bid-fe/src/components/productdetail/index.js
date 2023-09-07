import { useTheme } from "@mui/material/styles";
import {
    useMediaQuery,
    Dialog,
    DialogTitle,
    Slide,
    Box,
    IconButton,
    DialogContent,
    Typography,
    Button,
    Stack,
    Grid,
    Divider,
} from "@mui/material";

import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";
import CloseIcon from "@mui/icons-material/Close";

import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import GavelIcon from '@mui/icons-material/Gavel';
import styled from "@emotion/styled";

import React, { useEffect, useState } from "react";
import axios from 'axios';
import moment from "moment";
import { useNavigate } from "react-router-dom";
import useDialogModal from "../../hooks/useDialogModal";
import { Colors } from "../../style/theme";
import { Product, ProductDetailImage, ProductImage } from "../../style/Products";
import AuctionForm from "../auction";

function getTimeRemaining(endTime) {
    const total = Date.parse(endTime) - Date.now();
    const remainingTime = total > 0 ? total : 0;

    const seconds = Math.floor((remainingTime / 1000) % 60);
    const minutes = Math.floor((remainingTime / 1000 / 60) % 60);
    const hours = Math.floor((remainingTime / (1000 * 60 * 60)) % 24);
    const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));


    return {
        total: remainingTime,
        days,
        hours,
        minutes,
        seconds,
    };
}
function SlideTransition(props) {
    return <Slide direction="down" {...props} />;
}

const formatCreateDate = (createDate) => {
    return moment(createDate).format('YYYY-MM-DD HH:mm:ss'); // Adjust the format as per your requirement
};

const ProductDetailWrapper = styled(Box)(({ theme }) => ({
    display: "flex",
    padding: theme.spacing(1),
    marginTop: '1%',
    [theme.breakpoints.down('md')]: {
        width: '100%',
    }

}));

const ProductDetailInfoWrapper = styled(Box)(() => ({
    width: '100%',
    display: "flex",
    flexDirection: "column",
    maxWidth: "100%",
    lineHeight: 1.5,

}));

export default function ProductDetail({ open, onClose, product }) {
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down("md"));
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(
        product.images.length > 0 ? product.images[0].detail : "/assets/images/covers/auction-hammer.jpg"
      );
    const Image = "https://images.unsplash.com/photo-1528127269322-539801943592?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDJ8fHxlbnwwfHx8fHw%3D&auto=format&fit=crop&w=500&q=60"
    const [AuctionDetailDialog, showAuctionDetailDialog, closeProductDialog] =
        useDialogModal(AuctionForm);
    const [countdown, setCountdown] = useState(getTimeRemaining(product.beginTime));
    const [showDescriptions, setShowDescriptions] = useState(false);
    const [feeDialogOpen, setFeeDialogOpen] = useState(false);
    const [maxWidth, setMaxWidth] = React.useState('sm');
    const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
    const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState("");
    const [successgMessage, setSuccessDialogMessage] = useState("");

    const [selectedItem, setSelectedItem] = useState(null);
    const navigate = useNavigate();

    const token = localStorage.getItem('token');
    const user = localStorage.getItem('loginUser');
    const jsonUser = JSON.parse(user);
    const isLoggedIn = !!jsonUser && !!jsonUser.Email;

    const apiUrl = 'https://bids-online.azurewebsites.net/api/SessionDetails/joinning';
    const autoApi = 'https://bids-online.azurewebsites.net/api/Sessions/session_status_to_in_stage';
    const paymentAPI = `https://bids-online.azurewebsites.net/api/Login/payment_joinning?sessionId=${selectedItem?.sessionId}&payerId=${jsonUser?.Id}&urlSuccess=https://capstone-bid-fe-git-descrip-f85d2b-doannguyenquochuy13-gmailcom.vercel.app/payment-success&urlFail=https://capstone-bid-fe.vercel.app/payment-fail`
    
    const [link, setPaymentlink] = useState();


    const closeDialog = () => {
        setFeeDialogOpen(false);
    };
    useEffect(() => {
        const interval = setInterval(() => {
            setCountdown(getTimeRemaining(product.beginTime));
        }, 1000);

        // Cleanup the interval on unmount
        return () => {
            clearInterval(interval);
        };
    }, [product.beginTime]);

    const closeJonningDialog = () => {

        setSelectedItem(product);
        setFeeDialogOpen(true); // Set the selected item first
        handlePayment();
        setIsErrorDialogOpen(false)
    };
    
    const handleImageClick = (image) => {
        setSelectedImage(image);
    };

    const joinAuction = () => {
        const requestData = {
            sessionId: product.sessionId,
            userId: jsonUser.Id
        };

        axios.post(apiUrl, requestData, { headers: { Authorization: `Bearer ${token}` } })
            .then(response => {
                // Handle the response from the API if needed.
                // For example, you can show a success message or refresh the page.

            })
            .catch(error => {
                console.error('Error joining the auction:', error);
                if (error.response && error.response.status === 400 && error.response.data) {

                    if (error.response.data === "Bạn đã tham gia vào cuộc đấu giá này trước đó, vui lòng kiểm tra lại email để nắm bắt thông tin của cuộc đấu giá.") {
                        setIsSuccessDialogOpen(true)
                        setSuccessDialogMessage(error.response.data)
                    } else {
                        setIsErrorDialogOpen(true);
                        setDialogMessage(error.response.data);
                    }

                } else {
                    setIsErrorDialogOpen(true);
                    setDialogMessage("Đã có lỗi xảy ra");
                }
            });
    };


    const handlePayment = async () => {
        if (selectedItem) {
            try {
                console.log("check")
                console.log(selectedItem?.sessionId)
                const response = await axios.post(paymentAPI, null, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                // Assuming the API response contains the payment link
                const paymentLink = response.data;
                setPaymentlink(paymentLink);
                // Redirect the user to the payment link
                window.location.href = paymentLink;

            } catch (error) {
                console.error('Error processing payment:', error);
                // Handle error, show a message to the user, etc.
            }
        }
    };
    
    useEffect(() => {
        const interval = setInterval(() => {
            setCountdown(getTimeRemaining(product.beginTime));

            // Check if the countdown has reached 0
            if (countdown.total <= 0) {
                // Make the API call when the countdown reaches 0
                axios.put(autoApi, { sessionID: product.sessionId }, { headers: { Authorization: `Bearer ${token}` } },)
                    .then(response => {
                        // Handle the API response if needed.
                        // For example, you can update the state based on the response.
                        // You can also show a success message to the user.
                    })
                    .catch(error => {
                        // Handle errors, such as displaying an error message to the user.
                        console.error('Error making the API call:', error);
                    });

                // Stop the interval after making the API call to prevent further calls
                clearInterval(interval);
            }
        }, 1000);

        // Cleanup the interval on unmount
        return () => {
            clearInterval(interval);
        };
    }, [countdown.total, product.beginTime, product.sessionId]);

    function formatToVND(price) {
        return price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
    }


    // Function to handle the auction button click
    // const handleAuctionButtonClick = () => {
    //     localStorage.setItem("sessionId", product.sessionId);
    //     if (isLoggedIn) {
    //         joinAuction();
    //     } else {
    //         // If the user is not logged in, show the custom dialog.
    //         setDialogOpen(true);
    //     }
    // };

    const openDialog = (product) => {

        localStorage.setItem("sessionId", product.sessionId);
        if (isLoggedIn) {
            joinAuction();
            // Wait for the payment processing
        } else {
            // If the user is not logged in, show the custom dialog.
            setDialogOpen(true);
        }
        // Finally, open the dialog
    };
    const handleDialogClose = () => {
        setDialogOpen(false);
    };
    const handleToggleDescriptions = () => {
        setShowDescriptions((prevState) => !prevState);
    };

    const handleLogin = () => {
        // Redirect to the login page or perform other login actions.
        window.location.href = "/login"; // Replace "/login" with your actual login page URL.
    };
    return (
        <>
            <Dialog
                TransitionComponent={SlideTransition}
                variant="permanant"
                open={open}
                fullScreen
            >
                <DialogTitle
                    sx={{ ml: 5, p: 2, backgroundImage: `url(${Image})`, backgroundSize: 'cover' }}
                >
                    <Box
                        display="flex"
                        alignItems="center"
                        justifyContent={"space-between"}

                    >
                        <Typography fontSize={"25px"} >Tên Sản Phẩm : {product.itemName}</Typography>
                        <IconButton onClick={onClose}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <ProductDetailWrapper display={"flex"} flexDirection={matches ? "column" : "row"}>
                        <Product sx={{ mr: 2 }}>
                            {/* Use the product.image from the API link as the src */}
                            <ProductDetailImage src={selectedImage} />
                            <Box display="flex" justifyContent="flex-start" mt={2}>
                                {/* Render small images on the same row */}
                                {product.images.map((image, index) => (
                                    <Box key={index} sx={{ flex: "0 0 auto" }}>
                                        <button
                                            type="button"
                                            onClick={() => handleImageClick(image.detail)}
                                            onKeyPress={(event) => {
                                                // Add keyboard event listener to handle Enter key press
                                                if (event.key === 'Enter') {
                                                    handleImageClick(image.detail);
                                                }
                                            }}
                                            style={{
                                                background: "none",
                                                border: "none",
                                                cursor: "pointer",
                                                padding: 0,
                                                margin: 5,
                                                width: "100px", // Set the width for small images
                                            }}
                                        >
                                            <img
                                                src={image.detail}
                                                alt=""
                                                style={{
                                                    width: "100%",
                                                    marginBottom: "4px",
                                                    border: selectedImage === image.detail ? "2px solid blue" : "none",
                                                }}
                                            />
                                        </button>
                                    </Box>
                                ))}
                            </Box>
                        </Product>
                        <ProductDetailInfoWrapper>

                            {/* <Typography sx={{ lineHeight: 4 }} variant="h4">
                                Tên Sản Phẩm : {product.itemName}
                            </Typography> */}
                            <Typography margin={"1%"} color={"#696969"}>Thời gian đếm ngược bắt đầu trả giá:</Typography>
                            <Box sx={{ boxShadow: 3 }}>
                                <Typography sx={{ display: "flex", justifyContent: "space-between", margin: "3%" }}>
                                    <Grid container sx={{ textAlign: "center" }}>
                                        <Grid item xs={12}>
                                            <Typography fontSize={"25px"} fontWeight={"bold"} margin={"1%"} variant="subtitle">
                                                {countdown.days}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography margin={"1%"} variant="subtitle">
                                                Ngày
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid container sx={{ textAlign: "center" }}>
                                        <Grid item xs={12}>
                                            <Typography fontSize={"25px"} fontWeight={"bold"} margin={"1%"} variant="subtitle">
                                                {countdown.hours}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography margin={"1%"} variant="subtitle">
                                                Giờ
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid container sx={{ textAlign: "center" }}>
                                        <Grid item xs={12}>
                                            <Typography fontSize={"25px"} fontWeight={"bold"} margin={"1%"} variant="subtitle">
                                                {countdown.minutes}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography margin={"1%"} variant="subtitle">
                                                Phút
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid container sx={{ textAlign: "center" }}>
                                        <Grid item xs={12}>
                                            <Typography fontSize={"25px"} fontWeight={"bold"} margin={"1%"} variant="subtitle">
                                                {countdown.seconds}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography margin={"1%"} variant="subtitle">
                                                Giây
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Typography>
                            </Box>

                            <Stack
                                sx={{
                                    boxShadow: 12,
                                    padding: 2,

                                }}
                            >
                                <Typography sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}>
                                    <Typography margin={'1%'} align="inherit" color={"#696969"} variant="subtitle">Mô tả sản phẩm  </Typography>
                                    <Typography margin={'1%'} align="right" color={"#B41712"} variant="subtitle"> {product.description} </Typography>
                                </Typography>
                                <Typography sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}>
                                    <Typography margin={'1%'} color={"#696969"} align="left" variant="subtitle">Giá khởi Điểm :  </Typography>
                                    <Typography margin={'1%'} align="right" color={"#B41712"} variant="subtitle"> {formatToVND(product.firstPrice)} </Typography>
                                </Typography>
                                <Typography sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}>
                                    <Typography margin={'1%'} color={"#696969"} align="left" variant="subtitle">
                                        Phí Tham Gia Đấu Giá:
                                    </Typography>
                                    <Typography margin={'1%'} align="right" color={"#B41712"} variant="subtitle">
                                        {formatToVND(
                                            Math.min(
                                                Math.max(product.participationFee * product.firstPrice, 10000),
                                                200000
                                            )
                                        )}
                                    </Typography>
                                </Typography>
                                <Typography sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}>
                                    <Typography margin={'1%'} color={"#696969"} align="left" variant="subtitle">Tiền Đặt Cọc:  </Typography>
                                    <Typography margin={'1%'} align="right" color={"#B41712"} variant="subtitle"> {formatToVND(product.depositFee * product.firstPrice)} </Typography>
                                </Typography>
                                <Typography sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}>
                                    <Typography margin={'1%'} color={"#696969"} align="left" variant="subtitle">Bước Giá :  </Typography>
                                    <Typography margin={'1%'} align="right" color={"#B41712"} variant="subtitle"> {formatToVND(product.stepPrice)} </Typography>
                                </Typography>
                                <Typography sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}>
                                    <Typography margin={'1%'} color={"#696969"} align="left" variant="subtitle">Giá hiện tại  </Typography>
                                    <Typography margin={'1%'} align="right" color={"#B41712"} variant="subtitle"> {formatToVND(product.finalPrice)} </Typography>
                                </Typography>
                                <Typography sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}>
                                    <Typography margin={'1%'} color={"#696969"} align="left" variant="subtitle">Thời gian trì hoãn tăng giá :  </Typography>
                                    <Typography margin={'1%'} align="right" color={"#B41712"} variant="subtitle"> {(product.delayTime)} </Typography>
                                </Typography>
                                <Typography sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}>
                                    <Typography margin={'1%'} color={"#696969"} align="left" variant="subtitle">Thay đổi thời gian trì hoãn tăng giá :  </Typography>
                                    <Typography margin={'1%'} align="right" color={"#B41712"} variant="subtitle"> {(product.freeTime)} (Cuối) </Typography>
                                </Typography>
                                <Typography sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}>
                                    <Typography margin={'1%'} color={"#696969"} align="left" variant="subtitle">Thời gian trì hoãn tăng giá đã thay đổi :  </Typography>
                                    <Typography margin={'1%'} align="right" color={"#B41712"} variant="subtitle"> {(product.delayFreeTime)} </Typography>
                                </Typography>
                                <Typography sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}>
                                    <Typography margin={'1%'} color={"#696969"} align="left" variant="subtitle">Thời gian bắt đầu :  </Typography>
                                    <Typography margin={'1%'} align="right" color={"#B41712"} variant="subtitle"> {formatCreateDate(product.beginTime)} </Typography>
                                </Typography>
                                <Typography sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    margin: '1%'
                                }}>
                                    <Typography color={"#696969"} align="left" variant="subtitle">Thời gian Kết thúc :  </Typography>
                                    <Typography align="right" color={"#B41712"} variant="subtitle"> {formatCreateDate(product.endTime)} </Typography>
                                </Typography>
                                {/* <Typography margin={'1%'} variant="subtitle">Giá khởi Điểm : {formatToVND(product.firstPrice)}</Typography>
                                <Typography margin={'1%'} variant="subtitle">Bước Giá : {formatToVND(product.stepPrice)}</Typography>
                                <Typography margin={'1%'} variant="subtitle">Giá hiện tại : {formatToVND(product.finalPrice)}</Typography>
                                <Typography margin={'1%'} variant="subtitle">Thời gian bắt đầu : {formatCreateDate(product.beginTime)}</Typography>
                                <Typography margin={'1%'} variant="subtitle">Thời gian Kết thúc : {formatCreateDate(product.endTime)}</Typography> */}

                                {
                                    product.descriptions.map((description, index) => (
                                        <Typography
                                            key={index}
                                            margin={"1%"}
                                            sx={{
                                                display: showDescriptions ? "flex" : "none", // Show or hide the descriptions based on state
                                                justifyContent: "space-between",
                                            }}
                                        >
                                            <Typography color={"#696969"} variant="subtitle">
                                                {description.description} :
                                            </Typography>
                                            <Typography
                                                color={"#B41712"}
                                                variant="subtitle"
                                                sx={{ marginLeft: "auto" }}
                                            >
                                                {description.detail}
                                            </Typography>
                                        </Typography>
                                    ))
                                }
                                <Typography
                                    margin={"1%"}
                                    fontWeight={"bold"}
                                    variant="dashed"
                                    sx={{ cursor: "pointer", display: "flex", justifyContent: "center", }}
                                    onClick={handleToggleDescriptions} // Toggle the visibility on click
                                >
                                    {showDescriptions ? (
                                        <>
                                            Ẩn bớt <KeyboardArrowUpIcon />
                                        </>
                                    ) : (
                                        <>
                                            Xem thêm <KeyboardArrowDownIcon />
                                        </>
                                    )}
                                </Typography>
                                <Button startIcon={<GavelIcon />} size="large" color="primary" variant="contained" onClick={() => openDialog(product)}>
                                    Đăng Kí Đấu Giá.
                                </Button>
                            </Stack>
                            {/* <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "flex-start",
                                    mt: 2,
                                    flexWrap: "wrap", // Add flex-wrap to handle wrapping descriptions
                                }}
                            >
                                {product.descriptions.map((description, index) => (
                                    <Typography
                                        key={index}
                                        margin={"1%"}
                                        variant="subtitle"
                                        sx={{ display: showDescriptions ? "block" : "none" }} // Show or hide the descriptions based on state
                                    >
                                        {description.description}: {description.detail}<br />
                                    </Typography>
                                ))}
                            </Box> */}

                            {/* <Box
                                sx={{ mt: 4 }}
                                display="flex"
                                alignItems="center"
                                justifyContent="space-between"
                            >
                                <Button color="primary" variant="contained" onClick={handleAuctionButtonClick}>
                                    Đăng Kí Đấu Giá.
                                </Button>
                            </Box> */}

                        </ProductDetailInfoWrapper>
                    </ProductDetailWrapper>

                </DialogContent>
            </Dialog>
            <AuctionDetailDialog product={product} />
            <Dialog open={isDialogOpen} onClose={handleDialogClose}>
                <DialogTitle>Không Thể Tham Gia Đấu Giá</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Bạn cần đăng nhập trước để đăng kí tham gia đấu giá.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="primary">
                        Hủy Bỏ
                    </Button>
                    <Button onClick={handleLogin} color="primary" autoFocus>
                        Đăng Nhập
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={isSuccessDialogOpen} onClose={() => setIsSuccessDialogOpen(false)}>
                <DialogTitle>Thành Công</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {successgMessage}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsSuccessDialogOpen(false)} color="primary">
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={isErrorDialogOpen} onClose={() => setIsErrorDialogOpen(false)}>
                <DialogTitle>Thông Báo</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {dialogMessage}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => closeJonningDialog()} color="primary">
                        OK
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog fullWidth maxWidth={maxWidth} open={feeDialogOpen} onClose={closeDialog}>
                <DialogTitle>Chi tiết đơn hàng</DialogTitle>
                <DialogContent>
                    {selectedItem && (
                        <>
                            <Grid marginTop={"50px"} marginBottom={"50px"} >
                                <Typography sx={{ mt: 1, mb: 1, display: "flex", justifyContent: "space-between" }}>
                                    <Typography margin={'1%'} align="inherit" variant="subtitle1">Phí Tham Gia Đấu Giá</Typography>
                                    <Typography margin={'1%'} align="right" variant="subtitle1">
                                    {formatToVND(
                                            Math.min(
                                                Math.max(product.participationFee * product.firstPrice, 10000),
                                                200000
                                            )
                                        )}
                                        
                                        </Typography>
                                </Typography>
                                <Typography sx={{ mt: 1, mb: 1, display: "flex", justifyContent: "space-between" }}>
                                    <Typography margin={'1%'} align="inherit" variant="subtitle1">Phí Đặt Cọc</Typography>
                                    <Typography margin={'1%'} align="right" variant="subtitle1"> {formatToVND(selectedItem?.depositFee * selectedItem?.firstPrice)}</Typography>
                                </Typography>
                            </Grid>
                            <Divider variant="inset" />
                            <Typography marginTop={"50px"} marginBottom={"50px"}>

                                <Typography sx={{ mt: 1, mb: 1, display: "flex", justifyContent: "space-between" }}>
                                    <Typography margin={'1%'} align="inherit" variant="subtitle1">Tổng phụ</Typography>
                                    <Typography margin={'1%'} align="right" variant="subtitle1">
                                        
                                    {formatToVND(
                                            Math.min(
                                                Math.max(product.participationFee * product.firstPrice, 10000),
                                                200000
                                            ) + (selectedItem?.depositFee * selectedItem?.firstPrice)
                                        )}
                                        
                                         </Typography>
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
                                <Typography margin={'1%'} align="right" variant="h4"> {formatToVND(
                                            Math.min(
                                                Math.max(product.participationFee * product.firstPrice, 10000),
                                                200000
                                            ) + (selectedItem?.depositFee * selectedItem?.firstPrice)
                                        )}   </Typography>
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
        </>
    );
}