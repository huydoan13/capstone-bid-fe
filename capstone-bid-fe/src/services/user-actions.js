import axios from "axios";
import axiosInstance from "./axios-instance";

export async function getAllUser() {
    const url = `https://bids-api-testing.azurewebsites.net/api/users`;
    return axiosInstance.get(url);
}
