import { Box, Button, Checkbox, FormControl, FormControlLabel, FormLabel, Grid, InputLabel, MenuItem, OutlinedInput, Paper, Radio, RadioGroup, Select, TextField, Typography, useTheme } from "@mui/material";
import React from "react";
import FrontUploader from "../uploader";
import BackUploader from "../uploader/backindex";


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

function getStyles(gender, personGender, theme) {
    return {
        fontWeight:
            personGender.indexOf(gender) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}
const gender = [
    'Nam',
    'Nữ'
];

export default function SignUpForm() {
    const paperStyle = {
        padding: '20px 30px', width: '80%', margin: "20px auto"
    }
    const theme = useTheme();
    const [personGender, setpersonGender] = React.useState([]);

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setpersonGender(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    return (
        <Grid>
            <Paper elevation={20} style={paperStyle} >
                {/* loai tai khoan */}
                <Grid>

                    <FormControl fullWidth >
                        <FormLabel id="demo-row-radio-buttons-group-label">Loại Tài Khoản</FormLabel>
                        <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                        >
                            <Grid container spacing={0.5} marginTop={"5px"} >
                                <Grid xs={6}>
                                    <FormControlLabel value="Cá Nhân" control={<Radio />} label="Cá Nhân" />
                                </Grid>
                                <Grid xs={6}>
                                    <FormControlLabel value="Tổ chức" control={<Radio />} label="Tổ chức" />
                                </Grid>
                            </Grid>

                        </RadioGroup>
                    </FormControl>
                </Grid>
                {/* ho ten ten dem */}
                <Box
                    component="form"
                    sx={{
                        '& .MuiTextField-root': { m: 1, width: '35ch' },
                    }}
                    noValidate
                    autoComplete="off"
                >
                    <Grid container justifyContent={"space-around"} marginTop={"1%"}>
                        <Grid marginTop={"5px"} sx={4}>
                            <TextField label="Họ" variant="outlined" />
                        </Grid>
                        <Grid marginTop={"5px"} sx={4}>
                            <TextField label="Tên Đệm" variant="outlined" />
                        </Grid>
                        <Grid marginTop={"5px"} sx={4}>
                            <TextField label="Tên" variant="outlined" />
                        </Grid>
                    </Grid>
                </Box>
                {/* ten dang nhap */}
                <Grid container margin={"15px"}>
                    <TextField fullWidth label="Tên Đăng Nhập" variant="outlined" />
                </Grid>
                {/* mat khau */}
                <Grid container margin={"15px"}>
                    <TextField
                        fullWidth
                        id="outlined-password-input"
                        label="Mật Khẩu"
                        type="password"
                        autoComplete="current-password"
                    />
                </Grid>
                {/* nhap mat khau */}
                <Grid container margin={"15px"}>
                    <TextField
                        fullWidth
                        id="outlined-password-input"
                        label="Nhập Lại mật khẩu"
                        type="password"
                        autoComplete="current-password"
                    />
                </Grid>
                {/* email sdt giotinh */}
                <Box
                    component="form"
                    sx={{
                        '& .MuiTextField-root': { m: 1, width: '35ch' },
                    }}
                    noValidate
                    autoComplete="off"
                >
                    <Grid container alignItems={"center"} justifyContent={"space-around"} >
                        <Grid marginTop={"5px"} sx={4}>
                            <TextField label="Địa chỉ email" variant="outlined" />
                        </Grid>
                        <Grid marginTop={"5px"} sx={4}>
                            <TextField
                                id="outlined-number"
                                label="Nhập Số điện thoại"
                                type="number"
                            // InputLabelProps={{
                            //     shrink: true,
                            // }}
                            />
                        </Grid>
                        <Grid marginTop={"5px"} sx={4}>
                            <FormControl sx={{ m: 1, width: '35ch' }}>
                                <InputLabel id="demo-multiple-name-label">Giới Tính</InputLabel>
                                <Select
                                    labelId="demo-multiple-name-label"
                                    id="demo-multiple-name"
                                    value={personGender}
                                    onChange={handleChange}
                                    input={<OutlinedInput label="Giới Tính" />}
                                    MenuProps={MenuProps}
                                >
                                    {gender.map((name) => (
                                        <MenuItem
                                            key={name}
                                            value={name}
                                            style={getStyles(gender, personGender, theme)}
                                        >
                                            {name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Box>
                {/* ngay sinh */}
                {/* <Grid container marginTop={"1%"}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DatePicker']}>
                            <DatePicker label="Basic date picker" />
                        </DemoContainer>
                    </LocalizationProvider>
                </Grid> */}
                {/* địa chỉ chi tiết */}
                <Grid container margin={"15px "}>
                    <TextField fullWidth label="Địa chỉ chi tiết" variant="outlined" />
                </Grid>
                {/* cccd,ngay cap ,noi cấp  */}
                <Box
                    component="form"
                    sx={{
                        '& .MuiTextField-root': { m: 1, width: '35ch' },
                    }}
                    noValidate
                    autoComplete="off"
                >
                    <Grid container alignItems={"center"} justifyContent={"space-around"} marginTop={"1%"}>
                        <Grid marginTop={"5px"} sx={4}>
                            <TextField
                                id="outlined-number"
                                label="CMND/CCCD"
                                type="number"
                            />
                        </Grid>
                        <Grid marginTop={"5px"} sx={4}>
                            <TextField label="Ngày Cấp" variant="outlined" />
                        </Grid>
                        <Grid marginTop={"5px"} sx={4}>
                            <TextField label="Nơi Cấp" variant="outlined" />
                        </Grid>
                    </Grid>
                </Box>
                {/* image upload */}

                <Grid marginLeft={"1%"} alignItems={"center"} display={"flex"} justifyContent={"space-around"} container spacing={2}>
                    <Grid marginTop={"2%"} xs={6}>
                        <FrontUploader />
                    </Grid>
                    <Grid marginTop={"2%"} xs={6}>
                        <BackUploader />
                    </Grid>
                </Grid>
                {/* check box */}
                <Grid container margin={"15px"}>
                    <FormControlLabel fullWidth control={<Checkbox />} label="Tôi cam kết tuân thủ Quyền và trách nhiệm của Người tham gia đấu giá (Quy định theo tài sản đấu giá) 
                    , Chính sách bảo mật thông tin khách hàng  Cơ chế giải quyết tranh chấp , Quy chế hoạt động tại website đấu giá trực tuyến lacvietauction.vn" />
                </Grid>
                {/* button */}
                <Grid container height={2} margin={"15px "}>
                    <Button fullWidth size="large" variant="contained">Đăng Kí Tài Khoản</Button>
                </Grid>
                <Box display={"flex"} justifyContent={"center"} sx={{ p: 2 }}>
                    <Typography variant="h7"> </Typography>
                </Box>


            </Paper>
        </Grid>
    )

}
