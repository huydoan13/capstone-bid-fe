import React, { useState } from 'react';
import { TextField, Button, Avatar, IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    rePassword: '',
    address: '',
    phoneNumber: '',
    dateOfBirth: '',
    citizenIdCardNumber: '',
    citizenIdCardFrontImage: null,
    citizenIdCardBackImage: null,
    avatar: null
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    if (
      e.target.name === 'citizenIdCardFrontImage' ||
      e.target.name === 'citizenIdCardBackImage' ||
      e.target.name === 'avatar'
    ) {
      setFormData({ ...formData, [e.target.name]: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
    // Clear error message when input is corrected
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleRemoveImage = (name) => {
    setFormData({ ...formData, [name]: null });
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    if (formData.username.trim() === '') {
      newErrors.username = 'Username is required';
      isValid = false;
    }

    if (formData.email.trim() === '') {
      newErrors.email = 'Email is required';
      isValid = false;
    }

    if (formData.password === '') {
      newErrors.password = 'Password is required';
      isValid = false;
    }

    if (formData.password !== formData.rePassword) {
      newErrors.rePassword = 'Passwords do not match';
      isValid = false;
    }

    if (formData.address.trim() === '') {
      newErrors.address = 'Address is required';
      isValid = false;
    }

    if (formData.phoneNumber.trim() === '') {
      newErrors.phoneNumber = 'Phone number is required';
      isValid = false;
    }

    if (formData.dateOfBirth.trim() === '') {
      newErrors.dateOfBirth = 'Date of Birth is required';
      isValid = false;
    }

    if (formData.citizenIdCardNumber.trim() === '') {
      newErrors.citizenIdCardNumber = 'Citizen ID Card Number is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log(formData); // You can handle form submission logic here
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
        <Typography variant="subtitle1">Avatar</Typography>
        <input
          type="file"
          name="avatar"
          accept="image/*"
          onChange={handleChange}
        />
        {formData.avatar && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginLeft: '1rem',
              border: errors.avatar ? '1px solid red' : '1px solid transparent',
              borderRadius: '8px',
              overflow: 'hidden',
              flexBasis: '50%'
            }}
          >
            <Avatar
              src={URL.createObjectURL(formData.avatar)}
              alt="Avatar"
              sx={{
                width: '100%',
                height: 'auto',
                objectFit: 'cover'
              }}
            />
            <IconButton
              aria-label="Remove avatar"
              onClick={() => handleRemoveImage('avatar')}
            >
              <DeleteIcon />
            </IconButton>
          </div>
        )}
      </div>
      {errors.avatar && <Typography color="error">{errors.avatar}</Typography>}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ flexBasis: '50%', marginRight: '1rem' }}>
          <Typography variant="subtitle1">Citizen ID Card Front</Typography>
          <input
            type="file"
            name="citizenIdCardFrontImage"
            accept="image/*"
            onChange={handleChange}
          />
          {formData.citizenIdCardFrontImage && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                border: errors.citizenIdCardFrontImage ? '1px solid red' : '1px solid transparent',
                borderRadius: '8px',
                overflow: 'hidden',
                flexBasis: '50%'
              }}
            >
              <Avatar
                src={URL.createObjectURL(formData.citizenIdCardFrontImage)}
                alt="Citizen ID Card Front"
                sx={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'cover'
                }}
              />
              <IconButton
                aria-label="Remove front image"
                onClick={() => handleRemoveImage('citizenIdCardFrontImage')}
              >
                <DeleteIcon />
              </IconButton>
            </div>
          )}
        </div>
        <div style={{ flexBasis: '50%' }}>
          <Typography variant="subtitle1">Citizen ID Card Back</Typography>
          <input
            type="file"
            name="citizenIdCardBackImage"
            accept="image/*"
            onChange={handleChange}
          />
          {formData.citizenIdCardBackImage && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                border: errors.citizenIdCardBackImage ? '1px solid red' : '1px solid transparent',
                borderRadius: '8px',
                overflow: 'hidden',
                flexBasis: '50%'
              }}
            >
              <Avatar
                src={URL.createObjectURL(formData.citizenIdCardBackImage)}
                alt="Citizen ID Card Back"
                sx={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'cover'
                }}
              />
              <IconButton
                aria-label="Remove back image"
                onClick={() => handleRemoveImage('citizenIdCardBackImage')}
              >
                <DeleteIcon />
              </IconButton>
            </div>
          )}
        </div>
      </div>
      {errors.citizenIdCardFrontImage && (
        <Typography color="error">{errors.citizenIdCardFrontImage}</Typography>
      )}
      {errors.citizenIdCardBackImage
&& (
        <Typography color="error">{errors.citizenIdCardBackImage}</Typography>
      )}
      <TextField
        label="Username"
        name="username"
        value={formData.username}
        onChange={handleChange}
        fullWidth
        margin="normal"
        error={Boolean(errors.username)}
        helperText={errors.username}
      />
      <TextField
        type="email"
        label="Email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        fullWidth
        margin="normal"
        error={Boolean(errors.email)}
        helperText={errors.email}
      />
      <TextField
        type="password"
        label="Password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        fullWidth
        margin="normal"
        error={Boolean(errors.password)}
        helperText={errors.password}
      />
      <TextField
        type="password"
        label="Re-enter Password"
        name="rePassword"
        value={formData.rePassword}
        onChange={handleChange}
        fullWidth
        margin="normal"
        error={Boolean(errors.rePassword)}
        helperText={errors.rePassword}
      />
      <TextField
        label="Address"
        name="address"
        value={formData.address}
        onChange={handleChange}
        fullWidth
        margin="normal"
        error={Boolean(errors.address)}
        helperText={errors.address}
      />
      <TextField
        label="Phone Number"
        name="phoneNumber"
        value={formData.phoneNumber}
        onChange={handleChange}
        fullWidth
        margin="normal"
        error={Boolean(errors.phoneNumber)}
        helperText={errors.phoneNumber}
      />
      <TextField
        type="date"
        label="Date of Birth"
        name="dateOfBirth"
        value={formData.dateOfBirth}
        onChange={handleChange}
        fullWidth
        margin="normal"
        InputLabelProps={{
          shrink: true,
        }}
        error={Boolean(errors.dateOfBirth)}
        helperText={errors.dateOfBirth}
      />
      <TextField
        label="CCCD/CMND"
        name="citizenIdCardNumber"
        value={formData.citizenIdCardNumber}
        onChange={handleChange}
        fullWidth
        margin="normal"
        error={Boolean(errors.citizenIdCardNumber)}
        helperText={errors.citizenIdCardNumber}
      />
      <Button type="submit" variant="contained" color="primary">
        Sign Up
      </Button>
    </form>
  );
};

export default SignUpForm;
