import axios from "axios";

export async function getAllStaff() {
    const url = `https://bids-api-testing.azurewebsites.net/api/staffs`;
    return axios.get(url);
}

export async function deleteStaff(id) {
    const url = `https://bids-api-testing.azurewebsites.net/api/staffs/${id}`;
    try {
        axios.delete(url, { data: { id } });
        console.log(`Deleted Staff: ${id}`);
    } catch (error) {
        console.log(error);
    }
}