import { Box, Stack, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import FavoriteIcon from "@mui/icons-material/Favorite"
import ShareIcon from "@mui/icons-material/Share"
import FitScreenIcon from "@mui/icons-material/FitScreen"
import useDialogModal from "../../hooks/useDialogModal";
import { Product, ProductActionButton, ProductActionsWrapper, ProductAddToCart, ProductFavButton, ProductImage } from "../../style/Products";
import StageProductMeta from "./StageProductMeta";
import ProductDetail from "../productdetail";
import StageProductDetail from "../productdetail/stage-product-detail";

export default function StageSingleProducts({ product, matches }) {
    const [ProductDetailDialog, showProductDetailDialog, closeProductDialog] =
        useDialogModal(StageProductDetail);

    const [showOptions, setShowOptions] = useState(false);
    const [firstImage, setFirstImage] = useState("");
    const [isDialogOpen, setDialogOpen] = useState(false);

    const handleMouseEnter = () => {
        setShowOptions(true);
    };
    const handleMouseLeave = () => {
        setShowOptions(false);
    };
    const user = localStorage.getItem('loginUser');
    const jsonUser = JSON.parse(user);
    const isLoggedIn = !!jsonUser && !!jsonUser.Email;
    useEffect(() => {
        // Extract the first image URL from the server response
        if (product.images && product.images.length > 0) {
            setFirstImage(product.images[0].detail);
        }
    }, [product]);
    const handleAuctionButtonClick = () => {
        localStorage.setItem("sessionId", product.sessionId);
        if (isLoggedIn) {
            // If the user is logged in, show the auction details dialog.
            window.location.href = "/auction";
        } else {
            // If the user is not logged in, show the custom dialog.
            setDialogOpen(true);
        }
    };
    return (
        <>
            <Product onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                
            {firstImage && <ProductImage src={firstImage} />}
                <StageProductMeta product={product} matches={matches} />
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
            <ProductAddToCart onClick={handleAuctionButtonClick} variant="contained">Đấu Giá Ngay</ProductAddToCart>
            <ProductDetailDialog product={product} />
        </>
    );
}