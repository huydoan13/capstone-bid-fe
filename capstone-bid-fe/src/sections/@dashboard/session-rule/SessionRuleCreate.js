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
import { createSessionRule } from '../../../services/session-rule-actions';

function SessionRuleCreate() {
  const errorStyle = {
    color: 'red',
  };

  const buttonContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20px',
  };

  const errRef = useRef();
  const [sessionRuleData, setSessionRuleData] = useState({
    name: '',
    freeTime: {
      ticks: 0,
      days: 0,
      hours: 0,
      milliseconds: 0,
      minutes: 0,
      seconds: 0,
    },
    delayTime: {
      ticks: 0,
      days: 0,
      hours: 0,
      milliseconds: 0,
      minutes: 0,
      seconds: 0,
    },
    delayFreeTime: {
      ticks: 0,
      days: 0,
      hours: 0,
      milliseconds: 0,
      minutes: 0,
      seconds: 0,
    },
  });

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
    navigate('/dashboard/session-rule');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await createSessionRule(sessionRuleData);
      navigate('/dashboard/session-rule');
      toast.success('Tạo luật đấu giá thành công', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000, // Notification will automatically close after 3 seconds (3000 milliseconds)
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

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setSessionRuleData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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
                  // name='name'
                  value={sessionRuleData.name}
                  onChange={(event) => setSessionRuleData({ ...sessionRuleData, name: event.target.value })}
                  fullWidth
                  required
                  sx={{ mb: 3 }}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Thời gian đấu giá tự do (Giờ)"
                  // name="freeTime.minutes"
                  value={sessionRuleData.freeTime.hours}
                  onChange={(event) =>
                    setSessionRuleData({
                      ...sessionRuleData,
                      freeTime: {
                        ...sessionRuleData.freeTime,
                        hours: parseInt(event.target.value, 10),
                      },
                    })
                  }
                  fullWidth
                  margin="normal"
                  type="number"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Thời gian đấu giá tự do (Phút)"
                  // name="freeTime.minutes"
                  value={sessionRuleData.freeTime.minutes}
                  onChange={(event) =>
                    setSessionRuleData({
                      ...sessionRuleData,
                      freeTime: {
                        ...sessionRuleData.freeTime,
                        minutes: parseInt(event.target.value, 10),
                      },
                    })
                  }
                  fullWidth
                  margin="normal"
                  type="number"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Thời gian đấu giá tự do (Giây)"
                  // name="freeTime.minutes"
                  value={sessionRuleData.freeTime.seconds}
                  onChange={(event) =>
                    setSessionRuleData({
                      ...sessionRuleData,
                      freeTime: {
                        ...sessionRuleData.freeTime,
                        seconds: parseInt(event.target.value, 10),
                      },
                    })
                  }
                  fullWidth
                  margin="normal"
                  type="number"
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Đếm ngược đấu giá (Giờ)"
                  // name="freeTime.minutes"
                  value={sessionRuleData.delayTime.hours}
                  onChange={(event) =>
                    setSessionRuleData({
                      ...sessionRuleData,
                      delayTime: {
                        ...sessionRuleData.delayTime,
                        hours: parseInt(event.target.value, 10),
                      },
                    })
                  }
                  fullWidth
                  margin="normal"
                  type="number"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Đếm ngược đấu giá (Phút)"
                  // name="freeTime.minutes"
                  value={sessionRuleData.delayTime.minutes}
                  onChange={(event) =>
                    setSessionRuleData({
                      ...sessionRuleData,
                      delayTime: {
                        ...sessionRuleData.delayTime,
                        minutes: parseInt(event.target.value, 10),
                      },
                    })
                  }
                  fullWidth
                  margin="normal"
                  type="number"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Đếm ngược đấu giá (Giây)"
                  // name="freeTime.minutes"
                  value={sessionRuleData.delayTime.seconds}
                  onChange={(event) =>
                    setSessionRuleData({
                      ...sessionRuleData,
                      delayTime: {
                        ...sessionRuleData.delayTime,
                        seconds: parseInt(event.target.value, 10),
                      },
                    })
                  }
                  fullWidth
                  margin="normal"
                  type="number"
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Delay Time (hours)"
                  // name="freeTime.minutes"
                  value={sessionRuleData.delayFreeTime.hours}
                  onChange={(event) =>
                    setSessionRuleData({
                      ...sessionRuleData,
                      delayFreeTime: {
                        ...sessionRuleData.delayFreeTime,
                        hours: parseInt(event.target.value, 10),
                      },
                    })
                  }
                  fullWidth
                  margin="normal"
                  type="number"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Delay Time (minutes)"
                  // name="freeTime.minutes"
                  value={sessionRuleData.delayFreeTime.minutes}
                  onChange={(event) =>
                    setSessionRuleData({
                      ...sessionRuleData,
                      delayFreeTime: {
                        ...sessionRuleData.delayFreeTime,
                        minutes: parseInt(event.target.value, 10),
                      },
                    })
                  }
                  fullWidth
                  margin="normal"
                  type="number"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Delay Time (seconds)"
                  // name="freeTime.minutes"
                  value={sessionRuleData.delayFreeTime.seconds}
                  onChange={(event) =>
                    setSessionRuleData({
                      ...sessionRuleData,
                      delayFreeTime: {
                        ...sessionRuleData.delayFreeTime,
                        seconds: parseInt(event.target.value, 10),
                      },
                    })
                  }
                  fullWidth
                  margin="normal"
                  type="number"
                />
              </Grid>
            </Grid>
            {/* <Grid container spacing={2}>
              <Grid item xs={12} sm={12}>
                <TextField
                  label="Phí đặt cọc"
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
                  label="Phí hoa hồng"
                  value={feeData.surcharge}
                  onChange={(event) => setFeeData({ ...feeData, surcharge: event.target.value })}
                  fullWidth
                  required
                  sx={{ mb: 3 }}
                />
              </Grid>
            </Grid> */}

            <br />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Button sx={{ marginLeft: '50px' }} type="submit" variant="contained" color="primary">
                  Tạo luật đấu giá
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

export default SessionRuleCreate;
