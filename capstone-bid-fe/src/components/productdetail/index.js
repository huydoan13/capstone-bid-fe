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
} from "@mui/material";

import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import styled from "@emotion/styled";

import { useEffect, useState } from "react";
import axios from 'axios';
import moment from "moment";
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
}));

const ProductDetailInfoWrapper = styled(Box)(() => ({
    width: '100%',
    display: "flex",
    flexDirection: "column",
    marginLeft: '5%',
    maxWidth: "100%",
    lineHeight: 1.5,

}));

export default function ProductDetail({ open, onClose, product }) {
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down("md"));
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(product?.images[0]?.detail);
    const [startIndex, setStartIndex] = useState(0);
    const Image = "https://images.unsplash.com/photo-1528127269322-539801943592?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDJ8fHxlbnwwfHx8fHw%3D&auto=format&fit=crop&w=500&q=60"
    const [AuctionDetailDialog, showAuctionDetailDialog, closeProductDialog] =
        useDialogModal(AuctionForm);
    const [countdown, setCountdown] = useState(getTimeRemaining(product.beginTime));
    const [showDescriptions, setShowDescriptions] = useState(false);


    const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
    const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState("");
    useEffect(() => {
        const interval = setInterval(() => {
            setCountdown(getTimeRemaining(product.beginTime));
        }, 1000);

        // Cleanup the interval on unmount
        return () => {
            clearInterval(interval);
        };
    }, [product.beginTime]);


    const token = localStorage.getItem('token');
    const user = localStorage.getItem('loginUser');
    const jsonUser = JSON.parse(user);
    const isLoggedIn = !!jsonUser && !!jsonUser.Email;
    const apiUrl = 'https://bids-online.azurewebsites.net/api/SessionDetails/joinning';
    const autoApi = 'https://bids-online.azurewebsites.net/api/Sessions/session_status_to_in_stage';

    const joinAuction = () => {
        const requestData = {
            sessionId: product.sessionId,
            userId: jsonUser.Id
        };

        axios.post(apiUrl, requestData, { headers: { Authorization: `Bearer ${token}` } })
            .then(response => {
                // Handle the response from the API if needed.
                // For example, you can show a success message or refresh the page.
                setIsSuccessDialogOpen(true);
                setDialogMessage("Đăng kí thành công");
            })
            .catch(error => {
                console.error('Error joining the auction:', error);
                if (error.response && error.response.status === 400 && error.response.data) {
                    setIsErrorDialogOpen(true);
                    setDialogMessage(error.response.data);
                } else {
                    setIsErrorDialogOpen(true);
                    setDialogMessage("Đã có lỗi xảy ra");
                }
            });
    };


    const handleImageClick = (image) => {
        setSelectedImage(image);
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
    const handleAuctionButtonClick = () => {
        localStorage.setItem("sessionId", product.sessionId);
        if (isLoggedIn) {
            joinAuction();
        } else {
            // If the user is not logged in, show the custom dialog.
            setDialogOpen(true);
        }
    };
    const handleDialogClose = () => {
        setDialogOpen(false);
    };
    const handleToggleDescriptions = () => {
        setShowDescriptions(!showDescriptions);
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
                            <Typography fontWeight={"bold"}>Thời gian đếm ngược bắt đầu trả giá:</Typography>
                            <Box sx={{ boxShadow: 3 }}>
                                <Typography margin={'5%'}>
                                    <Typography margin={"1%"} variant="subtitle">
                                        {countdown.days}&nbsp; Ngày &nbsp;:&nbsp;  {countdown.hours}&nbsp; Giờ  &nbsp;: &nbsp; {countdown.minutes}&nbsp; Phút  &nbsp;:&nbsp;  {countdown.seconds}&nbsp; Giây
                                    </Typography>
                                </Typography>
                            </Box>


                            <Typography margin={'1%'} variant="subtitle">Mô tả sản phẩm : {product.description} </Typography>
                            <Typography margin={'1%'} variant="subtitle">Giá khởi Điểm : {formatToVND(product.firstPrice)}</Typography>
                            <Typography margin={'1%'} variant="subtitle">Bước Giá : {formatToVND(product.stepPrice)}</Typography>
                            <Typography margin={'1%'} variant="subtitle">Giá hiện tại : {formatToVND(product.finalPrice)}</Typography>
                            <Typography margin={'1%'} variant="subtitle">Thời gian bắt đầu : {formatCreateDate(product.beginTime)}</Typography>
                            <Typography margin={'1%'} variant="subtitle">Thời gian Kết thúc : {formatCreateDate(product.endTime)}</Typography>

                            <Typography
                            margin={"1%"}
                            fontWeight={"bold"}
                            variant="dashed"
                            sx={{ cursor: "pointer" }}
                            onClick={handleToggleDescriptions} // Toggle the visibility on click
                        >
                            Xem thêm <KeyboardArrowDownIcon/>
                        </Typography>
                            <Box
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
                                    {description.description}: {description.detail}<br/>
                                </Typography>
                            ))}
                        </Box>
                        
                            <Box
                                sx={{ mt: 4 }}
                                display="flex"
                                alignItems="center"
                                justifyContent="space-between"
                            >
                                <Button color="primary" variant="contained" onClick={handleAuctionButtonClick}>
                                    Đăng Kí Đấu Giá.
                                </Button>
                            </Box>

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
                        {dialogMessage}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsSuccessDialogOpen(false)} color="primary">
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={isErrorDialogOpen} onClose={() => setIsErrorDialogOpen(false)}>
                <DialogTitle>Lỗi</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {dialogMessage}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsErrorDialogOpen(false)} color="primary">
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}