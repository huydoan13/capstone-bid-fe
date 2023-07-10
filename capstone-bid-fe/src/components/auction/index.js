import { Box, Button, Grid, Paper, TextField, Tooltip } from "@mui/material"
import useDialogModal from "../../hooks/useDialogModal";
import { ProductActionButton } from "../../style/Products"
import ProductDetail from "../productdetail"




export default function AuctionForm() {
    const [ProductDetailDialog, showProductDetailDialog, closeProductDialog] =
    useDialogModal(ProductDetail);

    const paperStyle = {
        padding: '20px 30px', width: '100%', margin: "20px auto"
    }
    return (
        <Grid >
            <Paper margin={'1%'} elevation={20} style={paperStyle} >
                <Box
                    component="form"
                    sx={{
                        '& .MuiTextField-root': { m: 1, width: '40ch' },
                    }}
                    noValidate
                    autoComplete="off"
                >
                    <Grid container justifyContent={"space-around"} marginTop={"1%"}>
                        <Grid marginTop={"5px"} sx={4}>
                            <TextField label="Màu Sắc" variant="outlined" />
                        </Grid>
                        <Grid marginTop={"5px"} sx={4}>
                            <TextField label="Hãng" variant="outlined" />
                        </Grid>

                        <ProductActionButton onClick={() => showProductDetailDialog()}>
                            <Tooltip placement="left" title="Full view">
                                <Button> Đấu giá Ngay</Button>
                            </Tooltip>
                        </ProductActionButton>
                    </Grid>
                </Box>
            </Paper>

        </Grid>
    )
}      