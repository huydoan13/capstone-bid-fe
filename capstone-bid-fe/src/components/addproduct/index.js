

import React, { useState, useEffect } from 'react';
import { Uploader } from "uploader";
import { UploadDropzone } from "react-uploader";
import axios from 'axios';
import { Box, TextField, Button, Select, MenuItem, FormControl, InputLabel, Typography, InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import styled from '@emotion/styled';

const AddProductForm = () => {
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [selectedCategoryName, setSelectedCategoryName] = useState('');
  const [categories, setCategories] = useState([]);
  const [quantity, setQuantity] = useState('');
  const [firstPrice, setFirstPrice] = useState('');
  const [stepPrice, setStepPrice] = useState('');
  const [image, setProductImage] = useState(null);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);

  const token = localStorage.getItem('token');
  const user = localStorage.getItem('loginUser');
  const jsonUser = JSON.parse(user)

  const uploader = Uploader({ apiKey: "public_FW25bUpBZmkPhjgTWxYkac1GPbYr" });

  const Product = styled(Box)(({ theme }) => ({

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
    },
  }));




  useEffect(() => {
    axios.get('https://bids-api-testing.azurewebsites.net/api/Categorys', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    const selectedCategory = categories.find((category) => category.categoryId === categoryId);
    if (selectedCategory) {
      setSelectedCategoryName(selectedCategory.categoryName);
    } else {
      setSelectedCategoryName('');
    }
  }, [categoryId, categories]);

  const handleSubmit = (event) => {
    event.preventDefault();

    // Perform further processing or API call with the form data
    const formData = {
      userId: jsonUser.Id,
      itemName,
      description,
      categoryId,
      quantity,
      image,
      firstPrice,
      stepPrice,
    };

    // api = `api/${userId}`

    axios.post('https://bids-api-testing.azurewebsites.net/api/Items', formData, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        console.log('Data successfully posted:', response.data);
        setSuccessDialogOpen(true);
        // Reset form fields
        setItemName('');
        setDescription('');
        setCategoryId('');
        setQuantity('');
        setProductImage(null);
        setFirstPrice('');
        setStepPrice('');
      })
      .catch((error) => {
        console.error('Error while posting data:', error);
        setErrorDialogOpen(true);
      });
  };


  const handleSuccessDialogClose = () => {
    setSuccessDialogOpen(false);
  };

  const handleErrorDialogClose = () => {
    setErrorDialogOpen(false);
  };

  return (
    <Product>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Tên Sản Phẩm"
          value={itemName}
          onChange={(event) => setItemName(event.target.value)}
          fullWidth
          required
          margin="normal"
        />

        <TextField
          label="Mô Tả Sản Phẩm"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          fullWidth
          required
          margin="normal"
        />

        <FormControl fullWidth required margin="normal">
          <InputLabel>Thể Loại Sản Phẩm</InputLabel>
          <Select
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
            label="Category"
          >
            {categories.map((category) => (
              <MenuItem key={category.categoryId} value={category.categoryId}>
                {category.categoryName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>


        <TextField
          label="Số Lượng"
          value={quantity}
          onChange={(event) => setQuantity(event.target.value)}
          fullWidth
          required
          margin="normal"
          type="number"
        />

        <description>Hình Ảnh Sản Phẩm</description>
        <UploadDropzone uploader={uploader}       // Required.
          width="100%"             // Optional.
          height="375px"            // Optional.
          onUpdate={files => {      // Optional.
            if (files.length === 0) {
              console.log('No files selected.')
            } else {
              console.log('Files uploaded:');
              console.log(files.map(f => f.fileUrl).join("\n"));
              const img = files.map(f => f.fileUrl).join("\n");
              setProductImage(img);
            }
          }} />


        <TextField
          label="Giá Ban Đầu (VND)"
          value={firstPrice}
          onChange={(event) => setFirstPrice(event.target.value)}
          fullWidth
          required
          margin="normal"
          type="number"
          InputProps={{
            endAdornment: firstPrice ? (
              <InputAdornment position="end">{parseFloat(firstPrice).toLocaleString('vi-VN')} ₫</InputAdornment>
            ) : null,
          }}
        />

        <TextField
          label="Bước Giá(5-10% giá ban đầu) (VND)"
          value={stepPrice}
          onChange={(event) => setStepPrice(event.target.value)}
          fullWidth
          required
          margin="normal"
          type="number"
          InputProps={{
            endAdornment: stepPrice ? (
              <InputAdornment position="start">{parseFloat(stepPrice).toLocaleString('vi-VN')} ₫</InputAdornment>
            ) : null,
          }}
        />

        <Dialog open={successDialogOpen} onClose={handleSuccessDialogClose}>
          <DialogTitle>Thành Công</DialogTitle>
          <DialogContent>
            <Typography variant="body1">Tạo sản phẩm thành công. Vui lòng chờ Admin hệ thống xét duyệt sản phẩm của bạn. </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleSuccessDialogClose}>OK</Button>
          </DialogActions>
        </Dialog>

        {/* Error Dialog */}
        <Dialog open={errorDialogOpen} onClose={handleErrorDialogClose}>
          <DialogTitle>Error</DialogTitle>
          <DialogContent>
            <Typography variant="body1">Đã xảy ra lỗi khi tạo sản phẩm.</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleErrorDialogClose}>OK</Button>
          </DialogActions>
        </Dialog>


        <Button
          variant="contained"
          color="primary"
          size="large"
          type="submit"
          sx={{ display: 'block', mx: 'auto', mt: 4 }}
        >
          Thêm Sản Phẩm
        </Button>
      </form>
    </Product>
  );
};

export default AddProductForm;
