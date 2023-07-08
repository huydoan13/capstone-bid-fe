// import { Fragment } from 'react';
// import { Navigate } from 'react-router-dom';
// import { UseUserRoles } from './UseUserRoles';

// export function RolesAuthRoute({ children, roles }) {
//   const userRoles = UseUserRoles();

//   const canAccess = userRoles.some((userRole) => roles.includes(userRole));

//   if (canAccess) return <>{children}</>;

//   return <Navigate to='/login' />;
// }


import { createContext, useState } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({});

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;