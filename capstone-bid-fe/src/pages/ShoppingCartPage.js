import { Box, Button, Container, Pagination, Typography } from '@mui/material';
import React from 'react'

import Appbar from '../components/appbar';
import Banner from '../components/banner';
import Promotions from '../components/promotions';
import Products from '../components/products';
import Footer from '../components/footer';
import AppDrawer from '../components/drawer';
import { UIProvider } from '../context/ui';
import SearchBox from '../components/search';

import Cart from '../components/cart';
import ShoppingCartForm from '../components/shoppingcart';



function ShoppingCartPage() {

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
                    <Typography variant="h4">Giỏ Hàng Của Tôi</Typography>
                </Box>
                <ShoppingCartForm />
                <Cart/>
                <Footer />
                <AppDrawer />
                <SearchBox/>
            </UIProvider>

        </Container>
    );
}

export default ShoppingCartPage;