import axios from 'axios';
import axiosInstance from './axios-instance';


const BASE_URL = 'https://bids-online.azurewebsites.net/api';

export async function getAllSessions() {
    const url = `${BASE_URL}/sessions`;
    return axiosInstance.get(url);
}
export async function getSessionsSuccess() {
    const url = `${BASE_URL}/sessions/by_complete`;
    return axiosInstance.get(url);
}

export async function getSessionsNotPay() {
    const url = `${BASE_URL}/sessions/by_havent_pay`;
    return axiosInstance.get(url);
}

export async function getSessionsOutOfDate() {
    const url = `${BASE_URL}/sessions/by_out_of_date`;
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

export async function createSession(session, itemId) {
    const url = `${BASE_URL}/sessions`;
    console.log(session);
    const data = {
        sessionName: session.sessionName,
        itemId,
        sessionRuleId: session.sessionRuleId,
        beginTime: session.beginTime,
        endTime: session.endTime,
    }
    
    try {
        axiosInstance.post(url, data);
    } catch (error) {
        console.log(error);
    }
}

export function getStatusInfo(status) {
    switch (status) {
      case 1:
        return { text: 'Chưa bắt đầu', color: 'F0F758' }; // Red color
      case 2:
        return { text: 'Đang diễn ra', color: '#00FF00' }; // Green color
      case 3:
        return { text: 'Chưa thanh toán', color: '#FF0000' }; // Blue color
      default:
        return { text: 'Unknown', color: '#000000' }; // Black color for unknown status
    }
  }