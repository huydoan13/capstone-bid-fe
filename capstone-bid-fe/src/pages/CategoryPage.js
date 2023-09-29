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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
// components
// eslint-disable-next-line import/no-unresolved
import { createDescription, deleteCategory, deleteDescription, getAllCategory, updateCategory } from 'src/services/category-actions';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fDate } from '../utils/formatTime';
// import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
import { CategoryListHead, CategoryListToolbar } from '../sections/@dashboard/category';
import CategoryCreate from '../sections/@dashboard/category/CategoryCreate';
// mock
// import USERLIST from '../_mock/user';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'categoryName', label: 'Tên Loại', alignRight: false },
  { id: 'updateDate', label: 'Ngày cập nhật', alignRight: false },
  { id: 'createDate', label: 'Ngày tạo', alignRight: false },
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
    return filter(array, (_itemType) => _itemType.categoryName.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function CaterogyPage() {
  // const [open, setOpen] = useState(null);

  const [category, setCategory] = useState([]);

  const [categoryName, setCategoryName] = useState();
  const [selectedValue, setSelectedValue] = useState('');

  // const [upCategory, setUpCategory] = useState({});

  const [upCategory, setUpCategory] = useState({
    categoryId: category.categoryId, // initial value
    categoryName: category.categoryName,
    descriptions: category.descriptions, // initial value
    status: category.status, // initial value
  });

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('itemTypeName');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [modalOpen, setModalOpen] = useState(false);

  const [openPopoverId, setOpenPopoverId] = useState(null);

  const [anchorEl, setAnchorEl] = useState(null);

  const formatDate = (date) => moment(date).locale('vi').format('DD/MM/YYYY');

  const [dialogOpen, setDialogOpen] = useState(false);
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [newDescriptionName, setNewDescriptionName] = useState('');

  // const handleInputChange = (event) => {
  //   const { name, value } = event.target;
  //   setUpCategory(prevState => ({
  //     ...prevState,
  //     [name]: value
  //   }));
  // };

  const styleModal = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  };

  // lay du lieu tat ca user
  useEffect(() => {
    getAllCategory().then((response) => {
      setCategory(response.data);
      console.log(response.data);
    });
  }, []);

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleOpenMenu = (event, userId) => {
    setAnchorEl(event.currentTarget);
    setOpenPopoverId(userId);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setOpenPopoverId(null);
  };

  const handleOpenCreateDialog = () => {
    setNewDescriptionName(''); // Clear the input field when opening the dialog
    setCreateDialogOpen(true);
  };

  const handleOpenDeleteDialog = () => {
    setDeleteDialogOpen(true);
  };

  // ... other code ...

  // Step 4: Handle the creation of a new description
  const handleCreateDescription = async (event) => {
    event.preventDefault();
    try {
      const response = await createDescription(upCategory.categoryId, newDescriptionName);
      setNewDescriptionName('');
      setCreateDialogOpen(false);
      toast.success('Miêu tả tạo thành công', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
    } catch (error) {
      console.log('Failed to fetch', error);
      setCreateDialogOpen(false);
      toast.error('Miêu tả tạo không thành công', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
    }
    // Close the dialog
    setCreateDialogOpen(false);
  };

  const handleDeleteDescription = async (event) => {
    event.preventDefault();
    const descriptionIdToDelete = selectedValue;
    try {
      const response = await deleteDescription(descriptionIdToDelete);
      setDeleteDialogOpen(false);
      toast.success('Miêu tả xóa thành công', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
    } catch (error) {
      console.log('Failed to fetch', error);
      setDeleteDialogOpen(false);

      // Show an error message (optional)
      toast.error('Miêu tả xóa không thành công', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
    }
    // Close the dialog
    setCreateDialogOpen(false);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = category.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleOpenModalWithCategory = (categoryId) => {
    console.log('edit');
    const updatedCategory1 = category.find((u) => u.categoryId === categoryId);
    console.log(updatedCategory1);
    setUpCategory(updatedCategory1);
    console.log(upCategory);
    setModalOpen(true);
    handleCloseMenu();
  };

  const handleDeleteButton = (categoryId) => {
    deleteCategory(categoryId)
      .then(() => {
        const updatedCategory = category.find((u) => u.categoryId === categoryId);
        updatedCategory.status = false;
        setCategory([...category]);
        toast.success('Xóa loại đấu giá thành công', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000, // Notification will automatically close after 3 seconds (3000 milliseconds)
        });
      })
      .catch((err) => {
        console.log('Can not delete because:', err);
        toast.error('Xóa loại đấu giá không thành công', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000, // Notification will automatically close after 3 seconds (3000 milliseconds)
        });
      });
    handleCloseMenu();
  };

  const handleUpdateButton = () => {
    console.log('Update ne');
    updateCategory(upCategory);
    toast.success('Cập nhật loại đấu giá thành công', {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000, // Notification will automatically close after 3 seconds (3000 milliseconds)
    });
    console.log(upCategory);
    handleCloseModal();
  };

  const handleSelectChange = (event) => {
    setSelectedValue(event.target.value);
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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - category.length) : 0;

  const filteredCategory = applySortFilter(category, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredCategory.length && !!filterName;

  return (
    <>
      <Helmet>
        <title> Loại đấu giá | BIDS </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Loại đấu giá
          </Typography>
          <Button onClick={handleOpenDialog} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
            Tạo mới Loại đấu giá
          </Button>
          <CategoryCreate open={dialogOpen} onClose={handleCloseDialog} />
        </Stack>
        <Card>
          <CategoryListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <CategoryListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={category.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredCategory.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { categoryId, categoryName, updateDate, createDate, status } = row;
                    const selectedItemType = selected.indexOf(categoryName) !== -1;

                    return (
                      <TableRow hover key={categoryId} tabIndex={-1} role="checkbox" selected={selectedItemType}>
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedItemType} onChange={(event) => handleClick(event, categoryName)} />
                        </TableCell>

                        {/* <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar alt={name} src={avatarUrl} />
                            <Typography variant="subtitle2" noWrap>
                              {user.name}
                            </Typography>
                            </Stack>
                          </TableCell> */}

                        <TableCell align="left">{categoryName}</TableCell>
                        <TableCell align="left">{formatDate(updateDate)}</TableCell>
                        <TableCell align="left">{formatDate(createDate)}</TableCell>
                        <TableCell align="left">
                          <Chip
                            label={status ? 'Đang hoạt động' : 'Ngưng hoạt động'}
                            color={status ? 'success' : 'error'}
                          />
                        </TableCell>

                        <TableCell align="right">
                          <IconButton
                            size="large"
                            color="inherit"
                            onClick={(event) => handleOpenMenu(event, categoryId)}
                          >
                            <Iconify icon={'eva:more-vertical-fill'} />
                          </IconButton>
                          <Popover
                            open={openPopoverId === categoryId}
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
                                handleOpenModalWithCategory(row.categoryId);
                              }}
                            >
                              <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
                              Xem chi tiết
                            </MenuItem>

                            <MenuItem
                              onClick={() => {
                                handleDeleteButton(row.categoryId);
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
            count={category.length}
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
                <CardHeader title="Thông tin loại đấu giá" />
                <CardContent>
                  <Grid container spacing={2}>
                    {/* <Grid item md={12} xs={12}>
                      <TextField fullWidth label="Category Id" defaultValue={upCategory.categoryId} disabled />
                    </Grid> */}
                    <Grid item md={12} xs={12}>
                      <TextField
                        fullWidth
                        label="Loại đấu giá"
                        onChange={(e) => setUpCategory({ ...upCategory, categoryName: e.target.value })}
                        defaultValue={upCategory.categoryName}
                      />
                    </Grid>

                    {upCategory.descriptions?.map((description, index) => (
                      <Grid item md={6} xs={12} key={description.id}>
                        <TextField
                          fullWidth
                          multiline
                          label={`Miêu tả ${index + 1}`}
                          InputProps={{
                            readOnly: true,
                          }}
                          value={description.name}
                        />
                      </Grid>
                    ))}

                    <Grid item md={12} xs={12}>
                      <InputLabel id="demo-simple-select-label">Trạng thái</InputLabel>
                      <Select
                        onChange={(e) => setUpCategory({ ...upCategory, status: e.target.value === 'true' })}
                        value={upCategory.status}
                        label="status"
                        name="status"
                        size="small"
                      >
                        <MenuItem value="true">Đang hoạt động</MenuItem>
                        <MenuItem value="false">Ngưng hoạt động</MenuItem>
                      </Select>
                    </Grid>

                      <Grid item md={4} xs={12}>
                      <Button
                        onClick={() => {
                          handleUpdateButton(upCategory);
                        }}
                        color="primary"
                        variant="contained"
                      >
                        Cập nhật
                      </Button>
                      </Grid>
                      <Grid item md={4} xs={12}>
                      <Button onClick={handleOpenCreateDialog} variant="contained" color="success">
                        Tạo miêu tả
                      </Button>
                      </Grid>
                      <Grid item md={4} xs={12}>
                      <Button onClick={handleOpenDeleteDialog} variant="contained" color="error">
                        Xóa miêu tả
                      </Button>
                      </Grid>

                    {/* <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'left',
                        p: 3,
                      }}
                    >
                      <Button
                        onClick={() => {
                          handleUpdateButton(upCategory);
                        }}
                        color="primary"
                        variant="contained"
                      >
                        Cập nhật
                      </Button>
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        p: 3,
                      }}
                    >
                      <Button onClick={handleOpenCreateDialog} variant="contained">
                        Tạo miêu tả
                      </Button>
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'right',
                        p: 3,
                      }}
                    >
                      <Button onClick={handleOpenDeleteDialog} variant="contained">
                        Xóa miêu tả
                      </Button>
                    </Box> */}
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        p: 2,
                      }}
                    >
                      <Button onClick={handleCloseModal} color="grey" variant="contained">
                        Hủy
                      </Button>
                    </Box>
                  </Grid>
                </CardContent>
              </Card>
            </Box>
          </Modal>

          <Dialog
            open={isCreateDialogOpen}
            onClose={() => setCreateDialogOpen(false)}
            aria-labelledby="create-description-dialog-title"
          >
            <DialogTitle id="create-description-dialog-title">Tạo miêu tả</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                id="new-description-name"
                label="Miêu tả"
                type="text"
                fullWidth
                value={newDescriptionName}
                onChange={(e) => setNewDescriptionName(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setCreateDialogOpen(false)} color="secondary">
                Hủy
              </Button>
              <Button onClick={handleCreateDescription} color="primary" disabled={!newDescriptionName}>
                Tạo
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={isDeleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}
            aria-labelledby="create-description-dialog-title"
          >
            <DialogTitle id="create-description-dialog-title">Xóa miêu tả</DialogTitle>
            <DialogContent>
              <Select value={selectedValue} onChange={handleSelectChange} fullWidth>
                {upCategory.descriptions?.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleteDialogOpen(false)} color="secondary">
                Hủy
              </Button>
              <Button onClick={handleDeleteDescription} color="primary">
                Xóa
              </Button>
            </DialogActions>
          </Dialog>
        </Card>
      </Container>
    </>
  );
}
