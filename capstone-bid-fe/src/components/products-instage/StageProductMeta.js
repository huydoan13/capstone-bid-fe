import { Typography } from "@mui/material";
import { ProductMetaWrapper } from "../../style/Products";

export default function StageProductMeta({ product, matches }) {

  function formatToVND(price) {
    return price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
  }
    return (
      <ProductMetaWrapper>
        
        <Typography variant={matches ? "h6" : "h5"} lineHeight={2}>
          {product.sessionName}
        </Typography>
        <Typography variant={matches ? "caption" : "body1"}>
        Giá khởi Điểm : {formatToVND(product.firstPrice)}
        </Typography>
        <Typography variant={matches ? "caption" : "body1"}>
          {product.beginTime}
        </Typography>
      </ProductMetaWrapper>
    );
}