import { Box, Pagination } from "@mui/material";
import { useEffect, useState } from "react";
import StageService from "../../services/session-instage";

const pageSize = 3;

export default function AppStagePagination({ setProductss }) {
  const [pagination, setPagination] = useState({
    count: 0,
    from: 0,
    to: pageSize,
  });

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const from = (pagination.page - 1) * pageSize;
  //     const to = from + pageSize;

  //     try {
  //       const response = await StageService.getDataStage({ from, to });
  //       setPagination({ ...pagination, count: response.count });
  //       setProductss(response.data);
  //     } catch (error) {
  //       // Handle error if needed
  //       console.error("Error fetching data:", error);
  //     }
  //   };

  //   fetchData();
  // }, [pagination.page]);

  // const handlePageChange = (event, page) => {
  //   setPagination({ ...pagination, page });
  // };

  useEffect(() => {
    StageService.getDataStage().then((response) => {
      setPagination({ ...pagination, count: response.count });
      setProductss(response.data.slice(pagination.from, pagination.to));
    });
  }, [pagination.from, pagination.to]);

  const handlePageChange = (event, page) => {
    const From = (page - 1) * pageSize;
    const To = (page - 1) * pageSize + pageSize;

    setPagination({ ...pagination, from: From, to: To });
  };

  return (
    // <Box
    //   justifyContent={"center"}
    //   alignContent={"center"}
    //   display={"flex"}
    //   sx={{
    //     margin: "20px 0px",
    //   }}
    // >
    //   <Pagination
    //     color="primary"
    //     count={Math.ceil(pagination.count / pageSize)}
    //     page={pagination.page}
    //     onChange={handlePageChange}
    //   />
    // </Box>

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
