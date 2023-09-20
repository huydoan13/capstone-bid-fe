import React, { useRef, useState } from 'react';
import { TextField, Button, Box, Typography, Dialog, DialogTitle, DialogContent, DialogActions, FormControlLabel, Checkbox } from '@mui/material';
import { Uploader } from "uploader";
import { UploadDropzone } from "react-uploader";
import { format } from 'date-fns'
import axios from 'axios';
import EmailIcon from '@mui/icons-material/Email';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import { useTheme } from "@mui/material/styles";

const SignUpForm = () => {
  const [userName, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [paypalAccount, setPaypalAccount] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhoneNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [cccdnumber, setCitizenId] = useState('');
  const [err, setError] = useState('');
  const MAX_FILE_SIZE = 23 * 1024 * 1024; // 23 MB in bytes
  const [avatar, setAvatar] = useState(null);
  const [cccdfrontImage, setFrontImage] = useState(null);
  const [cccdbackImage, setBackImage] = useState(null);
  const [otpValue, setOtpValue] = useState('');
  const [otpError, setOtpError] = useState(false);
  const otpInputRef = useRef('');
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('loginUser');
  const jsonUser = JSON.parse(user)
  const [dialogOpen, setDialogOpen] = useState(false);
  const [updateRoleMessage, setUpdateRoleMessage] = useState('');
  const [checkboxError, setCheckboxError] = useState(false);
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
  const [otpDialogOpen, setOtpDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [emailDisabled, setEmailDisabled] = useState(false);
  const [roleUpgradeSuccess, setRoleUpgradeSuccess] = useState(false);
  const [maxWidth, setMaxWidth] = React.useState('sm');
  const navigate = useNavigate()
  const theme = useTheme();
  const uploader = Uploader({ apiKey: "public_kW15bhNGeEwXXtjm51C1xufEVTUm" });

  const UpdateRoleApi = `https://bids-online.azurewebsites.net/api/Users/update_role_user`
  const confirm = `https://bids-online.azurewebsites.net/api/Users/confirm_email?email=${email}`


  const handleOtpInputChange = (event) => {
    setOtpError(false);
  };

  const handleOpenOtpDialog = () => {

    if (!email) {
      setError('Địa chỉ Email không được bỏ trống');
      // You can set an error message if email is empty
      setErrorDialogOpen(true);
      return;
    }

    // If email is not empty, proceed to send OTP
    setError(''); // Clear any previous error message
    handleOtpSubmit(); // Call the function to send OTP
    setOtpDialogOpen(true);
    setOtpValue('');
    setOtpError(false);
  };


  const handleOtpSubmit = () => {
    axios
      .put(confirm, null, { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => {
        // If the API response has no error, proceed to update the user's role
        setOtpError(false);
        setUpdateRoleMessage('');
        // return handleUpgradeToAuctioneer();
      })
      .catch((error) => {
        setOtpError(true);
        setUpdateRoleMessage('');
      });
  };


  const handleDialogClose1 = () => {
    setOtpDialogOpen(false);
    setDialogOpen(false);
    setUpdateRoleMessage(''); // If needed to clear the updateRoleMessage state
  };

  // const onFileSelected = async (event, setImageState) => {
  //   const [file] = event.target.files;
  //   const formData = new FormData();
  //   formData.append('file', file);

  //   try {
  //     const response = await axios.post('https://bids-online.azurewebsites.net/api/Users', formData, {
  //       onUploadProgress: (progressEvent) => {
  //         const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
  //         onProgress({ progress });
  //       },
  //     });

  //     alert(`File uploaded: ${response.data.fileUrl}`);
  //     setImageState(response.data.fileUrl);
  //   } catch (error) {
  //     console.error('Error uploading file:', error);
  //   }
  // };
  // const onProgress = ({ progress }) => {
  //   console.log(`File uploading: ${progress}% complete.`)
  // }


  const handleUpgradeToAuctioneer = async () => {
    const otpValue = otpInputRef.current.value;

    try {
      const response = await axios.put(
        UpdateRoleApi,
        {
          email,
          code: otpValue,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        if (response.data === true) {
          setRoleUpgradeSuccess(true);
          setUpdateRoleMessage('Xác Thực Email Thành Công');
          setOtpError(false);
          setEmailDisabled(true);
        } else if (response.data === false) {
          setRoleUpgradeSuccess(false);
          // setUpdateRoleMessage('Xác Thực Email Thành Công');
          setOtpError(true);
        }
      } else {
        setRoleUpgradeSuccess(false);
        setOtpError(true);
      }
    } catch (error) {
      setRoleUpgradeSuccess(false);
      setOtpError(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userName || !email || !password || !rePassword || !address || !phone || !dateOfBirth || !cccdnumber) {
      setError('Không Được Bỏ Trống');
      return;
    }

    if (password.length < 8) {
      setError('Mật Khẩu Cần Ít Nhất 8 Ký Tự');
      return;
    }

    if (!email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)) {
      setError('Sai Kiểu email, Ví Dụ: example@gmail.com');
      return;
    }

    if (password !== rePassword) {
      setError('Mật Khẩu Không Giống');
      return;
    }
    if (!avatar || !cccdfrontImage || !cccdbackImage) {
      setError('Vui lòng tải lên đủ 3 hình ảnh (Ảnh đại diện, Mặt trước CCCD, Mặt sau CCCD).');
      return;
    }
    if (!isCheckboxChecked) {
      setCheckboxError(true); // Set checkbox error when not checked
      return;
    }
    setIsLoading(true);

    const date = format(new Date(dateOfBirth), 'MM-dd-yyyy')
    console.log(date)
    try {

      const response = await axios
        .post('https://bids-online.azurewebsites.net/api/Users', {
          userName,
          email,
          password,
          address,
          phone,
          dateOfBirth: date,
          cccdnumber,
          avatar,
          cccdfrontImage,
          cccdbackImage,
        })
        .then(data => {
          console.log(data);
          const userID = data.data.userId;
          console.log(userID);
          const paypalData = {
            userId : userID,
            paypalAccount,
          };
        
          axios.post('https://bids-online.azurewebsites.net/api/UserPaymentInformation', paypalData)
            
            .catch(err => {
              if (err.response.status === 400) {
                setIsLoading(false);
                const errorMessage = err.response.data; // Assuming the error message is in the response data
                console.log('Error:', errorMessage);
                err = setError(errorMessage);
                setErrorDialogOpen(true);
              }
            }).then(response => {
              setIsLoading(false);
          setSuccessDialogOpen(true);
            });
        
          // These statements should not be inside the inner .then block
          
        })
        .catch(err => {

          if (err.response.status === 400) {
            setIsLoading(false);
            const errorMessage = err.response.data; // Assuming the error message is in the response data
            console.log('Error:', errorMessage);
            err = setError(errorMessage);
            setErrorDialogOpen(true);
          }
          console.log('Server response:', response.data);
          // setSuccessDialogOpen(true);
          // if (err.response && err.response.data && err.response.data.errors) {
          //   const serverErrors = err.response.data.errors;
          //   let formattedErrors = "";

          //   Object.keys(serverErrors).forEach((key) => {
          //     formattedErrors += `${key}:\n`;
          //     serverErrors[key].forEach((errorMessage) => {
          //       formattedErrors += `- ${errorMessage}\n`;
          //     });
          //   });

          //   setError(formattedErrors);
          //   setErrorDialogOpen(true);
          // } else {
          //   setError('An unexpected error occurred.');
          //   setErrorDialogOpen(true);
          // }
        });

      console.log('Server response:', response.data);
      setSuccessDialogOpen(true);

      // Reset form fields
      setUsername('');
      setEmail('');
      setPassword('');
      setRePassword('');
      setAddress('');
      setPhoneNumber('');
      setDateOfBirth('');
      setCitizenId('');
      setAvatar(null);
      setFrontImage(null);
      setBackImage(null);
      setError('');
      
    } catch (error) {
      // console.error('Error:', error.response);

    }
  };

  const handleCloseOtpDialog = () => {
    setOtpDialogOpen(false);
    setOtpValue('');
    setOtpError(false);
  };

  const handleSuccessDialogClose = () => {
    navigate('/home', { replace: true });
    setSuccessDialogOpen(false);
  };

  const handleErrorDialogClose = () => {
    setErrorDialogOpen(false);
    setCheckboxError(false);
  };

  const styles = {
    errorIcon: {
      fontSize: '150px',
      color: '#B5E4EB' // Adjust the size as needed // To center it vertically
    },
    TaskAltIcon:{
      fontSize: '150px',
      color: '#C3E1AE'
    }
  };

  return (
    <Box
      component="form"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '65%',
        height: '100%',
        margin: 'auto',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        [theme.breakpoints.down('md')]: {
          width: '100%',
        }
      }}
      onSubmit={handleSubmit}
    >
      <TextField
        label="Tên Tài Khoản"
        type="text"
        value={userName}
        onChange={(e) => setUsername(e.target.value)}
        margin="normal"
        required
        sx={{ width: '100%' }}
        id="userName"
      />
      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        margin="normal"
        disabled={emailDisabled}
        required
        sx={{ width: '100%' }}
        id="email"
      />
      <Button
        variant="outlined"
        color="primary"
        sx={{ marginTop: '10px', width: '100%' }}
        onClick={handleOpenOtpDialog}
        endIcon={<EmailIcon />}
        disabled={emailDisabled}
      >
        Xác Thực Email
      </Button>

      <TextField
        label="Mật Khẩu"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        margin="normal"
        required
        sx={{ width: '100%' }}
        id="password"
        disabled={!roleUpgradeSuccess}
      />
      <TextField
        label="Nhập Lại Mật Khẩu"
        type="password"
        value={rePassword}
        onChange={(e) => setRePassword(e.target.value)}
        margin="normal"
        required
        sx={{ width: '100%' }}
        id="rePassword"
        disabled={!roleUpgradeSuccess}
      />
      <TextField
        label="Tài Khoản PayPal"
        type="text"
        value={paypalAccount}
        onChange={(e) => setPaypalAccount(e.target.value)}
        margin="normal"
        required
        sx={{ width: '100%' }}
        id="paypal"
        disabled={!roleUpgradeSuccess}
      />
      <TextField
        label="Địa Chỉ"
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        margin="normal"
        required
        sx={{ width: '100%' }}
        id="address"
        disabled={!roleUpgradeSuccess}
      />
      <TextField
        label="Số Điện Thoại"
        type="tel"
        value={phone}
        onChange={(e) => setPhoneNumber(e.target.value)}
        margin="normal"
        required
        sx={{ width: '100%' }}
        id="phone"
        disabled={!roleUpgradeSuccess}
      />
      <TextField
        label=" Tháng, Ngày, Năm Sinh"
        type="date"
        value={dateOfBirth}
        onChange={(e) => setDateOfBirth(e.target.value)}
        margin="normal"
        required
        sx={{ width: '100%' }}
        id="dateOfBirth"
        InputLabelProps={{
          shrink: true
        }}
        disabled={!roleUpgradeSuccess}
      />
      <TextField
        label="Số CCCD"
        type="text"
        value={cccdnumber}
        onChange={(e) => setCitizenId(e.target.value)}
        margin="normal"
        required
        sx={{ width: '100%' }}
        id="cccdnumber"
        disabled={!roleUpgradeSuccess}
      />
      <h2>Ảnh Đại Diện</h2>
      <UploadDropzone uploader={uploader}       // Required.
        width="600px"             // Optional.
        height="375px"            // Optional.
        onUpdate={files => {      // Optional.
          if (files.length === 0) {
            console.log('No files selected.')
          } else {
            console.log('Files uploaded:');
            console.log(files.map(f => f.fileUrl).join("\n"));
            const avatarimg = files.map(f => f.fileUrl).join("\n");
            setAvatar(avatarimg);
          }
        }}

      />
      <h2>Hình Ảnh Mặt Trước Thẻ CCCD</h2>
      <UploadDropzone uploader={uploader}       // Required.
        width="600px"             // Optional.
        height="375px"            // Optional.
        onUpdate={files => {      // Optional.
          if (files.length === 0) {
            console.log('No files selected.')
          } else {
            console.log('Files uploaded:');
            console.log(files.map(f => f.fileUrl).join("\n"));
            const frontimg = files.map(f => f.fileUrl).join("\n");
            setFrontImage(frontimg);
          }
        }} disabled={!roleUpgradeSuccess} />
      <h2>Hình Ảnh Mặt Sau Thẻ CCCD</h2>
      <UploadDropzone uploader={uploader}       // Required.
        width="600px"             // Optional.
        height="375px"            // Optional.
        onUpdate={files => {      // Optional.
          if (files.length === 0) {
            console.log('No files selected.')
          } else {
            console.log('Files uploaded:');
            console.log(files.map(f => f.fileUrl).join("\n"));
            const backimg = files.map(f => f.fileUrl).join("\n");
            setBackImage(backimg);
          }
        }}
      />
      {/* {err && (
        <Typography variant="body2" color="error" sx={{ marginTop: '10px' }}>
          {err}
        </Typography>
      )} */}

      <FormControlLabel
        control={
          <Checkbox
            color="primary"
            checked={isCheckboxChecked}
            disabled={!roleUpgradeSuccess}
            onChange={(e) => {
              setIsCheckboxChecked(e.target.checked);
              setCheckboxError(false); // Clear checkbox error when checked
            }}
          />
        }
        label="Tôi cam kết tuân thủ Quyền và trách nhiệm của Người tham gia đấu giá (Quy định theo tài sản đấu giá), Chính sách bảo mật thông tin khách hàng, Cơ chế giải quyết tranh chấp, Quy chế hoạt động tại website đấu giá trực tuyến của Online Bids."
      />

      <Dialog open={otpDialogOpen} onClose={handleCloseOtpDialog}>
        
        
        <DialogTitle fullWidth maxWidth={maxWidth} sx={{ textAlign: 'center',}}> <ErrorOutlineOutlinedIcon style={styles.errorIcon} /> </DialogTitle>
          <DialogTitle variant='h3' align='center' >Xác nhận mã OTP</DialogTitle>
          <DialogContent>
          <Typography variant='subtitle2' sx={{ marginBottom: "25px" }} align='center'>Hãy nhập mã OTP đã được gửi về địa chỉ email mà bạn đã đăng kí </Typography>
          <TextField
            label="OTP"
            fullWidth
            inputRef={otpInputRef}
            onChange={handleOtpInputChange}
            error={otpError}
            helperText={otpError ? 'Kiểm Tra Lại Mã OTP' : ''}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseOtpDialog} color="secondary">
            Thoát
          </Button>
          <Button onClick={handleUpgradeToAuctioneer} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>


      <Dialog  open={!!updateRoleMessage} onClose={handleDialogClose1}>
        <DialogContent>
          <Typography align='center'>{updateRoleMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose1} color="primary">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>


      <Dialog fullWidth maxWidth={maxWidth} open={successDialogOpen} onClose={handleSuccessDialogClose}>
      <DialogTitle sx={{ marginTop : '25px', textAlign: 'center',}}> <TaskAltIcon style={styles.TaskAltIcon} /> </DialogTitle>
        <DialogTitle DialogTitle variant='h3' align='center'>Đã đăng kí tài Khoản.</DialogTitle>
        <DialogContent>
          <Typography align='center' variant="subtitle2">Tài Khoản của bạn đã được tạo thành công. Vui lòng chờ Admin hệ thống xét duyệt Tài Khoản của bạn. </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSuccessDialogClose}>OK</Button>
        </DialogActions>
      </Dialog>

      {/* Error Dialog */}
      <Dialog fullWidth maxWidth={maxWidth} open={errorDialogOpen || checkboxError} onClose={handleErrorDialogClose}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <Typography variant="body1">{checkboxError ? 'Bạn cần chấp nhận điều khoản và điều kiện.' : err}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleErrorDialogClose}>OK</Button>
        </DialogActions>
      </Dialog>
      
      <Button
        endIcon={<PersonAddIcon />}
        
        style={{width:"200px"}}
        type="submit"
        variant="contained"
        color="primary"
        sx={{ marginTop: '20px' }}
        disabled={!roleUpgradeSuccess || isLoading} // Disable when loading
      >
        {isLoading ? <CircularProgress size={24} /> : 'Đăng Kí'}
      </Button>
    </Box>
  );
};

export default SignUpForm;
