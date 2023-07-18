import React from 'react';
import {
    Card,
    Table,
    Stack,
    Paper,
    Avatar,
    Button,
    Popover,
    Checkbox,
    TableRow,
    MenuItem,
    TableBody,
    TableCell,
    Container,
    Typography,
    IconButton,
    TableContainer,
    TablePagination,
    Modal,
    Chip,
    TextField,
    Box,
    CardHeader,
    CardContent,
    Grid,
    CardMedia,
  } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import Iconify from '../../../components/iconify';

export default function UserDetail(userDetail) {

    console.log(userDetail);

  return (
    <>
      <Helmet>
        <title>Chi tiết người dùng</title>
      </Helmet>
      <Container>

        <Card>
            <p>{userDetail.userName}</p>
        </Card>
      </Container>
    </>
  );
}
