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
    Divider,
    Grid,
    CircularProgress,
} from "@mui/material";
import { useNavigate } from 'react-router-dom';
import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";
import CloseIcon from "@mui/icons-material/Close";
import styled from "@emotion/styled";
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import GavelIcon from '@mui/icons-material/Gavel';
import moment from "moment";
import React, { useEffect, useState } from "react";
import axios from "axios";
import useDialogModal from "../../hooks/useDialogModal";
import { Colors } from "../../style/theme";
import { Product, ProductDetailImage, ProductImage } from "../../style/Products";
import AuctionForm from "../auction";
import AuctionCountdown from "../auction/auctionCountdown";





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

function formatToVND(price) {
    return price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}

const formatCreateDate = (createDate) => {
    return moment(createDate).format('YYYY-MM-DD HH:mm:ss'); // Adjust the format as per your requirement
};

function SlideTransition(props) {
    return <Slide direction="down" {...props} />;
}

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
    marginLeft: '5%',
    maxWidth: '100%',
    lineHeight: 1.5,

}));

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

export default function StageProductDetail({ open, onClose, product }) {
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down("md"));
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [AuctionDetailDialog, showAuctionDetailDialog, closeProductDialog] =
        useDialogModal(AuctionForm);
    const [countdown, setCountdown] = useState(getTimeRemaining(product.beginTime));
    const [selectedImage, setSelectedImage] = useState(
        product.images.length > 0 ? product.images[0].detail : "/assets/images/covers/auction-hammer.jpg"
    );
    const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
    const [feeDialogOpen, setFeeDialogOpen] = useState(false);
    const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState("");
    const [link, setPaymentlink] = useState();
    const [showDescriptions, setShowDescriptions] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('loginUser');
    const jsonUser = JSON.parse(user);
    const isLoggedIn = !!jsonUser && !!jsonUser.Email;
    const [maxWidth, setMaxWidth] = React.useState('sm');
    const [isLoading, setLoading] = useState(false);
    const apiUrl = 'https://bids-online.azurewebsites.net/api/SessionDetails/joinning_in_stage';
    const paymentAPI = `https://bids-online.azurewebsites.net/api/Login/payment_joinning?sessionId=${selectedItem?.sessionId}&payerId=${jsonUser?.Id}&urlSuccess=https://capstone-bid-fe.vercel.app/payment-success&urlFail=https://capstone-bid-fe.vercel.app/payment-fail`
    const navigate = useNavigate();

    useEffect(() => {
        const interval = setInterval(() => {
            setCountdown(getTimeRemaining(product.beginTime));
        }, 1000);

        // Cleanup the interval on unmount
        return () => {
            clearInterval(interval);
        };
    }, [product.beginTime]);

    const SmallImagesWrapper = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
`;


    const closeDialog = () => {
        setFeeDialogOpen(false);
    };


    const closeJonningDialog = () => {

        setSelectedItem(product);
        setFeeDialogOpen(true); // Set the selected item first
        handlePayment();
        setIsErrorDialogOpen(false)
    };

    const joinAuction = () => {
        setLoading(true);
        const requestData = {
            sessionId: product.sessionId,
            userId: jsonUser.Id
        };

        axios.post(apiUrl, requestData, { headers: { Authorization: `Bearer ${token}` } })
            .then(response => {
                // Handle the response from the API if needed.
                // For example, you can show a success message or refresh the page.

                // window.location.href = "/auction"
                setLoading(false);
                const sessionId = product.sessionId;
                navigate(`/auction/${sessionId}`);
            })
            .catch(error => {
                console.error('Error joining the auction:', error);
                if (error.response && error.response.status === 400 && error.response.data) {
                    setIsErrorDialogOpen(true);
                    setDialogMessage(error.response.data);
                    // setIsSuccessDialogOpen(true);
                    setLoading(false);

                } else {
                    setIsErrorDialogOpen(true);
                    setDialogMessage("Đã có lỗi xảy ra");
                    setLoading(false);
                }
            })
        // .Finally(window.location.href = "/auction");
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

    // Function to handle the auction button click
    const handleAuctionButtonClick = (product) => {
        // localStorage.setItem("sessionId", product.sessionId);
        // console.log(product.sessionId)

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
                    sx={{
                        background: Colors.secondary,
                    }}
                >
                    <Box
                        display="flex"
                        alignItems="center"
                        justifyContent={"space-between"}
                    >
                        Chi Tiết Sản Phẩm.
                        <IconButton onClick={onClose}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <ProductDetailWrapper display={"flex"} flexDirection={matches ? "column" : "row"}>

                        <Product sx={{ mr: 2 }}>
                            <ProductDetailImage src={selectedImage} alt={`Product Big`} />
                            <SmallImagesWrapper>
                                {product.images.map((image, index) => (
                                    <ProductDetailImage
                                        key={index}
                                        src={image.detail}
                                        alt={`Product ${index}`}
                                        onClick={() => setSelectedImage(image.detail)}
                                        style={{ width: '80px', height: '80px', marginRight: '8px' }}
                                    />
                                ))}
                            </SmallImagesWrapper>
                        </Product>

                        <ProductDetailInfoWrapper>



                            {/* <Typography>Thời gian đếm ngược bắt đầu trả giá:</Typography>
                            <Typography margin={"1%"} variant="subtitle">
                                {countdown.days}&nbsp; Ngày &nbsp;:&nbsp;  {countdown.hours}&nbsp; Giờ  &nbsp;: &nbsp; {countdown.minutes}&nbsp; Phút  &nbsp;:&nbsp;  {countdown.seconds}&nbsp; Giây
                            </Typography>
                            <Typography>Thời gian đấu giá con lại:</Typography> */}
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                                {product?.endTime && product?.beginTime && (
                                    <AuctionCountdown endTime={product?.endTime} beginTime={product?.beginTime} />
                                )}
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
                                    <Typography margin={'1%'} color={"#696969"} align="left" variant="subtitle">Phí Tham Gia Đấu Giá:  </Typography>
                                    <Typography margin={'1%'} align="right" color={"#B41712"} variant="subtitle"> {formatToVND(
                                        Math.min(
                                            Math.max(product.participationFee * product.firstPrice, 10000),
                                            200000
                                        )
                                    )} </Typography>
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
                                <Button
                                    startIcon={<GavelIcon />}
                                    size="large"
                                    color="primary"
                                    variant="contained"
                                    onClick={() => handleAuctionButtonClick(product)}
                                    disabled={isLoading} // Disable the button when loading
                                >
                                    {isLoading ? <CircularProgress size={24} color="inherit" /> : "Đăng Kí Đấu Giá."}
                                </Button>

                            </Stack>

                            {/* <Box
                                sx={{ mt: 4 }}
                                display="flex"
                                alignItems="center"
                                justifyContent="space-between"
                            >
                                <Button color="primary" variant="contained" onClick={handleAuctionButtonClick}>
                                    Đấu Giá Ngay
                                </Button>
                            </Box> */}
                        </ProductDetailInfoWrapper>
                    </ProductDetailWrapper>
                </DialogContent>
            </Dialog>
            <AuctionDetailDialog product={product} />
            <Dialog fullWidth maxWidth={maxWidth} open={isDialogOpen} onClose={handleDialogClose}>
                <DialogTitle sx={{ textAlign: 'center' }}>
                    <ErrorOutlineOutlinedIcon style={styles.errorIcon} />
                </DialogTitle>
                <DialogTitle variant="h4" align="center">Không Thể Tham Gia Đấu Giá</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Bạn cần đăng nhập trước để tham gia đấu giá.
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
            <Dialog fullWidth maxWidth={maxWidth} open={isSuccessDialogOpen} onClose={() => setIsSuccessDialogOpen(false)}>
                <DialogTitle sx={{ textAlign: 'center' }}>
                    <ErrorOutlineOutlinedIcon style={styles.errorIcon} />
                </DialogTitle>
                <DialogTitle variant="h4" align="center">Thành Công</DialogTitle>
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
            <Dialog fullWidth maxWidth={maxWidth} open={isErrorDialogOpen} onClose={() => setIsErrorDialogOpen(false)}>
                <DialogTitle sx={{ textAlign: 'center' }}>
                    <ErrorOutlineOutlinedIcon style={styles.errorIcon} />
                </DialogTitle>
                <DialogTitle variant="h4" align="center">Thông Báo</DialogTitle>
                <DialogContent>
                    <DialogContentText align="center">
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
                <DialogTitle variant="h5" align="center">Chi tiết đơn hàng</DialogTitle>
                <DialogContent>
                    {selectedItem && (
                        <>
                            <Grid marginTop={"50px"} marginBottom={"50px"} >
                                <Typography sx={{ mt: 1, mb: 1, display: "flex", justifyContent: "space-between" }}>
                                    <Typography margin={'1%'} align="inherit" variant="subtitle1">Phí Tham Gia Đấu Giá</Typography>
                                    <Typography margin={'1%'} align="right" variant="subtitle1">{formatToVND(
                                        Math.min(
                                            Math.max(product.participationFee * product.firstPrice, 10000),
                                            200000
                                        )
                                    )}</Typography>
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
                                            ) + (selectedItem?.depositFee * selectedItem?.firstPrice))}   </Typography>
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
                                    ) + (selectedItem?.depositFee * selectedItem?.firstPrice))}  </Typography>
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