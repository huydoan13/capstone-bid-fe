import { Box, Button, Container, Pagination, Typography } from '@mui/material';
import React from 'react'
import theme from '../theme';
import Appbar from '../components/appbar';
import Banner from '../components/banner';
import Promotions from '../components/promotions';
import Products from '../components/products';
import Footer from '../components/footer';
import AppDrawer from '../components/drawer';
import { UIProvider } from '../context/ui';
import SearchBox from '../components/search';
import StageProducts from '../components/products-instage/Stage-product';
import MyProductForm from '../components/myproduct';
import { Colors } from "../style/theme";
import Cart from '../components/cart';



function MyProductPage() {
const Image ="https://images.unsplash.com/photo-1644989787501-1397b3231a19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2839&q=80"
    return (
        <Container
            maxWidth="xl"
            sx={{
                background: '#fff'
            }}
        >
            <UIProvider>
                <Appbar />
                <Box display={"flex"} flexDirection= "column" sx={{ p: 8 ,backgroundImage: `url(${Image})`,backgroundSize: 'cover' }}>
                <Typography color={"white"} variant="h4">Danh Mục Tài Sản</Typography>
                <Typography color={"white"} variant="subtitle">Tài Sản Của Tôi</Typography>
                </Box>
                <MyProductForm/>
                <Box display={"flex"} sx={{ p: 1 }}>
                    <Typography variant="h5"> </Typography>
                </Box>
                <Cart/>
                <Footer />
                <AppDrawer />
                <SearchBox/>
            </UIProvider>

        </Container>
    );
}

export default MyProductPage;