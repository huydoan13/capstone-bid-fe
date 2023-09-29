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
import { useState } from "react";
import { DrawerCloseButton } from "../../style/appbar";
import { Colors } from "../../style/theme";
import { useUIContext } from "../../context/ui";


const MiddleDivider = styled((props) => (
  <Divider variant="middle" {...props} />
))``;

export default function AppDrawer() {
  const { drawerOpen, setDrawerOpen } = useUIContext();

  // Define state to track whether the additional options should be shown
  const [showAdditionalOptions, setShowAdditionalOptions] = useState(false);
  const user = localStorage.getItem('loginUser');
  const jsonUser = JSON.parse(user);
  const role = jsonUser?.Role
  // Function to toggle the visibility of additional options
  const toggleAdditionalOptions = () => {
    setShowAdditionalOptions(!showAdditionalOptions);
  };

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
          <MiddleDivider />
          <ListItemButton onClick={toggleAdditionalOptions}>
            <ListItemText>Cuộc Đấu Giá</ListItemText>
          </ListItemButton>
          {/* Conditionally render additional options when showAdditionalOptions is true */}
          {showAdditionalOptions && (
            <>
              <MiddleDivider />
              <Box marginLeft={"15px"}>

                <ListItemButton component="a" href="/prepare" underline="none" color="inherit">
                  <ListItemText > Cuộc Đấu Giá Sắp Bắt Đầu</ListItemText>
                </ListItemButton>
                <Divider variant="inset"  />
                <ListItemButton component="a" href="/instage" underline="none" color="inherit">
                  <ListItemText >Cuộc Đấu Giá Đang Diễn Ra</ListItemText>
                </ListItemButton>
                <Divider variant="inset" />
              </Box>
            </>

          )}
          <MiddleDivider />

          {role === "User" ? (
            <>
              <ListItemButton component="a" href="/additem">
                <ListItemText sx={{ fontWeight: "bold" }} primary="Thêm Tài Sản Đấu Giá" />
              </ListItemButton>
              <ListItemButton component="a" href="/myitem">
                <ListItemText primary="Tài Sản Của Tôi" />
              </ListItemButton>
              <ListItemButton component="a" href="/myhistory">
                <ListItemText primary="Lịch Sử Đấu Giá" />
              </ListItemButton>
            </>
          ) : (
            <>
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
            </>
          )}

        </List>
      </Drawer>
    </>
  );
}