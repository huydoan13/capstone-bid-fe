import { Box, Pagination } from "@mui/material";
import { useEffect, useState } from "react";
import FinishService from "../../services/session-finish";

const pageSize = 3;

export default function AppFinishPagination({ setProductsss}) {

    const [pagination, setPagination] = useState({
        count: 0,
        from: 0,
        to: pageSize
    });

    useEffect(() => {
        FinishService.getDataFinish({ from: pagination.from, to: pagination.to }).then(response => {
            
            setPagination({ ...pagination, count: response.count });
            setProductsss(response.data);
            console.log(response.data)
        });
    }, [pagination.from,pagination.to]);

    const handlePageChange = (event, page) => {
        const From = (page - 1) * pageSize;
        const To = (page - 1) * pageSize + pageSize;

        setPagination({ ...pagination, from : From, to: To });
    }
    return (
        <Box justifyContent={"center"} alignContent={"center"} display={"flex"} sx={{
            margin: "20px 0px"
        }}>
            <Pagination 
            color="primary"
            count={Math.ceil(pagination.count / pageSize)}
                onChange={handlePageChange}
            />
        </Box>
    )
}