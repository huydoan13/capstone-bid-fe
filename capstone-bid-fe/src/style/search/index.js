const { styled, Box } = require("@mui/material");
const { Colors } = require("../theme");


export const SearchBoxContainer = styled(Box)(({theme}) => ({
    position:'absolute',
    top: 0,
    left : 0,
    width: '100%',
    height: '100%',
    background: Colors.primary,
    display: 'flex',
    justifyContent:'center',
    alignItems:'center',
    zIndex: 99999,
    opacity:0.9
}));