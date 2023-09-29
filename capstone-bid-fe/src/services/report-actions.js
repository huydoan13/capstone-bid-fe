import axiosInstance from './axios-instance';

const BASE_URL = 'https://bids-online.azurewebsites.net/api';

export async function getReportAfterPayment(startDate, endDate){
    const url = `${BASE_URL}/Login/report_payment?startDate=${startDate}&endDate=${endDate}`;
    return axiosInstance.get(url);
}