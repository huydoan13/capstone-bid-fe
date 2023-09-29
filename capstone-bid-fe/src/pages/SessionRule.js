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
  Select,
  InputLabel,
} from '@mui/material';
import { Image } from 'mui-image';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// components
import { useNavigate } from 'react-router-dom';
// import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { getSessionsNotPay, getStatusInfo } from '../services/session-actions';
import { deleteSessionRule, getAllSessionRule, updateSessionRule } from '../services/session-rule-actions';
import { SessionRuleListHead, SessionRuleToolbar } from '../sections/@dashboard/session-rule';
// mock
// import USERLIST from '../_mock/user';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Cấu hình thời gian đấu giá', alignRight: false },
  // { id: 'increaseTime', label: 'Số lần tăng giá', alignRight: false },
  { id: 'freeTime', label: 'Thời gian tự do', alignRight: false },
  { id: 'delayTime', label: 'Đếm ngược đấu giá', alignRight: false },
  { id: 'delayFreeTime', label: 'Đếm ngược tự do', alignRight: false },
  // { id: 'createDate', label: 'createDate', alignRight: false },
  // { id: 'updateDate', label: 'updateDate', alignRight: false },
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
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function SessionRule() {
  // const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [sessionRule, setSessionRule] = useState([]);

  const [sessionRuleDetail, setSessionRuleDetail] = useState({
    name: '',
    freeTime: '',
    delayTime: '',
    delayFreeTime: '',
    status: true,
  });

  const [modalOpen, setModalOpen] = useState(false);

  const [openPopoverId, setOpenPopoverId] = useState(null);

  const [anchorEl, setAnchorEl] = useState(null);

  const formatDate = (date) => moment(date).locale('vi').format('DD/MM/YYYY HH:mm:ss');
  const formatAuctionTime = (date) => moment(date, 'HH:mm:ss.SSSSSSS').format('hh:mm:ss');

  const navigate = useNavigate();

  const useStyles = makeStyles((theme) => ({
    cardMedia: {
      width: '800px', // Điều chỉnh chiều rộng tùy ý
      height: '300px', // Điều chỉnh chiều cao tùy ý
      objectFit: 'contain', // Chỉnh vừa kích thước hình ảnh trong kích thước của phần tử
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
    getAllSessionRule().then((response) => {
      setSessionRule(response.data);
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
      const newSelecteds = sessionRule.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleUpdateSessionRule = (sessionRuleDetail) => {
    updateSessionRule(sessionRuleDetail).then(response => {
      toast.success('Cập nhật thời gian thành công', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 10000, // Notification will automatically close after 3 seconds (3000 milliseconds)
      });
      // if(response.status === 200) {
      //   toast.success('Cấm người dùng thành công', {
      //     position: toast.POSITION.TOP_RIGHT,
      //     autoClose: 3000, // Notification will automatically close after 3 seconds (3000 milliseconds)
      //   });
      // }
    }
    );
    handleCloseModal();
    handleCloseMenu();
  };

  const handleCancelButton = () => {
    setModalOpen(false);
    handleCloseMenu();
  };

  const handleCreateButton = () => {
    navigate('/dashboard/session-rule-create');
  };

  const handleOpenModalWithSessionRule = (sessionRuleId) => {
    console.log('edit');
    const updatedSession = sessionRule.find((u) => u.sessionRuleId === sessionRuleId);
    console.log(updatedSession);
    setSessionRuleDetail(updatedSession);
    setModalOpen(true);
    handleCloseMenu();
    // navigate('/dashboard/user-detail');
  };

  const handleDeleteButton = (sessionRuleId) => {
    deleteSessionRule(sessionRuleId)
      .then(() => {
        const updatedUser = sessionRule.find((u) => u.sessionRuleId === sessionRuleId);
        console.log(updatedUser);
        setSessionRule([...sessionRule]);
        toast.success('Xóa thành công', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 10000, // Notification will automatically close after 3 seconds (3000 milliseconds)
        });
      })
      .catch((err) => {
        console.log('Can not delete because:', err);
      });
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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - sessionRule.length) : 0;

  const filteredUsers = applySortFilter(sessionRule, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

  return (
    <>
      <Helmet>
        <title> Cấu hình thời gian đấu giá | BIDS </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Cấu hình thời gian đấu giá
          </Typography>
          <Button onClick={handleCreateButton} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
            Tạo mới thời gian đấu giá
          </Button>
          {/* <Modal onClick={handleOpenModal} onClose={handleCloseModal}>Create</Modal> */}
        </Stack>

        <Card>
          <SessionRuleToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />
          {/* <UserDetail userDetail={upUser} /> */}
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <SessionRuleListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={sessionRule.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const {
                      sessionRuleId,
                      name,
                      increaseTime,
                      freeTime,
                      delayTime,
                      delayFreeTime,
                      createDate,
                      updateDate,
                      status,
                    } = row;
                    const selectedUser = selected.indexOf(name) !== -1;

                    return (
                      <TableRow hover key={sessionRuleId} tabIndex={-1} role="checkbox" selected={selectedUser}>
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, name)} />
                        </TableCell>

                        {/* <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar alt={name} src={avatarUrl} />
                            <Typography variant="subtitle2" noWrap>
                              {user.name}
                            </Typography>
                          </Stack>
                        </TableCell> */}

                        <TableCell align="left">{name}</TableCell>
                        {/* <TableCell align="left">{increaseTime}</TableCell> */}
                        <TableCell align="left">{`${freeTime.hour}:${freeTime.minute}:${freeTime.second}`}</TableCell>
                        <TableCell align="left">{`${delayTime.hour}:${delayTime.minute}:${delayTime.second}`}</TableCell>
                        <TableCell align="left">{`${delayFreeTime.hour}:${delayFreeTime.minute}:${delayFreeTime.second}`}</TableCell>
                        {/* <TableCell align="left">{`${createDate.day}/${createDate.month}/${createDate.year} ${createDate.hours}:${createDate.minute}`}</TableCell>
                        <TableCell align="left">{`${updateDate.day}/${updateDate.month}/${updateDate.year} ${updateDate.hours}:${updateDate.minute}`}</TableCell> */}
                        <TableCell align="left">
                          <Chip
                            label={status ? 'Có hiệu lực' : 'Không hiệu lực'}
                            color={status ? 'success' : 'error'}
                          />
                        </TableCell>

                        <TableCell align="right">
                          <IconButton
                            size="large"
                            color="inherit"
                            onClick={(event) => handleOpenMenu(event, sessionRuleId)}
                          >
                            <Iconify icon={'eva:more-vertical-fill'} />
                          </IconButton>
                          <Popover
                            open={openPopoverId === sessionRuleId}
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
                            <MenuItem
                              onClick={() => {
                                handleOpenModalWithSessionRule(row.sessionRuleId);
                              }}
                            >
                              <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
                              Xem chi tiết
                            </MenuItem>

                            <MenuItem
                              onClick={() => {
                                handleDeleteButton(row.sessionRuleId);
                              }}
                              sx={{ color: 'error.main' }}
                            >
                              <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
                              Xóa
                            </MenuItem>
                          </Popover>
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
            count={sessionRule.length}
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
                  <CardHeader title="Thông tin chi tiết cấu hình đấu giá" />
                  <CardContent>
                    <Grid container spacing={2}>
                        <Grid item md={12} xs={12}>
                          <TextField
                            fullWidth
                            multiline
                            label="Cấu hình thời gian đấu giá"
                            value={sessionRuleDetail.name}
                            onChange={(e) => setSessionRuleDetail({ ...sessionRuleDetail, name: e.target.value })}
                            sx={{ mb: 3 }}
                          />
                      </Grid>
                      {/* <Grid item md={12} xs={12}>
                        <TextField fullWidth multiline label="Số lần tăng giá" defaultValue={sessionRuleDetail.increaseTime} />
                      </Grid> */}
                      <Typography variant="h8" paragraph>Thời gian tự do</Typography>
                      <Grid container spacing={2}>
                        <Grid item md={4} xs={12}>
                          <TextField
                            multiline
                            label="Giờ"
                            defaultValue={sessionRuleDetail.freeTime.hour}
                            onChange={(event) =>
                              setSessionRuleDetail({
                                ...sessionRuleDetail,
                                freeTime: {
                                  ...sessionRuleDetail.freeTime,
                                  hour: parseInt(event.target.value, 10),
                                },
                              })
                            }
                          />
                        </Grid>
                        <Grid item md={4} xs={12}>
                          <TextField
                            multiline
                            label="Phút"
                            defaultValue={sessionRuleDetail.freeTime.minute}
                            onChange={(event) =>
                              setSessionRuleDetail({
                                ...sessionRuleDetail,
                                freeTime: {
                                  ...sessionRuleDetail.freeTime,
                                  minute: parseInt(event.target.value, 10),
                                },
                              })
                            }
                          />
                        </Grid>
                        <Grid item md={4} xs={12}>
                          <TextField
                            multiline
                            label="Giây"
                            defaultValue={sessionRuleDetail.freeTime.second}
                            onChange={(event) =>
                              setSessionRuleDetail({
                                ...sessionRuleDetail,
                                freeTime: {
                                  ...sessionRuleDetail.freeTime,
                                  second: parseInt(event.target.value, 10),
                                },
                              })
                            }
                          />
                        </Grid>
                      </Grid>

                      <Typography variant="h8" paragraph>Đếm ngược đấu giá</Typography>
                      <Grid container spacing={2}>
                        <Grid item md={4} xs={12}>
                          <TextField
                            multiline
                            label="Giờ"
                            defaultValue={sessionRuleDetail.delayTime.hour}
                            onChange={(event) =>
                              setSessionRuleDetail({
                                ...sessionRuleDetail,
                                delayTime: {
                                  ...sessionRuleDetail.delayTime,
                                  hour: parseInt(event.target.value, 10),
                                },
                              })
                            }
                          />
                        </Grid>
                        <Grid item md={4} xs={12}>
                          <TextField
                            multiline
                            label="Phút"
                            defaultValue={sessionRuleDetail.delayTime.minute}
                            onChange={(event) =>
                              setSessionRuleDetail({
                                ...sessionRuleDetail,
                                delayTime: {
                                  ...sessionRuleDetail.delayTime,
                                  minute: parseInt(event.target.value, 10),
                                },
                              })
                            }
                          />
                        </Grid>
                        <Grid item md={4} xs={12}>
                          <TextField
                            multiline
                            label="Giây"
                            defaultValue={sessionRuleDetail.delayTime.second}
                            onChange={(event) =>
                              setSessionRuleDetail({
                                ...sessionRuleDetail,
                                delayTime: {
                                  ...sessionRuleDetail.delayTime,
                                  second: parseInt(event.target.value, 10),
                                },
                              })
                            }
                          />
                        </Grid>
                      </Grid>
                      <Typography variant="h8" paragraph>Đếm ngược tự do</Typography>
                      <Grid container spacing={2}>
                        <Grid item md={4} xs={12}>
                          <TextField
                            multiline
                            label="Giờ"
                            defaultValue={sessionRuleDetail.delayFreeTime.hour}
                            onChange={(event) =>
                              setSessionRuleDetail({
                                ...sessionRuleDetail,
                                delayFreeTime: {
                                  ...sessionRuleDetail.delayFreeTime,
                                  hour: parseInt(event.target.value, 10),
                                },
                              })
                            }
                          />
                        </Grid>
                        <Grid item md={4} xs={12}>
                          <TextField
                            multiline
                            label="Phút"
                            defaultValue={sessionRuleDetail.delayFreeTime.minute}
                            onChange={(event) =>
                              setSessionRuleDetail({
                                ...sessionRuleDetail,
                                delayFreeTime: {
                                  ...sessionRuleDetail.delayFreeTime,
                                  minute: parseInt(event.target.value, 10),
                                },
                              })
                            }
                          />
                        </Grid>
                        <Grid item md={4} xs={12}>
                          <TextField
                            multiline
                            label="Giây"
                            defaultValue={sessionRuleDetail.delayFreeTime.second}
                            onChange={(event) =>
                              setSessionRuleDetail({
                                ...sessionRuleDetail,
                                delayFreeTime: {
                                  ...sessionRuleDetail.delayFreeTime,
                                  second: parseInt(event.target.value, 10),
                                },
                              })
                            }
                          />
                        </Grid>
                      </Grid>
                      {/* <Grid item md={12} xs={12}>
                        <TextField multiline label="Thời gian tự do" defaultValue={sessionRuleDetail.freeTime?.days} />
                      </Grid>
                      <Grid item md={12} xs={12}>
                        <TextField multiline label="Thời gian tự do" defaultValue={sessionRuleDetail.freeTime?.hours} />
                      </Grid>
                      <Grid item md={12} xs={12}>
                        <TextField multiline label="Thời gian tự do" defaultValue={sessionRuleDetail.freeTime?.minutes} />
                      </Grid>
                      <Grid item md={12} xs={12}>
                        <TextField multiline label="Thời gian tự do" defaultValue={sessionRuleDetail.freeTime?.seconds} />
                      </Grid> */}

                      

                      {/* <Grid item md={12} xs={12}>
                        <TextField
                          multiline
                          label="Đếm ngược đấu giá"
                          defaultValue={sessionRuleDetail.delayTime}
                          onChange={(e) => setSessionRuleDetail({ ...sessionRuleDetail, delayTime: e.target.value })}
                        />
                      </Grid>
                      <Grid item md={12} xs={12}>
                        <TextField
                          multiline
                          label="Đếm ngược tự do"
                          defaultValue={sessionRuleDetail.delayFreeTime}
                          onChange={(e) =>
                            setSessionRuleDetail({ ...sessionRuleDetail, delayFreeTime: e.target.value })
                          }
                        />
                      </Grid> */}
                      <Grid item md={12} xs={12}>
                        <InputLabel id="demo-simple-select-label">Trạng thái</InputLabel>
                        <Select
                          onChange={(e) =>
                            setSessionRuleDetail({ ...sessionRuleDetail, status: e.target.value === 'true' })
                          }
                          value={sessionRuleDetail.status}
                          label="status"
                          name="status"
                          size="small"
                        >
                          <MenuItem value="true">Có hiệu lực</MenuItem>
                          <MenuItem value="false">Không hiệu lực</MenuItem>
                        </Select>
                      </Grid>
                      <Grid item md={6} xs={12}>
                        <Button
                          onClick={() => {
                            handleUpdateSessionRule(sessionRuleDetail);
                          }}
                        >
                          Cập nhật
                        </Button>
                      </Grid>
                      <Grid item md={6} xs={12}>
                        <Button onClick={handleCancelButton}>Hủy</Button>
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
