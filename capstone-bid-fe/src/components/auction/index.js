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
    TableRow,
    TableCell,
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableBody,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { Colors } from "../../style/theme";
import { Product, ProductDetailImage, ProductImage } from "../../style/Products";



function getTimeRemaining(auctionTime) {
    const currentTime = new Date();

    // Parse the auctionTime string to extract hours, minutes, seconds, ticks, and milliseconds
    const [hours, minutes, seconds, ticks, milliseconds] = auctionTime.split(/[.:]/).map(Number);

    const auctionDateTime = new Date();
    auctionDateTime.setHours(hours);
    auctionDateTime.setMinutes(minutes);
    auctionDateTime.setSeconds(seconds);
    auctionDateTime.setMilliseconds(milliseconds + ticks / 10); // Adding ticks as 0.1 milliseconds

    const total = auctionDateTime - currentTime;
    const remainingTime = total > 0 ? total : 0;

    const secondsRemaining = Math.floor(remainingTime / 1000);
    const days = Math.floor(secondsRemaining / (3600 * 24));
    const hoursRemaining = Math.floor((secondsRemaining % (3600 * 24)) / 3600);
    const minutesRemaining = Math.floor((secondsRemaining % 3600) / 60);
    const secondsLeft = secondsRemaining % 60;

    return {
        total: remainingTime,
        days,
        hours: hoursRemaining,
        minutes: minutesRemaining,
        seconds: secondsLeft,
    };
}

function SlideTransition(props) {
    return <Slide direction="down" {...props} />;
}

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
    maxWidth: 500,
    lineHeight: 1.5,

}));


const CountdownWrapper = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: theme.spacing(2),
}));


export default function AuctionForm({ open, onClose, product }) {
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down("md"));

    const [isTimerStarted, setIsTimerStarted] = useState(false);
    const [countdown, setCountdown] = useState(getTimeRemaining(product.auctionTime));
    const [hasStarted, setHasStarted] = useState(false);
    const  initialDelay = 0;

    useEffect(() => {
        const currentTime = new Date();
        const beginTime = new Date(product.beginTime);

        if (currentTime >= beginTime) {
            setIsTimerStarted(true);
        } else {
            setIsTimerStarted(false);
            setCountdown(getTimeRemaining(product.auctionTime));
        }

        if (!hasStarted) {
            setTimeout(() => {
                setHasStarted(true);
            }, initialDelay);
        }
    }, [hasStarted, product.beginTime, product.auctionTime, product]);

    useEffect(() => {
        let interval;

        const updateCountdown = () => {
            setCountdown(getTimeRemaining(product.auctionTime));
        };

        if (isTimerStarted) {
            interval = setInterval(() => {
                setCountdown(getTimeRemaining(product.auctionTime));
            }, 1000);
        }



        // Cleanup the interval on unmount
        return () => {
            clearInterval(interval);
        };
    }, [isTimerStarted, product.auctionTime]);



    return (
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
                    justifyContent="space-between"
                >
                    Đấu giá - Sản Phẩm
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent>
                <ProductDetailWrapper
                    display="flex"
                    flexDirection={matches ? "column" : "row"}
                >
                    <Product sx={{ mr: 2 }}>
                        <ProductDetailImage src={product.image} />
                    </Product>
                    <ProductDetailInfoWrapper>

                        {/* Timer Countdown */}
                        <CountdownWrapper>
                            <Typography variant="subtitle1" gutterBottom>
                                Thời gian còn lại:
                            </Typography>
                            {hasStarted ? (
                                <Typography variant="h6">
                                    {countdown.hours} Giờ : {countdown.minutes} Phút : {countdown.seconds} Giây
                                </Typography>
                            ) : (
                                <Typography variant="h6">
                                    {product.auctionTime}
                                </Typography>
                            )}
                        </CountdownWrapper>

                        {/* Auction Details in Table */}
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Thông tin</TableCell>
                                        <TableCell>Giá trị</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>Tên Sản Phẩm:</TableCell>
                                        <TableCell>{product.itemName} </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Giá khởi Điểm:</TableCell>
                                        <TableCell>{product.finalPrice} VND</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Bước Giá:</TableCell>
                                        <TableCell>{product.finalPrice} VND</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Giá hiện tại:</TableCell>
                                        <TableCell>{product.finalPrice} VND</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Thời gian bắt đầu:</TableCell>
                                        <TableCell>{product.beginTime}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Thời gian đấu giá:</TableCell>
                                        <TableCell>{product.auctionTime}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Thời gian Kết thúc:</TableCell>
                                        <TableCell>{product.endTime}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Box
                            sx={{ mt: 4 }}
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                        >
                            <Button color="primary" variant="contained">
                                Đấu Giá Ngay
                            </Button>
                        </Box>
                    </ProductDetailInfoWrapper>
                </ProductDetailWrapper>
            </DialogContent>
        </Dialog>
    );
}