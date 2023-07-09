import { Box, Button, Checkbox, FormControlLabel, Grid, Paper, TextField, Typography, FormHelperText } from "@mui/material";
import React, { useState } from "react";

import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { Formik, Field, ErrorMessage, Form } from 'formik';
import * as Yup from 'yup';
import { Uploader } from "uploader";
import FrontCccd from "../uploader/frontCccd"
import BackCccd from "../uploader/backCccd";
import Avatar from "../uploader/avatar";





export default function SignUpForm() {
    const paperStyle = {
        padding: '20px 30px', width: '80%', margin: "20px auto"
    }
    const uploader = Uploader({ apiKey: "free" });
    const MyUploadedFiles = ({ files }) => files.map(file => {
        // Tip: save 'filePath' to your DB (not 'fileUrl').
        const filePath = file.filePath
        // "raw" for un-transformed file.
        const avatarUrl = uploader.url(filePath, "thumbnail")
        console.log(avatarUrl)
        return (
            <p key={avatarUrl}>
                <a href={avatarUrl} >{avatarUrl}</a>
            </p>
        );
    })

    const url = ""
    const initialValues = {
        avatar: '',
        name: '',
        email: '',
        password: '',
        rePassword: '',
        phoneNumber: '',
        address: '',
        dateOfBirth: '',
        cccd: '',
        frontCccd: '',
        backCccd: '',
        termsAndConditions: false,


    }
    const [data, setData] = useState({
        avatar: '',
        name: '',
        email: '',
        password: '',
        rePassword: '',
        phoneNumber: '',
        address: '',
        dateOfBirth: '',
        cccd: '',
        frontCccd: '',
        backCccd: '',
    })

    function handle(e) {
        const newdata = { ...data }
        newdata[e.target.id] = e.target.value
        setData(newdata)
        console.log(newdata)
    }
    const validationSchema = Yup.object().shape({
        name: Yup.string().required("Tên Đăng Nhập Không Được Bỏ Trống"),
        email: Yup.string().email("Nhập Đúng Định Dạng Email").required("Email Không Được Bỏ Trống"),
        password: Yup.string().min(8, "Mật Khẩu cần Ít nhất 8 kí tự").required("Mật Khẩu Không Được Bỏ Trống"),
        rePassword: Yup.string().oneOf([Yup.ref('password')], "Mật khẩu không khớp").required("Nhập Lại Mật Khẩu Không Được Bỏ Trống"),
        phoneNumber: Yup.string().matches(/^[0-9]+$/, "Phải là Số").max(9, "Số Điện Thoại Không Đúng! Không Quá 10 kí tự").required("Số Điện Thoại Không Được Bỏ Trống"),
        address: Yup.string().required("Địa Chỉ Không Được Bỏ Trống"),
        dateOfBirth: Yup.date().required("Ngày Sinh Không Được Bỏ Trống"),
        cccd: Yup.string().matches(/^[0-9]+$/, "Phải là Số").max(12, "Không Quá 12 kí tự").required("CCCD Không Được Bỏ Trống"),
        termsAndConditions: Yup.string().oneOf(["true"], "Chấp nhận các điều khoản và điều kiện."),
        frontCccd: Yup.string().required("Tên Đăng Nhập Không Được Bỏ Trống"),
        backCccd: Yup.string().required("Tên Đăng Nhập Không Được Bỏ Trống"),
    })
    const onSubmit = (values, props) => {
        console.log(values)
        console.log(props)
        // console.log(props)
        // setTimeout(() => {
        //     props.resetForm()
        //     props.setSubmitting(false)
        // }, 2000)
    }

    // const[avatar,avatarChange]=useState("");
    // const[name,nameChange]=useState("");
    // const[email,emailChange]=useState("");
    // const[password,passwordChange]=useState("");
    // const[phoneNumber,phoneNumberChange]=useState("");
    // const[address,addressChange]=useState("");
    // const[dateOfBirth,dateOfBirthChange]=useState("");
    // const[cccd,cccdChange]=useState("");

    const handlesubmit = (e) => {
        e.prevenDefault();

    }

    return (
        <Paper elevation={20} style={paperStyle} >
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
                {(props) => (
                    <Form >

                        {/* ten dang nhap */}
                        <Grid margin={"2% auto"} >
                            <Avatar  />
                            
                        </Grid>
                        <Grid container margin={"15px"}>
                            <Field as={TextField}
                                id="name"
                                onChange={(e) => handle(e)}
                                value={data.name}
                                fullWidth
                                name="name"
                                label="Tên Đăng Nhập"
                                variant="outlined"
                                helperText={<ErrorMessage name="name" />} />
                        </Grid>
                        <Grid margin={"15px"} >
                            <Field as={TextField} fullWidth name="email" label="Địa chỉ email" variant="outlined" helperText={<ErrorMessage name="email" />} />
                        </Grid>

                        {/* mat khau */}
                        <Grid container margin={"15px"}>
                            <Field as={TextField}
                                fullWidth
                                name="password"
                                label="Mật Khẩu"
                                type="password"
                                autoComplete="current-password"
                                helperText={<ErrorMessage name="password" />}
                            />
                        </Grid>
                        {/* nhap mat khau */}
                        <Grid container margin={"15px"}>
                            <Field as={TextField}
                                fullWidth
                                name="rePassword"
                                label="Nhập Lại mật khẩu"
                                type="password"
                                autoComplete="current-password"
                                helperText={<ErrorMessage name="rePassword" />}
                            />
                        </Grid>
                        {/* email sdt giotinh */}

                        <Grid margin={"15px"}>
                            <Field as={TextField} fullWidth
                                name="phoneNumber"
                                helperText={<ErrorMessage name="phoneNumber" />}
                                label="Nhập Số điện thoại"
                                type="number"
                            // InputLabelProps={{
                            //     shrink: true,
                            // }}
                            />
                        </Grid>
                        {/* ngay sinh */}
                        {/* địa chỉ chi tiết */}

                        <Box
                            component="form"
                            sx={{
                                '& .MuiTextField-root': { m: 1, width: '55ch' },
                            }}
                            noValidate
                            autoComplete="off"
                        >
                            <Grid container >
                                <Grid xs={6} marginTop={'9px'} >
                                    <Field as={TextField} fullWidth name="address" label="Địa chỉ chi tiết" variant="outlined" helperText={<ErrorMessage name="address" />} />
                                </Grid>

                                <Grid xs={6}>
                                    <LocalizationProvider name="dateOfBirth" dateAdapter={AdapterDayjs}>
                                        <DemoContainer components={['DatePicker']}>
                                            <DatePicker label="Ngày Sinh" />
                                        </DemoContainer>
                                    </LocalizationProvider>
                                    <FormHelperText>{<ErrorMessage name="dateOfBirth" />}</FormHelperText>
                                </Grid>
                            </Grid>

                        </Box>

                        {/* cccd,ngay cap ,noi cấp  */}
                        <Grid margin={"15px"} >
                            <Field as={TextField}
                                fullWidth
                                name="cccd"
                                id="outlined-number"
                                label="CMND/CCCD"
                                type="number"
                                helperText={<ErrorMessage name="cccd" />}
                            />
                        </Grid>
                        {/* image upload */}

                        {/* <Grid marginLeft={"1%"} alignItems={"center"} display={"flex"} justifyContent={"space-around"} container spacing={2}>
                            <Grid marginTop={"2%"} xs={6}>
                                <FrontUploader />
                            </Grid>
                            <Grid marginTop={"2%"} xs={6}>
                                <BackUploader />
                            </Grid>
                        </Grid> */}

                        <Box
                            component="form"
                            sx={{
                                '& .MuiTextField-root': { m: 1, width: '50%' },
                            }}
                            noValidate
                            autoComplete="off"
                        >
                            <Grid container margin={"15px"}>
                                <Grid xs={6}>
                                    Mặt trước CCCD
                                </Grid>
                                <Grid xs={6}>
                                    Mặt sau CCCD
                                </Grid>
                            </Grid>
                        </Box>

                        <Grid marginLeft={"1%"} alignItems={"center"} display={"flex"} justifyContent={"space-around"} container spacing={2}>
                            <Grid marginTop={"2%"} xs={6}>
                                <FrontCccd name="frontCccd" helperText={<ErrorMessage name="frontCccd" />} />
                            </Grid>
                            <Grid marginTop={"2%"} xs={6}>
                                <BackCccd name="backCccd" helperText={<ErrorMessage name="backCccd" />} />
                            </Grid>
                        </Grid>
                        {/* check box */}
                        <Grid container margin={"15px"}>
                            <FormControlLabel fullWidth control={<Field as={Checkbox} name="termsAndConditions" />} label="Tôi cam kết tuân thủ Quyền và trách nhiệm của Người tham gia đấu giá (Quy định theo tài sản đấu giá) 
                    , Chính sách bảo mật thông tin khách hàng  Cơ chế giải quyết tranh chấp , Quy chế hoạt động tại website đấu giá trực tuyến lacvietauction.vn" />
                        </Grid>
                        <FormHelperText>{<ErrorMessage name="termsAndConditions" />}</FormHelperText>
                        {/* button */}
                        <Grid container height={2} margin={"15px "}>
                            <Button fullWidth type='submit' size="large" variant="contained"

                            > Đăng Kí Tài Khoản</Button>
                        </Grid>



                    </Form>
                )}

            </Formik>
        </Paper>
    )

}
