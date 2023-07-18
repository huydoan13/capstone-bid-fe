export function UseUserRoles() {
    const user = JSON.parse(localStorage.getItem('loginUser'));
    const userRoles = [user?.Role];
  
    return userRoles;
  }
  