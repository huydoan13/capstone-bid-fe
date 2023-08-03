import axios from 'axios';

const service = {
    getData: () => {
        return new Promise((resolve, reject) => {
            const apiUrl = "https://bids-online.azurewebsites.net/api/Sessions/by_not_start";

            // Fetch data from the API using Axios
            axios.get(apiUrl)
                .then((response) => {
                    // At this point, 'response.data' contains the response from the API
                    resolve({
                        count: response.data.length,
                        data: response.data
                    });
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }
};

export default service;