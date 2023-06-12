import axios from "axios";

export async function getAllItemType() {
    const url = `https://bids-api-testing.azurewebsites.net/api/itemtypes`;
    return axios.get(url);
}
