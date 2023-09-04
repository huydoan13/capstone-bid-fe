import { useEffect, useState } from "react";

import { Stack, Tooltip, Typography } from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import FitScreenIcon from "@mui/icons-material/FitScreen";
import useDialogModal from "../../hooks/useDialogModal";
import ProductDetail from "../productdetail";
import ProductMeta from "./ProductMeta";
import {
    Product,
    ProductActionButton,
    ProductActionsWrapper,
    ProductAddToCart,
    ProductImage,

} from "../../style/Products";


const defaultImageSource = "/assets/images/covers/auction-hammer.jpg";
export default function SingleProductDesktop({ product, matches }) {
    const [ProductDetailDialog, showProductDetailDialog, closeProductDialog] =
        useDialogModal(ProductDetail);

    const [showOptions, setShowOptions] = useState(false);
    const firstImageURL = product.images && product.images.length > 0 ? product.images[0].detail : null;
    const imageSource = firstImageURL || defaultImageSource;

    const handleMouseEnter = () => {
        setShowOptions(true);
    };
    const handleMouseLeave = () => {
        setShowOptions(false);
    };
    return (
        <>
            <Product onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            
            <ProductImage src={imageSource} /> {/* Display the first image or the default image */}
                {/* <ProductFavButton isfav={0}>
                    <FavoriteIcon />
                </ProductFavButton> */}
                {(showOptions || matches) && (
                    <ProductAddToCart onClick={() => showProductDetailDialog()} show={showOptions} variant="contained">
                        Thông tin sản phẩm
                    </ProductAddToCart>
                )}
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
            <ProductMeta product={product} />
            <ProductDetailDialog product={product} />
        </>
    );
}