import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import moment from 'moment';
import { makeStyles } from '@mui/styles';
// import { sentenceCase } from 'change-case';
import { useEffect, useState } from 'react';
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
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
import { Image } from 'mui-image';

// components
// eslint-disable-next-line import/no-unresolved
import { getUserWaiting, getStatusInfo } from 'src/services/user-actions';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';
import UserDetail from '../sections/@dashboard/user/UserDetail';
import { acceptUserWaiting, denyUserWaiting } from '../services/staff-actions';
// eslint-disable-next-line import/no-unresolved
import { fDate } from '../utils/formatTime';
// import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
// mock
// import USERLIST from '../_mock/user';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'userName', label: 'Họ và tên', alignRight: false },
  { id: 'email', label: 'Email', alignRight: false },
  { id: 'cccdnumber', label: 'Số CCCD', alignRight: false },
  // { id: 'address', label: 'Address', alignRight: false },
  { id: 'phone', label: 'Số điện thoại', alignRight: false },
  // { id: 'dateOfBirth', label: 'D.O.B', alignRight: false },
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
    return filter(array, (_user) => _user.email.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function UserWaitingApprove() {
  // const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [user, setUser] = useState([]);

  const [upUser, setUpUser] = useState({});

  const [modalOpen, setModalOpen] = useState(false);

  const [openPopoverId, setOpenPopoverId] = useState(null);

  const [anchorEl, setAnchorEl] = useState(null);

  const formatDate = (date) => moment(date).locale('vi').format('DD/MM/YYYY');

  const navigate = useNavigate();

  const useStyles = makeStyles((theme) => ({
    cardMedia: {
      width: '400px', // Điều chỉnh chiều rộng tùy ý
      height: '300px', // Điều chỉnh chiều cao tùy ý
      objectFit: 'cover', // Chỉnh vừa kích thước hình ảnh trong kích thước của phần tử
    },
  }));

  const classes = useStyles();

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

  // lay du lieu tat ca user
  useEffect(() => {
    getUserWaiting().then((response) => {
      setUser(response.data);
      console.log(response.data);
    });
  }, []);

  const handleOpenMenu = (event, userId) => {
    setAnchorEl(event.currentTarget);
    setOpenPopoverId(userId);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setOpenPopoverId(null);
  };

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
      const newSelecteds = user.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleAcceptUser = (userId) => {
    acceptUserWaiting(userId);
    toast.success('Chấp nhận người dùng thành công!', {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000, // Notification will automatically close after 3 seconds (3000 milliseconds)
    });
    handleCloseModal();
    handleCloseMenu();
  };

  const handleDenyUser = (userId) => {
    denyUserWaiting(userId);
    toast.success('Từ chối người dùng thành công!', {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000, // Notification will automatically close after 3 seconds (3000 milliseconds)
    });
    handleCloseModal();
    handleCloseMenu();
  };

  const handleOpenModalWithUser = (userId) => {
    console.log('edit');
    const updatedUser = user.find((u) => u.userId === userId);
    console.log(updatedUser);
    setUpUser(updatedUser);
    console.log(upUser);
    setModalOpen(true);
    handleCloseMenu();
    // navigate('/dashboard/user-detail');
  };

  // const handleDeleteButton = (userId) => {
  //   deleteUser(userId)
  //     .then(() => {
  //       const updatedUser = user.find((u) => u.userId === userId);
  //       updatedUser.status = false;
  //       setUser([...user]);
  //     })
  //     .catch((err) => {
  //       console.log('Can not delete because:', err);
  //     });
  //   handleCloseMenu();
  // };

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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - user.length) : 0;

  const filteredUsers = applySortFilter(user, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

  return (
    <>
      <Helmet>
        <title> Người dùng đang chờ duyệt | BIDS </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Người dùng đang chờ duyệt
          </Typography>
          {/* <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
            New User
          </Button> */}
        </Stack>

        <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />
          {/* <UserDetail userDetail={upUser} /> */}
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={user.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { userId, userName, email, cccdnumber, address, phone, dateOfBirth, status } = row;
                    const selectedUser = selected.indexOf(userName) !== -1;

                    return (
                      <TableRow hover key={userId} tabIndex={-1} role="checkbox" selected={selectedUser}>
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, email)} />
                        </TableCell>

                        {/* <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar alt={name} src={avatarUrl} />
                            <Typography variant="subtitle2" noWrap>
                              {user.name}
                            </Typography>
                          </Stack>
                        </TableCell> */}

                        <TableCell align="left">{userName}</TableCell>
                        <TableCell align="left">{email}</TableCell>
                        <TableCell align="left">{cccdnumber}</TableCell>
                        {/* <TableCell align="left">{address}</TableCell> */}
                        <TableCell align="left">{phone}</TableCell>
                        {/* <TableCell align="left">{formatDate(dateOfBirth)}</TableCell> */}
                        <TableCell align="left">
                          <Chip
                            label={getStatusInfo(status).text}
                            style={{ backgroundColor: getStatusInfo(status).color, color: '#ffffff' }}
                          />
                        </TableCell>

                        <TableCell align="right">
                          {/* <IconButton size="large" color="inherit" onClick={(event) => handleOpenMenu(event, userId)}>
                            <Iconify icon={'eva:more-vertical-fill'} />
                          </IconButton> */}
                          {/* <Popover
                            open={openPopoverId === userId}
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
                          > */}
                          <Link to={`/dashboard/user-waiting-detail/${row.userId}`}>
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

                          {/* <MenuItem
                              // onClick={() => {
                              //   handleDeleteButton(row.userId);
                              // }}
                              sx={{ color: 'error.main' }}
                            >
                              <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
                              Delete
                            </MenuItem> */}
                          {/* </Popover> */}
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
            count={user.length}
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
                        <TextField label="Họ và tên" defaultValue={upUser.userName} />
                      </Grid>
                      <Grid item md={6} xs={12}>
                        <TextField label="Số CCCD" defaultValue={upUser.cccdnumber} />
                      </Grid>
                      <Grid item md={12} xs={12}>
                        <a href={upUser.cccdfrontImage} target="_blank" rel="noopener noreferrer">
                          <CardMedia
                            component="img"
                            image={upUser.cccdfrontImage}
                            alt="CCCD Back Image"
                            className={classes.cardMedia}
                          />
                        </a>
                      </Grid>
                      <Grid item md={12} xs={12}>
                        <a href={upUser.cccdbackImage} target="_blank" rel="noopener noreferrer">
                          <CardMedia
                            component="img"
                            image={upUser.cccdbackImage}
                            alt="CCCD Back Image"
                            className={classes.cardMedia}
                          />
                        </a>
                      </Grid>
                      <Grid item md={12} xs={12}>
                        <TextField fullWidth label="Email" defaultValue={upUser.email} />
                      </Grid>
                      <Grid item md={12} xs={12}>
                        <TextField multiline fullWidth label="Địa chỉ" defaultValue={upUser.address} />
                      </Grid>
                      <Grid item md={6} xs={12}>
                        <TextField label="Số điện thoại" defaultValue={upUser.phone} />
                      </Grid>
                      <Grid item md={6} xs={12}>
                        <TextField label="Ngày sinh" defaultValue={formatDate(upUser.dateOfBirth)} />
                      </Grid>
                      <Grid item md={6} xs={12}>
                        <Button
                          onClick={() => {
                            handleAcceptUser(upUser.userId);
                          }}
                        >
                          Chấp nhận
                        </Button>
                      </Grid>
                      <Grid item md={6} xs={12}>
                        <Button
                          onClick={() => {
                            handleDenyUser(upUser.userId);
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
