import axios from 'axios';
import axiosInstance from './axios-instance';

const BASE_URL = 'https://bids-api-testing.azurewebsites.net/api';

export async function getAllFee() {
  const url = `${BASE_URL}/fee`;
  return axiosInstance.get(url);
}

export async function updateFee(fee) {
  const url = `${BASE_URL}/fee`;
  const data = {
    feeId: fee.feeId,
    name: fee.feeName,
    min: fee.min,
    max: fee.max,
    participationFee: fee.participationFee,
    depositFee: fee.depositFee,
    surcharge: fee.surcharge,
    status: Boolean(fee.status),
  };
  try {
    axiosInstance.put(url, data);
  } catch (error) {
    console.log(error);
  }
}

export async function deleteFee(feeId) {
  const url = `${BASE_URL}/fee/${feeId}`;
  try {
    axiosInstance.delete(url, { data: { feeId } });
    console.log(`Deleted Fee: ${feeId}`);
  } catch (error) {
    console.log('Khong delete duoc', error);
  }
}
