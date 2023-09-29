import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { format } from 'date-fns'
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { createStaff } from '../../services/staff-actions';

const StaffCreateNew = () => {

  const [newStaff, setNewStaff] = useState({
    staffName: '',
    email: '',
    password: '',
    address: '',
    phone: '',
    dateOfBirth: '',
  });

  // const [accountName, setAccountName] = useState('');
  // const [staffName, setStaffName] = useState('');
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  // const [address, setAddress] = useState('');
  // const [phone, setPhoneNumber] = useState('');
  // const [dateOfBirth, setDateOfBirth] = useState('');
  const [error, setError] = useState('');

  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);

  const navigate = useNavigate()
  
  const handleCancel = () => {
    navigate('/dashboard/staff', { replace: true });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if ( !newStaff.staffName || !newStaff.email || !newStaff.password || !newStaff.address || !newStaff.phone || !newStaff.dateOfBirth) {
      setError('Không Được Bỏ Trống');
      return;
    }

    if (newStaff.password.length < 8) {
      setError('Mật Khẩu Cần Ít Nhất 8 Ký Tự');
      return;
    }

    if (!newStaff.email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)) {
      setError('Sai Kiểu email, Ví Dụ: example@gmail.com');
      return;
    }

    if (newStaff.password !== rePassword) {
      setError('Mật Khẩu Không Giống');
      return;
    }

    const date = format(new Date(newStaff.dateOfBirth), 'MM-dd-yyyy')

    try {
      createStaff(newStaff);
      navigate('/dashboard/staff', { replace: true });
      setNewStaff({
        staffName: '',
        email: '',
        password: '',
        address: '',
        phone: '',
        dateOfBirth: '',
      });
      setRePassword('');
      setSuccessDialogOpen(true);
      setError('');
      toast.success('Tạo nhân viên thành công', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000, // Notification will automatically close after 3 seconds (3000 milliseconds)
      });
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
        >
          <Typography variant="h4" sx={{ marginBottom: '20px' }}>
            Tạo tài khoản cho nhân viên
          </Typography>
          {/* <TextField
            label="Tên Tài Khoản"
            type="text"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            margin="normal"
            required
            sx={{ width: '100%' }}
            id="accountName"
          /> */}
          <TextField
            label="Họ và tên"
            type="text"
            value={newStaff.staffName}
            onChange={(e) => setNewStaff({...newStaff, staffName: e.target.value})}
            margin="normal"
            required
            sx={{ width: '100%' }}
            id="staffName"
          />
          <TextField
            label="Email"
            type="email"
            value={newStaff.email}
            onChange={(e) => setNewStaff({...newStaff, email: e.target.value})}
            margin="normal"
            required
            sx={{ width: '100%' }}
            id="email"
          />
          <TextField
            label="Mật Khẩu"
            type="password"
            value={newStaff.password}
            onChange={(e) => setNewStaff({...newStaff, password: e.target.value})}
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
            value={newStaff.address}
            onChange={(e) => setNewStaff({...newStaff, address: e.target.value})}
            margin="normal"
            required
            sx={{ width: '100%' }}
            id="address"
          />
          <TextField
            label="Số Điện Thoại"
            type="tel"
            value={newStaff.phone}
            onChange={(e) => setNewStaff({...newStaff, phone: e.target.value})}
            margin="normal"
            required
            sx={{ width: '100%' }}
            id="phone"
          />
          <TextField
            label=" Tháng, Ngày, Năm Sinh"
            type="date"
            value={newStaff.dateOfBirth}
            onChange={(e) => setNewStaff({...newStaff, dateOfBirth: e.target.value})}
            margin="normal"
            required
            sx={{ width: '100%' }}
            id="dateOfBirth"
            InputLabelProps={{
              shrink: true
            }}
          />
          {/* <TextField
            label="Số CCCD"
            type="text"
            value={cccdnumber}
            onChange={(e) => setCitizenId(e.target.value)}
            margin="normal"
            required
            sx={{ width: '100%' }}
            id="cccdnumber"
          /> */}
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
    
          <Dialog open={errorDialogOpen} onClose={handleErrorDialogClose}>
            <DialogTitle>Error</DialogTitle>
            <DialogContent>
              <Typography variant="body1">Đã xảy ra lỗi khi tạo tài khoản, vui lòng kiểm tra lại thông tin cá nhân.</Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleErrorDialogClose}>OK</Button>
            </DialogActions>
          </Dialog>

          <Box sx={{ display: 'flex', justifyContent: 'center'}}>

          <Button onClick={handleSubmit} variant="contained" color="primary" sx={{ margin: '0 50px 50px 0' }}>
            Tạo tài khoản
          </Button>
          <Button onClick={handleCancel} variant="contained" color="primary" sx={{ margin: '0 50px 50px 0' }}>
            Hủy
          </Button>
          </Box>
        </Box>
      );
}

export default StaffCreateNew