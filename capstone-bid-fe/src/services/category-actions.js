import axios from "axios";
import axiosInstance from "./axios-instance";

const BASE_URL = 'https://bids-api-testing.azurewebsites.net/api/';

export async function getAllCategory() {
    const url = `${BASE_URL}/categorys`;
    return axiosInstance.get(url);
}

export async function createCategory(newCategory) {
    const url = `${BASE_URL}/categorys`;
    const data = {
        categoryName: newCategory.categoryName,
    }

    try{
        axiosInstance.post(url, data);
    }
    catch(error){
        console.log(error);
    }
}


export async function updateCategory(upCategory) {
    const url = `${BASE_URL}/categorys`;
    const data = {
        categoryId: upCategory.categoryId,
        categoryName: upCategory.categoryName,
        status: Boolean(upCategory.status),
    }
    try {
        axiosInstance.put(url, data);
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