import { useEffect, useState } from "react";

import { Stack, Tooltip, Typography } from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import FitScreenIcon from "@mui/icons-material/FitScreen";
import useDialogModal from "../../hooks/useDialogModal";
import ProductDetail from "../productdetail";
import StageProductMeta from "./StageProductMeta";
import {
    Product,
    ProductActionButton,
    ProductActionsWrapper,
    ProductAddToCart,
    ProductImage,

} from "../../style/Products";
import StageProductDetail from "../productdetail/stage-product-detail";

const defaultImageSource = "/assets/images/covers/auction-hammer.jpg";

export default function StageSingleProductDesktop({ product, matches }) {
    const [ProductDetailDialog, showProductDetailDialog, closeProductDialog] =
        useDialogModal(StageProductDetail);

    const [showOptions, setShowOptions] = useState(false);
    const [firstImage, setFirstImage] = useState("");
    const firstImageURL = product.images && product.images.length > 0 ? product.images[0].detail : null;
    const imageSource = firstImageURL || defaultImageSource;
    const user = localStorage.getItem('loginUser');
    const jsonUser = JSON.parse(user);
    const [isDialogOpen, setDialogOpen] = useState(false);
    const isLoggedIn = !!jsonUser && !!jsonUser.Email;
    const handleAuctionButtonClick = () => {
        localStorage.setItem("sessionId", product.sessionId);
        console.log(product.sessionId)
        if (isLoggedIn) {
            // If the user is logged in, show the auction details dialog.
            window.location.href = "/auction";
        } else {
            // If the user is not logged in, show the custom dialog.
            setDialogOpen(true);
        }
    };

    // const handleAuctionButtonClick = () => {
    //     window.location.href = "/auction";
    // };

    useEffect(() => {
        // Extract the first image URL from the server response
        if (product.images && product.images.length > 0) {
            console.log("Product Images:", product.images);
            console.log("First Image URL:", product.images[0].detail);
            setFirstImage(product.images[0].detail);
        }
    }, [product]);



    const handleMouseEnter = () => {
        setShowOptions(true);
    };
    const handleMouseLeave = () => {
        setShowOptions(false);
    };
    return (
        <>
            <Product onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>

            <ProductImage src={imageSource} />

                {/* <ProductFavButton isfav={0}>
                    <FavoriteIcon />
                </ProductFavButton> */}
                {(showOptions || matches) && (
                    <ProductAddToCart show={showOptions} onClick={() => showProductDetailDialog()} variant="contained">
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
            <StageProductMeta product={product} />
            <ProductDetailDialog product={product} />
        </>
    );
}