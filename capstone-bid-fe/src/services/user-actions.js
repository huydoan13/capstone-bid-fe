import axios from "axios";
import axiosInstance from "./axios-instance";

const BASE_URL = 'https://bids-api-testing.azurewebsites.net/api';

export async function getAllUser() {
    const url = `${BASE_URL}/users`;
    return axiosInstance.get(url);
}


export async function getUserWaiting() {
    const url = `${BASE_URL}/users/get-waitting`;
    return axiosInstance.get(url);
}

export async function getAllUserActive() {
    const url = `${BASE_URL}/users/get-active`;
    return axiosInstance.get(url);
}

export async function getAllUserBan() {
    const url = `${BASE_URL}/users/get-ban`;
    return axiosInstance.get(url);
}