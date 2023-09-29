import { useMediaQuery, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { BannerContainer, BannerContent, BannerDescription, BannerShopButton, BannerTitle, Bannerimage } from "../../style/banner";

export default function Banner() {
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down("md"));
    return (
        <BannerContainer>
            <Bannerimage  src="assets/images/banner/banner.jpg"/>
            <BannerContent>
                <Typography varriant="h6"> Chào mừng bạn đến với Online Bids</Typography>
                <BannerTitle variant="h2">Nền tảng đấu giá trực tuyến tại Việt Nam</BannerTitle>
                <BannerDescription variant="subtitle">Là một trong những nhà đấu giá tại Việt Nam, Online Bids là đơn vị tiên phong ứng dụng công nghệ thông tin vào hoạt động đấu giá.
                 Online Bids là đơn vị tổ chức cuộc đấu giá trực tuyến chính thống tại Việt Nam, vào ngày 17/07/2020.</BannerDescription>
                <BannerShopButton href="/prepare" color="black">Khám Phá</BannerShopButton>
            </BannerContent>
        </BannerContainer>

    );
}