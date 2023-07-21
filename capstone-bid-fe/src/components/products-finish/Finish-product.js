import { Container, Grid, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";
// import axios from 'axios';
import StageSingleProducts from "./FinishSingleProducts";
import StageSingleProductDesktop from "./FinishSingleProductDesktop";
import AppFinishPagination from "../pagination/finish-pagination";






export default function FinishProducts() {

    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down("md"));
    const [products, setProductsss] = useState([]);


    // useEffect(() => {
        
    //     axios.get('https://bids-api-testing.azurewebsites.net/api/Sessions/by_in_stage')
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







    const renderProducts = products && products.map((product) => (
        <Grid item key={product.sessionId} xs={3} sm={4} md={4} display="flex" flexDirection={'column'} alignItems="center">
            {matches ? (
                <StageSingleProducts product={product} matches={matches} />
            ) : (
                <StageSingleProductDesktop product={product} matches={matches} />
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
            <AppFinishPagination setProductsss={(p) => setProductsss(p)} />
        </Container>
    );
}