import React, { createContext, useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTheme } from "@mui/material/styles";
import axios from 'axios';
import moment from 'moment';
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import GavelIcon from '@mui/icons-material/Gavel';
import {
  Container,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Typography,
  Button,
  Box,
  useMediaQuery,
  DialogContent,
  Dialog,
  DialogTitle,
  DialogActions,
  TextField,
  Stack,
  DialogContentText,
  Divider,
  CircularProgress
} from '@mui/material';
import styled from '@emotion/styled';
import AuctionCountdown from './auctionCountdown';
import { Colors } from "../../style/theme";
import { Product, ProductDetailImage, ProductImage } from "../../style/Products";
import Scrollbar from '../scrollbar/Scrollbar';
import startConnection from './signalr';
import { Notify } from './sampleSignalr';

const BidDialogContext = createContext();

const useBidDialog = () => {
  return useContext(BidDialogContext);
};

const AuctionForm = () => {
  const [auctionData, setAuctionData] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [isCountdownRunning, setIsCountdownRunning] = useState(true);
  const [isAuctionOver, setIsAuctionOver] = useState(false);
  const [currentDelayTime, setCurrentDelayTime] = useState(() => {
    const storedDelayTime = localStorage.getItem('currentDelayTime');
    return storedDelayTime || null; // Set to null initially to fetch from API later
  });
  const [selectedThumbnailIndex, setSelectedThumbnailIndex] = useState(0);
  const [currentBigImage, setCurrentBigImage] = useState(null);
  const theme = useTheme();
  const currentTime = moment();
  const [isWinner, setIsWinner] = useState(false);
  const [winnerData, setWinnerData] = useState(null);
  const [isIntervalActive, setIsIntervalActive] = useState(true);
  const matches = useMediaQuery(theme.breakpoints.down("md"));
  const token = localStorage.getItem('token');
  // const sessionId = localStorage.getItem('sessionId');
  const { sessionId } = useParams();
  const user = localStorage.getItem('loginUser');
  const jsonUser = JSON.parse(user);
  const [sessionDetails, setSessionDetails] = useState([]);
  const [showDescriptions, setShowDescriptions] = useState(false);
  const [shouldResetCountdown, setShouldResetCountdown] = useState(false);

  const [connection, setConnection] = useState(null);
  const [inputText, setInputText] = useState("");
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [feeDialogOpen, setFeeDialogOpen] = useState(false);
  const [link, setPaymentlink] = useState();
  const [maxWidth, setMaxWidth] = React.useState('xs');
  const [hasServerResponse, setHasServerResponse] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const api = `https://bids-online.azurewebsites.net/api/Sessions/by_id?id=${sessionId}`
  const IncreaseApi = `https://bids-online.azurewebsites.net/api/SessionDetails/increase_price`
  const NotPayApi = `https://bids-online.azurewebsites.net/api/Sessions/session_status_to_haven't_pay`
  const sessionDetailAPI = `https://bids-online.azurewebsites.net/api/SessionDetails/by_session?id=${sessionId}`
  const paymentAPI = `https://bids-online.azurewebsites.net/api/Login/payment_joinning?sessionId=${sessionId}&payerId=${jsonUser?.Id}&urlSuccess=https://capstone-bid-fe.vercel.app/payment-success&urlhttps://capstone-bid-fe.vercel.app/payment-fail`

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     fetchAuctionData();
  //     fetchSessionDetails();
  //   }, 5000);

  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, []);

  useEffect(() => {
    fetchSessionDetails();
    fetchAuctionData();
  }, []);

  useEffect(() => {
    localStorage.setItem('currentDelayTime', currentDelayTime);
  }, [currentDelayTime]);

  // useEffect(() => {
  //   const connection = startConnection((data) => {
  //     setAuctionData(data);
  //   });

  //   // Fetch initial data
  //   fetchAuctionData();
  //   fetchSessionDetails();

  //   return () => {
  //     connection.stop();
  //   };
  // }, []);


  // Real time

  useEffect(() => {
    const connect = new HubConnectionBuilder()
      .withUrl("https://bids-online.azurewebsites.net/sessiondetailhub")
      .withAutomaticReconnect()
      .build();

    setConnection(connect);
  }, []);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          connection.on("ReceiveMessage", (message) => {
            fetchAuctionData();
            fetchSessionDetails();
          });
        })
        .catch((error) => console.log(error));
    }
  }, [connection]);

  const sendMessage = async () => {
    if (connection) await connection.send("SendMessage", inputText);
    setInputText("");
  };

  // end realtime

  const closeDialog = () => {
    setFeeDialogOpen(false);
  };

  const closeJonningDialog = () => {

    setFeeDialogOpen(true); // Set the selected item first
    // handlePayment();
    setIsErrorDialogOpen(false)
  };

  function formatToVND(price) {
    return price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
  }

  const handlePayment = async () => {

    try {
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

  };

  const fetchSessionDetails = async () => {
    try {
      const response = await axios.get(sessionDetailAPI, { headers: { Authorization: `Bearer ${token}` } });
      setSessionDetails(response.data);
    } catch (error) {
      console.error('Error fetching session details:', error);
    }
  };


  const fetchAuctionData = async () => {
    try {
      const response = await axios.get(api, { headers: { Authorization: `Bearer ${token}` } });
      setAuctionData(response.data);

      if (response.data.length > 0) {
        const remainingTime = moment(response.data[0]?.endTime, "YYYY-MM-DD HH:mm:ss").diff(moment(), 'seconds');

        if (remainingTime <= convertTimeToSeconds(response.data[0]?.freeTime)) {
          setCurrentDelayTime(response.data[0]?.delayFreeTime);
        } else {
          setCurrentDelayTime(response.data[0]?.delayTime);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const makeApiCall = async () => {
    try {
      const response = await axios.post(IncreaseApi, { userId: jsonUser.Id, sessionId }, { headers: { Authorization: `Bearer ${token}` } });
      // The price update via setInterval will automatically reflect here
    } catch (error) {
      if (error.response && error.response.status === 400 && error.response.data) {


        setIsErrorDialogOpen(true);
        setDialogMessage(error.response.data);


      } else {
        setIsErrorDialogOpen(true);
        setDialogMessage("Đã có lỗi xảy ra");
      }
    }
  };

  const handleGoBack = async () => {
    try {
      setIsLoading(true);
      const response = await axios.put(NotPayApi, { sessionID: sessionId }, { headers: { Authorization: `Bearer ${token}` } });
      console.log("API response:", response.data);

      // Check if the user is the winner based on the API response
      const winnerEmail = response.data[0]?.winner?.toLowerCase(); // Convert to lowercase
      console.log(winnerEmail);
      const userEmail = jsonUser.Email.toLowerCase(); // Convert to lowercase
      if (winnerEmail === userEmail) {
        setIsWinner(true);
      } else {
        setIsWinner(false);
      }
      setIsLoading(false);
      setWinnerData(response.data); // Store the winner data from the API response

      // Set the flag to indicate that the server response has been received
      setHasServerResponse(true);

    } catch (error) {
      setIsLoading(false);
      console.error('Error updating session status:', error);
      // Handle error if needed
    }
  };

  const handleToggleDescriptions = () => {
    setShowDescriptions((prevState) => !prevState);
  };
  const formatCreateDate = (createDate) => {
    return moment(createDate).format('YYYY-MM-DD HH:mm:ss'); // Adjust the format as per your requirement
  };

  const convertTimeToSeconds = (timeString) => {
    const [hours, minutes, seconds] = timeString.split(":").map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  };

  const RemainingTime = ({ endTime }) => {
    const [time, setTime] = useState(() => {
      const storedTime = localStorage.getItem('countdownTime');
      return storedTime ? Math.max(0, parseInt(storedTime, 10)) : convertTimeToSeconds(currentDelayTime);
    });

    useEffect(() => {
      const interval = setInterval(() => {
        setTime(prevTime => {
          if (prevTime > 0) {
            const updatedTime = prevTime - 1;
            localStorage.setItem('countdownTime', updatedTime.toString());
            return updatedTime;
          }

          const fiveMinutesBeforeEndTime = convertTimeToSeconds(moment(auctionData[0]?.endTime, "YYYY-MM-DD HH:mm:ss").subtract(convertTimeToSeconds(auctionData[0]?.freeTime), 'seconds').format("HH:mm:ss"));

          if (prevTime <= 0 && fiveMinutesBeforeEndTime <= 0) {

            // window.localStorage.removeItem('currentDelayTime');
            // window.localStorage.removeItem('countdownTime');
            const delayFreeTime = auctionData[0]?.delayFreeTime;
            if (delayFreeTime) {
              setCurrentDelayTime(delayFreeTime);
              localStorage.setItem('currentDelayTime', delayFreeTime);
              setShouldResetCountdown(true); // Set the flag to indicate countdown reset
              return convertTimeToSeconds(delayFreeTime);
            }
          }

          setIsCountdownRunning(false);
          return 0;
        });
      }, 1000);

      return () => clearInterval(interval);
    }, [endTime, auctionData, shouldResetCountdown]);

    useEffect(() => {
      const remainingTime = moment(auctionData[0]?.endTime, "YYYY-MM-DD HH:mm:ss").diff(moment(), 'seconds');
      if (remainingTime <= 0) {
        setIsAuctionOver(true);
        setIsCountdownRunning(false);
      }
    }, [auctionData]);

    const formatTime = (seconds) => {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const remainingSeconds = seconds % 60;
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };




    return (

      <Grid container margin={"1%"} sx={{ justifyContent: 'center' }}>
        <Grid item>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="h6" component="span" sx={{ mr: 1 }}>
              {formatTime(time)}
            </Typography>
          </Box>
        </Grid>
        <Grid item>
          <Button
            color="primary"
            variant="contained"
            fullWidth
            onClick={() => {
              setIsDialogOpen(true);
              setCurrentPrice(auctionData[0]?.finalPrice);
            }}
            // Disable the button if the current time is after the auction end time
            disabled={isCountdownRunning || moment(auctionData[0]?.endTime, "YYYY-MM-DD HH:mm:ss").isBefore(currentTime)}
          >
            Tăng Giá : {formatToVND(auctionData[0]?.finalPrice + auctionData[0]?.stepPrice)}
          </Button>
        </Grid>
      </Grid>

    );
  };

  const ProductDetailWrapper = styled(Box)(({ theme }) => ({
    display: "flex",
    width: '100%',
    height: '100%',
    padding: theme.spacing(1),
    border: '1px dashed #000000',
    marginTop: '1%',
    borderRadius: '5px',
    [theme.breakpoints.down('md')]: {
      width: '100%',
    }
  }));

  const ProductDetailInfoWrapper = styled(Box)(() => ({
    width: '100%',
    display: "flex",
    flexDirection: "column",
    maxWidth: '100%',
    lineHeight: 1.5,
    [theme.breakpoints.down('md')]: {
      width: '100%',
    }

  }));


  useEffect(() => {
    const checkAuctionEnd = () => {
      if (auctionData && auctionData[0]) { // Check if auctionData is not null and has at least one element
        const currentTime = moment();
        const auctionEndTime = moment(auctionData[0]?.endTime, "YYYY-MM-DD HH:mm:ss");
        if (auctionEndTime.isBefore(currentTime)) {
          handleGoBack(); // Call the API to update the session status and check if the user is the winner
          setIsIntervalActive(false); // Disable the interval once the auction ends
        }
      }
    };

    let interval = null;

    if (isIntervalActive) {
      interval = setInterval(() => {
        // fetchAuctionData();
        // fetchSessionDetails();
        checkAuctionEnd();
      }, 5000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isIntervalActive, auctionData]);

  const handleDialogClose = async () => {
    await makeApiCall();
    sendMessage();
    // fetchAuctionData();
    // fetchSessionDetails();
    setIsDialogOpen(false);
    setIsCountdownRunning(true);

    if (currentDelayTime) {
      localStorage.setItem('countdownTime', convertTimeToSeconds(currentDelayTime).toString());
    }

    setShouldResetCountdown(false); // Reset the flag after countdown reset
  };

  if (!auctionData) {
    return <Typography>Trang này hiện giờ không khả dụng</Typography>;
  }


  const ProductDetailImageContainer = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
  });

  const ProductDetailImage1 = styled('img')(({ theme }) => ({
    width: '650px',
    height: '500px',
    background: Colors.light_gray,
    padding: '10px',
    [theme.breakpoints.down('md')]: {
      width: '80%',
      height: '80%',
      padding: '25px',
    },
  }));

  const ProductDetailThumbnail = styled('img')(({ theme }) => ({
    width: '100px',
    height: '80px',
    objectFit: 'cover',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'transform 0.3s ease-in-out',
    '&:hover': {
      transform: 'scale(1.1)',
    },
    [theme.breakpoints.down('md')]: {
      width: '80px',
      height: '60px',
    },
  }));

  const renderProductImages = () => {
    if (!auctionData || !auctionData[0] || !auctionData[0].images || auctionData[0].images.length === 0) {
      // Render the default image when there are no product images
      return (
        <ProductDetailImageContainer>
          <ProductDetailImage1 src="/assets/images/covers/auction-hammer.jpg" />
        </ProductDetailImageContainer>
      );
    }

    // Use the selected thumbnail index or default to 0 (first image) if not selected
    const selectedThumbnailIndex = currentBigImage
      ? auctionData[0]?.images.findIndex((image) => image.detail === currentBigImage)
      : 0;

    const bigImage = currentBigImage || auctionData[0]?.images?.[selectedThumbnailIndex]?.detail;
    const thumbnailImages = auctionData[0]?.images || [];

    return (
      <ProductDetailImageContainer>
        <ProductDetailImage1 src={bigImage} />
        <Box sx={{ display: 'flex', gap: '5px' }}>
          {thumbnailImages.map((image, index) => (
            <ProductDetailThumbnail
              key={index}
              src={image.detail}
              onClick={() => setCurrentBigImage(image.detail)} // Set the clicked image as the current big image
            />
          ))}
        </Box>
      </ProductDetailImageContainer>
    );
  };


  const BidDialog = () => {
    const { isDialogOpen, setIsDialogOpen, currentPrice, setCurrentPrice } = useBidDialog();

    return (
      <Dialog Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>Bạn Có Muốn Tăng Giá</DialogTitle>
        <DialogContent>
          <Typography>Giá của sản phẩm hiện giờ là : {formatToVND(auctionData[0]?.finalPrice)}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)} color="primary">
            Thoát
          </Button>
          <Button onClick={handleDialogClose} color="primary">
            Đồng Ý
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <>
      {/* <Notify/> */}
      <ProductDetailWrapper display={"flex"} flexDirection={matches ? "column" : "row"}>
        <Product sx={{ mr: 2 }}>
          {renderProductImages()}
        </Product>

        <ProductDetailInfoWrapper>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            {auctionData[0]?.endTime && auctionData[0]?.beginTime && (
              <AuctionCountdown endTime={auctionData[0]?.endTime} beginTime={auctionData[0]?.beginTime} />
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
              <Typography margin={'1%'} align="right" color={"#B41712"} variant="subtitle"> {auctionData[0]?.description} </Typography>
            </Typography>
            <Typography sx={{
              display: "flex",
              justifyContent: "space-between",
            }}>
              <Typography margin={'1%'} color={"#696969"} align="left" variant="subtitle">Giá khởi Điểm :  </Typography>
              <Typography margin={'1%'} align="right" color={"#B41712"} variant="subtitle"> {formatToVND(auctionData[0]?.firstPrice)} </Typography>
            </Typography>
            <Typography sx={{
              display: "flex",
              justifyContent: "space-between",
            }}>
              <Typography margin={'1%'} color={"#696969"} align="left" variant="subtitle">Phí Tham Gia Đấu Giá:  </Typography>
              <Typography margin={'1%'} align="right" color={"#B41712"} variant="subtitle">
                {formatToVND(
                  Math.min(
                    Math.max(auctionData[0]?.participationFee * auctionData[0]?.firstPrice, 10000),
                    200000
                  )
                )}
                {/* {formatToVND(auctionData[0]?.participationFee * auctionData[0]?.firstPrice)} */}
              </Typography>
            </Typography>
            <Typography sx={{
              display: "flex",
              justifyContent: "space-between",
            }}>
              <Typography margin={'1%'} color={"#696969"} align="left" variant="subtitle">Tiền Đặt Cọc:  </Typography>
              <Typography margin={'1%'} align="right" color={"#B41712"} variant="subtitle"> {formatToVND(auctionData[0]?.depositFee * auctionData[0]?.firstPrice)} </Typography>
            </Typography>
            <Typography sx={{
              display: "flex",
              justifyContent: "space-between",
            }}>
              <Typography margin={'1%'} color={"#696969"} align="left" variant="subtitle">Bước Giá :  </Typography>
              <Typography margin={'1%'} align="right" color={"#B41712"} variant="subtitle"> {formatToVND(auctionData[0]?.stepPrice)} </Typography>
            </Typography>
            <Typography sx={{
              display: "flex",
              justifyContent: "space-between",
            }}>
              <Typography margin={'1%'} color={"#696969"} align="left" variant="subtitle">Giá hiện tại  </Typography>
              <Typography margin={'1%'} align="right" color={"#B41712"} variant="subtitle"> {formatToVND(auctionData[0]?.finalPrice)} </Typography>
            </Typography>
            <Typography sx={{
              display: "flex",
              justifyContent: "space-between",
            }}>
              <Typography margin={'1%'} color={"#696969"} align="left" variant="subtitle">Thời gian trì hoãn tăng giá :  </Typography>
              <Typography margin={'1%'} align="right" color={"#B41712"} variant="subtitle"> {(auctionData[0]?.delayTime)} </Typography>
            </Typography>
            <Typography sx={{
              display: "flex",
              justifyContent: "space-between",
            }}>
              <Typography margin={'1%'} color={"#696969"} align="left" variant="subtitle">Thay đổi thời gian trì hoãn tăng giá :  </Typography>
              <Typography margin={'1%'} align="right" color={"#B41712"} variant="subtitle"> {(auctionData[0]?.freeTime)} (Cuối) </Typography>
            </Typography>
            <Typography sx={{
              display: "flex",
              justifyContent: "space-between",
            }}>
              <Typography margin={'1%'} color={"#696969"} align="left" variant="subtitle">Thời gian trì hoãn tăng giá đã thay đổi :  </Typography>
              <Typography margin={'1%'} align="right" color={"#B41712"} variant="subtitle"> {(auctionData[0]?.delayFreeTime)} </Typography>
            </Typography>
            <Typography sx={{
              display: "flex",
              justifyContent: "space-between",
            }}>
              <Typography margin={'1%'} color={"#696969"} align="left" variant="subtitle">Thời gian bắt đầu :  </Typography>
              <Typography margin={'1%'} align="right" color={"#B41712"} variant="subtitle"> {formatCreateDate(auctionData[0]?.beginTime)} </Typography>
            </Typography>
            <Typography sx={{
              display: "flex",
              justifyContent: "space-between",
              margin: '1%'
            }}>
              <Typography color={"#696969"} align="left" variant="subtitle">Thời gian Kết thúc :  </Typography>
              <Typography align="right" color={"#B41712"} variant="subtitle"> {formatCreateDate(auctionData[0]?.endTime)} </Typography>
            </Typography>
            {/* <Typography margin={'1%'} variant="subtitle">Giá khởi Điểm : {formatToVND(product.firstPrice)}</Typography>
                                <Typography margin={'1%'} variant="subtitle">Bước Giá : {formatToVND(product.stepPrice)}</Typography>
                                <Typography margin={'1%'} variant="subtitle">Giá hiện tại : {formatToVND(product.finalPrice)}</Typography>
                                <Typography margin={'1%'} variant="subtitle">Thời gian bắt đầu : {formatCreateDate(product.beginTime)}</Typography>
                                <Typography margin={'1%'} variant="subtitle">Thời gian Kết thúc : {formatCreateDate(product.endTime)}</Typography> */}

            {
              auctionData[0]?.descriptions.map((description, index) => (
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

            <Grid item xs={12} sm={6}>
              {/* Use the StyledScrollbar component to wrap the TextField */}

              <TextField
                fontFamily="Arial, sans-serif" // Adjust the font-family as needed
                fontSize="15px" // Adjust the font size as needed // Use the primary text color from the theme
                label="Lịch Sử Tăng Giá"
                multiline
                rows={6}
                variant="outlined"
                fullWidth
                value={sessionDetails.map((detail) => ` Người Dùng : ${detail.userName} || Đã Tăng Lên: ${formatToVND(detail.price)} || Vào Lúc : ${formatCreateDate(detail.createDate)}`).join('\n')}
              />

            </Grid>

            <Box display="flex" alignItems="center" justifyContent="space-between">
              {auctionData[0]?.delayTime && (
                <RemainingTime endTime={auctionData[0]?.endTime} />
              )}
            </Box>

          </Stack>
        </ProductDetailInfoWrapper>
      </ProductDetailWrapper>
      <BidDialogContext.Provider value={{ isDialogOpen, setIsDialogOpen, currentPrice, setCurrentPrice }}>
        <BidDialog />
      </BidDialogContext.Provider>

      {/* popupdialog */}

      <Dialog open={isErrorDialogOpen} onClose={() => setIsErrorDialogOpen(false)}>
        <DialogTitle align='center' variant='h4'>Thông Báo</DialogTitle>
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
          {auctionData && (
            <>
              <Grid marginTop={"50px"} marginBottom={"50px"} >
                <Typography sx={{ mt: 1, mb: 1, display: "flex", justifyContent: "space-between" }}>
                  <Typography margin={'1%'} align="inherit" variant="subtitle1">Phí Tham Gia Đấu Giá</Typography>
                  <Typography margin={'1%'} align="right" variant="subtitle1">
                    {formatToVND(
                      Math.min(
                        Math.max(auctionData[0]?.participationFee * auctionData[0]?.firstPrice, 10000),
                        200000
                      )
                    )}

                  </Typography>
                </Typography>
                <Typography sx={{ mt: 1, mb: 1, display: "flex", justifyContent: "space-between" }}>
                  <Typography margin={'1%'} align="inherit" variant="subtitle1">Phí Đặt Cọc</Typography>
                  <Typography margin={'1%'} align="right" variant="subtitle1"> {formatToVND(auctionData[0]?.depositFee * auctionData[0]?.firstPrice)}</Typography>
                </Typography>
              </Grid>
              <Divider variant="inset" />
              <Typography marginTop={"50px"} marginBottom={"50px"}>

                <Typography sx={{ mt: 1, mb: 1, display: "flex", justifyContent: "space-between" }}>
                  <Typography margin={'1%'} align="inherit" variant="subtitle1">Tổng phụ</Typography>
                  <Typography margin={'1%'} align="right" variant="subtitle1">

                    {formatToVND(
                      Math.min(
                        Math.max(auctionData[0]?.participationFee * auctionData[0]?.firstPrice, 10000),
                        200000
                      ) + (auctionData[0]?.depositFee * auctionData[0]?.firstPrice)
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
                    Math.max(auctionData[0]?.participationFee * auctionData[0]?.firstPrice, 10000),
                    200000
                  ) + (auctionData[0]?.depositFee * auctionData[0]?.firstPrice)
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

      <Dialog fullWidth maxWidth={maxWidth} open={isLoading} onClose={() => { }}>
        <DialogContent align='center'>
          <CircularProgress color="primary" size={60} />
          <Typography>Đang Tải ...</Typography>
        </DialogContent>
      </Dialog>

      {isAuctionOver && hasServerResponse && (
        <>
          {isWinner ? (
            <Dialog open onClose={() => { }}>
              <DialogTitle align='center' variant='h4'>Xin chúc mừng</DialogTitle>
              <DialogContent>
                <Typography>Xin Chúc Mừng Bạn Là Người Chiến Thắng Với Số Tiền Là : {formatToVND(auctionData[0]?.finalPrice)}</Typography>
              </DialogContent>
              <DialogActions>
                <Link to="/home" style={{ textDecoration: 'none' }}>
                  <Button color="primary" onClick={handleGoBack}>
                    Quay lại Trang chủ
                  </Button>
                </Link>
                <Link to="/shoppingcart" style={{ textDecoration: 'none' }}>
                  <Button color="primary" onClick={handleGoBack}>
                    Thanh Toán Ngay
                  </Button>
                </Link>
              </DialogActions>
            </Dialog>
          ) : (
            <Dialog open onClose={() => { }}>
              <DialogTitle sx={{ display: 'flex', alignItems: "center" }}>Cuộc đấu giá đã kết thúc</DialogTitle>
              <DialogContent>
                <Typography>Rất tiếc, bạn đã không thắng cuộc đấu giá.   </Typography>
              </DialogContent>
              <DialogActions>
                <Link to="/home" style={{ textDecoration: 'none' }}>
                  <Button color="primary" onClick={handleGoBack}>
                    Quay lại Trang chủ
                  </Button>
                </Link>
              </DialogActions>
            </Dialog>
          )}
        </>
      )}

    </>
  );
};

export default AuctionForm;



