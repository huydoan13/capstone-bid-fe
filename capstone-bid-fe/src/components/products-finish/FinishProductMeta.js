import { Typography } from "@mui/material";
import moment from "moment";
import { ProductMetaWrapper } from "../../style/Products";


export default function StageProductMeta({ product, matches }) {

  function formatToVND(price) {
    return price?.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
  }
  const formatCreateDate = (createDate) => {
    return moment(createDate).format('YYYY-MM-DD HH:mm:ss'); // Adjust the format as per your requirement
  };
    return (
      <ProductMetaWrapper>
        
        <Typography variant={matches ? "h6" : "h5"} lineHeight={2}>
          {product?.sessionResponseCompletes.sessionName}
        </Typography>
        <Typography variant={matches ? "caption" : "body1"}>
        Giá khởi Điểm : {formatToVND(product?.sessionResponseCompletes?.finalPrice)}
        </Typography>
        <Typography variant={matches ? "caption" : "body1"}>
          {formatCreateDate(product?.sessionResponseCompletes?.beginTime)}
        </Typography>
      </ProductMetaWrapper>
    );
}