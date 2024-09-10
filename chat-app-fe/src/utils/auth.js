export const setToken = (token) => {
    localStorage.setItem('token', token);
  };
  
  export const getToken = () => {
    return localStorage.getItem('token');
  };
  
  export const removeToken = () => {
    localStorage.removeItem('token');
  };

// Decode the JWT token to extract the user ID
export const decodeToken = (token) => {
  if (!token) return null;

  const base64Url = token.split('.')[1];  // Get the payload part of the JWT
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);  // Parse the JSON payload
};

// Extract the logged-in user ID from the decoded token
export const getUserIdFromToken = () => {
  const token = getToken();  // Get the JWT token
  if (!token) return null;

  const decodedToken = decodeToken(token);  // Decode the token
  return decodedToken?.id || null;  // Return the user ID from the token
};