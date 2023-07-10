import { Button, Grid, Paper, TextField } from "@mui/material"
import Avatar from '@mui/material/Avatar';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import React from "react";
import dayjs from "dayjs";
import styled from "@emotion/styled";
import { Colors } from "../../style/theme";



export default function ProfilePage() {

    const CccdImage = styled('img')(({ src, theme }) => ({

        src: `url(${src})`,
        width: '100%',
        height: '50%',
        background: Colors.light_gray,
        padding: '10px',
        [theme.breakpoints.down('md')]: {
            width: '80%',
            padding: '25px',
        }

    }));

    const paperStyle = {
        padding: '20px 30px', width: '100%', margin: "20px auto"
    }

    const [value, setValue] = React.useState(dayjs('2022-04-17T15:30'));


    return (
        <Paper elevation={20} style={paperStyle} >
            <Grid container >
                <Grid width={'100%'} height={'100%'} xs={4}>
                    <Avatar
                        alt="Remy Sharp"
                        src="\assets\images\avatars\avatar_1.jpg"
                        sx={{ width: '90%', height: '90%' }}
                    />
                </Grid>

                <Grid sx={{
                    '& .MuiTextField-root': { m: 1, width: '25ch',margin: "20px auto" },
                    '& .MuiFormControl-root': { m: 1, width: '30ch' },
                   
                }}  justifyContent={"space-around"} marginTop={'15px'} xs={8}>
                    <TextField
                        
                        id="userName"
                        label="Tên đăng nhập"
                        defaultValue="Cừu non bé bỏng"
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                    <TextField
                        
                        id="gmail"
                        label="Gmail"
                        defaultValue="cuunonbebong@gmail.com"
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                    <TextField
                        
                        id="password"
                        label="Pasword"
                        defaultValue="Hello World"
                        type="password"
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                    <TextField
                        
                        id="address"
                        label="Địa chỉ"
                        defaultValue="Hello World"
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                    <TextField
                        
                        id="phoneNumber"
                        label="Số Điện Thoại"
                        type="number"
                        defaultValue="0123456789"
                        InputProps={{
                            readOnly: true,
                        }}
                    />

                    <TextField
                        fullwidth
                        id="cccdId"
                        label="Số Căn Cước Công Dân"
                        defaultValue="Hello World"
                        InputProps={{
                            readOnly: true,
                        }}
                    />

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DatePicker']}>
                            <DatePicker value={value} onChange={(newValue) => setValue(newValue)} />
                        </DemoContainer>
                    </LocalizationProvider>

                </Grid>
                <Grid container direction="row" >
                    <Grid xs={6} justifyContent={"space-around"}>
                        <CccdImage src="\assets\images\avatars\avatar_1.jpg" />
                    </Grid>
                    <Grid xs={6}>
                        <CccdImage src="\assets\images\avatars\avatar_2.jpg" />
                    </Grid>

                    
                </Grid>

                <Button size="large" fullWidth variant="contained">Đăng kí thành người bán</Button>


            </Grid>


        </Paper>
    )

}   