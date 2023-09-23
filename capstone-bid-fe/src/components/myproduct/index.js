import React, { useState, useEffect } from 'react';
import axios, { CancelToken } from 'axios';
import { Box, Container, Icon, List, ListItem, ListItemText, Paper, useMediaQuery, Pagination, IconButton, DialogTitle, Dialog, DialogContent, DialogActions, Button, Slide, Typography, Table, TableBody, TableRow, TableCell, TableContainer, TableHead, Stack } from '@mui/material';
import CloseIcon from "@mui/icons-material/Close";
import styled from '@emotion/styled';
import moment from 'moment/moment';
import MoreOutlinedIcon from '@mui/icons-material/MoreOutlined';
import { useTheme } from '@mui/styles';
import { useNavigate } from 'react-router-dom';
import { Colors } from "../../style/theme";


const MyProductForm = () => {
    const [option, setOption] = useState('waiting');
    const [selectedOption, setSelectedOption] = useState('waiting');
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [items, setItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Number of items to be displayed per page
    const [loading, setLoading] = useState(false);
    const Image = "https://www.shutterstock.com/image-vector/abstract-geometric-background-hexagons-polygonal-260nw-1793797981.jpg"
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('loginUser');
    const jsonUser = JSON.parse(user);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down("md"));
    const [cancelToken, setCancelToken] = useState(null);
    function SlideTransition(props) {
        return <Slide direction="down" {...props} />;
    }
    const navigate = useNavigate();




    const apiUrlWaiting = `https://bids-online.azurewebsites.net/api/BookingItems/by_user_watting?id=${jsonUser.Id}`;
    const apiUrlApproved = `https://bids-online.azurewebsites.net/api/BookingItems/by_user_accepted?id=${jsonUser.Id}`;
    const apiUrlWaitingSession = `https://bids-online.azurewebsites.net/api/BookingItems/by_user_waiting_create_session?id=${jsonUser.Id}`;
    const apiUrlCancelled = `https://bids-online.azurewebsites.net/api/BookingItems/by_user_denied?id=${jsonUser.Id}`;

    useEffect(() => {
        loadItems(option);
    }, [option]);

    useEffect(() => {
        setCurrentPage(1); // Reset current page when items change
    }, [items]);

    const handleImageClick = (index) => {
        setSelectedImageIndex(index);
    };

    const handleOpenPopup = (item) => {
        setSelectedItem(item);
        setIsPopupOpen(true);
    };

    // Function to close the popup dialog
    const handleClosePopup = () => {
        setIsPopupOpen(false);
    };

    const handleReAuctionClick = () => {
        if (selectedItem) {
            const itemId = selectedItem.itemId;
            navigate(`/re-auction/${itemId}`);
        }
    };

    const loadItems = (selectedOption) => {
        
        setLoading(true);
        if (cancelToken) {
            cancelToken.cancel('Operation canceled by the user.');
          }
        
          // Create a new cancel token for the current request
          const source = CancelToken.source();
          setCancelToken(source);
        let apiUrl;

        if (selectedOption === 'waiting') {
            apiUrl = apiUrlWaiting;
        } else if (selectedOption === 'approved') {
            apiUrl = apiUrlApproved;
        } else if (selectedOption === 'waiting-session') {
            apiUrl = apiUrlWaitingSession;
        } else if (selectedOption === 'cancelled') {
            apiUrl = apiUrlCancelled;
        }

        axios
            .get(apiUrl, { headers: { Authorization: `Bearer ${token}` } ,cancelToken: source.token,})
            .then((response) => setItems(response.data))
            .catch((error) => {
                if (axios.isCancel(error)) {
                    // Request was canceled, no need to handle this as an error
                    console.log('Request canceled:', error.message);
                  } else {
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


    const ProductDetailWrapper = styled(Box)(({ theme }) => ({
        display: "flex",
        padding: theme.spacing(4),
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

    const ProductImageSmallWrapper = styled(Box)({
        display: "flex",
        gap: "8px", // Add some space between small images
    });

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
        width: "50%",
        display: "flex",
        flexDirection: "column",
        maxWidth: "100%",
        lineHeight: 1.5,
        [theme.breakpoints.down('md')]: {
          width: '100%',
        }
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
                            <ListItemText primary="Sản Phẩm Chờ Duyệt" />
                        </ListOptionItem>
                        <ListOptionItem button selected={selectedOption === 'waiting-session'} onClick={() => setSelectedOption('waiting-session')}>
                            <ListItemText primary="Sản Phẩm Chưa Lên Sàn" />
                        </ListOptionItem>
                        <ListOptionItem button selected={selectedOption === 'approved'} onClick={() => setSelectedOption('approved')}>
                            <ListItemText primary="Sản Phẩm Đã Lên Sàn" />
                        </ListOptionItem>

                        <ListOptionItem button selected={selectedOption === 'cancelled'} onClick={() => setSelectedOption('cancelled')}>
                            <ListItemText primary="Sản Phẩm Đã Bị Hủy" />
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
                                        <TableCell>Giá Khởi điểm</TableCell>
                                        <TableCell>Bước Giá</TableCell>
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
                                        currentItems.map((item) => (
                                            <TableRow key={item?.itemId} sx={{
                                                boxShadow: 12,
                                                padding: 2,

                                            }} >
                                                <TableCell>{item?.images && item?.images.length > 0 ? (
                                                    <img src={item?.images[0]?.detail} alt="" style={{ width: '250px', height: '150px' }} />
                                                ) : (
                                                    'No Image'
                                                )}</TableCell>
                                                <TableCell>{item?.firstPrice?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</TableCell>
                                                <TableCell>{item?.stepPrice?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</TableCell>
                                                <TableCell>{item?.categoryName}</TableCell>
                                                <TableCell>{formatCreateDate(item?.createDate)}</TableCell>
                                                <TableCell>
                                                    <IconButton onClick={() => handleOpenPopup(item)}>
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
                            <ImageProduct sx={{ mr: 4 }}>
                                <ProductImageBig
                                    src={selectedItem?.images?.[selectedImageIndex]?.detail || ''}
                                    alt={`Big Image`}
                                />
                                <ProductImageSmallWrapper>
                                    {selectedItem.images?.map((image, index) => (
                                        <ProductImageSmall
                                            key={index}
                                            src={image?.detail}
                                            alt={`Image ${index + 1}`}
                                            onClick={() => handleImageClick(index)}
                                        />
                                    ))}
                                </ProductImageSmallWrapper>
                            </ImageProduct>

                            {/* Small Images */}


                            <ProductDetailInfoWrapper>
                                {/* <Table>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>
                                                <TableLabel>Tên sản phẩm:</TableLabel>
                                            </TableCell>
                                            <TableCell>{selectedItem.itemName}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>
                                                <TableLabel>Mô Tả sản phẩm:</TableLabel>
                                            </TableCell>
                                            <TableCell>{selectedItem.descriptionDetail}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>
                                                <TableLabel>Giá Khởi điểm:</TableLabel>
                                            </TableCell>
                                            <TableCell>
                                                {selectedItem.firstPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>
                                                <TableLabel>Bước Giá:</TableLabel>
                                            </TableCell>
                                            <TableCell>
                                            {selectedItem.stepPrice?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) || '-'}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>
                                                <TableLabel>Thể Loại:</TableLabel>
                                            </TableCell>
                                            <TableCell>{selectedItem.categoryName}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>
                                                <TableLabel>Ngày Tạo:</TableLabel>
                                            </TableCell>
                                            <TableCell>{formatCreateDate(selectedItem.createDate)}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table> */}
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
                                        <Typography margin={'1%'} align="right" color={"#B41712"} variant="subtitle"> {selectedItem?.descriptionDetail} </Typography>
                                    </Typography>
                                    <Typography sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                    }}>
                                        <Typography margin={'1%'} align="inherit" color={"#696969"} variant="subtitle">Giá Khởi điểm:</Typography>
                                        <Typography margin={'1%'} align="right" color={"#B41712"} variant="subtitle"> {selectedItem?.firstPrice?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) || '-'} </Typography>
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
                                                    {description?.description} :
                                                </Typography>
                                                <Typography
                                                    color={"#B41712"}
                                                    variant="subtitle"
                                                    sx={{ marginLeft: "auto" }}
                                                >
                                                    {description?.detail}
                                                </Typography>
                                            </Typography>
                                        ))
                                    }
                                    {selectedOption === 'cancelled' && (
                                        <Button variant='contained' onClick={handleReAuctionClick}>
                                            Đấu giá lại
                                        </Button>
                                    )}
                                </Stack>
                            </ProductDetailInfoWrapper>


                        </ProductDetailWrapper>
                    </>
                )}
            </Dialog>
        </Product>
    );
};

export default MyProductForm;