import axios from "axios";
import axiosInstance from "./axios-instance";

const BASE_URL = 'https://bids-api-testing.azurewebsites.net/api/';

export async function getAllBookingItem() {
    const url = `${BASE_URL}/bookingitems`;
    return axiosInstance.get(url);
}

export async function getBookingItemWaiting(email) {
    const url = `${BASE_URL}/bookingitems/by_staff_watting/${email}`;
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