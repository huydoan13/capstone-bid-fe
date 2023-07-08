import axios from "axios";
import axiosInstance from "./axios-instance";

const BASE_URL = 'https://bids-api-testing.azurewebsites.net/api/';

export async function getAllCategory() {
    const url = `${BASE_URL}/categorys`;
    return axiosInstance.get(url);
}


export async function updateCategory(category) {
    const url = `${BASE_URL}/categorys/${category.id}`;
    const data = {
        id: category.id,
        name: category.name,
        status: category.status,
    }
    try {
        await axiosInstance.put(url, data);
    } catch (error) {
        console.log(error);
    }
}

export async function deleteCategory(id) {
    const url = `${BASE_URL}/categorys/${id}`;
    try {
        axiosInstance.delete(url, { data: { id } });
        console.log(`Deleted Categorys: ${id}`);
    } catch (error) {
        console.log('Khong delete duoc', error);
    }
}