import { React, useState } from 'react';
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
import { createCategory } from '../../../services/category-actions';
import axiosInstance from '../../../services/axios-instance';

function CategoryCreate() {
  const [categoryName, setCategoryName] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      createCategory({ categoryName });
      setCategoryName('');
    } catch (error) {
      console.error('Error creating category:', error);
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
