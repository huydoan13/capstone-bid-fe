import { Link, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react"; // Import useState hook
import { AppbarContainer, AppbarHeader, MyList } from "../../style/appbar";
import Actions from "./actions";
import { useUIContext } from "../../context/ui";




export default function AppbarDesktop({ matches }) {
    const { setShowSearchBox } = useUIContext();

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
        <AppbarContainer>
            <AppbarHeader>
                <Link underline="none" href="/home">
                    Online Bids
                </Link>
            </AppbarHeader>
            <MyList type="row">
                <ListItemText primary="Tài Sản Đấu Giá" />
                {/* Add the dropdown for "Cuộc Đấu Giá" */}
                <ListItemButton onClick={handleMenuOpen}>
                    <ListItemText primary="Cuộc Đấu Giá" />
                </ListItemButton>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                >
                    {/* Add the dropdown items */}
                    <MenuItem onClick={handleMenuClose}>
                        <Link component="a" href="/prepare" underline="none" color="inherit">
                            Cuộc Đấu Giá Sắp Bắt Đầu
                        </Link>
                    </MenuItem>
                    <MenuItem onClick={handleMenuClose}>
                        <Link component="a" href="/instage" underline="none" color="inherit">
                            Cuộc Đấu Giá Đang Diễn Ra
                        </Link>
                    </MenuItem>
                    <MenuItem onClick={handleMenuClose}>
                        <Link component="a" href="/finish" underline="none" color="inherit">
                            Cuộc Đấu Giá Đã Kết Thúc
                        </Link>
                    </MenuItem>
                </Menu>
                {/* Continue with other list items */}
                <ListItemText primary="Tin Tức" />
                <ListItemText primary="Giới Thiệu" />
                <ListItemText primary="Liên Hệ" />
                <ListItemButton justifyCont onClick={() => setShowSearchBox(true)}>
                    <ListItemIcon>
                        <SearchIcon />
                    </ListItemIcon>
                </ListItemButton>
            </MyList>
            <Actions matches={matches} />
        </AppbarContainer>
    );
}
