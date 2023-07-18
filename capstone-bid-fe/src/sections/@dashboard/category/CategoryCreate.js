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
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createCategory } from '../../../services/category-actions';
import axiosInstance from '../../../services/axios-instance';

function CategoryCreate() {
  const errorStyle = {
    color: 'red',
  };

  const errRef = useRef();

  const [categoryName, setCategoryName] = useState('');

  const [errMsg, setErrMsg] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await createCategory({ categoryName });
      const message = response.data;
      setCategoryName('');
      navigate('/dashboard/category');
    } catch (error) {
      console.error('Error creating category:', error);
      setErrMsg(error.message);
      // Handle the error condition
    }
  };

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4" gutterBottom>
          Tạo mới Category
        </Typography>
      </Stack>
      <Box component="form" onSubmit={handleSubmit}>
        <p style={errorStyle} ref={errRef} className={errMsg ? 'errmsg' : 'offscreen'} aria-live="assertive">
          {errMsg}
        </p>
        <TextField
          label="Category Name"
          value={categoryName}
          onChange={(event) => setCategoryName(event.target.value)}
          fullWidth
          required
        />
        <Button type="submit" variant="contained" color="primary">
          Create Category
        </Button>
      </Box>
    </Container>
  );
}

export default CategoryCreate;
