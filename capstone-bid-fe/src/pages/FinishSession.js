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
import FinishProducts from '../components/products-finish/Finish-product';
import Cart from '../components/cart';



function HomePage() {

    return (
        <Container
            maxWidth="xl"
            sx={{
                background: '#fff'
            }}
        >
            <UIProvider>
                <Appbar />
                <Box display={"flex"} justifyContent={"center"} sx={{ p: 4 }}>
                    <Typography  variant="h4">Tài Sản Đã đấu giá</Typography>
                </Box>
                <FinishProducts />
                <Cart/>
                <Footer />
                <AppDrawer />
                <SearchBox/>
            </UIProvider>

        </Container>
    );
}

export default HomePage;