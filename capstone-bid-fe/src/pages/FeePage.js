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
  Grid,
  CardMedia,
  TextField,
  Box,
  CardHeader,
  CardContent,
  Select,
  InputLabel,
} from '@mui/material';
// components
// eslint-disable-next-line import/no-unresolved
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { deleteFee, getAllFee, updateFee } from '../services/fee-actions';
// import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { FeeListHead, FeeListToolbar } from '../sections/@dashboard/fee';
// mock
// import USERLIST from '../_mock/user';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'feeName', label: 'Tên phân khúc', alignRight: false },
  { id: 'min', label: 'Giá trị tối thiểu', alignRight: false },
  { id: 'max', label: 'Giá trị tối đa', alignRight: false },
  { id: 'participationFee', label: 'Phí tham gia', alignRight: false },
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
    return filter(array, (_fee) => _fee.feeName.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function FeePage() {
  // const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [fee, setFee] = useState([]);

  const [feeDetail, setFeeDetail] = useState({
    feeId: fee.feeId,
    name: fee.name,
    min: fee.min,
    max: fee.max,
    participationFee: fee.participationFee,
    depositFee: fee.depositFee,
    surcharge: fee.surcharge,
    status: Boolean(fee.status),
  });

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

  const handleImageClick = () => {
    // Perform the action you want when the image is clicked
    // For example, open the image in a larger view or trigger a modal to display the image
    // You can implement this logic based on your specific requirements
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

  // lay du lieu tat ca user
  useEffect(() => {
    getAllFee().then((response) => {
      setFee(response.data);
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

  // const handleOpenMenu = (event) => {
  //   setOpen(event.currentTarget);
  // };

  // const handleCloseMenu = () => {
  //   setOpen(null);
  // };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = fee.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleOpenModalWithFee = (feeId) => {
    const updatedFee = fee.find((u) => u.feeId === feeId);
    setFeeDetail(updatedFee);
    setModalOpen(true);
    handleCloseMenu();
    // navigate('/dashboard/user-detail');
  };

  const handleCreateButton = () => {
    navigate('/dashboard/fee-create');
  }

  const handleUpdateButton = () => {
    console.log('Update ne');
    updateFee(feeDetail);
    toast.success('Cập nhật phân khúc thành công', {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 10000, // Notification will automatically close after 3 seconds (3000 milliseconds)
    });
    console.log(feeDetail);
    handleCloseModal();
    navigate('/dashboard/fee');
  };

  const handleDeleteButton = (feeId) => {
    deleteFee(feeId)
      .then(() => {
        const updatedFee = fee.find((u) => u.feeId === feeId);
        console.log(updatedFee);
        setFee([...fee]);
        toast.success('Xóa phân khúc thành công', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 10000, // Notification will automatically close after 3 seconds (3000 milliseconds)
        });
        navigate('/dashboard/fee');
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

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - fee.length) : 0;

  const filteredFees = applySortFilter(fee, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredFees.length && !!filterName;

  return (
    <>
      <Helmet>
        <title> Phân khúc đấu giá | BIDS </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Phân khúc đấu giá
          </Typography>
          <Button onClick={handleCreateButton} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
            Tạo mới phân khúc
          </Button>
        </Stack>

        <Card>
          <FeeListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <FeeListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={fee.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredFees.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const {
                      feeId,
                      feeName,
                      min,
                      max,
                      participationFee,
                      depositFee,
                      surcharge,
                      createDate,
                      updateDate,
                      status,
                    } = row;
                    const selectedUser = selected.indexOf(feeName) !== -1;

                    return (
                      <TableRow hover key={feeId} tabIndex={-1} role="checkbox" selected={selectedUser}>
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, feeName)} />
                        </TableCell>

                        {/* <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar alt={name} src={avatarUrl} />
                            <Typography variant="subtitle2" noWrap>
                              {user.name}
                            </Typography>
                          </Stack>
                        </TableCell> */}

                        <TableCell align="left">{feeName}</TableCell>
                        <TableCell align="left">{min.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</TableCell>
                        <TableCell align="left">{max.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</TableCell>
                        <TableCell align="left">{`${(participationFee * 100).toFixed(2)}%`}</TableCell>
                        {/* <TableCell align="left">{`${createDate.day}/${createDate.month}/${createDate.year} ${createDate.hours}:${createDate.minute}`}</TableCell> */}
                        <TableCell align="left">
                          <Chip
                            label={status ? 'Đang hoạt động' : 'Ngưng hoạt động'}
                            color={status ? 'success' : 'error'}
                          />
                        </TableCell>

                        <TableCell align="right">
                          {/* <Button
                            color="secondary"
                            onClick={() => {
                              handleOpenModalWithUser(row.feeId);
                            }}
                          >
                            <Iconify icon={'eva:edit-fill'} sx={{ mr: 0, ml: 0 }} />
                            Chi tiết
                          </Button> */}
                          <IconButton size="large" color="inherit" onClick={(event) => handleOpenMenu(event, feeId)}>
                            <Iconify icon={'eva:more-vertical-fill'} />
                          </IconButton>
                          <Popover
                            open={openPopoverId === feeId}
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
                                handleOpenModalWithFee(row.feeId);
                              }}
                            >
                              <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
                              Xem chi tiết
                            </MenuItem>

                            <MenuItem
                              onClick={() => {
                                handleDeleteButton(row.feeId);
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
            count={fee.length}
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
                  <CardHeader title="Thông tin chi tiết phân khúc" />
                  <CardContent>
                    <Grid container spacing={3}>
                      {/* <Grid item md={6} xs={12}>
                        <TextField label="Mã tài khoản" defaultValue={upUser.userId} disabled />
                      </Grid> */}
                      <Grid item md={12} xs={12}>
                        <TextField fullWidth label="Tên phân khúc" defaultValue={feeDetail.feeName} onChange={(e) => setFeeDetail({...feeDetail, feeName: e.target.value})} />
                      </Grid>
                      <Grid item md={6} xs={12}>
                        <TextField label="Giá trị tối thiểu" defaultValue={feeDetail.min?.toLocaleString("vi-VN", { style: "currency", currency: "VND" })} onChange={(e) => setFeeDetail({...feeDetail, min: parseFloat(e.target.value)})} />
                      </Grid>
                      <Grid item md={6} xs={12}>
                        <TextField fullWidth label="Giá trị tối đa" defaultValue={feeDetail.max?.toLocaleString("vi-VN", { style: "currency", currency: "VND" })} onChange={(e) => setFeeDetail({...feeDetail, max: parseFloat(e.target.value)})} />
                      </Grid>
                      <Grid item md={12} xs={12}>
                        <TextField
                          fullWidth
                          label="Phí tham gia"
                          defaultValue={`${(feeDetail.participationFee * 100).toFixed(2)}%`}
                          onChange={(e) => setFeeDetail({...feeDetail, participationFee: parseFloat(e.target.value)})}
                        />
                      </Grid>
                      <Grid item md={6} xs={12}>
                        <TextField label="Phí đặt cọc" defaultValue={`${(feeDetail.depositFee * 100).toFixed(2)}%`} onChange={(e) => setFeeDetail({...feeDetail, depositFee: parseFloat(e.target.value)})} />
                      </Grid>
                      <Grid item md={6} xs={12}>
                        <TextField label="Phí hoa hồng" defaultValue={`${(feeDetail.surcharge * 100).toFixed(2)}%`} onChange={(e) => setFeeDetail({...feeDetail, surcharge: parseFloat(e.target.value)})} />
                      </Grid>
                      <Grid item md={12} xs={12}>
                        <TextField
                          disabled
                          fullWidth
                          label="Ngày tạo"
                          defaultValue={`${feeDetail.createDate?.day}/${feeDetail.createDate?.month}/${feeDetail.createDate?.year} ${feeDetail.createDate?.hours}:${feeDetail.createDate?.minute}`}
                          onChange={(e) => setFeeDetail({...feeDetail, createDate: e.target.value})}
                        />
                      </Grid>
                      <Grid item md={12} xs={12}>
                        <TextField
                          disabled
                          fullWidth
                          label="Ngày cập nhật"
                          defaultValue={`${feeDetail.updateDate?.day}/${feeDetail.updateDate?.month}/${feeDetail.updateDate?.year} ${feeDetail.updateDate?.hours}:${feeDetail.updateDate?.minute}`}
                          onChange={(e) => setFeeDetail({...feeDetail, updateDate: e.target.value})}
                        />
                      </Grid>
                      <Grid item md={12} xs={12}>
                        <InputLabel id="demo-simple-select-label">Status</InputLabel>
                        <Select
                          onChange={(e) => setFeeDetail({ ...feeDetail, status: e.target.value === 'true' })}
                          value={feeDetail.status}
                          label="status"
                          name="status"
                          size="small"
                        >
                          <MenuItem value="true">Đang hoạt động</MenuItem>
                          <MenuItem value="false">Ngưng hoạt động</MenuItem>
                        </Select>
                      </Grid>
                      <Grid item md={6} xs={12}>
                        <Button
                          onClick={() => {
                            handleUpdateButton(feeDetail);
                          }}
                          sx={{ color: 'green' }}
                        >
                          Cập nhật
                        </Button>
                      </Grid>
                      <Grid item md={6} xs={12}>
                        <Button onClick={handleCloseModal}>Hủy</Button>
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
