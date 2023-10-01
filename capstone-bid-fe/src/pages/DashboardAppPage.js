import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { faker } from '@faker-js/faker';
import CircularProgress from '@mui/material/CircularProgress';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import SearchIcon from '@mui/icons-material/Search';
// @mui
import { useTheme } from '@mui/material/styles';
import {
  Grid,
  Container,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
// components
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import axiosInstance from '../services/axios-instance';
import Iconify from '../components/iconify';
// sections
import {
  AppTasks,
  AppNewsUpdate,
  AppOrderTimeline,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppTrafficBySite,
  AppWidgetSummary,
  AppCurrentSubject,
  AppConversionRates,
} from '../sections/@dashboard/app';

// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const theme = useTheme();

  const user = JSON.parse(localStorage.getItem('loginUser'));

  const [selectedMenuItem, setSelectedMenuItem] = useState('Quy1');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startDateUser, setStartDateUser] = useState(null);
  const [endDateUser, setEndDateUser] = useState(null);
  const [startDatePayment, setStartDatePayment] = useState(null);
  const [endDatePayment, setEndDatePayment] = useState(null);
  const [total, setTotal] = useState({});
  const [totalPayment, setTotalPayment] = useState({});
  const [totalCategory, setTotalCategory] = useState({});
  const [totalUser, setTotalUser] = useState({});
  const [categories, setCategories] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [chartCategoryData, setChartCategoryData] = useState([]);
  const [chartUserData, setChartUserData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [maxWidth, setMaxWidth] = React.useState('xs');

  const mapLabelsToColors = (labels) => {
    const colorMap = {
      'Chưa bắt đầu': '#ff5722',
      'Đang diễn ra': '#3f51b5',
      'Chưa thanh toán': '#F7803B',
      'Thành công': '#1FEE26',
      'Thất bại': '#F2041E',
      'Đã nhận hàng': '#2196f3',
      'Nhận hàng lỗi': '#ff9800',
      'Đã xóa': '#795548',
    };

    return labels.map((label) => colorMap[label]);
  };

  const mapUserLabelsToColors = (labels) => {
    const colorMap = {
      'Đã chấp nhận': '#1FEE26',
      'Bị cấm': '#F2041E',
      'Đã từ chối': '#F7803B',
      'Đang chờ duyệt': '#ff9800',
    };

    return labels.map((label) => colorMap[label]);
  };

  // Inside your DashboardAppPage component
  const labelsPayment = [
    'Chưa bắt đầu',
    'Đang diễn ra',
    'Chưa thanh toán',
    'Thành công',
    'Thất bại',
    'Đã nhận hàng',
    'Nhận hàng lỗi',
    'Đã xóa',
  ];

  const labelsCategory = [
    'Chưa bắt đầu',
    'Đang diễn ra',
    'Chưa thanh toán',
    'Thành công',
    'Thất bại',
    'Đã nhận hàng',
    'Nhận hàng lỗi',
    'Đã xóa',
  ];

  const labelsUser = [
    'Đã chấp nhận',
    'Bị cấm',
    'Đã từ chối',
    'Đang chờ duyệt',
  ];

  const chartColorsPayment = mapLabelsToColors(labelsPayment);
  const chartColorsCategory = mapLabelsToColors(labelsCategory); // Define labelsCategory based on your data
  const chartColorsUser = mapUserLabelsToColors(labelsUser); // Define labelsUser based on your data

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get(
          'https://bids-online.azurewebsites.net/api/Login/report_session_total'
        );
        console.log(response);
        setTotal(response.data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.log('Failed to fetch: ', error);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get('https://bids-online.azurewebsites.net/api/Categorys');
        console.log(response);
        setCategories(response.data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.log('Failed to fetch: ', error);
      }
    })();
  }, []);

  const styles = {
    TaskAltIcon: {
      fontSize: '100px',
      color: '#C3E1AE'
    },
    errorIcon: {
      fontSize: '100px',
      color: '#B5E4EB' // Adjust the size as needed // To center it vertically
    },
  };

  // useEffect(() => {
  //   if (selectedCategoryId) {
  //     (async () => {
  //       try {
  //         const response = await axiosInstance.get('https://bids-online.azurewebsites.net/api/Login/report_category', {
  //           params: {
  //             categoryId: selectedCategoryId,
  //             startDate: startDate.toISOString(),
  //             endDate: endDate.toISOString(),
  //           },
  //         });
  //         console.log(response);
  //         setTotalCategory(response.data);
  //       } catch (error) {
  //         console.log('Failed to fetch: ', error);
  //       }
  //     })();
  //   }
  // }, [selectedCategoryId, startDate, endDate]);

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       // Calculate the start and end dates based on the selected menu item
  //       const currentDate = new Date();
  //       const currentYear = currentDate.getFullYear();
  //       let startMonth;
  //       let endMonth;

  //       switch (selectedMenuItem) {
  //         case 'Quy1':
  //           startMonth = 0; // January
  //           endMonth = 2; // March
  //           break;
  //         case 'Quy2':
  //           startMonth = 3; // April
  //           endMonth = 5; // June
  //           break;
  //         case 'Quy3':
  //           startMonth = 6; // July
  //           endMonth = 8; // September
  //           break;
  //         case 'Quy4':
  //           startMonth = 9; // October
  //           endMonth = 11; // December
  //           break;
  //         default:
  //           startMonth = 0;
  //           endMonth = 11;
  //       }

  //       const startDate = new Date(currentYear, startMonth, 1);
  //       const endDate = new Date(currentYear, endMonth + 1, 0);

  //       const response = await axiosInstance.get(
  //         `https://bids-online.azurewebsites.net/api/Login/report_session_total_by_date`,
  //         {
  //           params: {
  //             startDate: startDate.toISOString(),
  //             endDate: endDate.toISOString(),
  //           },
  //         }
  //       );

  //       console.log(response);
  //       setTotalPayment(response.data);
  //       const updatedChartData = [
  //         { label: 'totalCountNotStart', value: response.data.totalCountNotStart },
  //         { label: 'totalCountInStage', value: response.data.totalCountInStage },
  //         { label: 'totalCountHaventTranfer', value: response.data.totalCountHaventTranfer },
  //         { label: 'totalCountComplete', value: response.data.totalCountComplete },
  //         { label: 'totalCountFail', value: response.data.totalCountFail },
  //         { label: 'totalCountReceived', value: response.data.totalCountReceived },
  //         { label: 'totalCountErrorItem', value: response.data.totalCountErrorItem },
  //         { label: 'totalCountDelete', value: response.data.totalCountDelete },
  //       ];

  //       setChartData(updatedChartData);
  //     } catch (error) {
  //       console.log('Failed to fetch: ', error);
  //     }
  //   })();
  // }, [selectedMenuItem]);


  const handleCloseErrorDialog = () => {
    setErrorDialogOpen(false);
  };

  const handleSubmitPayment = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {

      if (!startDatePayment || !endDatePayment) {
        setErrorMessage('Ngày Bắt Đầu Hoặc Kết Thúc Không Được Bỏ Trống');
        setErrorDialogOpen(true);
        setIsLoading(false);
        return; // Exit the function early to prevent the API request
      }
  
      // Check if end date is not greater than start date
      if (endDatePayment <= startDatePayment) {
        setErrorMessage('Ngày Kết Thúc Phải bằng Hoặc Lớn Hơn Ngày Bắt Đầu');
        setErrorDialogOpen(true);
        setIsLoading(false);
        return; // Exit the function early to prevent the API request
      }
  
      const response = await axiosInstance.get('https://bids-online.azurewebsites.net/api/Login/report_session_total_by_date', {
        params: {
          startDate: startDatePayment.toISOString(),
          endDate: endDatePayment.toISOString()
        }
      });
      console.log(response)
      setTotalPayment(response.data);
      setIsLoading(false);
      const updatedChartData = [
        { label: 'Chưa bắt đầu', value: response.data.totalCountNotStart },
        { label: 'Đang diễn ra', value: response.data.totalCountInStage },
        { label: 'Chưa thanh toán', value: response.data.totalCountHaventTranfer },
        { label: 'Thành công', value: response.data.totalCountComplete },
        { label: 'Thất bại', value: response.data.totalCountFail },
        { label: 'Đã nhận hàng', value: response.data.totalCountReceived },
        { label: 'Nhận hàng lỗi', value: response.data.totalCountErrorItem },
        { label: 'Đã xóa', value: response.data.totalCountDelete },
      ];
      setChartData(updatedChartData);
    }
    catch (error) {
      setIsLoading(false);
      console.log('Failed to fetch: ', error);
    }
  }

  const handleSubmitCategory = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {

      if (!startDate || !endDate) {
        setErrorMessage('Ngày Bắt Đầu Hoặc Kết Thúc Không Được Bỏ Trống');
        setErrorDialogOpen(true);
        setIsLoading(false);
        return; // Exit the function early to prevent the API request
      }
  
      // Check if end date is not greater than start date
      if (endDate <= startDate) {
        setErrorMessage('Ngày Kết Thúc Phải bằng Hoặc Lớn Hơn Ngày Bắt Đầu');
        setErrorDialogOpen(true);
        setIsLoading(false);
        return; // Exit the function early to prevent the API request
      }
      const response = await axiosInstance.get('https://bids-online.azurewebsites.net/api/Login/report_category', {
        params: {
          categoryId: selectedCategoryId,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
      });
      setIsLoading(false);
      console.log(response);
      setTotalCategory(response.data);

      // Update chartData with the new data from the API response
      const updatedChartData = [
        { label: 'Chưa bắt đầu', value: response.data.totalCountNotStart },
        { label: 'Đang diễn ra', value: response.data.totalCountInStage },
        { label: 'Chưa thanh toán', value: response.data.totalCountHaventTranfer },
        { label: 'Thành công', value: response.data.totalCountComplete },
        { label: 'Thất bại', value: response.data.totalCountFail },
        { label: 'Đã nhận hàng', value: response.data.totalCountReceived },
        { label: 'Nhận hàng lỗi', value: response.data.totalCountErrorItem },
        { label: 'Đã xóa', value: response.data.totalCountDelete },
      ];

      setChartCategoryData(updatedChartData);
    } catch (error) {
      setIsLoading(false);
      console.log('Failed to fetch: ', error);
    }
  };

  const handleSubmitUser = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      if (!startDateUser || !endDateUser) {
        setErrorMessage('Ngày Bắt Đầu Hoặc Kết Thúc Không Được Bỏ Trống');
        setErrorDialogOpen(true);
        setIsLoading(false);
        return; // Exit the function early to prevent the API request
      }
  
      // Check if end date is not greater than start date
      if (endDateUser <= startDateUser) {
        setErrorMessage('Ngày Kết Thúc Phải bằng Hoặc Lớn Hơn Ngày Bắt Đầu');
        setErrorDialogOpen(true);
        setIsLoading(false);
        return; // Exit the function early to prevent the API request
      }
      const response = await axiosInstance.get('https://bids-online.azurewebsites.net/api/Login/report_user', {
        params: {
          startDate: startDateUser.toISOString(),
          endDate: endDateUser.toISOString(),
        },
      });
      console.log(response);
      setTotalUser(response.data);
      setIsLoading(false);
      const updatedChartData = [
        { label: 'Đã chấp nhận', value: response.data.totalAccountAccepted },
        { label: 'Bị cấm', value: response.data.totalAccountBanned },
        // { label: 'Đã từ chối', value: response.data.totalAccountRejected },
        { label: 'Đang chờ duyệt', value: response.data.totalAccountWaiting },
        // { label: 'totalCount', value: response.data.totalCount },
      ];

      setChartUserData(updatedChartData);
    } catch (error) {
      setIsLoading(false);
      console.log('Failed to fetch: ', error);
    }
  };

  return (
    <>
      <Helmet>
        <title> Tổng quan | BIDS </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Xin chào {user?.role}
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Tổng số các phiên đấu giá"
              total={total.totalCount}
              color="primary"
              icon={'mingcute:auction-fill'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Tổng số tiền nhận qua giao dịch" total={total.totalReceive} color="info" icon={'dashicons:money-alt'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Tổng tiền các phiên đấu giá" total={total.totalPrice} color="info" icon={'dashicons:money-alt'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Tổng tiền gửi cho người dùng" total={total.totalSend} color="warning" icon={'ph:package'} />
          </Grid>

          {/* <Grid item xs={12} md={6} lg={8}>
            <AppWebsiteVisits
              title="Website Visits"
              subheader="(+43%) than last year"
              chartLabels={[
                '01/01/2003',
                '02/01/2003',
                '03/01/2003',
                '04/01/2003',
                '05/01/2003',
                '06/01/2003',
                '07/01/2003',
                '08/01/2003',
                '09/01/2003',
                '10/01/2003',
                '11/01/2003',
              ]}
              chartData={[
                {
                  name: 'Team A',
                  type: 'column',
                  fill: 'solid',
                  data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
                },
                {
                  name: 'Team B',
                  type: 'area',
                  fill: 'gradient',
                  data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
                },
                {
                  name: 'Team C',
                  type: 'line',
                  fill: 'solid',
                  data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
                },
              ]}
            />
          </Grid> */}
          <Grid item xs={12} md={12}>
            <form onSubmit={handleSubmitPayment} >
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <DatePicker
                  label="Ngày bắt đầu"
                  value={startDatePayment}
                  onChange={(date) => setStartDatePayment(date)}
                  renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                />
                <DatePicker
                  sx={{ marginLeft: "1%" }}
                  label="Ngày kết thúc"
                  value={endDatePayment}
                  onChange={(date) => setEndDatePayment(date)}
                  renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                />
              </LocalizationProvider>

              <Button
                sx={{ marginLeft: '20px', marginTop: '10px' }}
                type="submit"
                variant="contained"
                color="primary"
                disabled={isLoading} // Disable the button when loading
              >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : <SearchIcon />}
              </Button>
              {/* <Button sx={{marginLeft: '20px', marginTop: '10px'}} type="submit" variant="contained" color="primary">
                Xong
              </Button> */}
            </form>
          </Grid>
          <Grid item xs={12} md={12}>
            <AppCurrentVisits
              title="Thống kê tổng số phiên đấu giá"
              chartData={chartData} // Update chartData with the state variable
              chartColors={chartColorsPayment}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <form onSubmit={handleSubmitCategory}>
              <FormControl fullWidth required margin="normal" sx={{ mb: 3 }}>
                <InputLabel>Chọn loại đấu giá</InputLabel>
                <Select
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                  label="Select Category"
                  sx={{ minWidth: 120 }}
                >
                  {/* Render a list of categories from your API */}
                  {categories.map((category) => (
                    <MenuItem key={category.categoryId} value={category.categoryId}>
                      {category.categoryName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <DatePicker
                  label="Ngày bắt đầu"
                  value={startDate}
                  onChange={(date) => setStartDate(date)}
                  renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                />
                <DatePicker
                  sx={{ marginLeft: "1%" }}
                  label="Ngày kết thúc"
                  value={endDate}
                  onChange={(date) => setEndDate(date)}
                  renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                />
              </LocalizationProvider>
              <Button
                sx={{ marginLeft: '20px', marginTop: '10px' }}
                type="submit"
                variant="contained"
                color="primary"
                disabled={isLoading} // Disable the button when loading
              >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : <SearchIcon />}
              </Button>
            </form>
          </Grid>
          <Grid item xs={12} md={12}>
            <AppCurrentVisits
              title="Thống kê theo thể loại"
              chartData={chartCategoryData} // Update chartData with the state variable
              chartColors={chartColorsCategory}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <form onSubmit={handleSubmitUser}>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <DatePicker
                  label="Ngày bắt đầu"
                  value={startDateUser}
                  onChange={(date) => setStartDateUser(date)}
                  renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                />
                <DatePicker
                  sx={{ marginLeft: "1%" }}
                  label="Ngày kết thúc"
                  value={endDateUser}
                  onChange={(date) => setEndDateUser(date)}
                  renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                />
              </LocalizationProvider>
              <Button
                sx={{ marginLeft: '20px', marginTop: '10px' }}
                type="submit"
                variant="contained"
                color="primary"
                disabled={isLoading} // Disable the button when loading
              >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : <SearchIcon />}
              </Button>
            </form>
          </Grid>
          <Grid item xs={12} md={12}>
            <AppCurrentVisits
              title="Thống kê người dùng"
              chartData={chartUserData} // Update chartData with the state variable
              chartColors={chartColorsUser}
            />
          </Grid>
          {/* <Grid item xs={12} sm={12}>
            <FormControl fullWidth required margin="normal" sx={{ mb: 3 }}>
              <InputLabel>Quy tắc đấu giá</InputLabel>
              <Select
                value={sessionData.sessionRuleId}
                onChange={(event) => setSessionData({ ...sessionData, sessionRuleId: event.target.value })}
                label="Quy tắc đấu giá"
              >
                {sessionRules.map((sessionRule) => (
                  <MenuItem key={sessionRule.sessionRuleId} value={sessionRule.sessionRuleId}>
                    {sessionRule.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid> */}
          {/* <Grid item xs={12} md={6}>
            <AppCurrentVisits
              title="Current Visits"
              chartData={[
                { label: 'America', value: 4344 },
                { label: 'Asia', value: 5435 },
                { label: 'Europe', value: 1443 },
                { label: 'Africa', value: 4443 },
              ]}
              chartColors={[
                theme.palette.primary.main,
                theme.palette.info.main,
                theme.palette.warning.main,
                theme.palette.error.main,
              ]}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <AppCurrentVisits
              title="Current Visits"
              chartData={[
                { label: 'America', value: 4344 },
                { label: 'Asia', value: 5435 },
                { label: 'Europe', value: 1443 },
                { label: 'Africa', value: 4443 },
              ]}
              chartColors={[
                theme.palette.primary.main,
                theme.palette.info.main,
                theme.palette.warning.main,
                theme.palette.error.main,
              ]}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <AppCurrentVisits
              title="Current Visits"
              chartData={[
                { label: 'America', value: 4344 },
                { label: 'Asia', value: 5435 },
                { label: 'Europe', value: 1443 },
                { label: 'Africa', value: 4443 },
              ]}
              chartColors={[
                theme.palette.primary.main,
                theme.palette.info.main,
                theme.palette.warning.main,
                theme.palette.error.main,
              ]}
            />
          </Grid> */}

          {/* <Grid item xs={12} md={6} lg={8}>
            <AppConversionRates
              title="Conversion Rates"
              subheader="(+43%) than last year"
              chartData={[
                { label: 'Italy', value: 400 },
                { label: 'Japan', value: 430 },
                { label: 'China', value: 448 },
                { label: 'Canada', value: 470 },
                { label: 'France', value: 540 },
                { label: 'Germany', value: 580 },
                { label: 'South Korea', value: 690 },
                { label: 'Netherlands', value: 1100 },
                { label: 'United States', value: 1200 },
                { label: 'United Kingdom', value: 1380 },
              ]}
            />
          </Grid> */}

          {/* <Grid item xs={12} md={6} lg={4}>
            <AppCurrentSubject
              title="Current Subject"
              chartLabels={['English', 'History', 'Physics', 'Geography', 'Chinese', 'Math']}
              chartData={[
                { name: 'Series 1', data: [80, 50, 30, 40, 100, 20] },
                { name: 'Series 2', data: [20, 30, 40, 80, 20, 80] },
                { name: 'Series 3', data: [44, 76, 78, 13, 43, 10] },
              ]}
              chartColors={[...Array(6)].map(() => theme.palette.text.secondary)}
            />
          </Grid> */}

          {/* <Grid item xs={12} md={6} lg={8}>
            <AppNewsUpdate
              title="News Update"
              list={[...Array(5)].map((_, index) => ({
                id: faker.datatype.uuid(),
                title: faker.name.jobTitle(),
                description: faker.name.jobTitle(),
                image: `/assets/images/covers/cover_${index + 1}.jpg`,
                postedAt: faker.date.recent(),
              }))}
            />
          </Grid> */}

          {/* <Grid item xs={12} md={6} lg={4}>
            <AppOrderTimeline
              title="Order Timeline"
              list={[...Array(5)].map((_, index) => ({
                id: faker.datatype.uuid(),
                title: [
                  '1983, orders, $4220',
                  '12 Invoices have been paid',
                  'Order #37745 from September',
                  'New order placed #XF-2356',
                  'New order placed #XF-2346',
                ][index],
                type: `order${index + 1}`,
                time: faker.date.past(),
              }))}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppTrafficBySite
              title="Traffic by Site"
              list={[
                {
                  name: 'FaceBook',
                  value: 323234,
                  icon: <Iconify icon={'eva:facebook-fill'} color="#1877F2" width={32} />,
                },
                {
                  name: 'Google',
                  value: 341212,
                  icon: <Iconify icon={'eva:google-fill'} color="#DF3E30" width={32} />,
                },
                {
                  name: 'Linkedin',
                  value: 411213,
                  icon: <Iconify icon={'eva:linkedin-fill'} color="#006097" width={32} />,
                },
                {
                  name: 'Twitter',
                  value: 443232,
                  icon: <Iconify icon={'eva:twitter-fill'} color="#1C9CEA" width={32} />,
                },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppTasks
              title="Tasks"
              list={[
                { id: '1', label: 'Create FireStone Logo' },
                { id: '2', label: 'Add SCSS and JS files if required' },
                { id: '3', label: 'Stakeholder Meeting' },
                { id: '4', label: 'Scoping & Estimations' },
                { id: '5', label: 'Sprint Showcase' },
              ]}
            />
          </Grid> */}
        </Grid>
      </Container>

      <Dialog
        fullWidth maxWidth={maxWidth}
        open={errorDialogOpen}
        onClose={handleCloseErrorDialog}
      >
        <DialogTitle sx={{ textAlign: 'center' }}>
          <ErrorOutlineOutlinedIcon style={styles.errorIcon} />
        </DialogTitle>
        <DialogTitle align='center' variant='h5'>Đã xảy ra Lỗi</DialogTitle>

        <DialogContent>
          <DialogContentText align='center' variant='subtitle2'>
            {errorMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseErrorDialog} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>

    </>
  );
}
