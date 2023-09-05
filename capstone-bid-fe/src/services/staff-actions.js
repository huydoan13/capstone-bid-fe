import axios from 'axios';
import axiosInstance from './axios-instance';

const BASE_URL = 'https://bids-online.azurewebsites.net/api';

export async function getAllStaff() {
  const url = `https://bids-online.azurewebsites.net/api/staffs`;
  return axiosInstance.get(url);
}

export async function getStaffById(id) {
  const url = `${BASE_URL}/staffs/by_id?id=${id}`;
  try {
    axiosInstance.get(url, { data: { id } });
  } catch (error) {
    console.log(error);
  }
  return axiosInstance.get(url);
}

export async function getNotificationById(id) {
  const url = `${BASE_URL}/staffnotificationdetail/by_id`;
  try {
    axiosInstance.get(url, { data: { id } });
  } catch (error) {
    console.log(error);
  }
  return axiosInstance.get(url);
}

export async function createStaff(newStaff) {
  const url = `${BASE_URL}/staffs`;
  const data = {
    staffName: newStaff.staffName,
    email: newStaff.email,
    password: newStaff.password,
    address: newStaff.address,
    phone: newStaff.phone,
    dateOfBirth: newStaff.dateOfBirth,
  };

  try {
    axiosInstance.post(url, data);
  } catch (error) {
    console.log(error);
  }
}

export async function updateStaff(upStaff) {
  const url = `${BASE_URL}/staffs`;
  const data = {
    staffId: upStaff.staffId,
    staffName: upStaff.staffName,
    address: upStaff.address,
    phone: upStaff.phone,
  };
  try {
    axiosInstance.put(url, data);
  } catch (error) {
    console.log(error);
  }
}

export async function deleteStaff(id) {
  const url = `${BASE_URL}/staffs?id=${id}`;
  try {
    axiosInstance.delete(url, { data: { id } });
    console.log(`Deleted Staff: ${id}`);
  } catch (error) {
    console.log(error);
  }
}

export async function acceptUserWaiting(id) {
  const url = `${BASE_URL}/staffs/accept_user?AcceptId=${id}`;
  const data = { id };
  try {
    axiosInstance.put(url, { params: data });
    console.log(`Accept User: ${id}`);
  } catch (error) {
    console.log(error);
  }
}
export async function denyUserWaiting(id, reason) {
  const url = `${BASE_URL}/staffs/deny_user?DenyId=${id}&reason=${reason}`;
  const data = {
    id,
    reason,
  };
  try {
    axiosInstance.put(url, data);
    console.log(`Deny User: ${id}`);
  } catch (error) {
    console.log(error);
  }
}

export async function banUser(id) {
  const url = `${BASE_URL}/staffs/ban?BanId=${id}`;
//   const data = { BanID };
  try {
    axiosInstance.put(url, { data: {id}} );
    console.log(`Ban User: ${id}`);
  } catch (error) {
    console.log(error);
  }
}

export async function unBanUser(id) {
  const url = `${BASE_URL}/staffs/unban?UnBanId=${id}`;
  const data = { id }
  try {
    axiosInstance.put(url, { params: data });
    console.log(`UnBan User: ${id}`);
  } catch (error) {
    console.log(error);
  }
}
