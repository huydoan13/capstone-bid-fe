import { Box, Stack, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import FavoriteIcon from "@mui/icons-material/Favorite"
import ShareIcon from "@mui/icons-material/Share"
import FitScreenIcon from "@mui/icons-material/FitScreen"
import useDialogModal from "../../hooks/useDialogModal";
import { Product, ProductActionButton, ProductActionsWrapper, ProductAddToCart, ProductFavButton, ProductImage } from "../../style/Products";
import ProductMeta from "./ProductMeta";
import ProductDetail from "../productdetail";

export default function SingleProducts({ product, matches }) {
    const [ProductDetailDialog, showProductDetailDialog, closeProductDialog] =
        useDialogModal(ProductDetail);

    const [showOptions, setShowOptions] = useState(false);
    const [firstImage, setFirstImage] = useState("");

    const handleMouseEnter = () => {
        setShowOptions(true);
    };
    const handleMouseLeave = () => {
        setShowOptions(false);
    };
    useEffect(() => {
        // Extract the first image URL from the server response
        if (product.images && product.images.length > 0) {
            setFirstImage(product.images[0].detail);
        }
    }, [product]);
    return (
        <>
            <Product onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                
            {firstImage && <ProductImage src={firstImage} />}
                <ProductMeta product={product} matches={matches} />
                <ProductActionsWrapper>
                    <Stack direction={matches ? "row" : "column"}>
                        <ProductFavButton isFav={0}>
                            <FavoriteIcon />
                        </ProductFavButton>
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
            <ProductAddToCart onClick={() => showProductDetailDialog()} variant="contained">Thông Tin Chi Tiết</ProductAddToCart>
            <ProductDetailDialog product={product} />
        </>
    );
}