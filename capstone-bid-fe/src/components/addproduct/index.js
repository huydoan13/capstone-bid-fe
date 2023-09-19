import React, { useState, useEffect } from 'react';
import { useTheme } from "@mui/material/styles";
import { Uploader } from 'uploader';
import { UploadDropzone } from 'react-uploader';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import {
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  RadioGroup,
  FormControlLabel,
  Radio,
  Grid,
} from '@mui/material';
import styled from '@emotion/styled';
import axios from 'axios';

const AddProductForm = () => {
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [selectedCategoryName, setSelectedCategoryName] = useState('');
  const [categories, setCategories] = useState([]);
  const [deposit, setDeposit] = useState(false);
  const [quantity, setQuantity] = useState('');
  const [firstPrice, setFirstPrice] = useState('');
  const [stepPrice, setStepPrice] = useState('');
  const [auctionHour, setAuctionHour] = useState('');
  const [auctionMinute, setAuctionMinute] = useState('');
  const [typeOfSession, setTypeOfSession] = useState('');
  const [image, setProductImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedCategoryDescriptions, setSelectedCategoryDescriptions] = useState([]);
  const [descriptionValues, setDescriptionValues] = useState({});

  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [error, setError] = useState();
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('loginUser');
  const jsonUser = JSON.parse(user);
  const [calculatedStepPrice, setCalculatedStepPrice] = useState('');
  const [maxWidth, setMaxWidth] = React.useState('sm');
  const theme = useTheme();
  const [auctionHourError, setAuctionHourError] = useState('');
  const [auctionMinuteError, setAuctionMinuteError] = useState('');
  const uploader = Uploader({ apiKey: 'public_kW15bhNGeEwXXtjm51C1xufEVTUm' });
  const uploaderOptions = {
    multi: true,

    // Comment out this line & use 'onUpdate' instead of
    // 'onComplete' to have the dropzone close after upload.
    showFinishButton: true,

    styles: {
      colors: {
        primary: '#377dff',
      },
    },
  };

  useEffect(() => {
    axios
      .get('https://bids-online.azurewebsites.net/api/Categorys', {
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

  useEffect(() => {
    // Calculate the step price based on firstPrice
    if (firstPrice) {
      const lowerBound = 0.05 * parseFloat(firstPrice);
      const upperBound = 0.1 * parseFloat(firstPrice);
      setCalculatedStepPrice(`${lowerBound.toLocaleString('vi-VN')} ₫ - ${upperBound.toLocaleString('vi-VN')} ₫`);
    } else {
      setCalculatedStepPrice('');
    }
  }, [firstPrice]);

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
    setLoading(true);
    // Perform further processing or API call with the form data

    if (auctionHour < 0 || auctionHour > 10) {
      setError('Giờ đấu giá phải nằm trong khoảng từ 0 đến 10');
      setErrorDialogOpen(true); // Show error dialog
      return; // Prevent form submission
    }

    if (auctionMinute < 0 || auctionMinute > 60) {
      setError('Phút đấu giá phải nằm trong khoảng từ 0 đến 60');
      setErrorDialogOpen(true); // Show error dialog
      return; // Prevent form submission
    }
    if (!image) {
      setError('Hình Ảnh Không Được Bỏ Trống');
      setErrorDialogOpen(true);
      setLoading(false);
      return; // Prevent form submission
    }
    const formData = {
      userId: jsonUser.Id,
      itemName,
      description,
      categoryId,
      quantity,
      auctionHour,
      auctionMinute,
      typeOfSession,
      image,
      firstPrice,
      stepPrice,
      deposit, // Include the deposit value
    };

    // api = `api/${userId}`

    axios
      .post('https://bids-online.azurewebsites.net/api/Items', formData, {
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

            if (!imageUrls) {
              setError("Hình Ảnh Không Được Bỏ Trống");
              setErrorDialogOpen(true);
              return;
            }
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
                setAuctionHour('');
                setAuctionMinute('');
                setTypeOfSession('');
                // setProductImage(null);
                setFirstPrice('');
                setStepPrice('');
                setLoading(false);
              })
              .catch((error) => {
                console.error('Error uploading image:', error);
                setLoading(false);
                setErrorDialogOpen(true);
              })
              .finally(() => {
                // Set loading back to false after the response is received
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
      .catch((error) => {
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
            setLoading(false);
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
    setLoading(false);
    setErrorDialogOpen(false);
  };

  const styles = {
    TaskAltIcon: {
      fontSize: '150px',
      color: '#C3E1AE'
    },
    errorIcon: {
      fontSize: '150px',
      color: '#B5E4EB' // Adjust the size as needed // To center it vertically
    },
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
        label="Tên Sản Phẩm"
        value={itemName}
        onChange={(event) => setItemName(event.target.value)}
        fullWidth
        required
        margin="normal"
      />



      <FormControl fullWidth required margin="normal">
        <InputLabel>Thể Loại Sản Phẩm</InputLabel>
        <Select value={categoryId} onChange={handleCategoryChange} label="Category">
          {categories.map((category) => (
            <MenuItem key={category.categoryId} value={category.categoryId}>
              {category.categoryName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: '10px',
          flexWrap: 'wrap',
          maxWidth: 'calc(4 * (100% - 10px) / 4)',
        }}
      >
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


      <Grid container >
        <Grid xs={6}>
          <TextField
            label="Số Lượng"
            value={quantity}
            onInput={(event) => {
              event.target.value = event.target.value.replace(/[^0-9]/g, ''); // Allow only numbers
              setQuantity(event.target.value);
            }}
            fullWidth
            required
            margin="normal"
            type="text"  // Change type to "text" to prevent non-numeric input
          />
        </Grid>
        <Grid xs={6} paddingLeft={"125px"}>
          <Box sx={{ width: '50%' }}>
            <InputLabel>Yêu cầu đặt cọc</InputLabel>
            <RadioGroup
              aria-label="Yêu cầu đặt cọc"
              row
              name="deposit"
              value={deposit.toString()} // Convert boolean to string
              onChange={(event) => {
                setDeposit(event.target.value === 'true'); // Convert string back to boolean
              }}
            >
              <FormControlLabel value="true" control={<Radio />} label="Có" />
              <FormControlLabel value="false" control={<Radio />} label="Không" />
            </RadioGroup>
          </Box>
        </Grid>
      </Grid>


      <TextField
        label="Thời gian đấu giá (giờ)"
        value={auctionHour}
        onInput={(event) => {
          event.target.value = event.target.value.replace(/[^0-9]/g, ''); // Allow only numbers
          setAuctionHour(event.target.value);

          // Validate the input value (not negative and between 0 - 10)
          const newValue = parseInt(event.target.value, 10); // Convert to integer
          if (newValue < 0 || newValue > 10) {
            setAuctionHourError('Giờ đấu giá phải nằm trong khoảng từ 0 đến 10');
          } else {
            setAuctionHourError('');
          }
        }}
        fullWidth
        required
        margin="normal"
        type="text"  // Change type to "text" to prevent non-numeric input
        error={!!auctionHourError}
        helperText={auctionHourError}
      />

      <TextField
        label="Thời gian đấu giá (phút)"
        value={auctionMinute}
        onInput={(event) => {
          event.target.value = event.target.value.replace(/[^0-9]/g, ''); // Allow only numbers
          setAuctionMinute(event.target.value);

          // Validate the input value (not negative and between 0 - 60)
          const newValue = parseInt(event.target.value, 10); // Convert to integer
          if (newValue < 0 || newValue > 60) {
            setAuctionMinuteError('Phút đấu giá phải nằm trong khoảng từ 0 đến 60');
          } else {
            setAuctionMinuteError('');
          }
        }}
        fullWidth
        required
        margin="normal"
        type="text"  // Change type to "text" to prevent non-numeric input
        error={!!auctionMinuteError}
        helperText={auctionMinuteError}
      />
      <FormControl fullWidth required margin="normal">
        <InputLabel id="demo-simple-select-label">Loại Phiên đấu giá</InputLabel>
        <Select
          value={typeOfSession}
          onChange={(event) => setTypeOfSession(event.target.value)}
          label="status"
          name="status"
        >
          <MenuItem value="5">Đấu giá ngay</MenuItem>
          <MenuItem value="1">Đấu giá sau</MenuItem>
        </Select>
      </FormControl>

      <TextField
        label="Mô Tả Sản Phẩm"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        fullWidth
        required
        margin="normal"
        multiline
        rows={4}
      />
      <description>Hình Ảnh Sản Phẩm</description>
      <UploadDropzone
        uploader={uploader} // Required.
        width="100%" // Optional.
        height="375px"
        options={uploaderOptions}
        // onUpdate={files => console.log(files.map(x => x.fileUrl).join("\n"))}        // Optional.
        onComplete={(files) => {
          // Optional.
          if (files.length === 0) {
            console.log('No files selected.');
          } else {
            console.log('Files uploaded:');
            console.log(files.map((f) => f.fileUrl).join('\n'));
            const img = files.map((f) => f.fileUrl).join('\n');
            setProductImage(img);
          }
        }}
      />

      <TextField
        label="Giá Ban Đầu (VND)"
        value={firstPrice}
        onInput={(event) => {
          event.target.value = event.target.value.replace(/[^0-9]/g, ''); // Allow only numbers
          setFirstPrice(event.target.value);
        }}
        fullWidth
        required
        margin="normal"
        type="text"  // Change type to "text" to prevent non-numeric input
        InputProps={{
          endAdornment: firstPrice ? (
            <InputAdornment position="end">{parseFloat(firstPrice).toLocaleString('vi-VN')} ₫</InputAdornment>
          ) : null,
        }}
      />

      <TextField
        label={`Bước Giá(5-10% giá ban đầu) (VND): ${calculatedStepPrice}`}
        value={stepPrice}
        onInput={(event) => {
          event.target.value = event.target.value.replace(/[^0-9]/g, ''); // Allow only numbers
          setStepPrice(event.target.value);
        }}
        fullWidth
        required
        margin="normal"
        type="text"  // Change type to "text" to prevent non-numeric input
        InputProps={{
          endAdornment: stepPrice ? (
            <InputAdornment position="start">{parseFloat(stepPrice).toLocaleString('vi-VN')} ₫</InputAdornment>
          ) : null,
        }}
      />

      <Dialog open={successDialogOpen} onClose={handleSuccessDialogClose}>
        <DialogTitle sx={{ marginTop: '25px', textAlign: 'center', }}> <TaskAltIcon style={styles.TaskAltIcon} /> </DialogTitle>
        <DialogTitle DialogTitle variant='h3' align='center'>Đã đăng kí sản phẩm thành công.</DialogTitle>
        <DialogContent>
          <Typography align='center' variant="subtitle2">Sản phẩm của bạn đã được tạo thành công. Vui lòng chờ Admin hệ thống xét duyệt sản phẩm  của bạn. </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSuccessDialogClose}>OK</Button>
        </DialogActions>
      </Dialog>

      {/* Error Dialog */}
      <Dialog fullWidth maxWidth={maxWidth} open={errorDialogOpen} onClose={handleErrorDialogClose}>
        <DialogTitle sx={{ textAlign: 'center', }}> <ErrorOutlineOutlinedIcon style={styles.errorIcon} /> </DialogTitle>
        <DialogTitle variant='h3' align='center' >Đã có lỗi xảy ra </DialogTitle>
        <DialogContent>
          <Typography Typography variant='subtitle2' sx={{ marginBottom: "25px" }} align='center'>{error}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleErrorDialogClose}>OK</Button>
        </DialogActions>
      </Dialog>

      {/* {loading && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <CircularProgress color="primary" />
        </div>
      )} */}

      <Button
        variant="contained"
        color="primary"
        fullWidth
        type="submit"
        sx={{ display: 'block', mx: 'auto', mt: 4 }}
        disabled={loading}
      >
        {loading ? (
          <CircularProgress color="inherit" size={24} />
        ) : (
          'Thêm Sản Phẩm'
        )}

      </Button>
    </Box>
  );
};

export default AddProductForm;
