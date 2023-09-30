import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

const AuctionCountdown = ({ endTime, beginTime }) => {
  const calculateTimeLeft = () => {
    const currentTime = new Date().getTime();
    const endTimestamp = new Date(endTime).getTime();
    const beginTimestamp = new Date(beginTime).getTime();

    if (currentTime < beginTimestamp) {
      // Auction has not started yet
      return beginTimestamp - currentTime;
    }

    // Auction is ongoing or has ended
    return Math.max(0, endTimestamp - currentTime);
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime, beginTime]);

  const formatTime = (milliseconds) => {
    const seconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return {
      days: Math.floor(hours / 24),
      hours: hours % 24,
      minutes,
      seconds: remainingSeconds,
    };
  };

  const countdown = formatTime(timeLeft);

  return (
    <>
      <Typography fontSize={"25px"} fontWeight={"bold"} margin={"1%"} variant="subtitle">Thời Gian Còn Lại</Typography>
      <Box sx={{ width: "100%", boxShadow: 3, margin: '3%' }}>
        
        <Typography sx={{ display: 'flex', justifyContent: 'space-between', margin: '3%' }}>
        <Grid container sx={{ textAlign: 'center' }}>
          <Grid fontSize={"25px"} fontWeight={"bold"} margin={"1%"} item xs={12}>
            {countdown.days.toString().padStart(2, '0')}
          </Grid>
          <Grid item xs={12}>
            Ngày
          </Grid>
        </Grid>
          <Grid container sx={{ textAlign: 'center' }}>
            <Grid fontSize={"25px"} fontWeight={"bold"} margin={"1%"} item xs={12}>
              {countdown.hours.toString().padStart(2, '0')}
            </Grid>
            <Grid item xs={12}>
              Giờ
            </Grid>
          </Grid>
          <Grid container sx={{ textAlign: 'center' }}>
            <Grid fontSize={"25px"} fontWeight={"bold"} margin={"1%"} item xs={12}>
              {countdown.minutes.toString().padStart(2, '0')}
            </Grid>
            <Grid item xs={12}>
              Phút
            </Grid>
          </Grid>
          <Grid container sx={{ textAlign: 'center' }}>
            <Grid fontSize={"25px"} fontWeight={"bold"} margin={"1%"} item xs={12}>
              {countdown.seconds.toString().padStart(2, '0')}
            </Grid>
            <Grid item xs={12}>
              Giây
            </Grid>
          </Grid>
        </Typography>
      </Box>
    </>
  );
};

export default AuctionCountdown;
