import { Box, Container, Link, Paper, Typography } from "@mui/material";
import Appbar from '../components/appbar';
import Footer from "../components/footer";
import { UIProvider } from '../context/ui';
import AppDrawer from "../components/drawer";
import SearchBox from "../components/search";
// import SignUpForm from "../components/signup";
import SignUpForm from "../components/signup/signupForm";
// import Appbar from "../components/appbar/index";




function SignUp() {

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
                    <Typography variant="h4">Đăng Kí Tài Khoản</Typography>
                    <Typography variant="h7">Bạn đã có tài khoản? <Link href="/login" variant="subtitle2" >Đăng Nhập Ngay</Link></Typography>

                </Box>

                <SignUpForm />

                <Box display={"flex"} justifyContent={"center"} sx={{ p: 0.5 }}>
                    <Typography variant="h7"> </Typography>
                </Box>
                <Footer />
                <AppDrawer />
                <SearchBox />
            </UIProvider>

        </Container>
    );
}

export default SignUp;