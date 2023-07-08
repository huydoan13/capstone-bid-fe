import axios from 'axios';
import axiosInstance from './axios-instance';

export function login(props) {
  const url = 'https://deliver-store.tk/api/v1/customer/authenticate';
  const Email = props.email;
  const Password = props.password;
  const postData = {};
  const error = { error: 'login-fail' };
  return axiosInstance
    .post(url, postData, {
      params: {
        email: Email,
        password: Password,
      },
    })
    .then((response) => response.data)
    .catch((err) => err.response.data);
}
