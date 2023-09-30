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
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  getBookingItemById,
  acceptBookingItemWaiting,
  denyBookingItemWaiting,
  getStatusInfo,
  getStatusLabel,
} from '../../../services/booking-item-actions';

const BookingItemDetailNow = () => {
  const { bookingItemId, itemId } = useParams();
  const [bookingItemDetail, setBookingItemDetail] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [reason, setReason] = useState('');
  const [isInputModalOpen, setIsInputModalOpen] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('loginUser'));

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

  const handleInputModalOpen = () => {
    setIsInputModalOpen(true);
    setReason('');
  };

  const handleInputModalClose = () => {
    setIsInputModalOpen(false);
    setReason('');
  };

  const handleInputChange = (event) => {
    setReason(event.target.value);
  };

  const handleSelectImage = (imageObj) => {
    setSelectedImage(imageObj);
    setIsModalOpen(true); // Open the modal when a small image is clicked
  };

  const handlePrevImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + bookingItemDetail[0].images.length) % bookingItemDetail[0].images.length
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % bookingItemDetail[0].images.length);
  };

  // Step 3: Create function to close the modal
  const handleCloseModal = () => {
    setSelectedImage(null);
    setIsModalOpen(false); // Close the modal
  };

  const handleOpenImageModal = (imageObj) => {
    setSelectedImage(imageObj);
  };

  // Function to close the image modal
  const handleCloseImageModal = () => {
    setSelectedImage(null);
  };

  // Function to clear the selected image
  const handleClearSelectedImage = () => {
    setSelectedImage(null);
  };

  // const handleButtonBack = () => {
  //   navigate('/dashboard/booking-items');
  // };

  // const handleAcceptBookingItem = (bookingItemId) => {
  //   acceptBookingItemWaiting(bookingItemId);
  //   toast.success('Chấp nhận đơn đăng kí thành công', {
  //     position: toast.POSITION.TOP_RIGHT,
  //     autoClose: 3000, // Notification will automatically close after 3 seconds (3000 milliseconds)
  //   });
  //   navigate(`/dashboard/session-create/${bookingItemDetail.itemId}`);
  // };

  const handleAcceptBookingItem = (bookingItemId) => {
    // Find the booking item with the given bookingItemId in the bookingItem array
    const selectedBookingItem = bookingItemDetail.find((item) => item.bookingItemId === bookingItemId);

    if (!selectedBookingItem) {
      // Handle the case where the item with the specified bookingItemId is not found
      console.error(`Booking item with bookingItemId "${bookingItemId}" not found.`);
      return;
    }

    // Perform the acceptBookingItemWaiting action with the bookingItemId
    acceptBookingItemWaiting(bookingItemId);

    // Show a success toast notification
    toast.success('Chấp nhận đơn đăng kí thành công', {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000, // Notification will automatically close after 3 seconds (3000 milliseconds)
    });

    // Access the itemId of the selectedBookingItem and navigate to the corresponding URL
    navigate(`/dashboard/session-create-now/${selectedBookingItem.itemId}`);
  };

  const handleDenyBookingItem = (bookingItemId, reason) => {
    denyBookingItemWaiting(bookingItemId, reason);
    setIsInputModalOpen(false)
    toast.success('Từ chối đơn đăng kí thành công', {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000, // Notification will automatically close after 3 seconds (3000 milliseconds)
    });
    navigate('/dashboard/booking-item-now');
  };

  useEffect(() => {
    getBookingItemById(bookingItemId).then((res) => {
      setBookingItemDetail(res.data);
      console.log(bookingItemDetail.itemId);
      console.log(res.data);
      setLoading(false);
    });
  }, [bookingItemId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!Array.isArray(bookingItemDetail)) {
    return <div>Error: Invalid data format</div>;
  }

  return (
    <Container>
      {/* <Button onClick={handleButtonBack}>Trở về</Button> */}
      <Card>
        <CardHeader title="Thông tin chi tiết đơn đăng kí" />
        <CardContent>
          <Box sx={{ p: 2 }}>
            {bookingItemDetail.map((item) => (
              <div key={item.bookingItemId}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Tên sản phẩm"
                      defaultValue={item.itemName}
                      variant="outlined"
                      disabled
                      sx={{ marginBottom: '20px' }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      disabled
                      label="Tên tài khoản"
                      defaultValue={item.userName}
                      variant="outlined"
                      sx={{ marginBottom: '20px' }}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={3}>
                    <TextField fullWidth disabled label="Loại" defaultValue={item.categoryName} />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField fullWidth disabled label="Số lượng" defaultValue={item.quantity} />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField fullWidth label="Trạng thái" defaultValue={getStatusLabel(item.status)} />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField fullWidth disabled label="Phí đặt cọc" defaultValue={item.deposit ? 'Có' : 'Không'} />
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12}>
                    <TextField
                      fullWidth
                      disabled
                      multiline
                      label="Mô tả chi tiết"
                      defaultValue={item.descriptionDetail}
                      sx={{ marginTop: '20px' }}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      disabled
                      multiline
                      label="Giá khởi điểm"
                      defaultValue={item.firstPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                      sx={{ marginTop: '20px' }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      disabled
                      multiline
                      label="Bước nhảy"
                      defaultValue={item.stepPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                      sx={{ marginTop: '20px' }}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  {/* Single big view for the selected image */}
                  {/* <Grid item xs={12} sm={12}>
            <Button onClick={() => handleSelectImage(selectedImage)}>
              <CardMedia
                component="img"
                src={selectedImage && selectedImage.detail}
                alt="Selected Image"
                className={classes.bigCardMedia}
              />
            </Button>
          </Grid> */}

                  {/* Three small views for other images */}
                  {item.images.map((imageObj, index) => (
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
                      disabled
                      multiline
                      label="Ngày tạo"
                      defaultValue={formatDate(item.createDate)}
                      sx={{ marginTop: '20px' }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      disabled
                      multiline
                      label="Ngày cập nhật"
                      defaultValue={formatDate(item.updateDate)}
                      sx={{ marginTop: '20px' }}
                    />
                  </Grid>
                </Grid>
                {/* <Grid container spacing={2}>
                  {item.images.map((imageObj, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Button onClick={() => handleOpenImageModal(imageObj)}>
                        <CardMedia
                          component="img"
                          src={imageObj.detail}
                          alt={`Image ${index + 1}`}
                          className={classes.cardMedia}
                        />
                      </Button>
                    </Grid>
                  ))}
                </Grid> */}
                <Grid container spacing={3}>
                  {user.Role === 'Staff' && (
                    <>
                      <Grid item md={6} xs={12}>
                        <Button
                          onClick={() => {
                            handleAcceptBookingItem(item.bookingItemId);
                          }}
                        >
                          Chấp nhận
                        </Button>
                      </Grid>
                      <Grid item md={6} xs={12}>
                        <Button onClick={() => handleInputModalOpen()}>Từ Chối</Button>
                      </Grid>
                    </>
                  )}
                  <Modal open={isInputModalOpen} onClose={handleInputModalClose}>
                    <Box sx={styleModal}>
                      <TextField
                        label="Nhập lý do từ chối đơn đăng kí"
                        variant="outlined"
                        value={reason}
                        onChange={handleInputChange}
                        fullWidth
                        multiline
                        rows={4}
                        sx={{ marginBottom: '20px' }}
                      />
                      <Button onClick={() => handleDenyBookingItem(item.bookingItemId, reason)}>Xong</Button>
                      <Button onClick={handleInputModalClose}>Hủy</Button>
                    </Box>
                  </Modal>
                </Grid>
              </div>
            ))}
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
                <IconButton onClick={handlePrevImage} disabled={bookingItemDetail[0].images.length <= 1}>
                  <ArrowBackIcon />
                </IconButton>
                <CardMedia
                  component="img"
                  src={bookingItemDetail[0].images[currentImageIndex].detail}
                  alt="Selected Image"
                  className={classes.modalCardMedia}
                />
                <IconButton onClick={handleNextImage} disabled={bookingItemDetail[0].images.length <= 1}>
                  <ArrowForwardIcon />
                </IconButton>
              </Box>
            </>
          )}
        </Box>
      </Modal>

      {/* <Modal open={isInputModalOpen} onClose={handleInputModalClose}>
        <Box sx={styleModal}>
          <TextField
            label="Nhập lý do từ chối đơn đăng kí"
            variant="outlined"
            value={reason}
            onChange={handleInputChange}
            fullWidth
            multiline
            rows={4}
            sx={{ marginBottom: '20px' }}
          />
          <Button onClick={() => handleDenyBookingItem(item.bookingItemId, reason)}>Xong</Button>
          <Button onClick={handleInputModalClose}>Hủy</Button>
        </Box>
      </Modal> */}
    </Container>
  );
};

export default BookingItemDetailNow;
