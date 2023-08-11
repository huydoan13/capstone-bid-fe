import { styled } from "@mui/material/styles";
import { Box, Button, Typography } from "@mui/material";
import { Colors } from "../theme";

const Image ="https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHdpZGUlMjBiYWNrZ3JvdW5kJTIwc25vd3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60"

export const BannerContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    padding: '0px 0px',
    backgroundImage: `url(${Image})`,
    backgroundSize: 'cover',
    [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
        alignItem: 'center'
    }
}));

export const Bannerimage = styled('img')(({src,theme}) => ({
    src:`url(${src})`,
    width: '500px',
    [theme.breakpoints.down('md')]: {
        width: '100%',
    },
    [theme.breakpoints.down('sm')]: {
        width: '100%',
        height: '300px'
    }
    
}));

export const BannerContent = styled(Box)(() => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    maxWidt: 420,
    padding: '30px',
}));

export const BannerTitle = styled(Typography)(({theme}) => ({
    lineHeight: 1.5,
    fontSize: '72px',
    marginBottom: '20px',
    [theme.breakpoints.down('sm')]: {
        fontSize: '42px'
    }
}));

export const BannerDescription = styled(Typography)(({theme}) => ({
    lineHeight: 1.25,
    letterSpacing: 1.25,
    marginBottom: '3em',
    [theme.breakpoints.down("md")]: {
        lineHeight: 1.15,
        letterSpacing: 1.15,
        marginBottom: '1.5em',
    }
}));

export const BannerShopButton = styled(Button, {
    // Configure which props should be forwarded on DOM
    shouldForwardProp: (prop) => prop !== "color",
    name: "MyShopButton",
    slot: "Root",
    // We are specifying here how the styleOverrides are being applied based on props
    overridesResolver: (props, styles) => [
      styles.root,
      props.color === "primary" && styles.primary,
      props.color === "secondary" && styles.secondary,
    ],
  })(({ theme }) => ({
    padding: "20px 0px",
    color: Colors.white,
    fontWeight: "bold",
    fontSize: "16px",
    background: Colors.primary,
    [theme.breakpoints.down("sm")]: {
      padding: "10px 0px",
      fontSize: "14px",
    },
  }));