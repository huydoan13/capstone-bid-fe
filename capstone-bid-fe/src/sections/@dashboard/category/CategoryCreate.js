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
} from '@mui/material';
import { React, useState } from 'react';

function CategoryCreate() {

    const [status, setStatus] = useState('');

    const handleStatusChange = (event) => {
      setStatus(event.target.value);
    };

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4" gutterBottom>
          Tạo mới Category
        </Typography>
      </Stack>
      <Card>
        <CardHeader title="Form tạo mới Category" />
        <CardContent>
          <TextField fullWidth label="CategoryName" />
          <Select label="Status" value={status}>
            <MenuItem value="True">True</MenuItem>
            <MenuItem value="False">False</MenuItem>
          </Select>
        </CardContent>
      </Card>
    </Container>
  );
}

export default CategoryCreate;
