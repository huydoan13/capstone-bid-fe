import React, { useState, useEffect } from "react";
import {
    Container,
    Grid,
    useMediaQuery,
    TextField,
    useTheme,
    Box,
    Pagination,
    Typography,
} from "@mui/material";
import axios from "axios";
import SingleProducts from "./SingleProducts";
import SingleProductDesktops from "./SingleProductDesktop";


export default function Products() {
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down("md"));
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1)

    //   useEffect to fetch products (uncomment this when you want to fetch data)
    useEffect(() => {
        axios.get('https://bids-online.azurewebsites.net/api/Sessions/by_not_start')
            .then(response => {
                const data = response.data;
                // Map the fetched data to the products array
                console.log(data);
                setProducts(data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    useEffect(() => {
        // Filter products based on searchQuery
        const filtered = products.filter((product) =>
            product.sessionName.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredProducts(filtered);
    
        // Reset currentPage to 1 when searchQuery changes
        setCurrentPage(1);
    }, [searchQuery, products]);

    const productsPerPage = 3; // Number of products to display per page
    const pageCount = Math.ceil(filteredProducts.length / productsPerPage);

    // Handle page change
    const handlePageChange = (event, newPage) => {
        setCurrentPage(newPage);
    };

    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const currentProducts = filteredProducts.slice(startIndex, endIndex);

    const renderProducts = currentProducts.map((product) => (
        <Grid
            item
            key={product.sessionId}
            xs={3}
            sm={4}
            md={4}
            display="flex"
            flexDirection={"column"}
            alignItems="center"
        >
            {matches ? (
                <SingleProducts product={product} matches={matches} />
            ) : (
                <SingleProductDesktops product={product} matches={matches} />
            )}
        </Grid>
    ));

    return (
        <Container>
            <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                <TextField
                    label="Tìm Kiếm Sản Phẩm"
                    variant="standard"
                    size="medium"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{ width: "250px", marginLeft: "10px", marginBottom: "10px" }}
                />
            </Box>
            {filteredProducts.length === 0 ? (
                <Typography align="center">Không có tài sản</Typography>
            ) : (
            <Grid
                container
                spacing={{ xs: 2, md: 3 }}
                justifyContent="center"
                sx={{ margin: `20px 4px 10px 4px` }}
                columns={{ xs: 4, sm: 8, md: 12 }}
            >
                {renderProducts}
            </Grid>
            )}
            {/* Pagination */}
            <Pagination
                count={pageCount}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                sx={{ marginTop: "20px", display: "flex", justifyContent: "center", marginBottom: "10px" }}
            />
        </Container>
    );
}