import { Link, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search"
import { AppbarContainer, AppbarHeader, MyList } from "../../style/appbar";
import Actions from "./actions";
import { useUIContext } from "../../context/ui";
import LoginActions from "./loginactions";



export default function AppbarDesktopLanding({ matches }) {
    const { setShowSearchBox } = useUIContext();
    return (

        <AppbarContainer>
            <AppbarHeader><Link underline="none" href="/landing">Online Bids</Link></AppbarHeader>
            <MyList type="row">
                <ListItemText primary="Tài Sản Đấu Giá" />
                <ListItemText primary="Cuộc Đấu Giá" />
                <ListItemText primary="Tin Tức" />
                <ListItemText primary="Giới Thiệu" />
                <ListItemText primary="Liên Hệ" />
                <ListItemButton justifyCont onClick={() => setShowSearchBox(true)}>
                    <ListItemIcon >
                        <SearchIcon />
                    </ListItemIcon>
                </ListItemButton>
            </MyList>
            <LoginActions matches={matches} />
        </AppbarContainer>



    );

}