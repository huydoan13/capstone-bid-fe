import { Link, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import styled from "@emotion/styled";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react"; // Import useState hook
import { AppbarContainer, AppbarHeader, MyList } from "../../style/appbar";
import Actions from "./actions";
import { useUIContext } from "../../context/ui";
import { Colors } from "../../style/theme";


const StyledLink = styled(Link)`
  color: inherit; /* Use the default text color */
  text-decoration: none; /* Remove underline */
  transition: color 0.3s; /* Smooth color transition on hover */

  &:hover {
    color: ${Colors.secondary}; /* Change color on hover (you can use any color you like) */
  }
`;

export default function AppbarDesktop({ matches }) {
    const { setShowSearchBox } = useUIContext();
    const user = localStorage.getItem('loginUser');
    const jsonUser = JSON.parse(user);
    const role = jsonUser?.Role

    // State to handle the dropdown menu
    const [anchorEl, setAnchorEl] = useState(null);

    // Open the dropdown menu
    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    // Close the dropdown menu
    const handleMenuClose = () => {
        setAnchorEl(null);
    };
      

    return (
        <AppbarContainer >
            <AppbarHeader>
                <StyledLink underline="none" href="/home">
                    Online Bids
                </StyledLink>
            </AppbarHeader>
            <MyList type="row">
                {/* <ListItemText primary="Tài Sản Đấu Giá" /> */}
                {/* Add the dropdown for "Cuộc Đấu Giá" */}
                <ListItemButton onClick={handleMenuOpen}>
                    <StyledLink >
                        <ListItemText  primary="Cuộc Đấu Giá" />
                    </StyledLink>
                </ListItemButton>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                >
                    {/* Add the dropdown items */}
                    <MenuItem onClick={handleMenuClose}>
                        <StyledLink component="a" href="/prepare" underline="none" color="inherit">
                            Cuộc Đấu Giá Sắp Bắt Đầu
                        </StyledLink>
                    </MenuItem>
                    <MenuItem onClick={handleMenuClose}>
                        <StyledLink component="a" href="/instage" underline="none" color="inherit">
                            Cuộc Đấu Giá Đang Diễn Ra
                        </StyledLink>
                    </MenuItem>
                    
                </Menu>
                {/* Continue with other list items */}
                {role === "User" ? (
                    <>
                        <ListItemButton >
                            <StyledLink component="a" href="/additem" underline="none" color="inherit">
                                <ListItemText primary="Thêm Tài Sản Đấu Giá" />
                            </StyledLink>
                        </ListItemButton>
                        <ListItemButton >
                            <StyledLink component="a" href="/myitem" underline="none" color="inherit">
                                <ListItemText primary="Tài Sản Của Tôi" />
                            </StyledLink>
                        </ListItemButton>
                        <ListItemButton  >
                            <StyledLink component="a" href="/myhistory" underline="none" color="inherit">
                                <ListItemText primary="Lịch Sử Đấu Giá" />
                            </StyledLink>
                        </ListItemButton>
                    </>
                ) : (
                    <>
                        <ListItemText primary="Tin Tức" />
                        <ListItemText primary="Giới Thiệu" />
                        <ListItemText primary="Liên Hệ" />
                    </>
                )}
                <ListItemButton justifyCont onClick={() => setShowSearchBox(true)}>
                    <ListItemIcon>
                        <SearchIcon />
                    </ListItemIcon>
                </ListItemButton>
            </MyList>
            <Actions matches={matches} />
            <style>
                {`
                    .css-juqb2d {
                        font-weight: 500;
                        font-size: 18px;
                        white-space: nowrap;
                        
                    }
                    .css-10ddaq7:hover {
                        -webkit-text-decoration: none;
                        text-decoration: none;
                        background-color: #fff;
                    }
                `
                
                }
            </style>
        </AppbarContainer>
    );
}
