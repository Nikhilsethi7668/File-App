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

export const verifyEmail = async (code) => {
  try {
    const response = await Axios.post("/verify-email", { code });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Error in Verifying Email";
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

export const forgotPassword = async (email) => {
  try {
    const response = await Axios.post("/forgot-password", { email });
    return response.data.message;
  } catch (error) {
    throw error.response?.data?.message || "Error sending reset password email";
  }
};

export const resetPassword = async (token, password) => {
  try {
    const response = await Axios.post(`/reset-password/${token}`, { password });
    return response.data.message;
  } catch (error) {
    throw error.response?.data?.message || "Error resetting password";
  }
};
