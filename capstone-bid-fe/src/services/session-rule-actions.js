import axiosInstance from './axios-instance';


const BASE_URL = 'https://bids-api-testing.azurewebsites.net/api';

export async function getAllSessionRule() {
    const url = `${BASE_URL}/sessionrule`;
    return axiosInstance.get(url);
}

export async function createSessionRule(newSessionRule) {
    const url = `${BASE_URL}/sessionrule`;
    const data = {
        name: newSessionRule.name,
        increaseTime: newSessionRule.increaseTime,
        freeTime: newSessionRule.freeTime,
        delayTime: newSessionRule.delayTime,
        delayFreeTime: newSessionRule.delayFreeTime,
    }

    try{
        axiosInstance.post(url, data);
    }
    catch(error){
        console.log(error);
    }
}

export async function updateSessionRule(upSessionRule) {
    const url = `${BASE_URL}/sessionrule`;
    const data = {
        sessionRuleId: upSessionRule.sessionRuleId,
        name: upSessionRule.name,
        increaseTime: upSessionRule.increaseTime,
        freeTime: upSessionRule.freeTime,
        delayTime: upSessionRule.delayTime,
        delayFreeTime: upSessionRule.delayFreeTime,
        status: Boolean(upSessionRule.status),
    }
    try {
        axiosInstance.put(url, data);
    } catch (error) {
        console.log(error);
    }
}

export async function deleteSessionRule(id) {
    const url = `${BASE_URL}/sessionrule/${id}`;
    try {
        axiosInstance.delete(url, { data: { id } });
        console.log(`Deleted SessionRule: ${id}`);
    } catch (error) {
        console.log('Khong delete duoc', error);
    }
}