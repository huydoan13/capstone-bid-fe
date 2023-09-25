import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { makeStyles } from '@mui/styles';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserById, getStatusLabel, getRoleLabel } from '../../../services/user-actions';
import { acceptUserWaiting, denyUserWaiting } from '../../../services/staff-actions';
import axiosInstance from '../../../services/axios-instance';

const UserWaitingDetail = () => {
  const { userId } = useParams();
  const [userDetail, setUserDetail] = useState({});
  const [loading, setLoading] = useState(true);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isInputModalOpen, setIsInputModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [reason, setReason] = useState('');

  const navigate = useNavigate();

  const styleModal = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 5,
    display: 'flex',
  };

  const imageContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center', // Center the image vertically
    maxHeight: '80vh',
    overflow: 'auto',
    width: '100%', // Set the width to 100% to make the background color cover the entire modal width
    backgroundColor: 'background.paper', // Apply the background color to the entire container
  };

  const arrowButtonContainerStyle = {
    display: 'flex',
    alignItems: 'center',
  };

  const arrowButtonStyle = {
    background: 'rgba(0, 0, 0, 0.3)',
    borderRadius: '50%',
    color: 'white',
    padding: '10px', // Increase padding for larger button size
    fontSize: '24px', // Increase font size
    margin: '5px', // Reduce margin for closer placement to image
    cursor: 'pointer',
    border: 'none',
    outline: 'none',
  };

  const useStyles = makeStyles((theme) => ({
    cardMedia: {
      //   width: '530px',
      height: '500px', // Điều chỉnh chiều cao tùy ý
      objectFit: 'cover', // Chỉnh vừa kích thước hình ảnh trong kích thước của phần tử
    },
  }));
  const classes = useStyles();

  const handleInputModalOpen = () => {
    setIsInputModalOpen(true);
  };

  const handleInputModalClose = () => {
    setIsInputModalOpen(false);
    setReason('');
  };

  const handleInputChange = (event) => {
    setReason(event.target.value);
  };

  const handleInputSubmit = () => {
    // Handle your input submission logic here
    console.log('User input:', reason);
    handleInputModalClose();
  };

  const handleImageClick = (imageUrl, index) => {
    setSelectedImage(imageUrl);
    setCurrentImageIndex(index);
    setIsImageModalOpen(true);
  };

  const handleNextImage = () => {
    const nextIndex = (currentImageIndex + 1) % 2; // Assuming you have two images
    setSelectedImage(nextIndex === 0 ? userDetail.cccdfrontImage : userDetail.cccdbackImage);
    setCurrentImageIndex(nextIndex);
  };

  const handlePrevImage = () => {
    const prevIndex = (currentImageIndex - 1 + 2) % 2; // Assuming you have two images
    setSelectedImage(prevIndex === 0 ? userDetail.cccdfrontImage : userDetail.cccdbackImage);
    setCurrentImageIndex(prevIndex);
  };

  const formatBirthDate = (date) => moment(date).locale('vi').format('DD/MM/YYYY');
  const formatDate = (date) => moment(date).locale('vi').format('DD/MM/YYYY HH:mm:ss');

  const handleButtonBack = () => {
    navigate('/dashboard/user-waiting');
  };

  const handleAcceptUser = (userId) => {
    acceptUserWaiting(userId);
    toast.success('Chấp nhận người dùng thành công!', {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000, // Notification will automatically close after 3 seconds (3000 milliseconds)
    });
    navigate('/dashboard/user-waiting');
  };

  const handleDenyUser = (userId, reason) => {
    denyUserWaiting(userId, reason);
    console.log(reason);
    toast.success('Từ chối người dùng thành công!', {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000, // Notification will automatically close after 3 seconds (3000 milliseconds)
    });
    navigate('/dashboard/user-waiting');
  };

  useEffect(() => {
    (async () => {
      try {
        const response = await axiosInstance.get('https://bids-online.azurewebsites.net/api/users/by_id', {
          params: { id: userId },
        });
        console.log(response);
        setUserDetail(response.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [userId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <Button onClick={handleButtonBack}>Trở về</Button>
      <Card>
        <CardHeader title="Thông tin chi tiết người dùng" />
        <CardContent>
          <Box sx={{ p: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Tên người dùng"
                  defaultValue={userDetail.userName}
                  variant="outlined"
                  sx={{ marginBottom: '20px' }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  defaultValue={userDetail.email}
                  variant="outlined"
                  sx={{ marginBottom: '20px' }}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Số CCCD"
                  defaultValue={userDetail.cccdnumber}
                  variant="outlined"
                  sx={{ marginBottom: '20px' }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Số điện thoại"
                  defaultValue={userDetail.phone}
                  variant="outlined"
                  sx={{ marginBottom: '20px' }}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12}>
                <TextField
                  fullWidth
                  multiline
                  label="Địa chỉ"
                  defaultValue={userDetail.address}
                  variant="outlined"
                  sx={{ marginBottom: '20px' }}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Vai trò"
                  defaultValue={getRoleLabel(userDetail.role)}
                  variant="outlined"
                  sx={{ marginBottom: '20px' }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Trạng thái"
                  defaultValue={getStatusLabel(userDetail.status)}
                  variant="outlined"
                  sx={{ marginBottom: '20px' }}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Ngày sinh"
                  defaultValue={formatBirthDate(userDetail.dateOfBirth)}
                  variant="outlined"
                  sx={{ marginBottom: '20px' }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Ngày tạo"
                  defaultValue={formatDate(userDetail.createDate)}
                  variant="outlined"
                  sx={{ marginBottom: '20px' }}
                />
              </Grid>
            </Grid>
            {/* <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Loại sản phẩm"
                      defaultValue={userDetail.categoryName}
                      variant="outlined"
                      sx={{ marginBottom: '20px' }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Phí đặt cọc"
                      defaultValue={userDetail.deposit ? 'Có' : 'Không'}
                      variant="outlined"
                      sx={{ marginBottom: '20px' }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Số lượng"
                      defaultValue={userDetail.quantity}
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
                      defaultValue={userDetail.descriptionDetail}
                      variant="outlined"
                      sx={{ marginBottom: '20px' }}
                    />
                  </Grid>
                </Grid> */}
            {/* <Grid container spacing={2}>
                  {userDetail.descriptions.map((desc, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <TextField
                        fullWidth
                        label={desc.description}
                        defaultValue={desc.detail}
                        variant="outlined"
                        sx={{ marginBottom: '20px' }}
                      />
                    </Grid>
                  ))}
                </Grid> */}
            <Grid container spacing={2} sx={{ marginBottom: '20px' }}>
              <Grid item md={6} xs={12}>
                <Button onClick={() => handleImageClick(userDetail.cccdfrontImage, 0)}>
                  <CardMedia
                    component="img"
                    image={userDetail.cccdfrontImage}
                    alt="Image"
                    className={classes.cardMedia}
                  />
                </Button>
              </Grid>
              <Grid item md={6} xs={12}>
                <Button onClick={() => handleImageClick(userDetail.cccdbackImage, 1)}>
                  <CardMedia
                    component="img"
                    image={userDetail.cccdbackImage}
                    alt="Image"
                    className={classes.cardMedia}
                  />
                </Button>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item md={6} xs={12}>
                <Button
                  onClick={() => {
                    handleAcceptUser(userDetail.userId);
                  }}
                >
                  Chấp nhận
                </Button>
              </Grid>
              <Grid item md={6} xs={12}>
                <Button onClick={handleInputModalOpen}>Từ Chối</Button>
              </Grid>
              {/* <Grid item md={6} xs={12}>
                <Button
                  onClick={() => {
                    handleDenyUser(userDetail.userId);
                  }}
                >
                  Từ Chối
                </Button>
              </Grid> */}
            </Grid>
          </Box>
        </CardContent>
      </Card>

      <Modal open={isInputModalOpen} onClose={handleInputModalClose}>
        <Box sx={styleModal}>
          <TextField
            label="Nhập lý do từ chối"
            variant="outlined"
            value={reason}
            onChange={handleInputChange}
            fullWidth
            multiline
            rows={4}
            sx={{ marginBottom: '20px' }}
          />
          <Button onClick={() => handleDenyUser(userDetail.userId, reason)}>Xong</Button>
          <Button onClick={handleInputModalClose}>Cancel</Button>
        </Box>
      </Modal>

      <Modal open={isImageModalOpen} onClose={() => setIsImageModalOpen(false)}>
        <Box sx={styleModal}>
          {selectedImage && (
            <Box sx={imageContainerStyle}>
              <Box sx={arrowButtonContainerStyle}>
                <IconButton style={arrowButtonStyle} onClick={handlePrevImage} disabled={currentImageIndex === 0}>
                  <ArrowBackIcon />
                </IconButton>
                <CardMedia
                  component="img"
                  src={selectedImage}
                  alt="Selected Image"
                  className={classes.modalCardMedia}
                />
                <IconButton style={arrowButtonStyle} onClick={handleNextImage} disabled={currentImageIndex === 1}>
                  <ArrowForwardIcon />
                </IconButton>
              </Box>
            </Box>
          )}
        </Box>
      </Modal>
    </Container>
  );
};

export default UserWaitingDetail;
