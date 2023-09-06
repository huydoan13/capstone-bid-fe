import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Container, Icon, List, ListItem, ListItemText, Paper, useMediaQuery, Pagination, IconButton, DialogTitle, Dialog, DialogContent, DialogActions, Button, Slide, Typography, Table, TableBody, TableRow, TableCell, TableContainer, TableHead, Stack } from '@mui/material';
import CloseIcon from "@mui/icons-material/Close";
import styled from '@emotion/styled';
import moment from 'moment/moment';
import MoreOutlinedIcon from '@mui/icons-material/MoreOutlined';
import { useTheme } from '@mui/styles';
import { Colors } from "../../style/theme";


const MySessionForm = () => {
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
    const [selectedItem, setSelectedItem] = useState(null);
    const isNotPaySelected = selectedOption === 'notpay' || selectedOption === 'success' || selectedOption === 'fail';
    const isSuccessSelected = selectedOption === 'success';
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down("md"));
    function SlideTransition(props) {
        return <Slide direction="down" {...props} />;
    }



    const apiNotStart = `https://bids-online.azurewebsites.net/api/Sessions/by_not_start_user?id=${jsonUser.Id}`;
    const apiInState = `https://bids-online.azurewebsites.net/api/Sessions/by_in_stage_user?id=${jsonUser.Id}`;
    const apiNotPay = `https://bids-online.azurewebsites.net/api/Sessions/by_havent_pay_user?id=${jsonUser.Id}`;
    const apiComplete = `https://bids-online.azurewebsites.net/api/Sessions/by_complete_user?id=${jsonUser.Id}`;
    const apiFail = `https://bids-online.azurewebsites.net/api/Sessions/by_fail_user?id=${jsonUser.Id}`;
    const apiReceived = `https://bids-online.azurewebsites.net/api/Sessions/by_received_user?id=${jsonUser.Id}`;
    const apiError = `https://bids-online.azurewebsites.net/api/Sessions/by_error_item_user?id=${jsonUser.Id}`;

    useEffect(() => {
        loadItems(option);
    }, [option]);

    useEffect(() => {
        setCurrentPage(1); // Reset current page when items change
    }, [items]);



    const handleOpenPopup = (item) => {
        setSelectedItem(item);
        setIsPopupOpen(true);
        setShowButtonInDialog(selectedOption === 'fail');
    };

    // Function to close the popup dialog
    const handleClosePopup = () => {
        setIsPopupOpen(false);
    };
    const loadItems = (selectedOption) => {
        setLoading(true);
        let apiUrl;
        if (selectedOption === 'waiting') {
            apiUrl = apiNotStart;
        } else if (selectedOption === 'instate') {
            apiUrl = apiInState;
        } else if (selectedOption === 'notpay') {
            apiUrl = apiNotPay;
        } else if (selectedOption === 'success') {
            apiUrl = apiComplete;
        } else if (selectedOption === 'fail') {
            apiUrl = apiFail;
        } else if (selectedOption === 'received') {
            apiUrl = apiReceived;
        } else if (selectedOption === 'error') {
            apiUrl = apiError;
        }

        axios
            .get(apiUrl, { headers: { Authorization: `Bearer ${token}` } })
            .then((response) => setItems(response.data))
            .catch((error) => console.error('Error fetching items:', error))
            .finally(() => {
                setLoading(false); // Hide loading spinner after data is fetched
            });
    };

    const handleFailedAuctionClick = (item) => {
        setSelectedItem(item);
        setIsPopupOpen(true);
    };
    const ProductImageSmallWrapper = styled(Box)({
        display: "flex",
        gap: "8px", // Add some space between small images
    });

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
    const handleImageClick = (index) => {
        setSelectedImageIndex(index);
    };


    const ProductDetailWrapper = styled(Box)(({ theme }) => ({
        display: "flex",
        padding: theme.spacing(4),
    }));


    const TableLabel = styled(Typography)({
        fontWeight: 'bold',
    });


    const ImageProduct = styled(Box)(({ theme }) => ({
        width: '50%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        [theme.breakpoints.down('md')]: {
            width: '100%',
            position: 'relative'
        },
    }));
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

    const ProductDetailInfoWrapper = styled(Paper)(() => ({
        width: '50%',
        display: "flex",
        flexDirection: "column",
        maxWidth: "100%",
        lineHeight: 1.5,
    }));

    const ProductImage = styled('img')(({ src, theme }) => ({

        src: `url(${src})`,
        width: '650px',
        height: '500px',
        background: Colors.light_gray,
        padding: '1%',
        [theme.breakpoints.down('md')]: {

            width: '250px',
            height: '250px',
            padding: '2%',
        }

    }));
    const ProductImageBig = styled('img')(({ src, theme }) => ({
        src: `url(${src})`,
        width: '650px',
        height: '500px',
        background: Colors.light_gray,
        padding: '1%',
        [theme.breakpoints.down('md')]: {
            width: '250px',
            height: '250px',
            padding: '2%',
        },
    }));
    const ProductImageSmall = styled('img')(({ src, theme }) => ({
        src: `url(${src})`,
        width: '100px',
        height: '80px',
        borderRadius: '4px',
        cursor: 'pointer',
        [theme.breakpoints.down('md')]: {
            width: '80px',
            height: '60px',
        },
    }));

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
                        <ListOptionItem button selected={selectedOption === 'waiting'} onClick={() => setSelectedOption('waiting')}>
                            <ListItemText primary="Phiên Đấu giá sắp bắt đầu" />
                        </ListOptionItem>
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
                        <ListOptionItem button selected={selectedOption === 'apiReceived'} onClick={() => setSelectedOption('received')}>
                            <ListItemText primary="Phiên Đấu giá đã nhận hàng" />
                        </ListOptionItem>
                        <ListOptionItem button selected={selectedOption === 'error'} onClick={() => setSelectedOption('error')}>
                            <ListItemText primary="Phiên Đấu giá đã Hoàn Trả" />
                        </ListOptionItem>
                    </List>
                </Paper>
                <Paper elevation={5} sx={{ height: '100%', width: isScreenMd ? '100%' : '100%', ml: isScreenMd ? 0 : '1%', mt: '20px' }}>
                    <Box mt={3} mx={3}>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Tên sản phẩm</TableCell>
                                        <TableCell>
                                            {(selectedOption === 'notpay' || selectedOption === 'success' || selectedOption === 'fail') ? 'Người Thắng Cuộc' : 'Giá Khởi điểm'}
                                            {/* {selectedOption === 'notpay' ? 'Người Thắng Cuộc' : 'Giá Khởi điểm'} */}
                                        </TableCell>
                                        <TableCell>
                                            {(selectedOption === 'notpay' || selectedOption === 'success' || selectedOption === 'fail') ? 'Giá Cuối Cùng' : 'Bước Giá'}
                                        </TableCell>
                                        <TableCell>Thể Loại</TableCell>
                                        <TableCell>Ngày Tạo</TableCell>
                                        <TableCell> </TableCell>
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
                                        (selectedOption === 'waiting' || selectedOption === 'instate') ?
                                            currentItems.map((item) => (
                                                <TableRow key={item.itemId} style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}>
                                                    <TableCell>
                                                        {item.images && item.images.length > 0 ? (
                                                            <img src={item.images[0].detail} alt="" style={{ width: '250px', height: '150px' }} />
                                                        ) : (
                                                            'No Image'
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {selectedOption === 'notpay'
                                                            ? (item.winner || '-')
                                                            : (item.firstPrice?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) || '-')}
                                                    </TableCell>
                                                    <TableCell>
                                                        {selectedOption === 'notpay'
                                                            ? (item.finalPrice?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) || '-')
                                                            : (item.stepPrice?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) || '-')}
                                                    </TableCell>
                                                    <TableCell>{item.categoryName}</TableCell>
                                                    <TableCell>{formatCreateDate(item.createDate)}</TableCell>
                                                    <TableCell>
                                                        <IconButton onClick={() => handleOpenPopup(item)}>
                                                            <MoreOutlinedIcon />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            )) : (
                                                // Other options (notpay, success, fail):
                                                currentItems.map((item) => (
                                                    <TableRow key={item.itemId}>
                                                        <TableCell>{item?.sessionResponseCompletes?.itemName}</TableCell>
                                                        <TableCell>
                                                            {(item.winner || '-')}
                                                        </TableCell>
                                                        <TableCell>
                                                            {(item.sessionResponseCompletes?.finalPrice?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) || '-')}
                                                        </TableCell>
                                                        <TableCell>{item?.sessionResponseCompletes?.categoryName}</TableCell>
                                                        <TableCell>{formatCreateDate(item.createDate)}</TableCell>
                                                        <TableCell>
                                                            <IconButton onClick={() => handleOpenPopup(item)}>
                                                                <MoreOutlinedIcon />
                                                            </IconButton>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )
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
                    </Box>
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
                        Thông Tin Sản Phẩm
                        <IconButton onClick={handleClosePopup}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                {selectedItem && (
                    <>
                        <ProductDetailWrapper display={"flex"} flexDirection={matches ? "column" : "row"}>

                            {isNotPaySelected ? (
                                <ImageProduct sx={{ mr: 4 }}>
                                    <ProductImageBig
                                        src={selectedItem?.sessionResponseCompletes?.images?.[selectedImageIndex]?.detail || ''}
                                        alt={`Big Image`}
                                    />
                                    <ProductImageSmallWrapper>
                                        {selectedItem?.sessionResponseCompletes?.images?.map((images, index) => (
                                            <ProductImageSmall
                                                key={index}
                                                src={images.detail}
                                                alt={`Image ${index + 1}`}
                                                onClick={() => handleImageClick(index)}
                                            />
                                        ))}
                                    </ProductImageSmallWrapper>
                                </ImageProduct>
                            ) : (

                                <ImageProduct sx={{ mr: 4 }}>
                                    <ProductImageBig
                                        src={selectedItem.images?.[selectedImageIndex]?.detail || ''}
                                        alt={`Big Image`}
                                    />
                                    <ProductImageSmallWrapper>
                                        {selectedItem.images?.map((image, index) => (
                                            <ProductImageSmall
                                                key={index}
                                                src={image.detail}
                                                alt={`Image ${index + 1}`}
                                                onClick={() => handleImageClick(index)}
                                            />
                                        ))}
                                    </ProductImageSmallWrapper>
                                </ImageProduct>
                            )}



                            {isNotPaySelected ? (
                                <>
                                    {/* <TableRow>
                                        <TableCell>
                                            <TableLabel>Tên sản phẩm:</TableLabel>
                                        </TableCell>
                                        <TableCell>{selectedItem?.sessionResponseCompletes?.itemName}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            <TableLabel>Mô Tả sản phẩm:</TableLabel>
                                        </TableCell>
                                        <TableCell>{selectedItem?.sessionResponseCompletes?.description}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            <TableLabel>Người Thắng Cuộc:</TableLabel>
                                        </TableCell>
                                        <TableCell>
                                            {selectedItem.winner || '-'}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            <TableLabel>Giá Cuối Cùng:</TableLabel>
                                        </TableCell>
                                        <TableCell>
                                            {selectedItem?.sessionResponseCompletes?.finalPrice?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) || '-'}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            <TableLabel>Thể Loại:</TableLabel>
                                        </TableCell>
                                        <TableCell>{selectedItem?.sessionResponseCompletes?.categoryName}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            <TableLabel>Ngày Tạo:</TableLabel>
                                        </TableCell>
                                        <TableCell>{formatCreateDate(selectedItem.createDate)}</TableCell>
                                    </TableRow> */}
                                    <ProductDetailInfoWrapper>
                                        <Stack
                                            sx={{
                                                boxShadow: 12,
                                                padding: 2,

                                            }}
                                        >
                                            <Typography sx={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                            }}>
                                                <Typography margin={'1%'} align="inherit" color={"#696969"} variant="subtitle">Tên sản phẩm:</Typography>
                                                <Typography margin={'1%'} align="right" color={"#B41712"} variant="subtitle"> {selectedItem.itemName} </Typography>
                                            </Typography>
                                            <Typography sx={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                            }}>
                                                <Typography margin={'1%'} align="inherit" color={"#696969"} variant="subtitle">Mô Tả sản phẩm:</Typography>
                                                <Typography margin={'1%'} align="right" color={"#B41712"} variant="subtitle"> {selectedItem?.description} </Typography>
                                            </Typography>
                                            <Typography sx={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                            }}>
                                                <Typography margin={'1%'} align="inherit" color={"#696969"} variant="subtitle">Người Thắng Cuộc:</Typography>
                                                <Typography margin={'1%'} align="right" color={"#B41712"} variant="subtitle"> {selectedItem.winner || '-'} </Typography>
                                            </Typography>
                                            <Typography sx={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                            }}>
                                                <Typography margin={'1%'} align="inherit" color={"#696969"} variant="subtitle">Giá Cuối Cùng:</Typography>
                                                <Typography margin={'1%'} align="right" color={"#B41712"} variant="subtitle"> {selectedItem?.sessionResponseCompletes?.finalPrice?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) || '-'} </Typography>
                                            </Typography>
                                            <Typography sx={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                            }}>
                                                <Typography margin={'1%'} align="inherit" color={"#696969"} variant="subtitle">Thể Loại:</Typography>
                                                <Typography margin={'1%'} align="right" color={"#B41712"} variant="subtitle"> {selectedItem?.categoryName} </Typography>
                                            </Typography>
                                            <Typography sx={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                            }}>
                                                <Typography margin={'1%'} align="inherit" color={"#696969"} variant="subtitle">Ngày Tạo:</Typography>
                                                <Typography margin={'1%'} align="right" color={"#B41712"} variant="subtitle"> {formatCreateDate(selectedItem?.createDate)} </Typography>
                                            </Typography>
                                        </Stack>
                                    </ProductDetailInfoWrapper>
                                </>
                            ) : (
                                <>
                                    <ProductDetailInfoWrapper>
                                        {/* <TableRow>
                                                    <TableCell>
                                                        <TableLabel>Tên sản phẩm:</TableLabel>
                                                    </TableCell>
                                                    <TableCell>{selectedItem.itemName}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>
                                                        <TableLabel>Mô Tả sản phẩm:</TableLabel>
                                                    </TableCell>
                                                    <TableCell>{selectedItem?.description}</TableCell>
                                                </TableRow>
                                                
                                                <TableRow>
                                                    <TableCell>
                                                        <TableLabel>Giá Khởi điểm:</TableLabel>
                                                    </TableCell>
                                                    <TableCell>
                                                        {selectedItem.firstPrice?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) || '-'}
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>
                                                        <TableLabel>Bước Giá:</TableLabel>
                                                    </TableCell>
                                                    <TableCell>
                                                        {selectedItem?.stepPrice?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) || '-'}
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>
                                                        <TableLabel>Thể Loại:</TableLabel>
                                                    </TableCell>
                                                    <TableCell>{selectedItem?.categoryName}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>
                                                        <TableLabel>Ngày Tạo:</TableLabel>
                                                    </TableCell>
                                                    <TableCell>{formatCreateDate(selectedItem?.createDate)}</TableCell>
                                                </TableRow> */}
                                        <Stack
                                            sx={{
                                                boxShadow: 12,
                                                padding: 2,

                                            }}
                                        >
                                            <Typography sx={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                            }}>
                                                <Typography margin={'1%'} align="inherit" color={"#696969"} variant="subtitle">Tên sản phẩm:</Typography>
                                                <Typography margin={'1%'} align="right" color={"#B41712"} variant="subtitle"> {selectedItem.itemName} </Typography>
                                            </Typography>
                                            <Typography sx={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                            }}>
                                                <Typography margin={'1%'} align="inherit" color={"#696969"} variant="subtitle">Mô Tả sản phẩm:</Typography>
                                                <Typography margin={'1%'} align="right" color={"#B41712"} variant="subtitle"> {selectedItem?.description} </Typography>
                                            </Typography>
                                            <Typography sx={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                            }}>
                                                <Typography margin={'1%'} align="inherit" color={"#696969"} variant="subtitle">Giá Khởi điểm:</Typography>
                                                <Typography margin={'1%'} align="right" color={"#B41712"} variant="subtitle"> {selectedItem.firstPrice?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) || '-'} </Typography>
                                            </Typography>
                                            <Typography sx={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                            }}>
                                                <Typography margin={'1%'} align="inherit" color={"#696969"} variant="subtitle">Bước Giá:</Typography>
                                                <Typography margin={'1%'} align="right" color={"#B41712"} variant="subtitle"> {selectedItem?.stepPrice?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) || '-'} </Typography>
                                            </Typography>
                                            <Typography sx={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                            }}>
                                                <Typography margin={'1%'} align="inherit" color={"#696969"} variant="subtitle">Thể Loại:</Typography>
                                                <Typography margin={'1%'} align="right" color={"#B41712"} variant="subtitle"> {selectedItem?.categoryName} </Typography>
                                            </Typography>
                                            <Typography sx={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                            }}>
                                                <Typography margin={'1%'} align="inherit" color={"#696969"} variant="subtitle">Ngày Tạo:</Typography>
                                                <Typography margin={'1%'} align="right" color={"#B41712"} variant="subtitle"> {formatCreateDate(selectedItem?.createDate)} </Typography>
                                            </Typography>
                                            {
                                                selectedItem?.descriptions.map((description, index) => (
                                                    <Typography
                                                        key={index}
                                                        margin={"1%"}
                                                        sx={{
                                                            display: "flex", // Show or hide the descriptions based on state
                                                            justifyContent: "space-between",
                                                        }}
                                                    >
                                                        <Typography color={"#696969"} variant="subtitle">
                                                            {description.description} :
                                                        </Typography>
                                                        <Typography
                                                            color={"#B41712"}
                                                            variant="subtitle"
                                                            sx={{ marginLeft: "auto" }}
                                                        >
                                                            {description.detail}
                                                        </Typography>
                                                    </Typography>
                                                ))
                                            }
                                        </Stack>
                                    </ProductDetailInfoWrapper>
                                </>
                            )}


                            {showButtonInDialog && (
                                <DialogActions>
                                    <Button onClick={() => console.log('Button clicked!')} variant="contained" color="primary">
                                        Đấu Giá Lại
                                    </Button>
                                </DialogActions>
                            )}

                        </ProductDetailWrapper>

                    </>
                )}
            </Dialog>
        </Product>
    );
};

export default MySessionForm;
