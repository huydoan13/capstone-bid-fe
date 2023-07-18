import { Container, Grid, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";
// import axios from 'axios';
import SingleProducts from "./SingleProducts";
import SingleProductDesktops from "./SingleProductDesktop";
import AppPagination from "../pagination";





export default function Products() {

    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down("md"));
    const [products, setProducts] = useState([]);


    // useEffect(() => {
        
    //     axios.get('https://bids-api-testing.azurewebsites.net/api/Sessions/by_not_start')
    //         .then(response => {
    //             const data = response.data;
    //             // Map the fetched data to the products array
    //             console.log(data)
    //             setProducts(data)
    //         })
    //         .catch(error => {
    //             console.error('Error fetching data:', error);
    //         });
    // }, [])

    // console.log(productss)







    const renderProducts =products && products.map((product) => (
        <Grid item key={product.sessionId} xs={2} sm={4} md={4} display="flex" flexDirection={'column'} alignItems="center">
            {matches ? (
                <SingleProducts product={product} matches={matches} />
            ) : (
                <SingleProductDesktops product={product} matches={matches} />
            )}
        </Grid>
    ));
    return (
        <Container>
            <Grid
                container
                spacing={{ xs: 2, md: 3 }}
                justifyContent="center"
                sx={{ margin: `20px 4px 10px 4px` }}
                columns={{ xs: 4, sm: 8, md: 12 }}
            >
                {renderProducts}
            </Grid>
            <AppPagination setProducts={(p) => setProducts(p)} />
        </Container>
    );
}