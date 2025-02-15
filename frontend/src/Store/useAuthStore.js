import Axios from "../Api/Axios.jsx";

export const signup = async (email, password, name, confirmPassword) => {
  try {
    const response = await Axios.post("/signup", {
      email,
      password,
      name,
      confirmPassword,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Error Signing Up";
  }
};

export const checkAuth = async () => {
  try {
    const response = await Axios.get("/check-auth");
    return response.data;
  } catch (error) {
    return null;
  }
};

export const login = async (email, password) => {
  try {
    const response = await Axios.post("/login", { email, password });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Error logging in";
  }
};

export const logout = async () => {
  try {
    await Axios.post("/logout");
  } catch (error) {
    throw "Error logging out";
  }
};
