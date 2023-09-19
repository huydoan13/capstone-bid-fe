import axiosInstance from './axios-instance';

const BASE_URL = 'https://bids-online.azurewebsites.net/api';

export async function getAllPayment() {
  const url = `${BASE_URL}/Login/report_payment_total`;
  return axiosInstance.get(url);
}

export async function getPaymentDetails(userId) {
  const url = `${BASE_URL}/Login/report_payment_user_total?userId=${userId}`;
  return axiosInstance.get(url);
}
