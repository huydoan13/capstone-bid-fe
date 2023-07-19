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