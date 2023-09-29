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
  Box,
  CardHeader,
  TextField,
  Grid,
  CardContent,
  Select,
  InputLabel,
} from '@mui/material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// components
// eslint-disable-next-line import/no-unresolved
import { getAllStaff, deleteStaff, updateStaff } from 'src/services/staff-actions';
import { fDate } from '../utils/formatTime';
// import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { StaffListHead, StaffListToolbar } from '../sections/staff';
// mock
// import USERLIST from '../_mock/user';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'staffName', label: 'Họ và tên', alignRight: false },
  { id: 'email', label: 'Email', alignRight: false },
  // { id: 'cccdnumber', label: 'CCCD Number', alignRight: false },
  { id: 'address', label: 'Địa chỉ', alignRight: false },
  { id: 'phone', label: 'SDT', alignRight: false },
  { id: 'dateOfBirth', label: 'Ngày sinh', alignRight: false },
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

export default function StaffPage() {
  // const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [staff, setStaff] = useState([]);

  const [staffDetail, setStaffDetail] = useState({});

  const [modalOpen, setModalOpen] = useState(false);

  const [openPopoverId, setOpenPopoverId] = useState(null);

  const [anchorEl, setAnchorEl] = useState(null);

  const formatDate = (date) => moment(date).locale('vi').format('DD/MM/YYYY');

  const styleModal = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  };

  // lay du lieu tat ca user
  useEffect(() => {
    getAllStaff().then((response) => {
      setStaff(response.data);
      console.log(response.data);
    });
  }, []);

  const handleOpenModalWithStaff = (staffId) => {
    const upStaff = staff.find((u) => u.staffId === staffId);
    console.log(upStaff);
    setStaffDetail(upStaff);
    setModalOpen(true);
    handleCloseMenu();
  };

  const handleDeleteButton = (staffId) => {
    deleteStaff(staffId)
      .then(() => {
        const updatedCategory = staff.find((u) => u.staffId === staffId);
        // updatedCategory.status = false;
        setStaff([...staff]);
        toast.success('Xóa nhân viên thành công', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 10000, // Notification will automatically close after 3 seconds (3000 milliseconds)
        });
      })
      .catch((err) => {
        console.log('Can not delete because:', err);
      });
    handleCloseMenu();
  };

  const handleUpdateButton = () => {
    console.log('Update ne');
    updateStaff(staffDetail);
    console.log(staffDetail);
    handleCloseModal();
  };

  const handleOpenMenu = (event, staffId) => {
    setAnchorEl(event.currentTarget);
    setOpenPopoverId(staffId);
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
      const newSelecteds = staff.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - staff.length) : 0;

  const filteredUsers = applySortFilter(staff, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

  return (
    <>
      <Helmet>
        <title> Nhân viên | BIDS </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Nhân viên
          </Typography>
          <Button href="staff-create" variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
            Tạo tài khoản nhân viên
          </Button>
          {/* <Modal onClick={handleOpenModal} onClose={handleCloseModal}>Create</Modal> */}
        </Stack>

        <Card>
          <StaffListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <StaffListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={staff.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { staffId, staffName, email, address, phone, dateOfBirth, status } = row;
                    const selectedUser = selected.indexOf(staffName) !== -1;

                    return (
                      <TableRow hover key={staffId} tabIndex={-1} role="checkbox" selected={selectedUser}>
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

                        <TableCell align="left">{staffName}</TableCell>
                        <TableCell align="left">{email}</TableCell>
                        <TableCell align="left">{address}</TableCell>
                        <TableCell align="left">{phone}</TableCell>
                        <TableCell align="left">{formatDate(dateOfBirth)}</TableCell>
                        <TableCell align="left">
                          <Chip label={status ? 'Đang hoạt động' : 'Đã cấm'} color={status ? 'success' : 'error'} />
                        </TableCell>

                        {/* <TableCell align="right">
                          <IconButton size="large" color="inherit" onClick={(event) => handleOpenMenu(event, staffId)}>
                            <Iconify icon={'eva:more-vertical-fill'} />
                          </IconButton>
                          <Popover
                            open={openPopoverId === staffId}
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
                                handleOpenModalWithStaff(row.staffId);
                              }}
                            >
                              <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
                              Cập nhật
                            </MenuItem>

                            <MenuItem
                              onClick={() => {
                                handleDeleteButton(row.staffId);
                              }}
                              sx={{ color: 'error.main' }}
                            >
                              <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
                              Xóa
                            </MenuItem>
                          </Popover>
                        </TableCell> */}
                        <TableCell align="right">
                          <Button
                            onClick={() => {
                              handleDeleteButton(row.staffId);
                            }}
                            sx={{ color: 'error.main' }}
                          >
                            <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
                            Xóa
                          </Button>
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
            count={staff.length}
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
              <Card>
                <CardHeader subheader="The information can be edited" title="Category Information" />
                <CardContent>
                  <Grid container spacing={3}>
                    {/* <Grid item md={12} xs={12}>
                      <TextField disabled fullWidth label="Staff Id" defaultValue={staffDetail.staffId} />
                    </Grid> */}
                    <Grid item md={12} xs={12}>
                      <TextField
                        multiline
                        fullWidth
                        label="Họ và tên"
                        onChange={(e) => setStaffDetail({ ...staffDetail, staffName: e.target.value })}
                        defaultValue={staffDetail.staffName}
                      />
                    </Grid>
                    <Grid item md={12} xs={12}>
                      <TextField
                        multiline
                        fullWidth
                        label="Địa chỉ"
                        onChange={(e) => setStaffDetail({ ...staffDetail, address: e.target.value })}
                        defaultValue={staffDetail.address}
                      />
                    </Grid>
                    <Grid item md={12} xs={12}>
                      <TextField
                        fullWidth
                        label="Số điện thoại"
                        onChange={(e) => setStaffDetail({ ...staffDetail, phone: e.target.value })}
                        defaultValue={staffDetail.phone}
                      />
                    </Grid>

                    {/* <Grid item md={12} xs={12}>
                      <InputLabel id="demo-simple-select-label">Status</InputLabel>
                      <Select onChange={(e) => setUpCategory({...upCategory, status: e.target.value === 'true' })} value={upCategory.status} label="status" name="status" size="small">
                        <MenuItem value="true">True</MenuItem>
                        <MenuItem value="false">False</MenuItem>
                      </Select>
                    </Grid> */}
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'left',
                        p: 5,
                      }}
                    >
                      <Button
                        onClick={() => {
                          handleUpdateButton(staffDetail);
                        }}
                        color="primary"
                        variant="contained"
                      >
                        Update
                      </Button>
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'right',
                        p: 2,
                      }}
                    >
                      <Button onClick={handleCloseModal} color="grey" variant="contained">
                        Cancel
                      </Button>
                    </Box>
                  </Grid>
                </CardContent>
              </Card>
            </Box>
          </Modal>
        </Card>
      </Container>
    </>
  );
}
