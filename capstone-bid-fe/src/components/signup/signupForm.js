import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Uploader } from "uploader";
import { UploadDropzone } from "react-uploader";
import { format } from 'date-fns'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignUpForm = () => {
  const [userName, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhoneNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [cccdnumber, setCitizenId] = useState('');
  const [error, setError] = useState('');

  const [avatar, setAvatar] = useState(null);
  const [cccdfrontImage, setFrontImage] = useState(null);
  const [cccdbackImage, setBackImage] = useState(null);

  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);

  const navigate = useNavigate()

  const uploader = Uploader({ apiKey: "public_FW25bUpBZmkPhjgTWxYkac1GPbYr" });

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


    const date = format(new Date(dateOfBirth), 'MM-dd-yyyy')
    console.log(date)
    try {

      const response = await axios.post('https://bids-api-testing.azurewebsites.net/api/Users', {
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
      });
      navigate('/home', { replace: true });
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
      console.error('Error:', error);
      setErrorDialogOpen(true);
    }
  };

  const handleSuccessDialogClose = () => {
    setSuccessDialogOpen(false);
  };

  const handleErrorDialogClose = () => {
    setErrorDialogOpen(false);
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
      }}
      onSubmit={handleSubmit}
    >
      <Typography variant="h4" sx={{ marginBottom: '20px' }}>
        Sign Up
      </Typography>
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
        required
        sx={{ width: '100%' }}
        id="email"
      />
      <TextField
        label="Mật Khẩu"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        margin="normal"
        required
        sx={{ width: '100%' }}
        id="password"
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
        }} />
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
        }} />
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
        }} />
      {error && (
        <Typography variant="body2" color="error" sx={{ marginTop: '10px' }}>
          {error}
        </Typography>
      )}


      <Dialog open={successDialogOpen} onClose={handleSuccessDialogClose}>
        <DialogTitle>Thành Công</DialogTitle>
        <DialogContent>
          <Typography variant="body1">Tạo Tài Khoản thành công. Vui lòng chờ Admin hệ thống xét duyệt Tài Khoản của bạn. </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSuccessDialogClose}>OK</Button>
        </DialogActions>
      </Dialog>

      {/* Error Dialog */}
      <Dialog open={errorDialogOpen} onClose={handleErrorDialogClose}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <Typography variant="body1">Đã xảy ra lỗi khi tạo tài khoản, vui lòng kiểm tra lại thông tin cá nhân.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleErrorDialogClose}>OK</Button>
        </DialogActions>
      </Dialog>
      <Button type="submit" variant="contained" color="primary" sx={{ marginTop: '20px' }}>
        Sign Up
      </Button>
    </Box>
  );
};

export default SignUpForm;