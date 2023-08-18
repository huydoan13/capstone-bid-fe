import { Avatar, Badge, Box, Divider, IconButton, ListItemButton, ListItemIcon, Menu, MenuItem, Tooltip, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import React, { useEffect, useState } from "react";
import axios from "axios";
import LogoutFuncion from "../../services/LogoutFunction";
import { MyList, ActionIconsContainerMobile, ActionIconsContainerDesktop } from "../../style/appbar";
import { Colors } from "../../style/theme";
import { useUIContext } from "../../context/ui";


export default function Actions({ matches }) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const logout = LogoutFuncion();
    const open = Boolean(anchorEl);


    const user = localStorage.getItem('loginUser');
    const jsonUser = JSON.parse(user);
    const userEmail = !!jsonUser && !!jsonUser.Email;
    const role = jsonUser?.Role;
    const { cart, setShowCart } = useUIContext();
    const [sessionData, setSessionData] = useState([]);
    const token = localStorage.getItem('token');

    const fetchSessionData = () => {
        // Fetch data from the API link using Axios
        axios.get(`https://bids-online.azurewebsites.net/api/Sessions/by_user_for_payment?id=${jsonUser?.Id}`, { headers: { Authorization: `Bearer ${token}` } })
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
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const Component = matches
        ? ActionIconsContainerMobile
        : ActionIconsContainerDesktop;


    return (
        <Component>
            <MyList type="row">
                <Divider orientation="vertical" flexItem />

                {userEmail ? ( // If user is logged in (email exists in local storage)
                    <>

                        <ListItemButton sx={{
                            justifyContent: 'center'
                        }}>
                            <ListItemIcon sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                color: matches && Colors.white,
                            }}>
                                <Badge badgeContent={sessionData && sessionData.length} color="secondary">
                                    <ShoppingCartIcon onClick={() => setShowCart(true)} />
                                </Badge>

                            </ListItemIcon>
                        </ListItemButton>
                        <Divider orientation="vertical" flexItem />
                        <ListItemButton
                            sx={{
                                justifyContent: 'center'
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    color: matches && Colors.white,
                                }}
                            >

                                <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                                    <Tooltip title="Account settings">
                                        <IconButton
                                            onClick={handleClick}
                                            size="small"
                                            sx={{ ml: 2 }}
                                            aria-controls={open ? 'account-menu' : undefined}
                                            aria-haspopup="true"
                                            aria-expanded={open ? 'true' : undefined}
                                        >
                                            <Avatar sx={{ width: 32, height: 32 }}>M</Avatar>
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                                <Menu
                                    anchorEl={anchorEl}
                                    id="account-menu"
                                    open={open}
                                    onClose={handleClose}
                                    onClick={handleClose}
                                    PaperProps={{
                                        elevation: 0,
                                        sx: {
                                            overflow: 'visible',
                                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                            mt: 1.5,
                                            '& .MuiAvatar-root': {
                                                width: 32,
                                                height: 32,
                                                ml: -0.5,
                                                mr: 1,
                                            },
                                            '&:before': {
                                                content: '""',
                                                display: 'block',
                                                position: 'absolute',
                                                top: 0,
                                                right: 14,
                                                width: 10,
                                                height: 10,
                                                bgcolor: 'background.paper',
                                                transform: 'translateY(-50%) rotate(45deg)',
                                                zIndex: 0,
                                            },
                                        },
                                    }}
                                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                >
                                    {role === "User" ? (
                                        <>
                                            <MenuItem onClick={handleClose} sx={{ display: "flex", alignItems: "center" }}>
                                                <Avatar />
                                                <Link to="/profile" style={{ textDecoration: "none", color: "inherit" }}>

                                                    <Typography sx={{ marginLeft: 1 }}>Hồ Sơ Cá Nhân</Typography>
                                                </Link>
                                            </MenuItem>
                                            <Divider />
                                            <MenuItem onClick={handleClose} sx={{ display: "flex", alignItems: "center" }}>
                                                <Inventory2OutlinedIcon />
                                                <Link to="/mysession" style={{ textDecoration: "none", color: "inherit" }}>

                                                    <Typography sx={{ marginLeft: 1 }}>Phiên đấu giá của tôi</Typography>
                                                </Link>
                                            </MenuItem>

                                            <MenuItem onClick={handleClose}>
                                                <ListItemIcon>
                                                    <AlternateEmailIcon fontSize="small" />
                                                </ListItemIcon>
                                                {jsonUser.Email}
                                            </MenuItem>
                                            <MenuItem onClick={handleClose}>
                                                <ListItemIcon>
                                                    <Settings fontSize="small" />
                                                </ListItemIcon>
                                                Cài Đặt
                                            </MenuItem>
                                            <MenuItem onClick={logout}>
                                                <ListItemIcon>
                                                    <Logout fontSize="small" />
                                                </ListItemIcon>
                                                Đăng Xuất
                                            </MenuItem>
                                        </>
                                    ) : (
                                        <>
                                            <MenuItem onClick={handleClose} sx={{ display: "flex", alignItems: "center" }}>
                                                <Avatar />
                                                <Link to="/profile" style={{ textDecoration: "none", color: "inherit" }}>
                                                    <Typography sx={{ marginLeft: 1 }}>Hồ Sơ Cá Nhân</Typography>
                                                </Link>
                                            </MenuItem>
                                            <Divider />

                                            <MenuItem onClick={handleClose}>
                                                <ListItemIcon>
                                                    <AlternateEmailIcon fontSize="small" />
                                                </ListItemIcon>
                                                {jsonUser.Email}
                                            </MenuItem>
                                            <MenuItem onClick={handleClose}>
                                                <ListItemIcon>
                                                    <Settings fontSize="small" />
                                                </ListItemIcon>
                                                Cài Đặt
                                            </MenuItem>
                                            <MenuItem onClick={logout}>
                                                <ListItemIcon>
                                                    <Logout fontSize="small" />
                                                </ListItemIcon>
                                                Đăng Xuất
                                            </MenuItem>
                                        </>
                                    )}

                                </Menu>
                            </ListItemIcon>
                        </ListItemButton>

                    </>
                ) : ( // If user is not logged in (email does not exist in local storage)
                    <Link to="/login" style={{ textDecoration: "none", color: "inherit" }}>
                        <Typography variant="button" sx={{ display: 'flex', justifyContent: 'center', color: matches && Colors.white }}>
                            Đăng Nhập
                        </Typography>
                    </Link>
                )
                }
                <Divider orientation="vertical" flexItem />
            </MyList>
        </Component>
    );
}
