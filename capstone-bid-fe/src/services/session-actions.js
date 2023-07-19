import axios from 'axios';
import axiosInstance from './axios-instance';


const BASE_URL = 'https://bids-api-testing.azurewebsites.net/api/';

export async function getAllSessions() {
    const url = `${BASE_URL}/sessions`;
    return axiosInstance.get(url);
}

export async function getSessionsNotPay() {
    const url = `${BASE_URL}/sessions/by_havent_pay`;
    return axiosInstance.get(url);
}

export async function deleteSession(id) {
    const url = `${BASE_URL}/sessions/${id}`;
    try {
        axiosInstance.delete(url, { data: { id } });
        console.log(`Deleted Session: ${id}`);
    } catch (error) {
        console.log(error);
    }
}

export async function createSession(session) {
    const url = `${BASE_URL}/sessions`;
    const data = {
        itemId: session.itemId,
        sessionName: session.sessionName,
        beginTime: session.beginTime,
        auctionTime: session.auctionTime,
        endTime: session.endTime,
    }
    try {
        axiosInstance.post(url, data);
    } catch (error) {
        console.log(error);
    }
}