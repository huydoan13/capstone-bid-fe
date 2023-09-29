import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import moment from 'moment';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
import Scrollbar from '../../../components/scrollbar';
import Iconify from '../../../components/iconify';
import SessionHistoryListHead from './SessionHistoryListHead';
import SessionHistoryListToolbar from './SessionHistoryListToolbar';
import axiosInstance from '../../../services/axios-instance';
import { getSessionHistoryById } from '../../../services/session-actions';

const TABLE_HEAD = [
  { id: 'userName', label: 'Tên người dùng', alignRight: false },
  { id: 'itemName', label: 'Tên sản phẩm', alignRight: false },
  { id: 'sessionName', label: 'Phiên đấu giá', alignRight: false },
  { id: 'price', label: 'Bước nhảy', alignRight: false },
  { id: 'createDate', label: 'Thời gian đấu giá', alignRight: false },
  { id: 'status', label: 'Trạng thái', alignRight: false },
  { id: '' },
];

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

const SessionHistory = () => {
  const { sessionId } = useParams();

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [openPopoverId, setOpenPopoverId] = useState(null);

  const [anchorEl, setAnchorEl] = useState(null);

  const [sessionHistory, setSessionHistory] = useState([]);

  const [loading, setLoading] = useState(true);

  const formatDate = (date) => moment(date).locale('vi').format('DD/MM/YYYY HH:mm:ss');

  const handleOpenMenu = (event, userId) => {
    setAnchorEl(event.currentTarget);
    setOpenPopoverId(userId);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setOpenPopoverId(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = sessionHistory.map((n) => n.name);
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

  useEffect(() => {
    (async () => {
      try {
        const response = await axiosInstance.get(
          `https://bids-online.azurewebsites.net/api/sessiondetails/by_session?id=${sessionId}`,
          {
            params: { id: sessionId },
          }
        );
        console.log(response);
        setSessionHistory(response.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [sessionId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - sessionHistory.length) : 0;

  const filteredUsers = applySortFilter(sessionHistory, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

  return (
    <>
      <Helmet>
        <title> Lịch sử đấu giá | BIDS </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Lịch sử đấu giá
          </Typography>
          {/* <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
                New User
              </Button> */}
        </Stack>

        <Card>
          <SessionHistoryListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />
          {/* <UserDetail userDetail={upUser} /> */}
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <SessionHistoryListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={sessionHistory.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const {
                      sessionDetailId,
                      price,
                      sessionName,
                      itemName,
                      userName,
                      beginTime,
                      auctionTime,
                      endTime,
                      finalPrice,
                      createDate,
                      status,
                    } = row;
                    const selectedUser = selected.indexOf(sessionName) !== -1;

                    return (
                      <TableRow hover key={sessionDetailId} tabIndex={-1} role="checkbox" selected={selectedUser}>
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, sessionName)} />
                        </TableCell>
                        <TableCell align="left">{userName}</TableCell>
                        <TableCell align="left">{itemName}</TableCell>
                        <TableCell align="left">{sessionName}</TableCell>
                        <TableCell align="left">
                          {price?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                        </TableCell>
                        <TableCell align="left">{formatDate(createDate)}</TableCell>
                        <TableCell align="left">
                        <Chip
                            label={status ? 'Hợp lệ' : 'Không hợp lệ'}
                            color={status ? 'success' : 'error'}
                          />
                          </TableCell>
                        {/* <TableCell align="left">{endTime}</TableCell> */}
                        {/* <TableCell align="left">{address}</TableCell> */}
                        {/* <TableCell align="left">{phone}</TableCell> */}
                        {/* <TableCell align="left">{formatDate(dateOfBirth)}</TableCell> */}
                        {/* <TableCell align="left">
                          <Chip
                            label={getStatusInfo(status).text}
                            style={{ backgroundColor: getStatusInfo(status).color, color: '#ffffff' }}
                          />
                        </TableCell> */}
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
            count={sessionHistory.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </>
  );
};

export default SessionHistory;
