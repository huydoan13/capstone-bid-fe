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
import styled from "@emotion/styled";

import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import FavoriteIcon from "@mui/icons-material/Favorite";

import { useEffect, useState } from "react";
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

function SlideTransition(props) {
    return <Slide direction="down" {...props} />;
}

const ProductDetailWrapper = styled(Box)(({ theme }) => ({
    display: "flex",
    padding: theme.spacing(1),
    border: ' 1px solid #000000',
    marginTop: '1%',
}));

const ProductDetailInfoWrapper = styled(Box)(() => ({
    width: '100%',
    display: "flex",
    flexDirection: "column",
    marginLeft: '5%',
    maxWidth: 500,
    lineHeight: 1.5,

}));

export default function StageProductDetail({ open, onClose, product }) {
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down("md"));
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [AuctionDetailDialog, showAuctionDetailDialog, closeProductDialog] =
        useDialogModal(AuctionForm);
    const [countdown, setCountdown] = useState(getTimeRemaining(product.beginTime));
    useEffect(() => {
        const interval = setInterval(() => {
            setCountdown(getTimeRemaining(product.beginTime));
        }, 1000);

        // Cleanup the interval on unmount
        return () => {
            clearInterval(interval);
        };
    }, [product.beginTime]);

    const user = localStorage.getItem('loginUser');
    const jsonUser = JSON.parse(user);
    const isLoggedIn = !!jsonUser && !!jsonUser.Email;

    // Function to handle the auction button click
    const handleAuctionButtonClick = () => {
        localStorage.setItem("sessionId", product.sessionId);
        if (isLoggedIn) {
            // If the user is logged in, show the auction details dialog.
            window.location.href = "/auction";
        } else {
            // If the user is not logged in, show the custom dialog.
            setDialogOpen(true);
        }
    };
    const handleDialogClose = () => {
        setDialogOpen(false);
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
                            <ProductDetailImage src={product.image} />
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
                            <Typography margin={'1%'} variant="subtitle">
                                Tên Sản Phẩm : {product.itemName}
                            </Typography>
                            <Typography margin={'1%'} variant="subtitle">Mô tả sản phẩm : {product.description} </Typography>
                            <Typography margin={'1%'} variant="subtitle">Giá khởi Điểm : {formatToVND(product.firstPrice)} </Typography>
                            <Typography margin={'1%'} variant="subtitle">Bước Giá : {formatToVND(product.firstPrice)} </Typography>
                            <Typography margin={'1%'} variant="subtitle">Giá hiện tại : {formatToVND(product.firstPrice)} </Typography>
                            <Typography margin={'1%'} variant="subtitle">Thời gian bắt đầu : {product.beginTime}</Typography>
                            <Typography margin={'1%'} variant="subtitle">Thời gian đấu giá : {product.auctionTime}</Typography>
                            <Typography margin={'1%'} variant="subtitle">Thời gian Kết thúc : {product.endTime}</Typography>

                            <Box
                                sx={{ mt: 4 }}
                                display="flex"
                                alignItems="center"
                                justifyContent="space-between"
                            >
                                <Button color="primary" variant="contained" onClick={handleAuctionButtonClick}>
                                    Đấu Giá Ngay
                                </Button>
                            </Box>
                            <Box
                                display="flex"
                                alignItems="center"
                                sx={{ mt: 4, color: Colors.light }}
                            >
                                <FavoriteIcon sx={{ mr: 2 }} />
                                Add to wishlist
                            </Box>
                            <Box
                                sx={{
                                    mt: 4,
                                    color: Colors.dove_gray,
                                }}
                            >
                                <FacebookIcon />
                                <TwitterIcon sx={{ pl: 2 }} />
                                <InstagramIcon sx={{ pl: 2 }} />
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
        </>
    );
}