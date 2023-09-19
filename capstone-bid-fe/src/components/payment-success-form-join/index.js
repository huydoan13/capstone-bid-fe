import { useParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/system';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import axios from 'axios'; 
import { useEffect ,React} from 'react';


const CenteredBox = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 70vh;
`;

const AnimatedTickIcon = styled(CheckCircleOutlineIcon)`
  font-size: 100px;
  color: #1976d2;
  animation: bounce 1s infinite;

  @keyframes bounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-20px);
    }
  }
`;

const PaymentSuccessJoinForm = () => {
  const { sessionId } = useParams(); // Retrieve the sessionId parameter
  const user = localStorage.getItem('loginUser');
    const jsonUser = JSON.parse(user);
    const token = localStorage.getItem('token');

    // useEffect(() => {
    //   // Make the API request
    //   axios.put(`https://bids-online.azurewebsites.net/api/Sessions/check_and_update_order?userId=${jsonUser.Id}`,null,{headers: { Authorization: `Bearer ${token}` }})
    //     .then(response => {
    //       // Handle the API response here
    //       console.log(response.data); // You can replace this with your logic
    //     })
    //     .catch(error => {
    //       console.error('Error:', error);
    //     });
    // }, []);

  return (
    <CenteredBox>
      <Box textAlign="center">
        <AnimatedTickIcon />
        <Typography variant="h5" component="h2" mt={2}>
          Bạn đã thanh đăng kí thành công
        </Typography>
      </Box>
    </CenteredBox>
  );
};

export default PaymentSuccessJoinForm;
