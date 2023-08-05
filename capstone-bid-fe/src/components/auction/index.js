import React, { createContext, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from "@mui/material/styles";
import axios from 'axios';
import moment from 'moment';


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
} from '@mui/material';
import styled from '@emotion/styled';
import AuctionCountdown from './auctionCountdown';
import { Colors } from "../../style/theme";
import { Product, ProductDetailImage, ProductImage } from "../../style/Products";
import Scrollbar from '../scrollbar/Scrollbar';

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
  const [currentBigImage, setCurrentBigImage] = useState(null);
  const theme = useTheme();
  const currentTime = moment();
  const [isWinner, setIsWinner] = useState(false);
  const [winnerData, setWinnerData] = useState(null);
  const [isIntervalActive, setIsIntervalActive] = useState(true);
  const matches = useMediaQuery(theme.breakpoints.down("md"));
  const token = localStorage.getItem('token');
  const sessionId = localStorage.getItem('sessionId');
  const user = localStorage.getItem('loginUser');
  const jsonUser = JSON.parse(user);
  const [sessionDetails, setSessionDetails] = useState([]);

  const api = `https://bids-online.azurewebsites.net/api/Sessions/${sessionId}`
  const IncreaseApi = `https://bids-online.azurewebsites.net/api/SessionDetails/increase_price`
  const NotPayApi = `https://bids-online.azurewebsites.net/api/Sessions/session_status_to_haven't_pay`
  const sessionDetailAPI = `https://bids-online.azurewebsites.net/api/SessionDetails/by_session/${sessionId}`

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
  }, []);

  useEffect(() => {
    localStorage.setItem('currentDelayTime', currentDelayTime);
  }, [currentDelayTime]);

  function formatToVND(price) {
    return price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
  }

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

      // Calculate the remaining time until the endTime in seconds
      const remainingTime = moment(response.data[0]?.endTime, "YYYY-MM-DD HH:mm:ss").diff(moment(), 'seconds');
      if (remainingTime <= 300) {
        setCurrentDelayTime(response.data[0]?.delayFreeTime);
      } else {
        setCurrentDelayTime(response.data[0]?.delayTime);
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
      console.error('Error calling API:', error);
    }
  };

  const handleGoBack = async () => {
    try {
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

      setWinnerData(response.data); // Store the winner data from the API response
    } catch (error) {
      console.error('Error updating session status:', error);
      // Handle error if needed
    }
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

          const fiveMinutesBeforeEndTime = convertTimeToSeconds(moment(endTime, "YYYY-MM-DD HH:mm:ss").subtract(5, 'minutes').format("HH:mm:ss"));
          if (prevTime <= 0 && fiveMinutesBeforeEndTime <= 0) {
            localStorage.clear('countdownTime');
            const delayFreeTime = auctionData[0]?.delayFreeTime;
            if (delayFreeTime) {
              setCurrentDelayTime(delayFreeTime);
              localStorage.setItem('currentDelayTime', delayFreeTime);
              return convertTimeToSeconds(delayFreeTime);
            }
          }

          setIsCountdownRunning(false);
          return 0;
        });
      }, 1000);

      return () => clearInterval(interval);
    }, [endTime, auctionData]);

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
      <Box sx={{ mt: 4, display: "flex", alignItems: "center" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="h6" component="span" sx={{ mr: 1 }}>
            {formatTime(time)}
          </Typography>
        </Box>
        <Button
          sx={{ position: "absolute", marginLeft: "12%", width: "200px" }}
          color="primary"
          variant="contained"
          onClick={() => {
            setIsDialogOpen(true);
            setCurrentPrice(auctionData[0]?.finalPrice);
          }}
          // Disable the button if the current time is after the auction end time
          disabled={isCountdownRunning || moment(auctionData[0]?.endTime, "YYYY-MM-DD HH:mm:ss").isBefore(currentTime)}
        >
          Tăng Giá
        </Button>
      </Box>
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
  }));

  const ProductDetailInfoWrapper = styled(Box)(() => ({
    width: '100%',
    display: "flex",
    flexDirection: "column",
    marginLeft: '5%',
    maxWidth: '100%',
    lineHeight: 1.5,

  }));

  const handleDialogOpen = (price) => {
    setCurrentPrice(price);
    setIsDialogOpen(true);
  };

  useEffect(() => {
    const checkAuctionEnd = () => {
      const currentTime = moment();
      const auctionEndTime = moment(auctionData[0]?.endTime, "YYYY-MM-DD HH:mm:ss");
      if (auctionEndTime.isBefore(currentTime)) {
        handleGoBack(); // Call the API to update the session status and check if the user is the winner
        setIsIntervalActive(false); // Disable the interval once the auction ends
      }
    };

    let interval = null;

    if (isIntervalActive) {
      interval = setInterval(() => {
        fetchAuctionData();
        fetchSessionDetails();
        checkAuctionEnd(); // Check if the auction has ended on each interval
      }, 5000);
    }

    return () => {
      clearInterval(interval); // Clear the interval on cleanup
    };
  }, [isIntervalActive, auctionData]);

  const handleDialogClose = async () => {
    await makeApiCall();
    fetchAuctionData();
    fetchSessionDetails();
    setIsDialogOpen(false);
    setIsCountdownRunning(true);

    if (currentDelayTime) {
      localStorage.setItem('countdownTime', convertTimeToSeconds(currentDelayTime).toString());
    }
  };

  if (!auctionData) {
    return <div>Trang này hiện giờ không khả dụng</div>;
  }


  const ProductDetailImageContainer = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
  });

  const ProductDetailImage1 = styled('img')(({ theme }) => ({
    width: '750px',
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
    if (!auctionData) {
      return null;
    }

    const bigImage = currentBigImage || auctionData[0]?.images?.[0]?.detail;
    const thumbnailImages = auctionData[0]?.images?.slice(1);

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

  const renderDescriptions = () => {
    if (!auctionData || !auctionData[0]?.descriptions) {
      return null;
    }

    return auctionData[0]?.descriptions.map((desc, index) => (
      <TableRow key={index}>
        <TableCell>{desc.description}</TableCell>
        <TableCell>{desc.detail}</TableCell>
      </TableRow>
    ));
  };

  const StyledTextField = styled(TextField)(({ theme }) => ({
    '& textarea': {
      // Add styles for the textarea element inside the TextField
      fontFamily: 'Arial, sans-serif', // Adjust the font-family as needed
      fontSize: '14px', // Adjust the font size as needed
      color: theme.palette.text.primary, // Use the primary text color from the theme
    },
  }));


  const StyledScrollbar = styled(Scrollbar)({
    // Add styles for the Scrollbar component
    width: '80%',
    height: '250px', // Set the desired height for the scrollbar container
    borderRadius: '4px', // Add some border radius to the container
  });
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
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="h5" fontWeight="bold" sx={{ marginBottom: 2 }}>
                Thông tin chi tiết của sản phẩm:
              </Typography>
              <TableContainer component={Paper} sx={{ mr: 2 }}>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell variant="head">Tên Sản Phẩm:</TableCell>
                      <TableCell>{auctionData[0]?.itemName}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell variant="head">Mô tả sản phẩm:</TableCell>
                      <TableCell>{auctionData[0]?.description}</TableCell>
                    </TableRow>
                    <TableRow sx={{ '&:last-child td': { borderBottom: 0 } }}>
                      <TableCell variant="head">Giá khởi Điểm:</TableCell>
                      <TableCell>{formatToVND(auctionData[0]?.firstPrice)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell variant="head">Bước Giá:</TableCell>
                      <TableCell>{formatToVND(auctionData[0]?.stepPrice)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell variant="head">Giá hiện tại:</TableCell>
                      <TableCell>{formatToVND(auctionData[0]?.finalPrice)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell variant="head">Thời gian bắt đầu:</TableCell>
                      <TableCell>{formatCreateDate(auctionData[0]?.beginTime)}</TableCell>
                    </TableRow>
                    {/* Uncomment the following section when you have the auctionTime available */}
                    {/* <TableRow>
            <TableCell variant="head">Thời gian đấu giá:</TableCell>
            <TableCell>{auctionData[0]?.auctionTime}</TableCell>
          </TableRow> */}
                    <TableRow>
                      <TableCell variant="head">Thời gian Kết thúc:</TableCell>
                      <TableCell>{formatCreateDate(auctionData[0]?.endTime)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  {auctionData[0]?.delayTime && (
                    <RemainingTime endTime={auctionData[0]?.endTime} />
                  )}
                </Box>
              </TableContainer>
            </Grid>
            <Grid item xs={12} sm={6}>
              {/* Use the StyledScrollbar component to wrap the TextField */}
              <StyledScrollbar>
                <StyledTextField
                  id="multiline-textfield"
                  label="Lịch Sử Tăng Giá"
                  multiline
                  rows={25}
                  variant="outlined"
                  fullWidth
                  value={sessionDetails.map((detail) => `${detail.userName} || ${formatToVND(detail.price)} || ${formatCreateDate(detail.createDate)}`).join('\n')}
                />
              </StyledScrollbar>
            </Grid>
          </Grid>
        </ProductDetailInfoWrapper>
      </ProductDetailWrapper>
      <BidDialogContext.Provider value={{ isDialogOpen, setIsDialogOpen, currentPrice, setCurrentPrice }}>
        <BidDialog />
      </BidDialogContext.Provider>

      {/* popupdialog */}
      {isAuctionOver && (
        <>
          {isWinner ? (
            <Dialog open onClose={() => { }}>
              <DialogTitle sx={{ display: 'flex', alignItems: "center" }}>Xin chúc mừng</DialogTitle>
              <DialogContent>
                <Typography  >Xin Chúc Mừng Bạn Là Người Chiến Thắng Với Số Tiền Là : {formatToVND(auctionData[0]?.finalPrice)}</Typography>
              </DialogContent>
              <DialogActions>
                <Link to="/home" style={{ textDecoration: 'none' }}>
                  <Button color="primary" onClick={handleGoBack}>
                    Quay lại Trang chủ
                  </Button>
                </Link>
                <Link to="/home" style={{ textDecoration: 'none' }}>
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
                <Typography  >Rất tiếc, bạn đã không thắng cuộc đấu giá.   </Typography>
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



