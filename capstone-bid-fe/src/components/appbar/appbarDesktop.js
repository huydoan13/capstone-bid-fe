import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search"
import { AppbarContainer, AppbarHeader, MyList } from "../../style/appbar";
import Actions from "./actions";
import { useUIContext } from "../../context/ui";



export default function AppbarDesktop({ matches }) {
    const { setShowSearchBox } = useUIContext();
    return (

        <AppbarContainer>
            <AppbarHeader>Online Bids</AppbarHeader>
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
            <Actions matches={matches} />
        </AppbarContainer>



    );

}