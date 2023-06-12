import axios from "axios";

export async function getAllUser() {
    const url = `https://bids-api-testing.azurewebsites.net/api/users`;
    return axios.get(url);
}
