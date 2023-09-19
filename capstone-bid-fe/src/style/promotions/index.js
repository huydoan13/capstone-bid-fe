import { Box, Typography, styled } from "@mui/material";
import { Colors } from "../theme";


export const PromotionsContainer = styled(Box)(({theme}) => ({
    [theme.breakpoints.down("md")]: {
        fontSize:'15px',
        padding:'40px 0px 40px 0px'
    },
    color: Colors.black,
    display: 'flex',
    justifyContent:'center',
    alignItems: 'center',
    padding: '20px 0px 20px 0px',
    overflow:'hidden',
    background:Colors.secondary,
}));

export const MessageText = styled(Typography)(({theme}) => ({
    // fontFamily: '"Montez", "cursive"',
    
    [theme.breakpoints.down("md")]: {
        fontSize: '2rem'
    },
    color: Colors.white,
    fontSize: '1.5rem'
}));