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
import Cart from '../components/cart';
import PaymentSuccessForm from '../components/payment-success-form';
import PaymentSuccessJoinForm from '../components/payment-success-form-join';



function PaymentSuccessJoinPage() {

    return (
        <Container
            maxWidth="xl"
            sx={{
                background: '#fff'
            }}
        >
            <UIProvider>
                <Appbar />
                <PaymentSuccessJoinForm />
                <Cart/>
                <Footer />
                <AppDrawer />
                <SearchBox/>
            </UIProvider>

        </Container>
    );
}

export default PaymentSuccessJoinPage;