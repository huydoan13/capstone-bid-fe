import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Container, Icon, List, ListItem, ListItemText, Paper, useMediaQuery, Pagination, IconButton, DialogTitle, Dialog, DialogContent, DialogActions, Button, Slide, Typography, Table, TableBody, TableRow, TableCell, TableHead, TableContainer } from '@mui/material';
import CloseIcon from "@mui/icons-material/Close";
import styled from '@emotion/styled';
import moment from 'moment/moment';
import MoreOutlinedIcon from '@mui/icons-material/MoreOutlined';
import { useTheme } from '@mui/styles';
import { Colors } from "../../style/theme";


const MyHistoryForm = () => {

    const [option, setOption] = useState('waiting');
    const [selectedOption, setSelectedOption] = useState('waiting');
    const [showButtonInDialog, setShowButtonInDialog] = useState(false);
    const [items, setItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const itemsPerPage = 10; // Number of items to be displayed per page
    const [loading, setLoading] = useState(false);
    const Image = "https://www.shutterstock.com/image-vector/abstract-geometric-background-hexagons-polygonal-260nw-1793797981.jpg"
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('loginUser');
    const jsonUser = JSON.parse(user);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [apiData, setApiData] = useState({});
    const isNotPaySelected = selectedOption === 'notpay';
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down("md"));



    const apiDetail = `https://bids-online.azurewebsites.net/api/SessionDetails/by_session_for_bidder?id=${items[0]?.sessionId}&userId=${jsonUser.Id}`;
    const apiDetailfBidder = `https://bids-online.azurewebsites.net/api/SessionDetails/by_session_for_bidder?id=${items[0]?.sessionResponseCompletes?.sessionId}&userId=${jsonUser.Id}`;
    const apiInState = `https://bids-online.azurewebsites.net/api/Sessions/by_in_stage_user?id=${jsonUser.Id}`;
    const apiNotPay = `https://bids-online.azurewebsites.net/api/Sessions/by_havent_pay_user?id=${jsonUser.Id}`;
    const apiComplete = `https://bids-online.azurewebsites.net/api/Sessions/by_complete_user?id=${jsonUser.Id}`;
    const apiFail = `https://bids-online.azurewebsites.net/api/Sessions/by_fail_user?id=${jsonUser.Id}`;

    useEffect(() => {
        loadItems(option);
    }, [option]);

    useEffect(() => {
        setCurrentPage(1); // Reset current page when items change
    }, [items]);

    console.log(items[0]?.sessionId);

    const handleOpenPopup = (sessionId) => {
        // Fetch the item details using the API

        let apiUrl;

        if (selectedOption === 'instate') {
            apiUrl = `https://bids-online.azurewebsites.net/api/SessionDetails/by_session_for_bidder?id=${items[0]?.sessionId}&userId=${jsonUser.Id}`;
        } else if (selectedOption === 'notpay') {
            apiUrl = `https://bids-online.azurewebsites.net/api/SessionDetails/by_session_for_bidder?id=${sessionId}&userId=${jsonUser.Id}`;
        } else if (selectedOption === 'success') {
            apiUrl = `https://bids-online.azurewebsites.net/api/SessionDetails/by_session_for_bidder?id=${sessionId}&userId=${jsonUser.Id}`;
        } else if (selectedOption === 'fail') {
            apiUrl = `https://bids-online.azurewebsites.net/api/SessionDetails/by_session_for_bidder?id=${sessionId}&userId=${jsonUser.Id}`;
        }

        axios
            .get(apiUrl, { headers: { Authorization: `Bearer ${token}` } })
            .then((response) => {
                setIsPopupOpen(true);
                const responseData = Array.isArray(response.data) ? response.data : [response.data];
                setApiData(responseData);
            })
            .catch((error) => console.error('Error fetching item details:', error));
    };

    // Function to close the popup dialog
    const handleClosePopup = () => {
        setIsPopupOpen(false);
    };


    const loadItems = (selectedOption) => {
        setLoading(true);
        let apiUrl;
        if (selectedOption === 'instate') {
            apiUrl = apiInState;
        } else if (selectedOption === 'notpay') {
            apiUrl = apiNotPay;
        } else if (selectedOption === 'success') {
            apiUrl = apiComplete;
        } else if (selectedOption === 'fail') {
            apiUrl = apiFail;
        }

        axios
            .get(apiUrl, { headers: { Authorization: `Bearer ${token}` } })
            .then((response) => setItems(response.data))
            .catch((error) => console.error('Error fetching items:', error))
            .finally(() => {
                setLoading(false); // Hide loading spinner after data is fetched
            });
    };


    const formatCreateDate = (createDate) => {
        return moment(createDate).format('YYYY-MM-DD HH:mm:ss'); // Adjust the format as per your requirement
    };

    const isScreenMd = useMediaQuery((theme) => theme.breakpoints.down('md'));

    const handlePageChange = (event, newPage) => {
        setCurrentPage(newPage);
    };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = items.slice(startIndex, endIndex);


    const Product = styled(Box)(({ theme }) => ({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        margin: 'auto',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        [theme.breakpoints.down('md')]: {
            width: '100%',
        },
    }));

    const MyTableContainer = styled(Paper)({
        position: 'relative',
        '& thead': {
            position: 'sticky',
            top: 0,
            background: '#f9f9f9',
        },
        [theme.breakpoints.down('md')]: {
            width: '100%',
        },
    });

    useEffect(() => {
        loadItems(selectedOption);
    }, [selectedOption]);

    const ListOptionItem = styled(ListItem)(({ theme, selected }) => ({
        "&:hover": {
            backgroundColor: selected ? Colors.secondary : Colors.transparent,
            cursor: 'pointer',
        },
        backgroundColor: selected ? Colors.secondary : Colors.transparent,
    }));

    return (
        <Product>
            <Box sx={{ width: '100%' }} display="flex" flexDirection={isScreenMd ? 'column' : 'row'} mt={3}>
                <Paper
                    elevation={3}
                    sx={{
                        width: isScreenMd ? '100%' : '25%',
                        mr: isScreenMd ? 0 : '20px',
                        mb: isScreenMd ? '20px' : 0,
                    }}
                >
                    <List>
                        <ListOptionItem button selected={selectedOption === 'instate'} onClick={() => setSelectedOption('instate')}>
                            <ListItemText primary="Phiên Đấu giá đang diễn ra" />
                        </ListOptionItem>
                        <ListOptionItem button selected={selectedOption === 'notpay'} onClick={() => setSelectedOption('notpay')}>
                            <ListItemText primary="Phiên Đấu giá chưa thanh toán" />
                        </ListOptionItem>
                        <ListOptionItem button selected={selectedOption === 'success'} onClick={() => setSelectedOption('success')}>
                            <ListItemText primary="Phiên Đấu giá thành công" />
                        </ListOptionItem>
                        <ListOptionItem button selected={selectedOption === 'fail'} onClick={() => setSelectedOption('fail')}>
                            <ListItemText primary="Phiên Đấu giá thất bại" />
                        </ListOptionItem>
                    </List>
                </Paper>
                <Paper sx={{ width: '100%' }}>
                    <TableContainer sx={{ width: '100%' }}>
                        <Table stickyHeader aria-label="simple table">
                            <TableHead >
                                <TableRow>
                                    <TableCell>Tên sản phẩm</TableCell>
                                    <TableCell>
                                        {selectedOption === 'notpay' || selectedOption === 'fail' || selectedOption === 'success'
                                            ? 'Người Thắng Cuộc'
                                            : 'Giá Khởi điểm'}
                                    </TableCell>
                                    <TableCell>
                                        {selectedOption === 'notpay' || selectedOption === 'fail' || selectedOption === 'success'
                                            ? 'Giá Cuối Cùng'
                                            : 'Giá Hiện Tại'}
                                    </TableCell>
                                    <TableCell>Thể Loại</TableCell>
                                    <TableCell>Ngày Tạo</TableCell>

                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center">
                                            Đang Tải...
                                        </TableCell>
                                    </TableRow>
                                ) : currentItems.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center">
                                            Không Có Sản Phẩm
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    currentItems.map((item) => (
                                        <TableRow key={item.itemId} style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}>
                                            <TableCell>{selectedOption === 'instate' ? item.images && item.images.length > 0 ? (
                                                <img src={item.images[0].detail} alt="" style={{ width: '250px', height: '150px' }} />
                                            ) : (
                                                'No Image'
                                            ) :
                                                item?.sessionResponseCompletes?.images && item?.sessionResponseCompletes?.images.length > 0 ? (
                                                    <img src={item?.sessionResponseCompletes?.images[0].detail} alt="" style={{ width: '250px', height: '150px' }} />
                                                ) : (
                                                    'No Image'
                                                )}</TableCell>
                                            <TableCell>
                                                {selectedOption === 'instate'
                                                    ? (item.firstPrice?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) || '-')
                                                    : (item.winner || '-')}
                                            </TableCell>
                                            <TableCell>
                                                {selectedOption === 'instate'
                                                    ? (item.finalPrice?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) || '-')
                                                    : (item.sessionResponseCompletes?.finalPrice?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) || '-')}
                                            </TableCell>
                                            <TableCell>{selectedOption === 'instate' ? item.categoryName : item?.sessionResponseCompletes?.categoryName}</TableCell>
                                            <TableCell>{formatCreateDate(item.createDate)}</TableCell>
                                            <TableCell>
                                                <IconButton onClick={() => handleOpenPopup(selectedOption === 'instate' ? item : item.sessionResponseCompletes.sessionId)}>
                                                    <MoreOutlinedIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Pagination
                        count={Math.ceil(items.length / itemsPerPage)}
                        page={currentPage}
                        onChange={handlePageChange}
                        color="primary"
                        size="large"
                        sx={{ display: 'flex', justifyContent: 'center', mt: '20px' }}
                    />
                </Paper>
            </Box>

            <Dialog
                // TransitionComponent={SlideTransition}
                variant="permanant"
                open={isPopupOpen}
                fullScreen
            >
                <DialogTitle
                    sx={{ p: 5, backgroundImage: `url(${Image})`, backgroundSize: 'cover' }}
                >
                    <Box
                        display="flex"
                        alignItems="center"
                        justifyContent={"space-between"}
                        fontSize={"25px"}
                    >
                        Lịch Sử Đấu Giá Của Phiên
                        <IconButton onClick={handleClosePopup}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>

                <DialogContent>
                    {/* Loop through the data and display each item */}
                    <MyTableContainer>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">Người Đấu Giá:</TableCell>
                                    <TableCell align="center">Sản Phẩm:</TableCell>
                                    <TableCell align="center">Giá đấu thầu:</TableCell>
                                    <TableCell align="center">Thời Gian Bỏ Giá:</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Array.isArray(apiData) && apiData.map((item) => (
                                    <TableRow key={item.sessionDetailId}>
                                        <TableCell align="center">{item.userName}</TableCell>
                                        <TableCell align="center">{item.itemName}</TableCell>
                                        <TableCell align="center">{item.price}</TableCell>
                                        <TableCell align="center">{item.createDate}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </MyTableContainer>
                    {(!Array.isArray(apiData) || apiData.length === 0) && (
                        <div>No data to display.</div>
                    )}
                </DialogContent>

            </Dialog>
        </Product>
    );
};

export default MyHistoryForm;
