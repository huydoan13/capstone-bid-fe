import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import moment from 'moment';
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
import { useNavigate, Link } from 'react-router-dom';
import UserDetail from '../sections/@dashboard/user/UserDetail';
import { acceptUserWaiting, denyUserWaiting } from '../services/staff-actions';
// eslint-disable-next-line import/no-unresolved
import { fDate } from '../utils/formatTime';
// import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { getSessionsNotStart, getStatusInfo } from '../services/session-actions';
import { SessionListHead, SessionListToolbar } from '../sections/@dashboard/session';
// mock
// import USERLIST from '../_mock/user';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'sessionName', label: 'Phiên đấu giá', alignRight: false },
  { id: 'feeName', label: 'Phân khúc', alignRight: false },
  { id: 'beginTime', label: 'Thời gian bắt đầu', alignRight: false },
  // { id: 'auctionTime', label: 'Thời gian đấu giá', alignRight: false },
  { id: 'endTime', label: 'Thời gian kết thúc', alignRight: false },
  { id: 'finailPrice', label: 'Giá chốt', alignRight: false },
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
    return filter(array, (_user) => _user.userName.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function SessionNotStart() {
  // const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [session, setSession] = useState([]);

  const [upSession, setUpSession] = useState({});

  const [modalOpen, setModalOpen] = useState(false);

  const [openPopoverId, setOpenPopoverId] = useState(null);

  const [anchorEl, setAnchorEl] = useState(null);

  const [showPaymentHistoryButton, setShowPaymentHistoryButton] = useState(false);

  const formatDate = (date) => moment(date).locale('vi').format('DD/MM/YYYY HH:mm:ss');

  const navigate = useNavigate();

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
    getSessionsNotStart().then((response) => {
      setSession(response.data);
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
      const newSelecteds = session.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleAcceptUser = (userId) => {
    acceptUserWaiting(userId);
    handleCloseModal();
    handleCloseMenu();
  };

  const handleDenyUser = (userId) => {
    denyUserWaiting(userId);
    handleCloseModal();
    handleCloseMenu();
  };

  const handleOpenModalWithUser = (sessionId) => {
    console.log('edit');
    const updatedSession = session.find((u) => u.sessionId === sessionId);
    setUpSession(updatedSession);
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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - session.length) : 0;

  const filteredUsers = applySortFilter(session, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

  return (
    <>
      <Helmet>
        <title> Phiên đấu giá chưa bắt đầu | BIDS </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Phiên đấu giá chưa bắt đầu
          </Typography>
          {/* <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
            New User
          </Button> */}
        </Stack>

        <Card>
          <SessionListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />
          {/* <UserDetail userDetail={upUser} /> */}
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <SessionListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={session.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { sessionId, feeName, sessionName, beginTime, auctionTime, endTime, finalPrice, status } =
                      row;
                    const selectedUser = selected.indexOf(sessionName) !== -1;

                    return (
                      <TableRow hover key={sessionId} tabIndex={-1} role="checkbox" selected={selectedUser}>
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, sessionName)} />
                        </TableCell>

                        {/* <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar alt={name} src={avatarUrl} />
                            <Typography variant="subtitle2" noWrap>
                              {user.name}
                            </Typography>
                          </Stack>
                        </TableCell> */}

                        <TableCell align="left">{sessionName}</TableCell>
                        <TableCell align="left">{feeName}</TableCell>
                        <TableCell align="left">{formatDate(beginTime)}</TableCell>
                        <TableCell align="left">{formatDate(endTime)}</TableCell>
                        <TableCell align="left">
                          {finalPrice?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                        </TableCell>
                        {/* <TableCell align="left">{address}</TableCell> */}
                        {/* <TableCell align="left">{phone}</TableCell> */}
                        {/* <TableCell align="left">{formatDate(dateOfBirth)}</TableCell> */}
                        <TableCell align="left">
                          <Chip
                            label={getStatusInfo(status).text}
                            style={{ backgroundColor: getStatusInfo(status).color, color: '#ffffff' }}
                          />
                        </TableCell>

                        <TableCell align="right">
                          <IconButton
                            size="large"
                            color="inherit"
                            onClick={(event) => handleOpenMenu(event, sessionId)}
                          >
                            <Iconify icon={'eva:more-vertical-fill'} />
                          </IconButton>
                          <Popover
                            open={openPopoverId === sessionId}
                            anchorEl={anchorEl}
                            // open={Boolean(open)}
                            // anchorEl={open}
                            onClose={handleCloseMenu}
                            anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                            PaperProps={{
                              sx: {
                                p: 1,
                                width: 150,
                                '& .MuiMenuItem-root': {
                                  px: 1,
                                  typography: 'body2',
                                  borderRadius: 0.75,
                                },
                              },
                            }}
                          >
                            <MenuItem>
                              <Link to={`/dashboard/session-detail/${row.sessionId}`}>
                                <Button>
                                  {/* <Iconify icon={'eva:edit-fill'} sx={{ mr: 0, ml: 0 }} /> */}
                                  Chi tiết
                                </Button>
                              </Link>
                            </MenuItem>
                            {/* <MenuItem>
                              {showPaymentHistoryButton && (
                                <Button>
                                  Lịch sử đấu giá
                                </Button>
                              )}
                            </MenuItem> */}
                          </Popover>
                        </TableCell>
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
            count={session.length}
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
                        <TextField label="Họ và tên" defaultValue={upSession.userName} />
                      </Grid>
                      <Grid item md={6} xs={12}>
                        <TextField label="Số CCCD" defaultValue={upSession.cccdnumber} />
                      </Grid>
                      <Grid item md={12} xs={12}>
                        <Typography variant="subtitle1" gutterBottom>
                          Mặt trước CCCD
                        </Typography>
                        <CardMedia component="img" image={upSession.cccdfrontImage} alt="CCCD Front Image" />
                      </Grid>
                      <Grid item md={12} xs={12}>
                        <Typography variant="subtitle1" gutterBottom>
                          Mặt sau CCCD
                        </Typography>
                        <CardMedia component="img" image={upSession.cccdbackImage} alt="CCCD Back Image" />
                      </Grid>
                      <Grid item md={12} xs={12}>
                        <TextField fullWidth label="Email" defaultValue={upSession.email} />
                      </Grid>
                      <Grid item md={12} xs={12}>
                        <TextField fullWidth label="Địa chỉ" defaultValue={upSession.address} />
                      </Grid>
                      <Grid item md={6} xs={12}>
                        <TextField label="Số điện thoại" defaultValue={upSession.phone} />
                      </Grid>
                      <Grid item md={6} xs={12}>
                        <TextField label="Ngày sinh" defaultValue={formatDate(upSession.dateOfBirth)} />
                      </Grid>
                      <Grid item md={6} xs={12}>
                        <Button
                          onClick={() => {
                            handleAcceptUser(upSession.sessionId);
                          }}
                        >
                          Chấp nhận
                        </Button>
                      </Grid>
                      <Grid item md={6} xs={12}>
                        <Button
                          onClick={() => {
                            handleDenyUser(upSession.sessionId);
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
