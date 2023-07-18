import {
    Box,
    Button,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItemButton,
    ListItemText,
    styled,
  } from "@mui/material";

  import CloseIcon from "@mui/icons-material/Close";
  import { lighten } from "polished";
  import { DrawerCloseButton } from "../../style/appbar";
  import { Colors } from "../../style/theme";
  import { useUIContext } from "../../context/ui";
  
  const MiddleDivider = styled((props) => (
    <Divider variant="middle" {...props} />
  ))``; 
  
  export default function AppDrawer() {
    const { drawerOpen, setDrawerOpen } = useUIContext();
  
    return (
      <>
        {drawerOpen && (
          <DrawerCloseButton onClick={() => setDrawerOpen(false)}>
            <CloseIcon
              sx={{
                fontSize: "2.5rem",
                color: lighten(0.09, Colors.secondary),
              }}
            />
          </DrawerCloseButton>
        )}
        <Drawer open={drawerOpen}>
          <List>
            <ListItemButton>
              <ListItemText>Tài Sản Đấu Giá</ListItemText>
            </ListItemButton>
            <MiddleDivider />
            <ListItemButton>
              <ListItemText>Cuộc Đấu Giá</ListItemText>
            </ListItemButton>
            <MiddleDivider />
            <ListItemButton>
              <ListItemText>Tin Tức</ListItemText>
            </ListItemButton>
            <MiddleDivider />
            <ListItemButton>
              <ListItemText>Giới Thiệu</ListItemText>
            </ListItemButton>
            <MiddleDivider />
            <ListItemButton>
              <ListItemText>Liên Hệ</ListItemText>
            </ListItemButton>
            <MiddleDivider />

          </List>
        </Drawer>
      </>
    );
  }