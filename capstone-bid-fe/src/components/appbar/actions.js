import { Avatar, Box, Divider, IconButton, ListItemButton, ListItemIcon, Menu, MenuItem, Tooltip, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import React from "react";
import LogoutFuncion from "../../services/LogoutFunction";
import { MyList, ActionIconsContainerMobile, ActionIconsContainerDesktop } from "../../style/appbar";
import { Colors } from "../../style/theme";

export default function Actions({ matches }) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const logout = LogoutFuncion();
    const open = Boolean(anchorEl);

    
    const user = localStorage.getItem('loginUser');
    const jsonUser = JSON.parse(user);
    const userEmail = !!jsonUser && !!jsonUser.Email;
    console.log(userEmail)
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
                            {userEmail ? ( // If user is logged in (email exists in local storage)
                                <>
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
                                        <MenuItem onClick={handleClose} sx={{ display: "flex", alignItems: "center" }}>
                                        <Avatar/>
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
                                    </Menu>
                                </>
                            ) : ( // If user is not logged in (email does not exist in local storage)
                                <Link to="/login" style={{ textDecoration: "none", color: "inherit" }}>
                                    <Typography variant="button" sx={{ display: 'flex', justifyContent: 'center', color: matches && Colors.white }}>
                                        Đăng Nhập
                                    </Typography>
                                </Link>
                            )}
                        </ListItemIcon>
                    </ListItemButton>
                    <Divider orientation="vertical" flexItem />
                </MyList>
            </Component>
        );
}
