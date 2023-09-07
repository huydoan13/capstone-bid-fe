import { Avatar, Box, Button, Divider, Drawer, Paper, Typography, colors, useMediaQuery, useTheme } from "@mui/material";

import { useEffect, useState } from "react";
import axios from "axios";

import { Colors } from "../../style/theme";
import { useUIContext } from "../../context/ui";


export default function Cart() {

    const { cart , setShowCart, showCart } = useUIContext();
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('md'))
    const user = localStorage.getItem('loginUser');
    const jsonUser = JSON.parse(user);
    const [sessionData, setSessionData] = useState([]);
    const token = localStorage.getItem('token');
    


    const api = `https://bids-online.azurewebsites.net/api/Sessions/by_user_for_payment?id=${jsonUser?.Id}`
    const fetchSessionData = () => {
        // Fetch data from the API link using Axios
        axios.get(api , { headers: { Authorization: `Bearer ${token}` } })
            .then(response => {
                setSessionData(response.data); // Set the fetched data to the state
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });
    };

    useEffect(() => {
        fetchSessionData();
    }, []);

    const cartContent = sessionData.map(session => (
        <Box key={session.sessionId}>
            <Box display="flex" sx={{
                pt: 2, pb: 2, mr: 2
            }}
                alignItems="start"
                justifyContent={"space-between"}
            >
                {session.images.length > 0 && (
                    <Avatar src={session.images[0].detail} sx={{ width: 50, height: 50, mr: 2, ml: 2 }} />
                )}

                <Box display="flex" flexDirection={"column"} >
                    <Typography variant="h6">{session.itemName}</Typography>
                    {!matches && <Typography variant="subtitle2">{session.description}</Typography>}
                </Box>
                <Typography variant="body1" justifyContent={"end"}>{session.finalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</Typography>

            </Box>
            {matches && <Typography variant="subtitle2">{session.description}</Typography>}
            <Divider variant="inset" />

        </Box>


    ))
    return (
        <Drawer open={showCart} anchor="right"
            onClose={() => setShowCart(false)}
            PaperProps={{
                sx: {
                    width: matches ? "100%" : 550,
                    background: Colors.light_gray,
                    borderRadius: 0,
                }
            }}
        >
            {sessionData.length > 0 ? <Box sx={{ p: 4 }}
                display="flex"
                justifyContent={"center"}
                flexDirection="column"
                alignItems="center"
            >
                <Typography variant="h3" color={Colors.black}>Sản Phẩm Chưa Thanh Toán </Typography>
                <Typography variant="body1" align="center" color={Colors.muted}>Xin vui lòng thanh toán trong vòng 3 ngày nếu không bạn sẽ mất tiền cọc theo quy định của chúng tôi. </Typography>
                <Paper elevation={0}
                    sx={{
                        mt: 2,
                        width: "100%",
                        padding: 2,
                    }}
                >
                    {cartContent}
                </Paper>
                <Button sx={{ mt: 4 }} variant="contained" href="/shoppingcart"> Thanh toán Ngay</Button>
            </Box> : <Box sx={{ p: 4, }}
                display="flex"
                justifyContent={"center"}
                flexDirection="column"
                alignItems="center"


            >
                <Typography variant={matches ? "h5" : "h3"} color={"black"}>Không Có Sản Phẩm</Typography>
            
            </Box>}

            <Button onClick={() => setShowCart(false)}> Đóng</Button>
        </Drawer>
    );
}