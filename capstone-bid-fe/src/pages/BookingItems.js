import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import moment from 'moment';
import { makeStyles } from '@mui/styles';
import { styled } from '@mui/material/styles';
// import { sentenceCase } from 'change-case';
import { useEffect, useState } from 'react';
// @mui
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
// components
// eslint-disable-next-line import/no-unresolved
import { Link, useNavigate } from 'react-router-dom';
import {
  getBookingItemWaiting,
  acceptBookingItemWaiting,
  denyBookingItemWaiting,
  getStatusInfo,
  getStatusLabel,
} from '../services/booking-item-actions';
import { BookingItemListToolbar, BookingItemListHead } from '../sections/@dashboard/booking-item';
import { fDate } from '../utils/formatTime';
// import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
import SessionCreate from '../sections/@dashboard/session/SessionCreate';
import axiosInstance from '../services/axios-instance';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'itemName', label: 'Tên sản phẩm', alignRight: false },
  { id: 'categoryName', label: 'Loại', alignRight: false },
  { id: 'userName', label: 'Tên người dùng', alignRight: false },
  { id: 'image', label: 'Hình ảnh', alignRight: false },
  { id: 'fristPrice', label: 'Giá ban đầu', alignRight: false },
  // { id: 'stepPrice', label: 'StepPrice', alignRight: false },
  { id: 'createDate', label: 'Ngày khởi tạo', alignRight: false },
  // { id: 'updateDate', label: 'UpdateDate', alignRight: false },
  // { id: 'deposit', label: 'Deposit', alignRight: false },
  { id: 'status', label: 'Trạng thái', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.itemName.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function BookingItems() {
  // const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [bookingItem, setBookingItem] = useState([]);

  const [bookingItemDetail, setBookingItemDetail] = useState({});

  const [modalOpen, setModalOpen] = useState(false);

  const [openPopoverId, setOpenPopoverId] = useState(null);

  const [anchorEl, setAnchorEl] = useState(null);

  const formatDate = (date) => moment(date).locale('vi').format('DD/MM/YYYY');

  const user = JSON.parse(localStorage.getItem('loginUser'));

  const navigate = useNavigate();

  const useStyles = makeStyles((theme) => ({
    cardMedia: {
      width: '400px', // Điều chỉnh chiều rộng tùy ý
      height: '300px', // Điều chỉnh chiều cao tùy ý
      objectFit: 'cover', // Chỉnh vừa kích thước hình ảnh trong kích thước của phần tử
    },
  }));

  const classes = useStyles();

  const handleImageClick = () => {
    // Perform the action you want when the image is clicked
    // For example, open the image in a larger view or trigger a modal to display the image
    // You can implement this logic based on your specific requirements
    navigate(bookingItemDetail.image);
    console.log('Image clicked!');
  };

  const styleModal = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '500px',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 5,
  };

  const StyledProductImg = styled('img')({
    // top: 0,
    width: '50px',
    height: '50px',
    // // objectFit: 'cover',
    // position: 'absolute',
    display: 'flex',
    alignItems: 'center',
  });

  // lay du lieu tat ca user
  useEffect(() => {
    (async () => {
      try {
        const response = await axiosInstance.get('https://bids-online.azurewebsites.net/api/bookingitems/by_staff_watting', {
        params: { email: user.Email },
      });
      console.log(response);
      setBookingItem(response.data);
      }
      catch (error) {
        console.log(error);
      }
    })();
  }, [user.Email]);
  // useEffect(() => {
  //   getBookingItemWaiting(user.Email).then((response) => {
  //     setBookingItem(response.data);
  //     console.log(response.data);
  //   });
  // }, []);

  const handleOpenMenu = (event, userId) => {
    setAnchorEl(event.currentTarget);
    setOpenPopoverId(userId);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setOpenPopoverId(null);
  };

  // const handleOpenMenu = (event) => {
  //   setOpen(event.currentTarget);
  // };

  // const handleCloseMenu = () => {
  //   setOpen(null);
  // };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = bookingItem.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleOpenModalWithBookingItem = (bookingItemId) => {
    console.log('edit');
    const bookingItemde = bookingItem.find((u) => u.bookingItemId === bookingItemId);
    setBookingItemDetail(bookingItemde);
    setModalOpen(true);
    handleCloseMenu();
    // navigate('/dashboard/user-detail');
  };

  const handleAcceptBookingItem = (bookingItemId) => {
    acceptBookingItemWaiting(bookingItemId);
    navigate(`/dashboard/session-create/${bookingItemDetail.itemId}`);
    handleCloseModal();
    handleCloseMenu();
  };

  const handleDenyBookingItem = (bookingItemId) => {
    denyBookingItemWaiting(bookingItemId);
    handleCloseModal();
    handleCloseMenu();
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  // const handleOpenModal = () => {
  //   setModalOpen(true);
  // };

  // const handleCloseModal = () => {
  //   setModalOpen(false);
  // };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - bookingItem.length) : 0;

  const filteredItems = applySortFilter(bookingItem, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredItems.length && !!filterName;

  return (
    <>
      <Helmet>
        <title> Đơn đăng kí đấu giá | BIDS </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Đơn đăng kí đấu giá
          </Typography>
          {/* <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
            Tạo mới đơn đăng kí đấu giá
          </Button> */}
          {/* <Modal onClick={handleOpenModal} onClose={handleCloseModal}>Create</Modal> */}
        </Stack>

        <Card>
          <BookingItemListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <BookingItemListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={bookingItem.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredItems.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const {
                      itemId,
                      bookingItemId,
                      itemName,
                      categoryName,
                      userName,
                      quantity,
                      images,
                      firstPrice,
                      stepPrice,
                      deposit,
                      createDate,
                      updateDate,
                      status,
                    } = row;
                    const selectedUser = selected.indexOf(itemName) !== -1;

                    return (
                      <TableRow hover key={itemId} tabIndex={-1} role="checkbox" selected={selectedUser}>
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, itemName)} />
                        </TableCell>

                        {/* <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar alt={name} src={avatarUrl} />
                            <Typography variant="subtitle2" noWrap>
                              {user.name}
                            </Typography>
                          </Stack>
                        </TableCell> */}

                        <TableCell align="left">{itemName}</TableCell>
                        <TableCell align="left">{categoryName}</TableCell>
                        <TableCell align="left">{userName}</TableCell>
                        {/* <TableCell align="left">{quantity}</TableCell> */}
                        <TableCell align="left">
                          {images && images.length > 0 ? (
                            <StyledProductImg src={images[0].detail} />
                          ) : (
                            <div>Không có hình</div>
                          )}
                        </TableCell>
                        <TableCell align="left">
                          {firstPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                        </TableCell>
                        {/* <TableCell align="left">{stepPrice}</TableCell>
                        <TableCell align="left">{deposit}</TableCell> */}
                        <TableCell align="left">{formatDate(createDate)}</TableCell>
                        {/* <TableCell align="left">{fDate(updateDate)}</TableCell> */}
                        <TableCell align="left">
                          <Chip
                            label={getStatusInfo(status).text}
                            style={{ backgroundColor: getStatusInfo(status).color, color: '#ffffff' }}
                          />
                        </TableCell>

                        <TableCell align="right">
                          <Link to={`/dashboard/booking-item-detail/${row.bookingItemId}`}>
                            <Button
                            // color="secondary"
                            // onClick={() => {
                            //   handleOpenModalWithItem(row.itemId);
                            // }}
                            >
                              <Iconify icon={'eva:edit-fill'} sx={{ mr: 0, ml: 0 }} />
                              Chi tiết
                            </Button>
                          </Link>
                          {/* <IconButton size="large" color="inherit" onClick={(event) => handleOpenMenu(event, itemId)}>
                            <Iconify icon={'eva:more-vertical-fill'} />
                          </IconButton>
                          <Popover
                            open={openPopoverId === itemId}
                            anchorEl={anchorEl}
                            // open={Boolean(open)}
                            // anchorEl={open}
                            onClose={handleCloseMenu}
                            anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                            PaperProps={{
                              sx: {
                                p: 1,
                                width: 140,
                                '& .MuiMenuItem-root': {
                                  px: 1,
                                  typography: 'body2',
                                  borderRadius: 0.75,
                                },
                              },
                            }}
                          >
                            <MenuItem onClick={handleEditButton}>
                              <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
                              Edit
                            </MenuItem>

                            <MenuItem
                              onClick={() => {
                                handleDeleteButton(row.userId);
                              }}
                              sx={{ color: 'error.main' }}
                            >
                              <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
                              Delete
                            </MenuItem>
                          </Popover> */}
                        </TableCell>
                        {/* <TableCell align="left">{isVerified ? 'Yes' : 'No'}</TableCell> */}
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Try checking for typos or using complete words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
            component="div"
            count={bookingItem.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />

          <Modal
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            open={modalOpen}
            onClose={handleCloseModal}
          >
            <Box sx={styleModal}>
              <form>
                <Card>
                  <CardHeader title="Thông tin chi tiết tài khoản" />
                  <CardContent>
                    <Grid container spacing={3}>
                      {/* <Grid item md={6} xs={12}>
                        <TextField label="Mã tài khoản" defaultValue={upUser.userId} disabled />
                      </Grid> */}
                      <Grid item md={6} xs={12}>
                        <TextField label="Tên sản phẩm" defaultValue={bookingItemDetail.itemName} />
                      </Grid>
                      <Grid item md={6} xs={12}>
                        <TextField label="Loại" defaultValue={bookingItemDetail.categoryName} />
                      </Grid>
                      <Grid item md={6} xs={12}>
                        <TextField label="Tên tài khoản" defaultValue={bookingItemDetail.userName} />
                      </Grid>
                      <Grid item md={6} xs={12}>
                        <TextField label="Số lượng" defaultValue={bookingItemDetail.quantity} />
                      </Grid>
                      <Grid item md={12} xs={12}>
                        <a href={bookingItemDetail.image} target="_blank" rel="noopener noreferrer">
                          <CardMedia
                            component="img"
                            image={bookingItemDetail.image}
                            alt="Hinh anh"
                            className={classes.cardMedia}
                          />
                        </a>
                      </Grid>
                      <Grid item md={6} xs={12}>
                        <TextField
                          label="Giá khởi điểm"
                          defaultValue={bookingItemDetail.firstPrice?.toLocaleString('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                          })}
                        />
                      </Grid>
                      <Grid item md={6} xs={12}>
                        <TextField
                          label="Bước nhảy"
                          defaultValue={bookingItemDetail.stepPrice?.toLocaleString('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                          })}
                        />
                      </Grid>
                      <Grid item md={6} xs={12}>
                        <TextField label="Phí đặt cọc" defaultValue={bookingItemDetail.deposit ? 'Có' : 'Không'} />
                      </Grid>
                      <Grid item md={6} xs={12}>
                        <TextField label="Trạng thái" defaultValue={getStatusLabel(bookingItemDetail.status)} />
                      </Grid>
                      <Grid item md={6} xs={12}>
                        <TextField label="Ngày tạo" defaultValue={formatDate(bookingItemDetail.createDate)} />
                      </Grid>
                      <Grid item md={6} xs={12}>
                        <TextField label="Ngày cập nhật" defaultValue={formatDate(bookingItemDetail.updateDate)} />
                      </Grid>
                      <Grid item md={6} xs={12}>
                        <Button
                          onClick={() => {
                            handleAcceptBookingItem(bookingItemDetail.bookingItemId);
                          }}
                        >
                          Chấp nhận
                        </Button>
                      </Grid>
                      <Grid item md={6} xs={12}>
                        <Button
                          onClick={() => {
                            handleDenyBookingItem(bookingItemDetail.bookingItemId);
                          }}
                        >
                          Từ Chối
                        </Button>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </form>
            </Box>
          </Modal>
        </Card>
      </Container>
    </>
  );
}
