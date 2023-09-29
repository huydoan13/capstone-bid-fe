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
import { getSessionRuleValid } from '../../../services/session-rule-actions';
import { createSession, createSessionNow } from '../../../services/session-actions';
import axiosInstance from '../../../services/axios-instance';

function SessionCreateNow() {
  const errorStyle = {
    color: 'red',
  };

  const buttonContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20px',
  };

  const errRef = useRef();
  const [sessionData, setSessionData] = useState({
    sessionName: '',
    itemId: '',
    sessionRuleId: '',
    beginTime: null,
    // endTime: null,
  });

  const [sessionRules, setSessionRules] = useState([]);

  const [selectedSessionRuleName, setSelectedSessionRuleName] = useState('');

  const [sessionRuleId, setSessionRuleId] = useState('');

  const [errMsg, setErrMsg] = useState('');

  const getToday = () => {
    const today = moment().startOf('day'); // Start of the day (00:00:00)
    return today;
  };

  const navigate = useNavigate();

  const { itemId } = useParams();

  useEffect(() => {
    getSessionRuleValid().then((response) => {
      setSessionRules(response.data);
      console.log(response.data);
    });
  }, []);

  useEffect(() => {
    const selectedSessionRule = sessionRules.find((sessionRule) => sessionRule.sessionRuleId === sessionRuleId);
    if (selectedSessionRule) {
      setSelectedSessionRuleName(selectedSessionRule.name);
    } else {
      setSelectedSessionRuleName('');
    }
  }, [sessionRuleId, sessionRules]);

  const getSevenDaysFromToday = () => {
    const sevenDaysFromToday = moment().add(7, 'days'); // Add 7 days to the current date
    return sevenDaysFromToday;
  };

  const handleCancelButton = () => {
    navigate('/dashboard/booking-item-now');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // const localBeginTime = sessionData.beginTime.local().format('YYYY-MM-DDTHH:mm:ss');
    //   const localEndTime = sessionData.endTime.local().format('YYYY-MM-DDTHH:mm:ss');

      const formattedSessionData = {
        ...sessionData,
        // beginTime: localBeginTime,
        // endTime: localEndTime,
      };
      const response = await createSessionNow(formattedSessionData, itemId);
      // setSessionName('');
      // setSessionRuleId('');
      // setBeginTime('');
      // setEndTime('');
      // if (response.status === 200) {
      navigate('/dashboard/booking-item-now');
      toast.success('Tạo phiên đấu giá thành công', {
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

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
        <Typography variant="h4" gutterBottom>
          Tạo mới Phiên đấu giá
        </Typography>
      </Stack>
      <Card>
        <CardHeader title="Đơn tạo mới phiên đấu giá" />
        <CardContent>
          <Box component="form" onSubmit={handleSubmit}>
            <p style={errorStyle} ref={errRef} className={errMsg ? 'errmsg' : 'offscreen'} aria-live="assertive">
              {errMsg}
            </p>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12}>
                <TextField
                  label="Tên phiên đấu giá"
                  value={sessionData.sessionName}
                  onChange={(event) => setSessionData({ ...sessionData, sessionName: event.target.value })}
                  fullWidth
                  required
                  sx={{ mb: 3 }}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12}>
                <TextField label="Mã sản phẩm" value={itemId} fullWidth disabled sx={{ mb: 3 }} />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12}>
                <FormControl fullWidth required margin="normal" sx={{ mb: 3 }}>
                  <InputLabel>Quy tắc đấu giá</InputLabel>
                  <Select
                    value={sessionData.sessionRuleId}
                    onChange={(event) => setSessionData({ ...sessionData, sessionRuleId: event.target.value })}
                    label="Quy tắc đấu giá"
                  >
                    {sessionRules.map((sessionRule) => (
                      <MenuItem key={sessionRule.sessionRuleId} value={sessionRule.sessionRuleId}>
                        {sessionRule.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            {/* <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider fullWidth dateAdapter={AdapterMoment}>
                  <DateTimePicker
                    label="Thời gian bắt đầu"
                    minDate={getToday()}
                    maxDate={getSevenDaysFromToday()}
                    value={sessionData.beginTime}
                    fullWidth
                    onChange={(date) => setSessionData({ ...sessionData, beginTime: date })}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider fullWidth dateAdapter={AdapterMoment}>
                  <DateTimePicker
                    label="Thời gian kết thúc"
                    minDate={getToday()}
                    maxDate={getSevenDaysFromToday()}
                    value={sessionData.endTime}
                    fullWidth
                    onChange={(date) => setSessionData({ ...sessionData, endTime: date })}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid> */}
            {/* <LocalizationProvider dateAdapter={AdapterMoment}>
              <DateTimePicker
                label="Begin Time"
                value={sessionData.beginTime}
                fullWidth
                onChange={(date) => setSessionData({ ...sessionData, beginTime: date })}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>

            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DateTimePicker
                label="End Time"
                value={sessionData.endTime}
                fullWidth
                onChange={(date) => setSessionData({ ...sessionData, endTime: date })}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider> */}
            <br />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Button sx={{ marginLeft: '50px' }} type="submit" variant="contained" color="primary">
                  Tạo phiên đấu giá
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

export default SessionCreateNow;
