import axios from "axios";

export function getAllStaff() {
  // return axios.get("https://jsonplaceholder.typicode.com/users");
  return axios.get("https://bids-api-testing.azurewebsites.net/api/staffs");
}