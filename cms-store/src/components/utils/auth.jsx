

// Save JWT token to localStorage
export function setToken(token) {
  localStorage.setItem("token", token);
}

// Retrieve JWT token from localStorage
export function getToken() {
  return localStorage.getItem("token");
}

// Remove token from localStorage and log out user
export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

// Check if the user is logged in by checking token presence
export function isLoggedIn() {
  return !!localStorage.getItem("token");
}

// Perform authenticated HTTP request with proper headers and error handling

