import { useEffect, useState } from "react";

import { Stack, Tooltip, Typography } from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import FitScreenIcon from "@mui/icons-material/FitScreen";
import useDialogModal from "../../hooks/useDialogModal";
import ProductDetail from "../productdetail";
import StageProductMeta from "./FinishProductMeta";
import {
    Product,
    ProductActionButton,
    ProductActionsWrapper,
    ProductAddToCart,
    ProductImage,

} from "../../style/Products";
import FinishProductDetail from "../productdetail/finish-product-detail";

export default function StageSingleProductDesktop({ product, matches }) {
    const [ProductDetailDialog, showProductDetailDialog, closeProductDialog] =
        useDialogModal(FinishProductDetail);

    const [showOptions, setShowOptions] = useState(false);

    const handleMouseEnter = () => {
        setShowOptions(true);
    };
    const handleMouseLeave = () => {
        setShowOptions(false);
    };
    return (
        <>
            <Product onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                
                <ProductImage src={product.image} />
                
                {/* <ProductFavButton isfav={0}>
                    <FavoriteIcon />
                </ProductFavButton> */}
                {/* {(showOptions || matches) && (
                    <ProductAddToCart show={showOptions} variant="contained">
                        Đấu Giá Ngay
                    </ProductAddToCart>
                )} */}
                <ProductActionsWrapper show={showOptions || matches}>
                    <Stack direction={matches ? "row" : "column"}>
                        <ProductActionButton>
                            <Tooltip placement="left" title="share this product">
                                <ShareIcon color="primary" />
                            </Tooltip>
                        </ProductActionButton>
                        <ProductActionButton onClick={() => showProductDetailDialog()}>
                            <Tooltip placement="left" title="Full view">
                                <FitScreenIcon color="primary" />
                            </Tooltip>
                        </ProductActionButton>
                    </Stack>
                </ProductActionsWrapper>
            </Product>
            <StageProductMeta product={product} />
            <ProductDetailDialog product={product} />
        </>
    );
}