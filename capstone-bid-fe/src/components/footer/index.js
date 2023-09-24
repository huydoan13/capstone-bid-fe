import styled from "@emotion/styled";
import {
  Grid,
  List,
  ListItemText,
  Typography,
  Button,
  Stack,
  Container,
  Link,
} from "@mui/material";
import { Box } from "@mui/system";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import SendIcon from "@mui/icons-material/Send";
import { Colors } from "../../style/theme";
import { SubscribeTf, FooterTitle } from "../../style/footer";


const StyledLink = styled(Link)`
  color: inherit; /* Use the default text color */
  text-decoration: none; /* Remove underline */
  transition: color 0.3s; /* Smooth color transition on hover */

  &:hover {
    color: ${Colors.primary}; /* Change color on hover (you can use any color you like) */
  }
`;

export default function Footer() {

  return (
    <Box
      sx={{
        background: Colors.shaft,
        color: Colors.white,
        p: { xs: 4, md: 10 },
        pt: 12,
        pb: 12,
        fontSize: { xs: '12px', md: '14px' }
      }}
    >
      <Grid container spacing={2} justifyContent="center">
        <Grid item md={6} lg={4}>
          <FooterTitle variant="body1">Về chúng tôi.</FooterTitle>
          <Typography variant="caption2">
            BIDs online là hệ thống ứng dụng đấu giá trực tuyến cung cấp dịch vụ đấu giá trực tuyến cho người dùng khắp cả nước sử dụng mọi lúc mọi nơi.
          </Typography>
        </Grid>
        <Grid item md={6} lg={2}>
          <FooterTitle variant="body1">Thông Tin</FooterTitle>
          <List>
            <ListItemText>
              <Typography lineHeight={2} variant="caption2">
                <StyledLink component="a" href="https://docs.google.com/document/d/1wHiHLmHivLH5tboGqxfcfztanMaKYAEFcwhX5U0CNeI/edit?fbclid=IwAR3OaRPLB2kXR-c67JIGYy0sFnNy1XmpRuWHeuMAU4ufsUEjtotPbpGF37c" underline="none" color="inherit">
                  Quy tắc hệ thống
                </StyledLink >
              </Typography>
            </ListItemText>
          </List>
        </Grid>
        <Grid item md={6} lg={2}>
          <FooterTitle variant="body1">Tài khoản của tôi</FooterTitle>
          <List>
            <ListItemText>
              <Typography lineHeight={2} variant="caption2">
                <StyledLink component="a" href="/login" underline="none" color="inherit">
                  Đăng Nhập
                </StyledLink >
              </Typography>
            </ListItemText>
            <ListItemText>
              <Typography lineHeight={2} variant="caption2">
                <StyledLink component="a" href="/shoppingcart" underline="none" color="inherit">
                  Giỏ Hàng
                </StyledLink >
              </Typography>
            </ListItemText>
            <ListItemText>
              <Typography lineHeight={2} variant="caption2">
                <StyledLink component="a" href="/profile" underline="none" color="inherit">
                  Tài Khoản Của Tôi
                </StyledLink >
              </Typography>
            </ListItemText>

          </List>
        </Grid>
        <Grid item md={6} lg={4}>
          <FooterTitle variant="body1">Lưu ý</FooterTitle>
          <Typography variant="caption2">
            Mọi thông tin và hình ảnh trên website đều được sưu tầm trên Internet. Chúng tôi không sở hữu hay chịu trách nhiệm bất kỳ thông tin nào trên web này. Nếu làm ảnh hưởng đến cá nhân hay tổ chức nào, khi được yêu cầu, chúng tôi sẽ xem xét và gỡ bỏ ngay lập tức.
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}