import { Box, Container, Link, Paper, Typography } from "@mui/material";
import Appbar from '../components/appbar';
import Footer from "../components/footer";
import { UIProvider } from '../context/ui';
import AppDrawer from "../components/drawer";
import SearchBox from "../components/search";
import ReAuctionForm from "../components/reauction";





export default function Reauction() {
    return (
        <Container
            maxWidth="xl"
            sx={{
                background: '#fff'
            }}
        >
            <UIProvider>
                <Appbar />

                <Box display={"flex"} flexDirection={'column'} alignItems="center" justifyContent={"center"} sx={{ p: 4 }}>
                    <Typography variant="h4">Đăng Kí đấu giá lại tài sản </Typography>
                </Box>
                <ReAuctionForm />
                <Box display={"flex"} justifyContent={"center"} sx={{ p: 0.5 }}>
                    <Typography variant="h7"> </Typography>
                </Box>
                <Footer />
                <AppDrawer />
                <SearchBox />
            </UIProvider>

        </Container>
    )
}