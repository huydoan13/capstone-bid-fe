import React, { useState, useEffect } from 'react';
import axios, { CancelToken } from 'axios';
import { Box, Container, Icon, List, ListItem, ListItemText, Paper, useMediaQuery, Pagination, IconButton, DialogTitle, Dialog, DialogContent, DialogActions, Button, Slide, Typography, Table, TableBody, TableRow, TableCell, TableHead, TableContainer, Stack, FormControl, InputLabel, Select, MenuItem, Modal } from '@mui/material';
import CloseIcon from "@mui/icons-material/Close";
import CircularProgress from '@mui/material/CircularProgress';
import styled from '@emotion/styled';
import moment from 'moment/moment';
import MoreOutlinedIcon from '@mui/icons-material/MoreOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
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
    const [open, setOpen] = useState(false);
    const [successOpen, setSuccessOpen] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [apiData, setApiData] = useState([]);
    const isNotPaySelected = selectedOption === 'notpay';
    const [dialogCurrentPage, setDialogCurrentPage] = useState(1);
    const dialogItemsPerPage = 7;
    const [maxWidth, setMaxWidth] = React.useState('sm');
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down("md"));
    const maxPrice = Math.max(...apiData.map((item) => item.price || 0));
    const [selectedReason, setSelectedReason] = useState(''); // State to store the selected reason
    const [sessionIdToError, setSessionIdToError] = useState(null); // State to store the session ID for the PUT request
    const [cancelToken, setCancelToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // const apiDetail = `https://bids-online.azurewebsites.net/api/SessionDetails/by_session_for_bidder?id=${items[0]?.sessionId}&userId=${jsonUser.Id}`;
    // const apiDetailfBidder = `https://bids-online.azurewebsites.net/api/SessionDetails/by_session_for_bidder?id=${items[0]?.sessionResponseCompletes?.sessionId}&userId=${jsonUser.Id}`;
    const apiInState = `https://bids-online.azurewebsites.net/api/Sessions/by_in_stage_by_auctioneer?id=${jsonUser.Id}`;
    const apiNotPay = `https://bids-online.azurewebsites.net/api/Sessions/by_havent_tranfer_by_auctioneer?userId=${jsonUser.Id}`;
    const apiComplete = `https://bids-online.azurewebsites.net/api/Sessions/by_complete_by_auctioneer?userId=${jsonUser.Id}`;
    const apiFail = `https://bids-online.azurewebsites.net/api/Sessions/by_fail_by_auctioneer?userId=${jsonUser.Id}`;
    const apiWinner = `https://bids-online.azurewebsites.net/api/Sessions/by_complete_by_winner?userId=${jsonUser.Id}`;
    const apiRecieve = `https://bids-online.azurewebsites.net/api/Sessions/by_received_by_auctioneer?userId=${jsonUser.Id}`;
    const apiError = `https://bids-online.azurewebsites.net/api/Sessions/by_error_item_by_auctioneer?userId=${jsonUser.Id}`;

    useEffect(() => {
        loadItems(option);
    }, [option]);

    useEffect(() => {
        setCurrentPage(1); // Reset current page when items change
    }, [items]);
    useEffect(() => {
        setDialogCurrentPage(1); // Reset current page when items change
    }, [apiData]);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const handleSuccessClickOpen = () => {
        setSuccessOpen(true);
    };

    const handleSuccessClose = () => {

        loadItems(option);
        setOpen(false);
        setIsPopupOpen(false);
        setSuccessOpen(false);
    };
    const handleReasonChange = (event) => {
        setSelectedReason(event.target.value);
    };

    console.log(items[0]?.sessionId);

    const handleRecieve = () => {
        setIsLoading(true);
        console.log(sessionIdToError);
        if (!sessionIdToError) {
            alert('Session ID is missing.'); // You can replace this with a more user-friendly error message
            return;
        }

        // Create the PUT request URL
        const apiUrl = `https://bids-online.azurewebsites.net/api/Sessions/session_status_to_received`;

        // Create the request body
        const requestBody = {
            sessionID: sessionIdToError,
        };

        // Send the PUT request
        axios
            .put(apiUrl, requestBody)
            .then((response) => {
                // Handle the response (success or failure)
                // You can add your logic here, e.g., show a success message
                console.log('PUT request successful:', response);
                loadItems(option);
                setSuccessOpen(true);
                setIsLoading(false);
            })
            .catch((error) => {
                // Handle the error
                console.error('Error making PUT request:', error);
                setIsLoading(false);
                // You can display an error message here
            });
    };
    const handleConfirmReturn = () => {
        // Check if a reason has been selected
        setIsLoading(true);
        if (!selectedReason) {
            alert('Vui lòng chọn lý do trả lại tài sản.'); // You can replace this with a more user-friendly error message
            return;
        }
        console.log(sessionIdToError);
        if (!sessionIdToError) {
            alert('Session ID is missing.'); // You can replace this with a more user-friendly error message
            return;
        }
        const apiUrl = `https://bids-online.azurewebsites.net/api/Sessions/session_status_to_error_item?reason=${selectedReason}`;
        const requestBody = {
            sessionID: sessionIdToError,
        };
        axios
            .put(apiUrl, requestBody)
            .then((response) => {
                console.log('PUT request successful:', response);
                // Close the dialog
                loadItems(option);
                setOpen(false);
                setIsPopupOpen(false);
                setIsLoading(false);
            })
            .catch((error) => {
                // Handle the error
                setIsLoading(false);
                console.error('Error making PUT request:', error);
            });
    };
    const handleOpenDialog = (sessionId) => {
        setSessionIdToError(sessionId);
        setOpen(true);
    };
    const handleCloseDialog = () => {
        setOpen(false);
        setSelectedReason('');
    };
    const handleOpenPopup = (sessionId, page) => {

        let apiUrl;
        setSessionIdToError(sessionId);

        if (selectedOption === 'instate') {
            apiUrl = `https://bids-online.azurewebsites.net/api/SessionDetails/by_session?id=${sessionId}`;
        } else if (selectedOption === 'notpay') {
            apiUrl = `https://bids-online.azurewebsites.net/api/SessionDetails/by_session?id=${sessionId}`;
        } else if (selectedOption === 'success') {
            apiUrl = `https://bids-online.azurewebsites.net/api/SessionDetails/by_session?id=${sessionId}`;
        } else if (selectedOption === 'fail') {
            apiUrl = `https://bids-online.azurewebsites.net/api/SessionDetails/by_session?id=${sessionId}`;
        } else if (selectedOption === 'pay-success') {
            apiUrl = `https://bids-online.azurewebsites.net/api/SessionDetails/by_session?id=${sessionId}`;
        } else if (selectedOption === 'received') {
            apiUrl = `https://bids-online.azurewebsites.net/api/SessionDetails/by_session?id=${sessionId}`;
        } else if (selectedOption === 'error') {
            apiUrl = `https://bids-online.azurewebsites.net/api/SessionDetails/by_session?id=${sessionId}`;
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
    const handleClosePopup = () => {
        setIsPopupOpen(false);
    };
    const loadItems = (selectedOption) => {
        setIsLoading(true);
        setLoading(true);

        if (cancelToken) {
            cancelToken.cancel('Operation canceled by the user.');
        }
        const source = CancelToken.source();
        setCancelToken(source);
        let apiUrl;
        if (selectedOption === 'instate') {
            apiUrl = apiInState;
        } else if (selectedOption === 'notpay') {
            apiUrl = apiNotPay;
        } else if (selectedOption === 'success') {
            apiUrl = apiComplete;
        } else if (selectedOption === 'fail') {
            apiUrl = apiFail;
        } else if (selectedOption === 'pay-success') {
            apiUrl = apiWinner;
        } else if (selectedOption === 'received') {
            apiUrl = apiRecieve;
        } else if (selectedOption === 'error') {
            apiUrl = apiError;
        }
        axios
            .get(apiUrl, {
                headers: { Authorization: `Bearer ${token}` },
                cancelToken: source.token, // Use the new cancel token
            })
            .then(response => {
                setIsLoading(false);
                setItems(response.data);
            })
            .catch((error) => {
                if (axios.isCancel(error)) {
                    // Request was canceled, no need to handle this as an error
                    setIsLoading(false);
                    console.log('Request canceled:', error.message);
                } else {
                    setIsLoading(false);
                    console.error('Error fetching items:', error);
                }
            })
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
    const startIndexDialog = (dialogCurrentPage - 1) * dialogItemsPerPage;
    const endIndexDialog = startIndexDialog + dialogItemsPerPage;
    const currentItemsDialog = apiData.slice(startIndexDialog, endIndexDialog);
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
    const styles = {
        errorIcon: {
            fontSize: '100px',
            color: '#B5E4EB' // Adjust the size as needed // To center it vertically
        },
        TaskAltIcon: {
            fontSize: '150px',
            color: '#C3E1AE'
        }
    };
    return (
        <Product>
            {isLoading && (
                <Dialog fullWidth maxWidth={maxWidth} open={isLoading}>
                    <DialogTitle align='center'>Đang tải</DialogTitle>
                    <DialogContent>
                        {/* You can customize the loading message or add a spinner here */}
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <CircularProgress color="primary" size={60} />
                        </div>
                    </DialogContent>
                </Dialog>
            )}
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
                            <ListItemText primary="Cuộc Đấu giá đang diễn ra" />
                        </ListOptionItem>
                        <ListOptionItem button selected={selectedOption === 'notpay'} onClick={() => setSelectedOption('notpay')}>
                            <ListItemText primary="Cuộc Đấu giá chưa thanh toán" />
                        </ListOptionItem>
                        <ListOptionItem button selected={selectedOption === 'success'} onClick={() => setSelectedOption('success')}>
                            <ListItemText primary="Cuộc Đấu giá thành công" />
                        </ListOptionItem>
                        <ListOptionItem button selected={selectedOption === 'fail'} onClick={() => setSelectedOption('fail')}>
                            <ListItemText primary="Cuộc Đấu giá thất bại" />
                        </ListOptionItem>
                        <ListOptionItem button selected={selectedOption === 'pay-success'} onClick={() => setSelectedOption('pay-success')}>
                            <ListItemText primary="Thắng cuộc đã thanh toán" />
                        </ListOptionItem>
                        <ListOptionItem button selected={selectedOption === 'received'} onClick={() => setSelectedOption('received')}>
                            <ListItemText primary="Đã nhận Tài sản" />
                        </ListOptionItem>
                        <ListOptionItem button selected={selectedOption === 'error'} onClick={() => setSelectedOption('error')}>
                            <ListItemText primary="Hoàn trả tài sản" />
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
                                        {selectedOption === 'notpay' || selectedOption === 'fail' || selectedOption === 'success' || selectedOption === 'pay-success' || selectedOption === 'received' || selectedOption === 'error'
                                            ? 'Người Thắng Cuộc'
                                            : 'Giá Khởi điểm'}
                                    </TableCell>
                                    <TableCell>
                                        {selectedOption === 'notpay' || selectedOption === 'fail' || selectedOption === 'success' || selectedOption === 'pay-success' || selectedOption === 'received' || selectedOption === 'error'
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
                                                    ? (item?.firstPrice?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) || '-')
                                                    : (item?.winner || '-')}
                                            </TableCell>
                                            <TableCell>
                                                {selectedOption === 'instate'
                                                    ? (item.finalPrice?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) || '-')
                                                    : (item.sessionResponseCompletes?.finalPrice?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) || '-')}
                                            </TableCell>
                                            <TableCell>{selectedOption === 'instate' ? item?.categoryName : item?.sessionResponseCompletes?.categoryName}</TableCell>
                                            <TableCell>{formatCreateDate(item?.createDate)}</TableCell>
                                            <TableCell>
                                                <IconButton onClick={() => handleOpenPopup(selectedOption === 'instate' ? item.sessionId : item.sessionResponseCompletes.sessionId)}>
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
            {(selectedOption === 'pay-success') ? (

                <Modal
                    open={isPopupOpen}
                    onClose={handleClosePopup}
                    aria-labelledby="bid-dialog-title"
                    aria-describedby="bid-dialog-description"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Box
                        sx={{
                            bgcolor: 'background.paper',
                            border: '2px solid #000',
                            borderRadius: '0', // Remove border radius
                            p: 4,
                            width: '100%', // Set width to 100%
                            height: '100%', // Set height to 100%
                            maxWidth: 'none', // Remove max width
                            maxHeight: 'none', // Remove max height
                        }}
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
                            {Array.isArray(apiData) && apiData.length > 0 ? (
                                <MyTableContainer>
                                    <Table aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align="center">Người Đấu Giá:</TableCell>
                                                <TableCell align="center">Sản Phẩm:</TableCell>
                                                <TableCell align="center">Giá đấu thầu:</TableCell>
                                                <TableCell align="center">Thời Gian Bỏ Giá:</TableCell>
                                                {selectedOption !== 'instate' && <TableCell align="center">Kết quả</TableCell>}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {currentItemsDialog.map((item) => (
                                                <TableRow key={item.sessionDetailId}>
                                                    <TableCell align="center">{item?.userName}</TableCell>
                                                    <TableCell align="center">{item?.itemName}</TableCell>
                                                    <TableCell align="center">
                                                        {item?.price?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) || '-'}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        {item?.createDate ? new Date(item.createDate).toLocaleString('vi-VN') : '-'}
                                                    </TableCell>
                                                    {selectedOption !== 'instate' && <TableCell align="center" style={{ color: item?.price === maxPrice ? 'green' : 'red' }}>
                                                        {item?.price === maxPrice ? 'Trúng Đấu Giá' : 'Không Trúng Đấu Giá'}
                                                    </TableCell>}
                                                </TableRow>
                                            ))}

                                        </TableBody>
                                    </Table>
                                    <Stack
                                        spacing={2}
                                        direction="row"
                                        justifyContent="flex-end" // Align to the right
                                        padding={2} // Optional padding
                                        marginTop={"1%"}
                                        marginRight={"5%"}
                                    >

                                        <Button

                                            variant="contained"
                                            color="primary"

                                            onClick={handleRecieve}
                                            disabled={isLoading} // Disable when loading
                                        >
                                            {isLoading ? <CircularProgress size={24} /> : 'Đã Nhận Hàng'}
                                        </Button>
                                        <Button

                                            variant="contained"
                                            color="primary"

                                            onClick={handleClickOpen}
                                            disabled={isLoading} // Disable when loading
                                        >
                                            {isLoading ? <CircularProgress size={24} /> : 'Trả Hàng Hoàn Tiền'}
                                        </Button>
                                        {/* <Button variant="outlined" onClick={handleRecieve}>Đã Nhận Hàng</Button>
                                    <Button variant="outlined" onClick={handleClickOpen} >Trả Hàng Hoàn Tiền</Button> */}
                                    </Stack>
                                </MyTableContainer>

                            ) : (
                                <div>No data to display.</div>
                            )}
                        </DialogContent>
                        <Pagination
                            count={Math.ceil(apiData.length / dialogItemsPerPage)}
                            page={dialogCurrentPage}
                            onChange={(event, page) => setDialogCurrentPage(page)}
                            color="primary"
                            size="large"
                            sx={{ display: 'flex', justifyContent: 'center', mt: '20px' }}
                        />
                    </Box>
                </Modal>


            ) : (
                <Modal
                    open={isPopupOpen}
                    onClose={handleClosePopup}
                    aria-labelledby="bid-dialog-title"
                    aria-describedby="bid-dialog-description"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Box
                        sx={{
                            bgcolor: 'background.paper',
                            border: '2px solid #000',
                            borderRadius: '0', // Remove border radius
                            p: 4,
                            width: '100%', // Set width to 100%
                            height: '100%', // Set height to 100%
                            maxWidth: 'none', // Remove max width
                            maxHeight: 'none', // Remove max height
                        }}
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
                            {Array.isArray(apiData) && apiData.length > 0 ? (
                                <MyTableContainer>
                                    <Table aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align="center">Người Đấu Giá:</TableCell>
                                                <TableCell align="center">Sản Phẩm:</TableCell>
                                                <TableCell align="center">Giá đấu thầu:</TableCell>
                                                <TableCell align="center">Thời Gian Bỏ Giá:</TableCell>
                                                {selectedOption !== 'instate' && <TableCell align="center">Kết quả</TableCell>}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {currentItemsDialog.map((item) => (
                                                <TableRow key={item.sessionDetailId}>
                                                    <TableCell align="center">{item?.userName}</TableCell>
                                                    <TableCell align="center">{item?.itemName}</TableCell>
                                                    <TableCell align="center">
                                                        {item?.price?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) || '-'}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        {item?.createDate ? new Date(item.createDate).toLocaleString('vi-VN') : '-'}
                                                    </TableCell>
                                                    {selectedOption !== 'instate' && <TableCell align="center" style={{ color: item?.price === maxPrice ? 'green' : 'red' }}>
                                                        {item?.price === maxPrice ? 'Trúng Đấu Giá' : 'Không Trúng Đấu Giá'}
                                                    </TableCell>}
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </MyTableContainer>
                            ) : (
                                <div>No data to display.</div>
                            )}
                        </DialogContent>
                        <Pagination
                            count={Math.ceil(apiData.length / dialogItemsPerPage)}
                            page={dialogCurrentPage}
                            onChange={(event, page) => setDialogCurrentPage(page)}
                            color="primary"
                            size="large"
                            sx={{ display: 'flex', justifyContent: 'center', mt: '20px' }}
                        />

                    </Box>
                </Modal>
            )}
            
            <Modal
                open={open}
                onClose={handleCloseDialog}
                aria-labelledby="bid-dialog-title"
                aria-describedby="bid-dialog-description"
                BackdropProps={{
                    style: {
                      backgroundColor: 'transparent', // or 'rgba(0, 0, 0, 0)'
                    },
                  }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 700,
                        bgcolor: 'background.paper',
                        borderRadius: '5px',
                        boxShadow: 24,
                        p: 4,
                    }}
                >

                    <DialogTitle sx={{ textAlign: 'center' }}>
                        <ErrorOutlineOutlinedIcon style={styles.errorIcon} />
                    </DialogTitle>
                    <DialogTitle variant="h4" align="center">
                        Xác nhận trả hàng
                    </DialogTitle>
                    <DialogContent>
                        <Typography variant="subtitle2" sx={{ marginBottom: '25px' }} align="center">
                            Bạn có đồng ý trả lại tài sản lưu ý bạn sẽ mất số tiền tham gia và tiền cọc của tài sản
                        </Typography>
                        <Typography variant="subtitle1" sx={{ marginBottom: '25px' }} align="center">
                            Xin vui lòng chọn lý do hoàn trả tài sản
                        </Typography>
                        <FormControl fullWidth>
                            <InputLabel>Lý do hoàn trả</InputLabel>
                            <Select
                                value={selectedReason}
                                onChange={handleReasonChange}
                            >
                                <MenuItem value="Tài sản không đúng với mô tả">Tài sản không đúng với mô tả</MenuItem>
                                <MenuItem value="Tôi không muốn mua tài sản này nữa">Tôi không muốn mua tài sản này nữa</MenuItem>
                                <MenuItem value="Thay đổi địa chỉ nhận tài sản">Thay đổi địa chỉ nhận tài sản</MenuItem>
                                <MenuItem value="Chưa nhận được tài sản">Chưa nhận được tài sản</MenuItem>
                                <MenuItem value="Lý do khác">Lý do khác</MenuItem>
                            </Select>
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleConfirmReturn}
                            disabled={isLoading} // Disable when loading
                        >
                            {isLoading ? <CircularProgress size={24} /> : ' Đồng ý'}
                        </Button>
                        <Button variant="contained" color="error" onClick={handleCloseDialog}>
                            Hủy bỏ
                        </Button>
                    </DialogActions>

                </Box>
            </Modal>
            <Dialog fullWidth maxWidth={maxWidth} open={successOpen} onClose={handleSuccessClose}>
                <DialogTitle sx={{ marginTop: '25px', textAlign: 'center', }}> <TaskAltIcon style={styles.TaskAltIcon} /> </DialogTitle>
                <DialogTitle variant='h4' align='center' >Thành Công</DialogTitle>
                <DialogContent>
                    <Typography variant='subtitle2' sx={{ marginBottom: "25px" }} align='center'>Đã nhận tài sản thành công, xin cám ơn bạn đã sử dụng dịch vu của chúng tôi</Typography>
                </DialogContent>

                <DialogActions>
                    <Button
                        style={{ width: "200px" }}
                        variant="contained"
                        color="primary"
                        sx={{ marginTop: '20px' }}
                        onClick={handleSuccessClose}
                        disabled={isLoading} // Disable when loading
                    >
                        {isLoading ? <CircularProgress size={24} /> : ' Đồng ý'}
                    </Button>
                    {/* <Button variant="contained" color='success' onClick={handleSuccessClose}>Đồng ý</Button> */}
                </DialogActions>

            </Dialog>

        </Product>
    );
};
export default MyHistoryForm;
