import { Typography } from "@mui/material";
import { ProductMetaWrapper } from "../../style/Products";

export default function StageProductMeta({ product, matches }) {
    return (
      <ProductMetaWrapper>
        
        <Typography variant={matches ? "h6" : "h5"} lineHeight={2}>
          {product.sessionName}
        </Typography>
        <Typography variant={matches ? "caption" : "body1"}>
          {product.finalPrice} VND
        </Typography>
        <Typography variant={matches ? "caption" : "body1"}>
          {product.beginTime}
        </Typography>
      </ProductMetaWrapper>
    );
}