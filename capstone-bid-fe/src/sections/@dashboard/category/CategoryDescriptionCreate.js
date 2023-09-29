import { React, useState, useRef } from 'react';
import {
  Container,
  Card,
  CardHeader,
  CardContent,
  Typography,
  Stack,
  TextField,
  MenuItem,
  Select,
  Box,
  Button,
  Dialog, DialogActions, DialogContent, DialogTitle,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createCategory } from '../../../services/category-actions';
import axiosInstance from '../../../services/axios-instance';

const CategoryDescriptionCreate = ({ open, onClose }) => {
  const errorStyle = {
    color: 'red',
  };

  const errRef = useRef();

  const [descriptionName, setDescriptionName] = useState('');

  const [errMsg, setErrMsg] = useState('');

  const navigate = useNavigate();

  const handleInputChange = (event) => {
    setDescriptionName(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await createCategory({ descriptionName });
      setDescriptionName('');
      navigate('/dashboard/category');
    } catch (error) {
      console.error('Error creating category:', error);
      setErrMsg(error.message);
      // Handle the error condition
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Tạo mới loại đấu giá</DialogTitle>
      <DialogContent>
        <TextField
          label="Tên loại đấu giá"
          name="descriptionName"
          value={descriptionName}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit} color="primary">
          Tạo
        </Button>
        <Button onClick={onClose} color="secondary">
          Hủy
        </Button>
      </DialogActions>
    </Dialog>
    // <Container>
    //   <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
    //     <Typography variant="h4" gutterBottom>
    //       Tạo mới Category
    //     </Typography>
    //   </Stack>
    //   <Box component="form" onSubmit={handleSubmit}>
    //     <p style={errorStyle} ref={errRef} className={errMsg ? 'errmsg' : 'offscreen'} aria-live="assertive">
    //       {errMsg}
    //     </p>
    //     <TextField
    //       label="Category Name"
    //       value={categoryName}
    //       onChange={(event) => setCategoryName(event.target.value)}
    //       fullWidth
    //       required
    //     />
    //     <Button type="submit" variant="contained" color="primary">
    //       Create Category
    //     </Button>
    //   </Box>
    // </Container>
  );
}

export default CategoryDescriptionCreate;
