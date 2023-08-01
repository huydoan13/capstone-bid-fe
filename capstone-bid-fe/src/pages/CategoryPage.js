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
// components
// eslint-disable-next-line import/no-unresolved
import { deleteCategory, getAllCategory, updateCategory } from 'src/services/category-actions';
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

  // const [upCategory, setUpCategory] = useState({});

  const [upCategory, setUpCategory] = useState({
    categoryId: category.categoryId, // initial value
    categoryName: category.categoryName, // initial value
    status: category.status // initial value
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
    width: 400,
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
      })
      .catch((err) => {
        console.log('Can not delete because:', err);
      });
    handleCloseMenu();
  };

  const handleUpdateButton = () => {
    console.log('Update ne');
    updateCategory(upCategory);
    console.log(upCategory);
    handleCloseModal();
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
                          <Chip label={status ? 'Đang hoạt động' : 'Ngưng hoạt động'} color={status ? 'success' : 'error'} />
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
            rowsPerPageOptions={[5, 10, 25]}
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
                <CardHeader subheader="The information can be edited" title="Category Information" />
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item md={12} xs={12}>
                      <TextField fullWidth label="Category Id" defaultValue={upCategory.categoryId} disabled />
                    </Grid>
                    <Grid item md={12} xs={12}>
                      <TextField fullWidth label="Category Name" onChange={(e) => setUpCategory({...upCategory, categoryName: e.target.value})} defaultValue={upCategory.categoryName} />
                    </Grid>
                    <Grid item md={12} xs={12}>
                      <InputLabel id="demo-simple-select-label">Status</InputLabel>
                      <Select onChange={(e) => setUpCategory({...upCategory, status: e.target.value === 'true' })} value={upCategory.status} label="status" name="status" size="small">
                        <MenuItem value="true">True</MenuItem>
                        <MenuItem value="false">False</MenuItem>
                      </Select>
                    </Grid>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'left',
                        p: 5,
                      }}
                    >
                      <Button
                        onClick={() => {
                          handleUpdateButton(upCategory);
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
