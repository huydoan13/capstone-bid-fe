import axios from "axios";
import axiosInstance from "./axios-instance";

export async function getAllStaff() {
    const url = `https://bids-api-testing.azurewebsites.net/api/staffs`;
    return axiosInstance.get(url);
}

export async function deleteStaff(id) {
    const url = `https://bids-api-testing.azurewebsites.net/api/staffs/${id}`;
    try {
        axiosInstance.delete(url, { data: { id } });
        console.log(`Deleted Staff: ${id}`);
    } catch (error) {
        console.log(error);
    }
}