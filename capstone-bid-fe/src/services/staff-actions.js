import axios from "axios";
import axiosInstance from "./axios-instance";

const BASE_URL = 'https://bids-api-testing.azurewebsites.net/api';

export async function getAllStaff() {
    const url = `https://bids-api-testing.azurewebsites.net/api/staffs`;
    return axiosInstance.get(url);
}

export async function deleteStaff(id) {
    const url = `${BASE_URL}/staffs/${id}`;
    try {
        axiosInstance.delete(url, { data: { id } });
        console.log(`Deleted Staff: ${id}`);
    } catch (error) {
        console.log(error);
    }
}

export async function acceptUserWaiting(id) {
    const url = `${BASE_URL}/staffs/accept_user/${id}`;
    try {
        axiosInstance.put(url, { data: { id } });
        console.log(`Accept User: ${id}`);
    } catch (error) {
        console.log(error);
    }
}
export async function denyUserWaiting(id) {
    const url = `${BASE_URL}/staffs/deny_user/${id}`;
    try {
        axiosInstance.put(url, { data: { id } });
        console.log(`Deny User: ${id}`);
    } catch (error) {
        console.log(error);
    }
}

export async function banUser(id) {
    const url = `${BASE_URL}/staffs/ban/${id}`;
    try {
        axiosInstance.put(url, { data: { id } });
        console.log(`Ban User: ${id}`);
    } catch (error) {
        console.log(error);
    }
}
export async function unBanUser(id) {
    const url = `${BASE_URL}/staffs/unban/${id}`;
    try {
        axiosInstance.put(url, { data: { id } });
        console.log(`UnBan User: ${id}`);
    } catch (error) {
        console.log(error);
    }
}