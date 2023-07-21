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
} from '@mui/material';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { useNavigate, useParams } from 'react-router-dom';
import { getAllSessionRule } from '../../../services/session-rule-actions';
import { createSession } from '../../../services/session-actions';
import axiosInstance from '../../../services/axios-instance';

function SessionCreate() {
  const errorStyle = {
    color: 'red',
  };

  const errRef = useRef();
  const [sessionData, setSessionData] = useState({
    sessionName: '',
    itemId: '',
    sessionRuleId: '',
    beginTime: null,
    endTime: null,
  });

  const [sessionRules, setSessionRules] = useState([]);

  const [selectedSessionRuleName, setSelectedSessionRuleName] = useState('');

  const [sessionRuleId, setSessionRuleId] = useState('');

  const [errMsg, setErrMsg] = useState('');

  const navigate = useNavigate();

  const { itemId } = useParams();

  useEffect(() => {
    getAllSessionRule().then((response) => {
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

  const handleCancelButton = () => {
    navigate('/dashboard/booking-items');
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await createSession( sessionData, itemId );
      // setSessionName('');
      // setSessionRuleId('');
      // setBeginTime('');
      // setEndTime('');
      // if (response.status === 200) {
      navigate('/dashboard/booking-items');
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
        <TextField
          label="Session Name"
          value={sessionData.sessionName}
          onChange={(event) => setSessionData({ ...sessionData, sessionName: event.target.value })}
          fullWidth
          required
        />

        <TextField
          label="Item Id"
          value={itemId}
          fullWidth
          disabled
        />

        <FormControl fullWidth required margin="normal">
          <InputLabel>Quy tắc đấu giá</InputLabel>
          <Select value={sessionData.sessionRuleId} onChange={(event) => setSessionData({ ...sessionData, sessionRuleId: event.target.value })} label="Session Rule">
            {sessionRules.map((sessionRule) => (
              <MenuItem key={sessionRule.sessionRuleId} value={sessionRule.sessionRuleId}>
                {sessionRule.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <LocalizationProvider dateAdapter={AdapterMoment}>
          <DateTimePicker label="Begin Time" value={sessionData.beginTime} fullWidth onChange={(date) => setSessionData({ ...sessionData, beginTime: date })}
        renderInput={(params) => <TextField {...params} />} />
        </LocalizationProvider>

        <LocalizationProvider dateAdapter={AdapterMoment}>
          <DateTimePicker label="End Time" value={sessionData.endTime} fullWidth onChange={(date) => setSessionData({ ...sessionData, endTime: date })}
        renderInput={(params) => <TextField {...params} />} />
        </LocalizationProvider>
        <br/>
        <Button type="submit" variant="contained" color="primary">
          Create Session
        </Button>
        <Button onClick={handleCancelButton} variant="contained" color="primary">
          Cancel
        </Button>
      </Box>
        </CardContent>
      </Card>
    </Container>
  );
}

export default SessionCreate;
