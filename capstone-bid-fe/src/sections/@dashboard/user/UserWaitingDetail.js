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
import { useParams, useNavigate } from 'react-router-dom';
import { getUserById, getStatusLabel, getRoleLabel } from '../../../services/user-actions';
import { acceptUserWaiting, denyUserWaiting } from '../../../services/staff-actions';

const UserWaitingDetail = () => {
  const { userId } = useParams();
  const [userDetail, setUserDetail] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const useStyles = makeStyles((theme) => ({
    cardMedia: {
      //   width: '530px',
      height: '500px', // Điều chỉnh chiều cao tùy ý
      objectFit: 'cover', // Chỉnh vừa kích thước hình ảnh trong kích thước của phần tử
    },
  }));
  const classes = useStyles();

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

  const handleDenyUser = (userId) => {
    denyUserWaiting(userId);
    toast.success('Từ chối người dùng thành công!', {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000, // Notification will automatically close after 3 seconds (3000 milliseconds)
    });
    navigate('/dashboard/user-waiting');
  };

  useEffect(() => {
    getUserById(userId).then((res) => {
      setUserDetail(res.data);
      console.log(res.data);
      setLoading(false);
    });
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
                  label="Role"
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
                  defaultValue={formatDate(userDetail.dateOfBirth)}
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
                <a href={userDetail.cccdfrontImage} target="_blank" rel="noopener noreferrer">
                  <CardMedia
                    component="img"
                    image={userDetail.cccdfrontImage}
                    alt="Image"
                    className={classes.cardMedia}
                  />
                </a>
              </Grid>
              <Grid item md={6} xs={12}>
                <a href={userDetail.cccdbackImage} target="_blank" rel="noopener noreferrer">
                  <CardMedia
                    component="img"
                    image={userDetail.cccdbackImage}
                    alt="Image"
                    className={classes.cardMedia}
                  />
                </a>
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
                <Button
                  onClick={() => {
                    handleDenyUser(userDetail.userId);
                  }}
                >
                  Từ Chối
                </Button>
              </Grid>
            </Grid>
            {/* <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Giá khởi điểm"
                      defaultValue={userDetail.firstPrice.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                      variant="outlined"
                      sx={{ marginBottom: '20px' }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Bước nhảy"
                      defaultValue={userDetail.stepPrice.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                      variant="outlined"
                      sx={{ marginBottom: '20px' }}
                    />
                  </Grid>
                </Grid> */}
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default UserWaitingDetail;
