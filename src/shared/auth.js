const isAuthenticated = () => {
  let authState = false;
  if (localStorage.IDtoken) {
    if (localStorage.emailId) {
      authState = localStorage.emailId;
    } else if (localStorage.phoneNumber) {
      authState = localStorage.phoneNumber;
    }
  }
  return authState;
};

export default isAuthenticated;
