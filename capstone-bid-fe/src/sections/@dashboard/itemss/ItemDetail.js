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
import { getItemById } from '../../../services/item-actions';
import axiosInstance from '../../../services/axios-instance';

const ItemDetail = () => {
  const { itemId } = useParams();
  const [itemDetail, setItemDetail] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
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

  const handleButtonBack = () => {
    navigate('/dashboard/items');
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + itemDetail[0].images.length) % itemDetail[0].images.length);
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % itemDetail[0].images.length);
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

  useEffect(() => {
    (async () => {
      try {
        const response = await axiosInstance.get('https://bids-online.azurewebsites.net/api/items/by_id', {
        params: { id: itemId },
      });
      console.log(response);
      setItemDetail(response.data);
      setLoading(false);
      }
      catch (error) {
        console.log(error);
      }
    })();
  }, [itemId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <Button onClick={handleButtonBack}>Trở về</Button>
      <Card>
        <CardHeader title="Thông tin chi tiết sản phẩm" />
        <CardContent>
          <Box sx={{ p: 2 }}>
            {itemDetail.map((item) => (
              <div key={item.itemId}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Tên sản phẩm"
                      defaultValue={item.itemName}
                      variant="outlined"
                      sx={{ marginBottom: '20px' }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Tên tài khoản"
                      defaultValue={item.userName}
                      variant="outlined"
                      sx={{ marginBottom: '20px' }}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Loại sản phẩm"
                      defaultValue={item.categoryName}
                      variant="outlined"
                      sx={{ marginBottom: '20px' }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Phí đặt cọc"
                      defaultValue={item.deposit ? 'Có' : 'Không'}
                      variant="outlined"
                      sx={{ marginBottom: '20px' }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Số lượng"
                      defaultValue={item.quantity}
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
                      defaultValue={item.descriptionDetail}
                      variant="outlined"
                      sx={{ marginBottom: '20px' }}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  {item.descriptions.map((desc, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <TextField
                        fullWidth
                        label={desc.description}
                        defaultValue={desc.detail}
                        variant="outlined"
                        sx={{ marginBottom: '30px' }}
                      />
                    </Grid>
                  ))}
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
                      label="Giá khởi điểm"
                      defaultValue={item.firstPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                      variant="outlined"
                      sx={{ marginBottom: '20px', marginTop: '20px' }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Bước nhảy"
                      defaultValue={item.stepPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                      variant="outlined"
                      sx={{ marginBottom: '20px', marginTop: '20px' }}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Ngày cập nhật"
                      defaultValue={formatDate(item.updateDate)}
                      variant="outlined"
                      sx={{ marginBottom: '20px' }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Ngày tạo"
                      defaultValue={formatDate(item.createDate)}
                      variant="outlined"
                      sx={{ marginBottom: '20px' }}
                    />
                  </Grid>
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
                <IconButton onClick={handlePrevImage} disabled={itemDetail[0].images.length <= 1}>
                  <ArrowBackIcon />
                </IconButton>
                <CardMedia
                  component="img"
                  src={itemDetail[0].images[currentImageIndex].detail}
                  alt="Selected Image"
                  className={classes.modalCardMedia}
                />
                <IconButton onClick={handleNextImage} disabled={itemDetail[0].images.length <= 1}>
                  <ArrowForwardIcon />
                </IconButton>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </Container>
  );
};

export default ItemDetail;
