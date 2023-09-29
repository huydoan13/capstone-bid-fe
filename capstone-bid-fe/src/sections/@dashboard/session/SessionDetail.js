import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { makeStyles } from '@mui/styles';
import {
  Card,
  Table,
  Stack,
  Paper,
  // Avatar,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
  Modal,
  Chip,
  TextField,
  Box,
  CardHeader,
  CardContent,
  Grid,
  CardMedia,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getSessionsById, getStatusLabel } from '../../../services/session-actions';
import { getSessionRuleValid } from '../../../services/session-rule-actions';
import axiosInstance from '../../../services/axios-instance';

const SessionDetail = () => {
  const { sessionId } = useParams();
  const [sessionDetail, setSessionDetail] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [sessionRules, setSessionRules] = useState([]);
  const [sessionRuleId, setSessionRuleId] = useState('');
  const [selectedSessionRuleName, setSelectedSessionRuleName] = useState('');
  const [showUpdateButton, setShowUpdateButton] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [updateFormData, setUpdateFormData] = useState({
    sessionId: '',
    sessionRuleId: '',
    sessionName: '',
    beginTime: null,
  });

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  const styleModal = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '70%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 5,
  };

  const styleUpdateModal = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '500px',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 5,
  };

  const useStyles = makeStyles((theme) => ({
    bigCardMedia: {
      width: '100%', // Adjust the width as needed
      height: '80%', // Adjust the height as needed
      objectFit: 'contain', // Maintain the image's aspect ratio while covering the container
    },
    smallCardMedia: {
      width: '100%', // Adjust the width as needed
      height: '200px', // Adjust the height as needed
      objectFit: 'contain', // Maintain the image's aspect ratio while covering the container
    },
    modalCardMedia: {
      width: '100%', // Adjust width as needed
      maxHeight: '80vh', // Adjust maximum height as needed
      objectFit: 'contain',
      margin: 'auto',
      display: 'block',
    },
  }));
  const classes = useStyles();

  const formatDate = (date) => moment(date).locale('vi').format('DD/MM/YYYY HH:mm:ss');

  const getToday = () => {
    const today = moment().startOf('day'); // Start of the day (00:00:00)
    return today;
  };

  const getSevenDaysFromToday = () => {
    const sevenDaysFromToday = moment().add(7, 'days'); // Add 7 days to the current date
    return sevenDaysFromToday;
  };

  //   const handleButtonBack = () => {
  //     navigate('/dashboard/items');
  //   };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + sessionData.images.length) % sessionData.images.length);
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % sessionData.images.length);
  };

  const handleSelectImage = (imageObj) => {
    setSelectedImage(imageObj);
    setIsModalOpen(true); // Open the modal when a small image is clicked
  };

  // Step 3: Create function to close the modal
  const handleCloseModal = () => {
    setSelectedImage(null);
    setIsModalOpen(false); // Close the modal
  };
  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false); // Close the modal
  };

  const handleUpdateClick = () => {
    setIsUpdateModalOpen(true);

    // Initialize the update form data with the current session data
    setUpdateFormData((prevFormData) => ({
      ...prevFormData,
      sessionId: sessionDetail[0].sessionResponseCompletes.sessionId,
      sessionRuleId: sessionDetail[0].sessionResponseCompletes.sessionRuleId,
      sessionName: sessionDetail[0].sessionResponseCompletes.sessionName,
      beginTime: moment(sessionDetail[0].sessionResponseCompletes.beginTime), // Convert to moment.js date
    }));
    console.log(updateFormData);
  };

  const handleUpdateSubmit = async () => {
    try {
      const localBeginTime = updateFormData.beginTime.local().format('YYYY-MM-DDTHH:mm:ss');
      const formattedSessionUpdateData = {
        ...updateFormData,
        beginTime: localBeginTime,
      };
      const response = await axiosInstance.put(
        'https://bids-online.azurewebsites.net/api/Sessions',
        formattedSessionUpdateData
      );
      toast.success('Cập nhật phiên đấu giá thành công', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000, // Notification will automatically close after 3 seconds (3000 milliseconds)
      });
      navigate('/dashboard/session-not-start');
      setIsUpdateModalOpen(false);
    } catch (error) {
      // Handle errors
      console.error('Update error:', error);
    }
  };

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

  useEffect(() => {
    (async () => {
      try {
        const response = await axiosInstance.get('https://bids-online.azurewebsites.net/api/sessions/by_id_for_admin', {
          params: { id: sessionId },
        });
        console.log(response);
        setSessionDetail(response.data);
        setLoading(false);
        if (response.data[0].sessionResponseCompletes.status === 1) {
          setShowUpdateButton(true);
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, [sessionId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const sessionData = sessionDetail[0].sessionResponseCompletes;
  const winnerEmail = sessionDetail[0].winner;

  return (
    <Container>
      {/* <Button onClick={handleButtonBack}>Trở về</Button> */}
      <Card>
        <CardHeader title="Thông tin chi tiết phiên đấu giá" />
        <CardContent>
          <Box sx={{ p: 2 }}>
            {/* {sessionDetail.sessionResponseCompletes &&
              sessionDetail.sessionResponseCompletes?.map((item) => ( */}
            <div key={sessionData.sessionId}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phiên đấu giá"
                    defaultValue={sessionData.sessionName}
                    variant="outlined"
                    sx={{ marginBottom: '20px' }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phân khúc"
                    defaultValue={sessionData.feeName}
                    variant="outlined"
                    sx={{ marginBottom: '20px' }}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Tên sản phẩm"
                    defaultValue={sessionData.itemName}
                    variant="outlined"
                    sx={{ marginBottom: '20px' }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Loại sản phẩm"
                    defaultValue={sessionData.categoryName}
                    variant="outlined"
                    sx={{ marginBottom: '20px' }}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Trạng thái"
                    defaultValue={getStatusLabel(sessionData.status)}
                    variant="outlined"
                    sx={{ marginBottom: '20px' }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Người chiến thắng"
                    defaultValue={winnerEmail}
                    variant="outlined"
                    sx={{ marginBottom: '20px' }}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item md={12} xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    label="Mô tả chi tiết"
                    rows={4}
                    defaultValue={sessionData.description}
                    variant="outlined"
                    sx={{ marginBottom: '20px' }}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                {sessionData.descriptions.map((desc, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <TextField
                      fullWidth
                      label={desc.description}
                      defaultValue={desc.detail}
                      variant="outlined"
                      sx={{ marginBottom: '16px' }}
                    />
                  </Grid>
                ))}
              </Grid>
              <Grid container spacing={2}>
                {sessionData.images.map((imageObj, index) => (
                  <Grid item xs={12} sm={3} key={index}>
                    {/* Button to select the image */}
                    <Button onClick={() => handleSelectImage(imageObj)}>
                      <CardMedia
                        component="img"
                        src={imageObj.detail}
                        alt={`Image ${index + 1}`}
                        className={classes.smallCardMedia}
                      />
                    </Button>
                  </Grid>
                ))}
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Đặt cọc"
                    defaultValue={sessionData.deposit ? 'Có' : 'Không'}
                    variant="outlined"
                    sx={{ marginBottom: '20px', marginTop: '20px' }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phí đặt cọc"
                    defaultValue={sessionData.depositFee}
                    variant="outlined"
                    sx={{ marginBottom: '20px', marginTop: '20px' }}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phí tham gia"
                    defaultValue={sessionData.participationFee.toLocaleString('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    })}
                    variant="outlined"
                    sx={{ marginBottom: '20px', marginTop: '20px' }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Bước nhảy"
                    defaultValue={sessionData.stepPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                    variant="outlined"
                    sx={{ marginBottom: '20px', marginTop: '20px' }}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Giá khởi đầu"
                    defaultValue={sessionData.firstPrice.toLocaleString('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    })}
                    variant="outlined"
                    sx={{ marginBottom: '20px', marginTop: '20px' }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Giá cuối cùng"
                    defaultValue={sessionData.finalPrice.toLocaleString('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    })}
                    variant="outlined"
                    sx={{ marginBottom: '20px', marginTop: '20px' }}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Ngày bắt đầu"
                    defaultValue={formatDate(sessionData.beginTime)}
                    variant="outlined"
                    sx={{ marginBottom: '20px' }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Ngày kết thúc"
                    defaultValue={formatDate(sessionData.endTime)}
                    variant="outlined"
                    sx={{ marginBottom: '20px' }}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  {showUpdateButton && (
                    <Button variant="contained" color="primary" onClick={handleUpdateClick} sx={{ marginTop: '20px' }}>
                      Cập nhật
                    </Button>
                  )}
                </Grid>
                {/* <Grid item xs={12} sm={6}>
                  {showUpdateButton && (
                    <Button variant="contained" color="primary" onClick={handleCloseUpdateModal} sx={{ marginTop: '20px' }}>
                      Hủy
                    </Button>
                  )}
                </Grid> */}
              </Grid>
            </div>
            {/* ))} */}
          </Box>
        </CardContent>
      </Card>
      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Box sx={styleModal}>
          {selectedImage && (
            <>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                  mb: '10px',
                }}
              >
                <IconButton onClick={handlePrevImage} disabled={sessionData.images.length <= 1}>
                  <ArrowBackIcon />
                </IconButton>
                <CardMedia
                  component="img"
                  src={sessionData.images[currentImageIndex].detail}
                  alt="Selected Image"
                  className={classes.modalCardMedia}
                />
                <IconButton onClick={handleNextImage} disabled={sessionData.images.length <= 1}>
                  <ArrowForwardIcon />
                </IconButton>
              </Box>
            </>
          )}
        </Box>
      </Modal>
      <Modal open={isUpdateModalOpen} onClose={handleCloseUpdateModal}>
        <Box sx={styleUpdateModal}>
          <form>
            <Card>
              <CardHeader title="Cập Nhật Phiên Đấu Giá Chưa Bắt Đầu" />
              <CardContent>
                <Grid container spacing={3}>
                  {/* <Grid item md={12} xs={12}>
                    <TextField
                      label="Mã phiên đấu giá"
                      defaultValue={updateFormData.sessionId}
                      fullWidth
                      disabled
                    />
                  </Grid> */}
                  <Grid item md={12} xs={12}>
                    <TextField
                      onChange={(event) => setUpdateFormData({ ...updateFormData, sessionName: event.target.value })}
                      fullWidth
                      multiline
                      label="Tên sản phẩm"
                      defaultValue={updateFormData.sessionName}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <FormControl fullWidth required margin="normal" sx={{ mb: 3 }}>
                      <InputLabel>Quy tắc đấu giá</InputLabel>
                      <Select
                        value={updateFormData.sessionRuleId}
                        onChange={(event) =>
                          setUpdateFormData({ ...updateFormData, sessionRuleId: event.target.value })
                        }
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
                  <Grid item md={12} xs={12}>
                    <LocalizationProvider fullWidth dateAdapter={AdapterMoment}>
                      <DateTimePicker
                        label="Thời gian bắt đầu"
                        minDate={getToday()}
                        maxDate={getSevenDaysFromToday()}
                        value={updateFormData.beginTime}
                        fullWidth
                        onChange={(date) => setUpdateFormData({ ...updateFormData, beginTime: date })}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item md={6} sm={12}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Button variant="contained" color="primary" onClick={handleUpdateSubmit}>
                        Cập nhật
                      </Button>
                      <Button variant="contained" color="primary" onClick={handleCloseUpdateModal}>
                        Hủy
                      </Button>
                    </div>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </form>
        </Box>
      </Modal>
    </Container>
  );
};

export default SessionDetail;
