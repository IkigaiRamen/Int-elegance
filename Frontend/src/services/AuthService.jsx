import {jwtDecode} from "jwt-decode";

const getUserIdFromToken = () => {
  try {
    // Step 1: Retrieve the token from localStorage or sessionStorage
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    // Step 2: If no token found, throw an error or return null
    if (!token) {
      throw new Error("No token found");
    }

    // Step 3: Decode the token to extract user information
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.id;

    // Step 4: Return the user ID
    return userId;
  } catch (error) {
    console.error("Error decoding token:", error.message);
    return null;
  }
};

export { getUserIdFromToken };
