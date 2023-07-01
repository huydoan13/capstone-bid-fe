import { Box, Typography, styled } from "@mui/material";
import { Colors } from "../theme";


export const PromotionsContainer = styled(Box)(({theme}) => ({
    [theme.breakpoints.down("md")]: {
        padding:'40px 0px 40px 0px'
    },
    display: 'flex',
    justifyContent:'center',
    alignItems: 'center',
    padding: '20px 0px 20px 0px',
    overflow:'hidden',
    background:Colors.din_grey
}));

export const MessageText = styled(Typography)(({theme}) => ({
    // fontFamily: '"Montez", "cursive"',
    
    [theme.breakpoints.down("md")]: {
        fontSize: '3rem'
    },
    color: Colors.White,
    fontSize: '1.5rem'
}));