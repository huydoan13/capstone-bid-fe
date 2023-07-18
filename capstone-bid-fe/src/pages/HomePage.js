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
import AppPagination from '../components/pagination';



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
                <Banner />
                <Promotions />
                <Box display={"flex"} justifyContent={"center"} sx={{ p: 4 }}>
                    <Typography variant="h4">Tài Sản Sắp Được đấu giá</Typography>
                </Box>
                <Products />
                {/* <Box display={"flex"} justifyContent={"center"} sx={{ p: 4 }}>
                    <Typography variant="h4">Tài Sản Đang Được đấu giá</Typography>
                </Box>
                <Products /> */}
                <Footer />
                <AppDrawer />
                <SearchBox/>
            </UIProvider>

        </Container>
    );
}

export default HomePage;