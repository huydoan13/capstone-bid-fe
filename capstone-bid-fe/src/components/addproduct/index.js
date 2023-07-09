import { Box, Button, FormControl, FormLabel, Grid, InputLabel, MenuItem, OutlinedInput, Paper, Select, TextField, Typography, useTheme } from "@mui/material";
import React from "react";

import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker'



const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

function getStyles(category, productCategory, theme) {
    return {
        fontWeight:
            productCategory.indexOf(category) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}
const CategoryName = [
    'Phương Tiện giao thông',
    'Diện thoại di động',
    'Quyền Sử Dụng đất'
];

export default function AddProductForm() {
    const paperStyle = {
        padding: '20px 30px', width: '90%', margin: "20px auto"
    }

    const theme = useTheme();
    const [productCategory, setproductCategory] = React.useState([]);

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setproductCategory(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    return (
        <Grid >
            <Paper margin={'1%'} elevation={20} style={paperStyle} >
                {/* Hình Ảnh Sản phẩm */}
                {/* Tên Sản phẩm */}
                <Grid container margin={"15px"}>
                    <TextField fullwidth label="Tên Sản Phẩm" variant="outlined" />
                </Grid>
                {/* Thể Loại Sản phẩm */}

                <Box
                    component="form"
                    sx={{
                        '& .MuiTextField-root': { m: 1, width: '60ch' },
                    }}
                    noValidate
                    autoComplete="off"
                >

                    <Grid container marginTop={'15px'} alignItems={"center"} justifyContent={"space-around"}>
                        <Grid marginTop={"5px"} sx={6}>
                            <FormControl sx={{ m: 1, width: '60ch' }}>
                                <InputLabel id="demo-multiple-name-label">Loại Sản Phẩm</InputLabel>
                                <Select
                                    labelId="demo-multiple-name-label"
                                    id="demo-multiple-name"
                                    value={productCategory}
                                    onChange={handleChange}
                                    input={<OutlinedInput label="Loại Sản Phẩm" />}
                                    MenuProps={MenuProps}
                                >
                                    {CategoryName.map((name) => (
                                        <MenuItem
                                            key={name}
                                            value={name}
                                            style={getStyles(CategoryName, productCategory, theme)}
                                        >
                                            {name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid marginTop={"5px"} sx={6}>
                            <TextField
                                id="outlined-number"
                                label="Nhập Số Lượng"
                                type="number"
                            />
                        </Grid>
                    </Grid>
                </Box>

                {/* description */}
                <Grid container margin={"15px"}>
                    <TextField
                        fullwidth
                        id="outlined-multiline-flexible"
                        label="Mô tả sản phẩm"
                        multiline
                        maxRows={4}
                    />
                </Grid>
                {/* Mô tả chi tiết */}
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
                        <Grid marginTop={"5px"} sx={4}>
                            <TextField label="Tình Trạng" variant="outlined" />
                        </Grid>
                    </Grid>
                </Box>

                <Box
                    component="form"
                    sx={{
                        '& .MuiTextField-root': { m: 1, width: '60ch' },
                    }}
                    noValidate
                    autoComplete="off"
                >
                    <Grid container justifyContent={"space-around"} marginTop={"1%"}>
                        <Grid marginTop={"5px"} sx={6}>
                            <TextField
                                id="outlined-number"
                                label="Nhập Số Tiền đấu giá(VND)"
                                type="number"
                            />
                        </Grid>
                        <Grid marginTop={"5px"} sx={6}>
                            <TextField
                                id="outlined-number"
                                label="Nhập Bước Giá(VND)"
                                type="number"
                            />
                        </Grid>

                    </Grid>
                </Box>


                <Grid container height={2} margin={"15px "}>
                    <Button fullWidth size="large" variant="contained">Chấp Nhận</Button>
                </Grid>

                <Box display={"flex"} justifyContent={"center"} sx={{ p: 2 }}>
                    <Typography variant="h7"> </Typography>
                </Box>

            </Paper>
        </Grid>
    )
}