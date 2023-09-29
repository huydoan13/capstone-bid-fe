import { useParams } from 'react-router-dom';
import React, { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/system';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import axios from 'axios';

const CenteredBox = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const AnimatedXIcon = styled(CancelOutlinedIcon)`
  font-size: 100px;
  color: #d32f2f; /* Initial color */
  animation: rotateAndChangeColor 2s infinite;
  
  @keyframes rotateAndChangeColor {
    0% {
      transform: rotate(0deg);
      color: #d32f2f; /* Initial color */
    }
    25% {
      transform: rotate(45deg);
      color: #e57373; /* Mid-color */
    }
    50% {
      transform: rotate(90deg);
      color: #ef5350; /* Final color */
    }
    75% {
      transform: rotate(135deg);
      color: #e57373; /* Mid-color */
    }
    100% {
      transform: rotate(180deg);
      color: #d32f2f; /* Initial color */
    }
  }
`;

const PaymentFailForm = () => {
  const { sessionId } = useParams(); // Retrieve the sessionId parameter
  const user = localStorage.getItem('loginUser');
    const jsonUser = JSON.parse(user);
    const token = localStorage.getItem('token');

  useEffect(() => {
    // Make the API request
    axios.put(`https://bids-online.azurewebsites.net/api/Sessions/check_and_update_order?userId=${jsonUser?.Id}`,null,{headers: { Authorization: `Bearer ${token}` }})
      .then(response => {
        // Handle the API response here
        console.log(response.data); // You can replace this with your logic
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, [sessionId]);
  return (
    <CenteredBox>
      <Box textAlign="center">
        <AnimatedXIcon />
        <Typography variant="h5" component="h2" mt={2}>
          Thanh toán thất bại
        </Typography>
      </Box>
    </CenteredBox>
  );
};

export default PaymentFailForm;
