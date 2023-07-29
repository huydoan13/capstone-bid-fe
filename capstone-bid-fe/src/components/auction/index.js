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
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("md"));
  const token = localStorage.getItem('token');
  const sessionId = localStorage.getItem('sessionId');
  const user = localStorage.getItem('loginUser');
  const jsonUser = JSON.parse(user);
  const [sessionDetails, setSessionDetails] = useState([]);

  const api = `https://bids-api-testing.azurewebsites.net/api/Sessions/${sessionId}`
  const IncreaseApi = `https://bids-api-testing.azurewebsites.net/api/SessionDetails/increase_price`
  const NotPayApi = `https://bids-api-testing.azurewebsites.net/api/Sessions/session_status_to_haven't_pay`
  const sessionDetailAPI = `https://bids-api-testing.azurewebsites.net/api/SessionDetails/by_session/${sessionId}`

  useEffect(() => {
    fetchAuctionData();
    fetchSessionDetails();
    
    const interval = setInterval(() => {
      fetchAuctionData();
      fetchSessionDetails();
    }, 5000);
    return () => {
      clearInterval(interval);
    };
  }, []);

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
      console.log("API response:", response.data);
      // The price update via setInterval will automatically reflect here
    } catch (error) {
      console.error('Error calling API:', error);
    }
  };

  const handleGoBack = async () => {
    try {
      await axios.put(NotPayApi, { sessionID: sessionId }, { headers: { Authorization: `Bearer ${token}` } });
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
            // fetchAuctionData();
            // fetchSessionDetails();
            setIsDialogOpen(true);
            setCurrentPrice(auctionData[0]?.finalPrice);
          }}
          disabled={isCountdownRunning || RemainingTime.initialTime > 0}
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


 const ProductDetailImage1 = styled('img')(({ src, theme }) => ({

    src: `url(${src})`,
    width: '750px',
    height: '500px',
    background: Colors.light_gray,
    padding: '10px',
    [theme.breakpoints.down('md')]: {
        width: '80%',
        height: '80%',
        padding: '25px',
    }

}));

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
          <ProductDetailImage1 src={auctionData[0]?.image ?? "loi"} />
        </Product>

        <ProductDetailInfoWrapper>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            {auctionData[0]?.endTime && auctionData[0]?.beginTime && (
              <AuctionCountdown endTime={auctionData[0]?.endTime} beginTime={auctionData[0]?.beginTime} />
            )}
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TableContainer sx={{ mr: 2 }} component={Paper} >
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>Tên Sản Phẩm:</TableCell>
                      <TableCell>{auctionData[0]?.itemName}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Mô tả sản phẩm:</TableCell>
                      <TableCell>{auctionData[0]?.description}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Giá khởi Điểm:</TableCell>
                      <TableCell>{formatToVND(auctionData[0]?.firstPrice)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Bước Giá:</TableCell>
                      <TableCell>{formatToVND(auctionData[0]?.stepPrice)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Giá hiện tại:</TableCell>
                      <TableCell>{formatToVND(auctionData[0]?.finalPrice)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Thời gian bắt đầu:</TableCell>
                      <TableCell>{auctionData[0]?.beginTime}</TableCell>
                    </TableRow>
                    {/* <TableRow>
                  <TableCell>Thời gian đấu giá:</TableCell>
                  <TableCell>{auctionData[0]?.auctionTime}</TableCell>
                </TableRow> */}
                    <TableRow>
                      <TableCell>Thời gian Kết thúc:</TableCell>
                      <TableCell>{auctionData[0]?.endTime}</TableCell>
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
              <TextField
                id="multiline-textfield"
                label="Lịch Sử Tăng Giá"
                multiline
                rows={30}
                variant="outlined"
                fullWidth
                value={sessionDetails.map((detail) => `${detail.userName} || ${formatToVND(detail.price)} || ${formatCreateDate(detail.createDate)}`).join('\n')}
                
              // You can add any additional props or event handlers as needed
              />
            </Grid>
          </Grid>
        </ProductDetailInfoWrapper>
      </ProductDetailWrapper>
      <BidDialogContext.Provider value={{ isDialogOpen, setIsDialogOpen, currentPrice, setCurrentPrice }}>
        <BidDialog />
      </BidDialogContext.Provider>

      {/* popupdialog */}
      {isAuctionOver && (
        <Dialog open onClose={() => { }}>
          <DialogTitle sx={{display: 'flex', alignItems:"center"}}>Cuộc đấu giá đã kết thúc</DialogTitle>
          <DialogContent>
            <Typography  >Rất tiếc, cuộc đấu giá đã kết thúc.<br/> Người chiến thắng sẽ được thông báo bằng email, xin vui lòng thanh toán trong vong 3 ngày sau khi nhận được email </Typography>
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
  );
};

export default AuctionForm;