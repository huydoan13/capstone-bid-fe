import { Box, Pagination } from "@mui/material";
import { useEffect, useState } from "react";
import service from "../../services";

const pageSize = 3;

export default function AppPagination({ setProducts }) {
    const [pagination, setPagination] = useState({
        count: 0,
        from: 0,
        to: pageSize,
    });

    useEffect(() => {
        service.getData().then((response) => {
            setPagination({ ...pagination, count: response.count });
            setProducts(response.data.slice(pagination.from, pagination.to));
        });
    }, [pagination.from, pagination.to]);

    const handlePageChange = (event, page) => {
        const From = (page - 1) * pageSize;
        const To = (page - 1) * pageSize + pageSize;

        setPagination({ ...pagination, from: From, to: To });
    };

    return (
        <Box
            justifyContent={"center"}
            alignContent={"center"}
            display={"flex"}
            sx={{
                margin: "20px 0px",
            }}
        >
            <Pagination
                color="primary"
                count={Math.ceil(pagination.count / pageSize)}
                onChange={handlePageChange}
            />
        </Box>
    );
}
