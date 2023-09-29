import { React, useState, useRef, useEffect } from 'react';
import {
  Container,
  Card,
  CardHeader,
  CardContent,
  Typography,
  Stack,
  TextField,
  MenuItem,
  Select,
  Box,
  Button,
  FormControl,
  InputLabel,
  Grid,
} from '@mui/material';
import moment from 'moment';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { toast } from 'react-toastify';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../../services/axios-instance';
import { createFee } from '../../../services/fee-actions';

function FeeCreate() {
  const errorStyle = {
    color: 'red',
  };

  const buttonContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20px',
  };

  const errRef = useRef();
  const [feeData, setFeeData] = useState({
    name: '',
    min: 0,
    max: 0,
    participationFee: 0,
    depositFee: 0,
    surcharge: 0,
  });

  const [sessionRules, setSessionRules] = useState([]);

  //   const [selectedSessionRuleName, setSelectedSessionRuleName] = useState('');

  //   const [sessionRuleId, setSessionRuleId] = useState('');

  const [errMsg, setErrMsg] = useState('');

  const getToday = () => {
    const today = moment().startOf('day'); // Start of the day (00:00:00)
    return today;
  };

  const navigate = useNavigate();

  //   const { itemId } = useParams();

  //   useEffect(() => {
  //     getAllSessionRule().then((response) => {
  //       setSessionRules(response.data);
  //       console.log(response.data);
  //     });
  //   }, []);

  //   useEffect(() => {
  //     const selectedSessionRule = sessionRules.find((sessionRule) => sessionRule.sessionRuleId === sessionRuleId);
  //     if (selectedSessionRule) {
  //       setSelectedSessionRuleName(selectedSessionRule.name);
  //     } else {
  //       setSelectedSessionRuleName('');
  //     }
  //   }, [sessionRuleId, sessionRules]);

  const handleCancelButton = () => {
    navigate('/dashboard/fee');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const numericFeeData = {
        ...feeData,
        min: parseFloat(feeData.min),
        max: parseFloat(feeData.max),
        participationFee: parseFloat(feeData.participationFee),
        depositFee: parseFloat(feeData.depositFee),
        surcharge: parseFloat(feeData.surcharge),
      };
      const response = await createFee(numericFeeData);
      navigate('/dashboard/fee');
      toast.success('Tạo phân khúc thành công', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 10000, // Notification will automatically close after 3 seconds (3000 milliseconds)
      });
      // } else {
      //   setErrMsg('Phien dau gia da ton tai');
      // }
    } catch (error) {
      console.error('Error creating session:', error);
      setErrMsg(error.message);
      // Handle the error condition
    }
  };

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
        <Typography variant="h4" gutterBottom>
          Tạo mới phân khúc đấu giá
        </Typography>
      </Stack>
      <Card>
        <CardHeader title="Đơn tạo mới phân khúc đấu giá" />
        <CardContent>
          <Box component="form" onSubmit={handleSubmit}>
            <p style={errorStyle} ref={errRef} className={errMsg ? 'errmsg' : 'offscreen'} aria-live="assertive">
              {errMsg}
            </p>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12}>
                <TextField
                  label="Tên phân khúc"
                  value={feeData.name}
                  onChange={(event) => setFeeData({ ...feeData, name: event.target.value })}
                  fullWidth
                  required
                  sx={{ mb: 3 }}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12}>
                <TextField
                  label="Nhỏ nhất"
                  value={feeData.min}
                  onChange={(event) => setFeeData({ ...feeData, min: event.target.value })}
                  fullWidth
                  required
                  sx={{ mb: 3 }}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12}>
                <TextField
                  label="Lớn nhất"
                  value={feeData.max}
                  onChange={(event) => setFeeData({ ...feeData, max: event.target.value })}
                  fullWidth
                  required
                  sx={{ mb: 3 }}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12}>
                <TextField
                  label="Phí tham gia (%)"
                  value={feeData.participationFee}
                  onChange={(event) => setFeeData({ ...feeData, participationFee: event.target.value })}
                  fullWidth
                  required
                  sx={{ mb: 3 }}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12}>
                <TextField
                  label="Phí đặt cọc (%)"
                  value={feeData.depositFee}
                  onChange={(event) => setFeeData({ ...feeData, depositFee: event.target.value })}
                  fullWidth
                  required
                  sx={{ mb: 3 }}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12}>
                <TextField
                  label="Phí hoa hồng (%)"
                  value={feeData.surcharge}
                  onChange={(event) => setFeeData({ ...feeData, surcharge: event.target.value })}
                  fullWidth
                  required
                  sx={{ mb: 3 }}
                />
              </Grid>
            </Grid>

            <br />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Button sx={{ marginLeft: '50px' }} type="submit" variant="contained" color="primary">
                  Tạo phân khúc
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button sx={{ marginLeft: '50px' }} onClick={handleCancelButton} variant="contained" color="primary">
                  Hủy
                </Button>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}

export default FeeCreate;
