import axios from "axios";

export function getAllUser() {
  // return axios.get("https://jsonplaceholder.typicode.com/users");
  return axios.get("https://bids-api-testing.azurewebsites.net/api/users");
}