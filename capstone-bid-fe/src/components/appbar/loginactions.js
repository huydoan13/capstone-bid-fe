import { Button, Divider, ListItemButton, ListItemIcon } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingBag"
import PersonIcon from "@mui/icons-material/Person"
import { MyList, ActionIconsContainerMobile, ActionIconsContainerDesktop } from "../../style/appbar";
import { Colors } from "../../style/theme";




export default function  LoginActions({ matches }) {
    const Component = matches
        ? ActionIconsContainerMobile
        : ActionIconsContainerDesktop

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
                        <ShoppingCartIcon />
                    </ListItemIcon>
                </ListItemButton>
                <Divider orientation="vertical" flexItem />
                <ListItemButton
                    sx={{
                        justifyContent: 'center'
                    }}>
                    <ListItemIcon
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            color: matches && Colors.white,
                        }}>
                        
                        <Button variant="contained" href="login">Đăng Nhập</Button>
                    </ListItemIcon>
                </ListItemButton>
                <Divider orientation="vertical" flexItem />
            </MyList>
        </Component>

    )
}