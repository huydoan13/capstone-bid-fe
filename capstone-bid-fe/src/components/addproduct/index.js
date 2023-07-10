import React, { useState } from 'react';
import { TextField, Button, Grid, MenuItem, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const categories = [
  {
    id: '1',
    name: 'Category 1',
    descriptions: [
      'Description 1 for Category 1',
      'Description 2 for Category 1',
      'Description 3 for Category 1',
    ],
  },
  {
    id: '2',
    name: 'Category 2',
    descriptions: ['Description for Category 2'],
  },
  {
    id: '3',
    name: 'Category 3',
    descriptions: [
      'Description 1 for Category 3',
      'Description 2 for Category 3',
    ],
  },
];

const AddProductForm = () => {
  const [itemName, setItemName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [image, setImage] = useState('');
  const [firstPrice, setFirstPrice] = useState('');
  const [stepPrice, setStepPrice] = useState('');
  const [descriptions, setDescriptions] = useState([]);

  const selectedCategory = categories.find((cat) => cat.id === categoryId);

  const handleCategoryChange = (e) => {
    setCategoryId(e.target.value);
    setDescriptions([]);
  };

  const handleDescriptionChange = (index, e) => {
    const updatedDescriptions = [...descriptions];
    updatedDescriptions[index] = e.target.value;
    setDescriptions(updatedDescriptions);
  };

  const handleDeleteDescription = (index) => {
    const updatedDescriptions = [...descriptions];
    updatedDescriptions.splice(index, 1);
    setDescriptions(updatedDescriptions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your form submission logic here
    // You can access the form values with the state variables above
    console.log({
      itemName,
      descriptions,
      categoryId,
      quantity,
      image,
      firstPrice,
      stepPrice,
    });
    // Reset the form after submission
    setItemName('');
    setCategoryId('');
    setQuantity('');
    setImage('');
    setFirstPrice('');
    setStepPrice('');
    setDescriptions([]);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Item Name"
            fullWidth
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            select
            label="Category"
            fullWidth
            value={categoryId}
            onChange={handleCategoryChange}
          >
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        {descriptions.map((desc, index) => (
          <Grid item xs={12} key={index}>
            <TextField
              label={`Description ${index + 1}`}
              fullWidth
              value={desc}
              onChange={(e) => handleDescriptionChange(index, e)}
            />
            <IconButton
              aria-label="Delete"
              onClick={() => handleDeleteDescription(index)}
            >
              <DeleteIcon />
            </IconButton>
          </Grid>
        ))}
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setDescriptions([...descriptions, ''])}
          >
            Add Description
          </Button>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Quantity"
            fullWidth
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Image"
            fullWidth
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="First Price"
            fullWidth
            value={firstPrice}
            onChange={(e) => setFirstPrice(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Step Price"
            fullWidth
            value={stepPrice}
            onChange={(e) => setStepPrice(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">
            Add Product
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default AddProductForm;
