import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, Grid, InputAdornment, InputLabel, MenuItem, Radio, RadioGroup, Select, TextField, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import CircularProgress from '@mui/material/CircularProgress';
import { useParams, useNavigate } from "react-router-dom";


const ReAuctionForm = () => {
  const { itemId } = useParams();
  const [itemData, setItemData] = useState(null);


  const reItemName = useRef('');
  const [deposit, setDeposit] = useState(false);
  const reDescription = useRef('');
  const reQuantity = useRef('');
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState('');
  const [selectedCategoryName, setSelectedCategoryName] = useState('');
  const [defaultCategoryName, setDefaultCategoryName] = useState('');
  const [reFirstPriceValue, setReFirstPriceValue] = useState(itemData ? itemData[0]?.firstPrice : "");
  const [reStepPriceValue, setReStepPriceValue] = useState(itemData ? itemData[0]?.stepPrice : "");
  const reFirstPrice = useRef('');
  const reStepPrice = useRef('');
  const [calculatedStepPrice, setCalculatedStepPrice] = useState('');
  const [auctionHour, setAuctionHour] = useState('');
  const [auctionMinute, setAuctionMinute] = useState('');
  const [auctionHourError, setAuctionHourError] = useState('');
  const [auctionMinuteError, setAuctionMinuteError] = useState('');
  const [selectedCategoryDescriptions, setSelectedCategoryDescriptions] = useState([]);
  const [descriptionValues, setDescriptionValues] = useState({});
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('loginUser');
  const jsonUser = JSON.parse(user);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [error, setError] = useState();
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [maxWidth, setMaxWidth] = React.useState('sm');
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Calculate the step price based on firstPrice
    if (itemData && itemData[0]) {
      const firstPrice = itemData[0].firstPrice;
      const stepPrice = itemData[0].stepPrice;
      setReFirstPriceValue(firstPrice);
      setReStepPriceValue(stepPrice);
    }
  }, [itemData]);

  const handleErrorDialogClose = () => {
    setIsLoading(false);
    setErrorDialogOpen(false);

  };


  function findCategoryIdByCategoryName(categories, categoryName) {
    const category = categories.find((category) => category.categoryName === categoryName);
    return category ? category.categoryId : ''; // Return an empty string if not found
  }

  const handleReauction = () => {
    setIsLoading(true);
    const itemName = reItemName.current.value;
    const description = reDescription.current.value;
    const quantity = reQuantity.current.value;
    const firstPrice = reFirstPrice.current.value;
    const stepPrice = reStepPrice.current.value;

    if (auctionHourError || auctionMinuteError) {
      // Do not proceed with the API request if there are validation errors
      return;
    }
    if (!itemName) {
      setError("Tên Sản Phẩm Không Được Bỏ Trống");
      setErrorDialogOpen(true);
      return;
    }
    if (!description) {
      setError("Mô Tả Sản Phẩm Không Được Bỏ Trống");
      setErrorDialogOpen(true);
      return;
    }
    if (!quantity) {
      setError("Số Lượng Sản Phẩm Không Được Bỏ Trống");
      setErrorDialogOpen(true);
      return;
    }
    if (!auctionHour) {
      setError("Thời Gian Đấu Giá Không Được Bỏ Trống");
      setErrorDialogOpen(true);
      return;
    }
    if (!auctionMinute) {
      setError("Thời Gian Đấu Giá Không Được Bỏ Trống");
      setErrorDialogOpen(true);
      return;
    }
    if (!firstPrice) {
      setError("Giá Ban Đầu Không Được Bỏ Trống");
      setErrorDialogOpen(true);
      return;
    }
    if (!stepPrice) {
      setError("Bước Giá Không Được Bỏ Trống");
      setErrorDialogOpen(true);
      return;
    }
    
    const apiReUrl = `https://bids-online.azurewebsites.net/api/Sessions/re_auction`;
    const requestBody = {
      itemId, itemName, description, deposit, quantity, auctionHour, auctionMinute, firstPrice, stepPrice
    };
    axios
      .put(apiReUrl, requestBody, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        // Handle the response (success or failure)
        // You can add your logic here, e.g., show a success message
        setIsLoading(false);
        setSuccessDialogOpen(true);
        console.log('PUT request successful:', response);
        
      })
      .catch((error) => {
        // Set the error message in the state
        setError(error?.response?.data || 'An error occurred.');
        setIsLoading(false);
        // Open the error dialog
        setErrorDialogOpen(true);

        console.error('Error making PUT request:', error);
      });
  }
  useEffect(() => {
    // Define the API URL
    setIsLoading(true);
    const apiUrl = `https://bids-online.azurewebsites.net/api/Items/by_id?id=${itemId}`;

    // Fetch data from the API using Axios
    axios
      .get(apiUrl)
      .then((response) => {
        // Set the retrieved data in the state
        setItemData(response.data);
        const categoryNameFromItemData = response.data[0].categoryName;

        // Set the default category name in the state
        setDefaultCategoryName(categoryNameFromItemData);

        const defaultCategoryId = findCategoryIdByCategoryName(categories, categoryNameFromItemData);
        setCategoryId(defaultCategoryId);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        console.error("Error fetching data:", error);
      });
  }, []);

  


  useEffect(() => {
    axios
      .get('https://bids-online.azurewebsites.net/api/Categorys/valid', {
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
    if (reFirstPrice.current.value) {
      const lowerBound = 0.05 * parseFloat(reFirstPrice.current.value);
      const upperBound = 0.1 * parseFloat(reFirstPrice.current.value);
      setCalculatedStepPrice(`${lowerBound.toLocaleString('vi-VN')} ₫ - ${upperBound.toLocaleString('vi-VN')} ₫`);
    } else {
      setCalculatedStepPrice('');
    }
  }, [reFirstPrice.current.value]);


  const handleSuccessDialogClose = () => {
    navigate(`/mysession`);
    setSuccessDialogOpen(false);
  }

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

    
    itemData && <Box
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
    >

{isLoading && (
    <Dialog fullWidth maxWidth={maxWidth} open={isLoading}>
        <DialogTitle align='center'>Đang tải</DialogTitle>
        <DialogContent>
            {/* You can customize the loading message or add a spinner here */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress color="primary" size={60} />
            </div>
        </DialogContent>
    </Dialog>
)}
      <TextField
        label="Tên Sản Phẩm"
        defaultValue={itemData ? itemData[0]?.itemName : ''}
        inputRef={reItemName}
        // onChange={(event) => setItemName(event.currentTarget.value)}
        fullWidth
        required
        margin="normal"
      />


      <TextField
        label="Mô Tả Sản Phẩm"
        defaultValue={itemData ? itemData[0]?.descriptionDetail : ''}
        inputRef={reDescription}
        // onChange={(event) => setDescription(event.currentTarget.value)}
        fullWidth
        required
        margin="normal"
        multiline
        rows={4}
      />


      <FormControl fullWidth disabled required margin="normal">
        <InputLabel>Thể Loại Sản Phẩm</InputLabel>
        <Select value={defaultCategoryName} onChange={handleCategoryChange} label="Category">
          {categories.map((category) => (
            <MenuItem key={category.categoryId} value={category.categoryName}>
              {category.categoryName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Grid container >
        <Grid xs={6}>
          <TextField
            label="Số Lượng"
            defaultValue={itemData ? itemData[0]?.quantity : ''}
            inputRef={reQuantity}
            // onChange={(event) => setQuantity(event.currentTarget.value)}
            fullWidth
            required
            margin="normal"
            type="number"
          />
        </Grid>
        <Grid xs={6} paddingLeft={"125px"}>
          <Box sx={{ width: '50%' }}>
            <InputLabel>Yêu cầu đặt cọc</InputLabel>
            <RadioGroup
              label="Yêu cầu đặt cọc"
              row
              name="deposit"
              defaultValue={itemData ? itemData[0]?.deposit.toString() : ''} // Convert boolean to string
              onChange={(event) => {
                setDeposit(event.currentTarget.value === 'true'); // Convert string back to boolean
              }}
            >
              <FormControlLabel value="true" control={<Radio />} label="Có" />
              <FormControlLabel value="false" control={<Radio />} label="Không" />
            </RadioGroup>
          </Box>
        </Grid>
      </Grid>

      <Grid container >
        <Grid xs={6}>
        <TextField
      label="Thời gian đấu giá (giờ)"
      value={auctionHour}
      onChange={(event) => {
        const newValue = event.target.value.replace(/[^0-9]/g, ''); // Allow only numbers
        setAuctionHour(newValue);

        // Validate the input value (not negative and between 0 - 10)
        if (newValue < 0 || newValue > 168) {
          setAuctionHourError('Giờ đấu giá phải nằm trong khoảng từ 0 đến 168');
        } else {
          setAuctionHourError('');
        }
      }}
      fullWidth
      required
      margin="normal"
      type="text" // Change the type to "text"
      error={!!auctionHourError}
      helperText={auctionHourError}
    />
  </Grid>
  <Grid xs={6} paddingLeft={"15px"}>
    <TextField
      label="Thời gian đấu giá (phút)"
      value={auctionMinute}
      onChange={(event) => {
        const newValue = event.target.value.replace(/[^0-9]/g, ''); // Allow only numbers
        setAuctionMinute(newValue);

        // Validate the input value (not negative and between 0 - 59)
        if (newValue < 0 || newValue > 59) {
          setAuctionMinuteError('Phút đấu giá phải nằm trong khoảng từ 0 đến 59');
        } else {
          setAuctionMinuteError('');
        }
      }}
      fullWidth
      required
      margin="normal"
      type="text" // Change the type to "text"
      error={!!auctionMinuteError}
      helperText={auctionMinuteError}
    />
        </Grid>

      </Grid>
      <Grid container >
        <Grid xs={6}>
        <TextField
      label="Giá Ban Đầu (VND)"
      value={reFirstPriceValue}
      onChange={(event) => {
        const newValue = event.target.value.replace(/[^0-9]/g, ''); // Allow only numbers
        setReFirstPriceValue(newValue);
      }}
      inputRef={reFirstPrice}
      fullWidth
      required
      margin="normal"
      type="text" // Change the type to "text"
      InputProps={{
        endAdornment: reFirstPriceValue ? (
          <InputAdornment position="end">{parseFloat(reFirstPriceValue).toLocaleString('vi-VN')} ₫</InputAdornment>
        ) : null,
      }}
    />
  </Grid>
  <Grid xs={6} paddingLeft={"15px"}>
    <TextField
      label={`Bước Giá(5-10% giá ban đầu) (VND): ${calculatedStepPrice}`}
      value={reStepPriceValue}
      onChange={(event) => {
        const newValue = event.target.value.replace(/[^0-9]/g, ''); // Allow only numbers
        setReStepPriceValue(newValue);
      }}
      inputRef={reStepPrice}
      fullWidth
      required
      margin="normal"
      type="text" // Change the type to "text"
      InputProps={{
        endAdornment: reStepPriceValue ? (
          <InputAdornment position="start">{parseFloat(reStepPriceValue).toLocaleString('vi-VN')} ₫</InputAdornment>
        ) : null,
      }}
    />
        </Grid>
      </Grid>

      <Button variant="outlined" sx={{ width: "150px" }} onClick={handleReauction}>Đấu Giá lại</Button>


      <Dialog fullWidth maxWidth={maxWidth} open={successDialogOpen} onClose={handleSuccessDialogClose}>
        <DialogTitle sx={{ marginTop: '25px', textAlign: 'center', }}> <TaskAltIcon style={styles.TaskAltIcon} /> </DialogTitle>
        <DialogTitle DialogTitle variant='h3' align='center'>Đã đăng kí sản phẩm thành công.</DialogTitle>
        <DialogContent>
          <Typography align='center' variant="subtitle2">Sản phẩm của bạn đã được tạo thành công. Vui lòng chờ Admin hệ thống xét duyệt sản phẩm  của bạn. </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSuccessDialogClose}>OK</Button>
        </DialogActions>
      </Dialog>

      <Dialog fullWidth maxWidth={maxWidth} open={errorDialogOpen} onClose={handleErrorDialogClose}>
        <DialogTitle sx={{ textAlign: 'center' }}>
          <ErrorOutlineOutlinedIcon style={styles.errorIcon} />
        </DialogTitle>
        <DialogTitle variant='h3' align='center' >Đã có lỗi xảy ra </DialogTitle>
        <DialogContent>
          <Typography Typography variant='subtitle2' sx={{ marginBottom: "25px" }} align='center'>
            {error}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleErrorDialogClose}>OK</Button>
        </DialogActions>
      </Dialog>
    </Box>


  );
};

export default ReAuctionForm;
