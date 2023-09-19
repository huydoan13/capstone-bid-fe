import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  TablePagination,
  Button,
  Container,
  Divider,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  CardHeader,
  CardContent,
  Card,
} from '@mui/material';
import { getPaymentDetails } from '../../../services/payment-actions';

const PaymentUserDetail = () => {
  const { userId } = useParams();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [paymentHistory, setPaymentHistory] = useState([]);
  const user = localStorage.getItem('loginUser');
  const jsonUser = JSON.parse(user);
  const token = localStorage.getItem('token');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  let dateRangeText = '';
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const dateDiff = (end - start) / (1000 * 3600 * 24); // Calculate the difference in days
    dateRangeText = `${dateDiff} ngày `;
  }

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    getPaymentDetails(userId).then((res) => {
      setPaymentHistory(res.data);
      console.log(res.data);
    });
  }, []);

  return (
    <Container maxWidth="lg">
      <Card>
        <CardHeader titleTypographyProps={{variant:'h4' }} title="Lịch sử giao dịch" align='center' />
        <CardContent>
          {/* <Typography variant="h4" align="center" gutterBottom>
            Lịch Sử Giao Dịch
          </Typography> */}

          {paymentHistory.paymentReport && paymentHistory.paymentReport.length > 0 ? (
            <Stack boxShadow={3}>
              <Grid sx={{ display: 'flex', justifyContent: 'space-between', margin: '3%' }}>
                <Grid container sx={{ textAlign: 'center' }}>
                  <Grid item xs={12}>
                    <Typography margin={'1%'} variant="subtitle">
                      Tổng Số Tiền Đã Chi Tiêu Trong : {dateRangeText}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography fontSize={'25px'} color={'red'} fontWeight={'bold'} margin={'1%'} variant="subtitle">
                      -{paymentHistory?.totalSend?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container sx={{ textAlign: 'center' }}>
                  <Grid item xs={12}>
                    <Typography margin={'1%'} variant="subtitle">
                      Tổng Số Tiền Nhận Đã Nhận Trong : {dateRangeText}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography fontSize={'25px'} color={'green'} fontWeight={'bold'} margin={'1%'} variant="subtitle">
                      +{paymentHistory?.totalReceive?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Stack>
          ) : (
            <Typography> </Typography>
          )}
          {/* <Stack direction="row" spacing={2} alignItems="center" sx={{ marginTop: '3%', marginBottom: '3%' }}>
          <TextField
            id="start-date"
            label="Ngày Bắt Đầu"
            type="date"
            value={startDate}
            onChange={handleStartDateChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          <TextField
            id="end-date"
            label="Ngày Kết Thúc"
            type="date"
            value={endDate}
            onChange={handleEndDateChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          <Button variant="contained" color="primary">
            <SearchIcon />
          </Button>
        </Stack> */}

          <Divider variant="middle" />

          <Grid item xs={12} sx={{ marginTop: '3%', marginBottom: '3%' }}>
            <TableContainer component={Paper} elevation={3}>
              {' '}
              {/* Add elevation for shadow */}
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Mã Giao Dịch</TableCell>
                    <TableCell>Tài Khoản Paypal</TableCell>
                    <TableCell>Số Tiền</TableCell>
                    <TableCell>Ngày Giao Dịch</TableCell>
                    <TableCell>Tên Sản Phẩm</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paymentHistory.paymentReport && paymentHistory.paymentReport.length > 0 ? (
                    paymentHistory.paymentReport
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) // Pagination logic
                      .map((payment, index) => (
                        <TableRow
                          key={index}
                          style={{
                            boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)',
                            marginBottom: '8px',
                            color: payment.isReceive ? 'green' : 'red', // Change font color
                          }}
                        >
                          <TableCell>{payment.paymentID}</TableCell>
                          <TableCell>{payment.payPalAccount}</TableCell>
                          <TableCell
                            style={{
                              color: payment.isReceive ? 'green' : 'red', // Change font color
                            }}
                          >
                            {payment.isReceive ? '+' : '-'}
                            {payment.paymentTotal.toLocaleString('vi-VN', {
                              style: 'currency',
                              currency: 'VND',
                            })}
                          </TableCell>
                          <TableCell>{new Date(payment.paymentTime).toLocaleString()}</TableCell>
                          <TableCell>{payment.sessionName}</TableCell>
                        </TableRow>
                      ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        Không có lịch sử thanh toán có sẵn.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]} // Options for rows per page
            component="div"
            count={paymentHistory.paymentReport ? paymentHistory.paymentReport.length : 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </CardContent>
      </Card>
    </Container>
  );
};

export default PaymentUserDetail;
