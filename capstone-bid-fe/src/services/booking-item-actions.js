import axios from 'axios';
import axiosInstance from './axios-instance';

const BASE_URL = 'https://bids-online.azurewebsites.net/api';

export async function getAllBookingItem() {
  const url = `${BASE_URL}/bookingitems`;
  return axiosInstance.get(url);
}

export async function getBookingItemById(id) {
  const url = `${BASE_URL}/bookingitems/by_id/${id}`;
  return axiosInstance.get(url);
}

export async function getBookingItemWaiting(email) {
  const url = `${BASE_URL}/bookingitems/by_staff_watting/${email}`;
  return axiosInstance.get(url);
}

export async function getBookingItemNoSesssion(email) {
  const url = `${BASE_URL}/bookingitems/by_staff_to_create_session/${email}`;
  return axiosInstance.get(url);
}

export async function acceptBookingItemWaiting(id) {
  const url = `${BASE_URL}/bookingitems/accept/${id}`;
  try {
    axiosInstance.put(url, { data: { id } });
    console.log(`Accept BookingItem: ${id}`);
  } catch (error) {
    console.log(error);
  }
}

export async function denyBookingItemWaiting(id) {
  const url = `${BASE_URL}/bookingitems/deny/${id}`;
  try {
    axiosInstance.put(url, { data: { id } });
    console.log(`Deny BookingItem: ${id}`);
  } catch (error) {
    console.log(error);
  }
}

export function getStatusInfo(status) {
  switch (status) {
    case 'Waitting':
      return { text: 'Đang chờ duyệt', color: '#FA8D24' }; // Red color
    case 'Accepted':
      return { text: 'Đã chấp nhận', color: '#00FF00' }; // Green color
    case 'Denied':
      return { text: 'Từ chối', color: '#FF0000' }; // Blue color
    case 'Unactive':
      return { text: 'Không hoạt động', color: '#FF0000' };
    case 'NotCreateSessionYet':
      return { text: 'Chưa có phiên', color: '#FF0000' };
    default:
      return { text: 'Unknown', color: '#000000' }; // Black color for unknown status
  }
}

export const getStatusLabel = (status) => {
  switch (status) {
    case 'Waitting':
      return 'Đang chờ duyệt';
    case 'Accepted':
      return 'Đã chấp nhận';
    case 'Denied':
      return 'Từ chối';
    case 'Unactive':
      return 'Không hoạt động';
    case 'NotCreateSessionYet':
      return 'Chưa có Phiên';
    default:
      return '';
  }
};
