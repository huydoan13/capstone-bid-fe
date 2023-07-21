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

export function getStatusInfo(status) {
    switch (status) {
      case 'Waitting':
        return { text: 'Đang chờ duyệt', color: '#FA8D24' }; // Red color
      case 'Acctive':
        return { text: 'Đang hoạt động', color: 'green' }; // Red color
      case 'Ban':
        return { text: 'Đã cấm', color: 'red' }; // Green color
      default:
        return { text: 'Unknown', color: '#000000' }; // Black color for unknown status
    }
  }