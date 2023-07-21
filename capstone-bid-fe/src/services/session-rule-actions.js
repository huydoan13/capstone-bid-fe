import axiosInstance from './axios-instance';


const BASE_URL = 'https://bids-api-testing.azurewebsites.net/api';

export async function getAllSessionRule() {
    const url = `${BASE_URL}/sessionrule`;
    return axiosInstance.get(url);
}