import Axios from "../Api/Axios.jsx";

export const signup = async (email, password, userName) => {
  try {
    const response = await Axios.post("/auth/signup", {
      email,
      password,
      userName,
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const checkAuth = async () => {
  try {
    const response = await Axios.get("/auth/check-auth");
    return response.data;
  } catch (error) {
    return null;
  }
};

export const login = async (email, password) => {
  try {
    const response = await Axios.post("/auth/login", { email, password });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Error logging in";
  }
};

export const logout = async () => {
  try {
    await Axios.post("/auth/logout");
  } catch (error) {
    throw "Error logging out";
  }
};
