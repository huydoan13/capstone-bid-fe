import { useNavigate } from 'react-router-dom';

export default function LogoutFuncion() {
  const navigate = useNavigate();
  function Logout() {
    localStorage.clear('loginUser');
    navigate('/login', { replace: true });
  }
  return Logout;
}
