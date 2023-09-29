import { Box, Container, Typography } from "@mui/material";
import Appbar from "../components/appbar";
import { UIProvider } from '../context/ui';
import Footer from '../components/footer';
import AppDrawer from '../components/drawer';
import SearchBox from "../components/search";
import ProfilePage from "../components/profile";
import Cart from '../components/cart';




function Profile() {

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
                    <Typography variant="h4">Thông Tin Tài Khoản</Typography>

                </Box>
                <ProfilePage />
                <Cart/>
                <AppDrawer />
                <Footer />
                <AppDrawer />
                <SearchBox />
                </UIProvider>


        </Container>
    );
}

export default Profile;