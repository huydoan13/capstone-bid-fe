import axios from "axios";
import axiosInstance from "./axios-instance";

const BASE_URL = 'https://bids-online.azurewebsites.net/api';

export async function getAllUser() {
    const url = `${BASE_URL}/users`;
    return axiosInstance.get(url);
}

export async function getUserById(id) {
    const url = `${BASE_URL}/users/${id}`;
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

  export const getRoleLabel = (status) => {
    switch (status) {
      case 'Bidder':
        return 'Người đấu giá';
      case 'Auctioneer':
        return 'Người đăng phiên';
      case 'Admin':
        return 'Quản trị viên';
      case 'Staff':
        return 'Nhân viên';
      default:
        return '';
    }
  };

  export const getStatusLabel = (status) => {
    switch (status) {
      case 'Waitting':
        return 'Đang chờ duyệt';
      case 'Acctive':
        return 'Đang hoạt động';
      case 'Ban':
        return 'Đã cấm';
      default:
        return 'Không rõ';
    }
  };