

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

  const [selectedCategoryDescriptions, setSelectedCategoryDescriptions] = useState([]);
  const [descriptionValues, setDescriptionValues] = useState({});

  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [error, setError] = useState();
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('loginUser');
  const jsonUser = JSON.parse(user)

  const uploader = Uploader({ apiKey: "public_kW15bZBDGpnmYn4xuNbK1ftXgweC" });
  const uploaderOptions = {
    multi: true,

    // Comment out this line & use 'onUpdate' instead of
    // 'onComplete' to have the dropzone close after upload.
    showFinishButton: true,

    styles: {
      colors: {
        primary: "#377dff"
      }
    }
  }





  useEffect(() => {
    axios.get('https://bids-online.azurewebsites.net/api/Categorys', {
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

  const handleCategoryChange = (event) => {
    const selectedCategoryId = event.target.value;
    setCategoryId(selectedCategoryId);

    // Find the selected category in the categories array
    const selectedCategory = categories.find((category) => category.categoryId === selectedCategoryId);
    if (selectedCategory) {
      setSelectedCategoryName(selectedCategory.categoryName);
      setSelectedCategoryDescriptions(selectedCategory.descriptions || []);

      // Initialize the description values with empty strings
      const initialDescriptionValues = {};
      selectedCategory.descriptions.forEach((description) => {
        initialDescriptionValues[description.name] = '';
      });
      setDescriptionValues(initialDescriptionValues);
    } else {
      setSelectedCategoryName('');
      setSelectedCategoryDescriptions([]);
      setDescriptionValues({});
    }
  };

  const handleDescriptionChange = (descriptionName, event) => {
    const newValue = event.target.value;
    setDescriptionValues((prevValues) => ({
      ...prevValues,
      [descriptionName]: newValue,
    }));
  };
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

    axios.post('https://bids-online.azurewebsites.net/api/Items', formData, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        console.log('Data successfully posted:', response.data);
        const itemId = response.data[0].itemId;
        const descriptionPromises = selectedCategoryDescriptions.map((description) => {
          const descriptionData = {
            itemId,
            descriptionId: description.id,
            detail: descriptionValues[description.name],
          };
          console.log(itemId);
          return axios.post('https://bids-online.azurewebsites.net/api/ItemDescriptions', descriptionData, {
            headers: { Authorization: `Bearer ${token}` },
          });
        });
        Promise.all(descriptionPromises)
          .then(() => {
            console.log('Item descriptions successfully posted.');

          // Now upload the image to the new API endpoint
          const imageUrls = image.split('\n');
          
          // Create an array to store the promises for image uploads
          const imageUploadPromises = imageUrls.map((imageUrl) => {
            const imageFormData = {
              itemId,
              detailImage: imageUrl,
            };
            return axios.post('https://bids-online.azurewebsites.net/api/Images', imageFormData, {
              headers: { Authorization: `Bearer ${token}` },
            });
          });
          Promise.all(imageUploadPromises)
            .then(() => {
              console.log('Image uploaded successfully.');

              setSuccessDialogOpen(true);
              // Reset form fields
              setItemName('');
              setDescription('');
              setCategoryId('');
              setQuantity('');
              // setProductImage(null);
              setFirstPrice('');
              setStepPrice('');
            })
            .catch((error) => {
              console.error('Error uploading image:', error);
              setErrorDialogOpen(true);
            });
          })
          .catch((error) => {
            console.error('Error posting item descriptions:', error);
            setErrorDialogOpen(true);
          });
        // setSuccessDialogOpen(true);
        // // Reset form fields
        // setItemName('');
        // setDescription('');
        // setCategoryId('');
        // setQuantity('');
        // setProductImage(null);
        // setFirstPrice('');
        // setStepPrice('');
      })
      .catch(error => {
        // Handle error
        if (error.response) {
          // The request was made, and the server responded with an error status code (4xx, 5xx)
          if (error.response.status === 400) {
            // The server returned a 400 status code
            // You can access the error message from the response data
            const errorMessage = error.response.data; // Assuming the error message is in the response data
            console.log('Error:', errorMessage);
            error = setError(errorMessage);
            // Now you can save the errorMessage to your frontend state to display it on the UI
            // this.setState({ errorMessage });
          } else {
            // Other error handling for different status codes
          }
        } else {
          // The request was made but no response was received, or something happened in between
          console.error('Error:', error.message);
        }
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
          onChange={handleCategoryChange}

          label="Category"
        >
          {categories.map((category) => (
            <MenuItem key={category.categoryId} value={category.categoryId}>
              {category.categoryName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap', maxWidth: 'calc(4 * (100% - 10px) / 4)' }}>
  {selectedCategoryDescriptions.map((description) => (
    <TextField
      key={description.name}
      label={description.name}
      value={descriptionValues[description.name]}
      onChange={(event) => handleDescriptionChange(description.name, event)}
      fullWidth
      required
      margin="normal"
      sx={{ flex: '1 0 calc(25% - 10px)' }} // This will ensure each TextField takes up 25% of the container width minus 10px for the gap.
    />
  ))}
</Box>

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
        height="375px"
        options={uploaderOptions}
        onUpdate={files => console.log(files.map(x => x.fileUrl).join("\n"))}        // Optional.
        onComplete={files => {      // Optional.
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
          <Typography variant="body1">{error}</Typography>
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

    </Box>
  );
};

export default AddProductForm;
