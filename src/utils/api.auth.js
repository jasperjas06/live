import axios from "axios"

const baseUrl = import.meta.env.VITE_API_URL
const token = localStorage.getItem('liveauthToken') || null;

export const login = async (credentials) => {
    try {
        const response = await axios.post(`${baseUrl}api/user/login`, credentials)
        return {
      data: response.data,
      message: response?.data?.message,
      status: 200,
    };
    } catch (error) {
        console.log("Login error:", error)
        return error.response?.data || { success: false, message: "Login failed" }
    }
} 

export const getUserAccess = async (id) => {
    try {
        const response = await axios.get(`${baseUrl}api/role/menu/get/role/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return {
      data: response.data,
      message: response?.data?.message,
      status: 200,
    };
    }
    catch (error) {
        console.log("Get user access error:", error)
        return error.response?.data || { success: false, message: "Failed to fetch user access" }
    }
}

export const getEditRequest = async (params) => {
  try {
    const response = await axios.get(`${baseUrl}api/edit/request/get/all`, {
      headers: {
        Authorization: `${token}`,
      },
      params, // Pass query params (date, export)
    });
    return {
      data: response.data,
      message: response?.data?.message,
      status: 200,
    };
  } catch (error) {
    console.log("Get edit request error:", error);
    return (
      error.response?.data || {
        success: false,
        message: "Failed to fetch edit request",
      }
    );
  }
};

export const getEditRequestByID = async(id)=>{
    try {
        const response = await axios.get(`${baseUrl}api/edit/request/get/${id}`, {
            headers: {
                Authorization: `${token}`
            }
        })
        return {
      data: response.data,
      message: response?.data?.message,
      status: 200,
    };
    } catch (error) {
        console.log("Get edit request error:", error)
        return error.response?.data || { success: false, message: "Failed to fetch edit request" }
    }
}

export const updateRequestStatus = async(id, status)=>{
    try {
        let reason = "N/A"
        const response = await axios.post(`${baseUrl}api/edit/request/approve`, {id,status,reason}, {
            headers: {
                Authorization: `${token}`
            }
        })
        return {
      data: response.data,
        message: response?.data?.message,
        status: 200,
    };
    } catch (error) {
        console.log("Update request status error:", error)
        return error.response?.data || { success: false, message: "Failed to update request status" }
    }
}

export const getUserProfile = async()=>{
    try {
        const response = await axios.get(`${baseUrl}api/user/get/by/token`, {
            headers: {
                Authorization: `${token}`
            }
        })
        return {
        data: response.data,
        message: response?.data?.message,
        status: 200,
    };
    } catch (error) {
        console.log("Get user profile error:", error)
        return error.response?.data || { success: false, message: "Failed to fetch user profile" }
    }
}

export const updateUserProfile = async(profileData)=>{
    try {
        const response = await axios.put(`${baseUrl}api/user/update/their/profile`, profileData, {
            headers: {
                Authorization: `${token}`
            }
        })
        return {
        data: response.data,
        message: response?.data?.message,
        status: 200,
    };
    }
    catch (error) {
        console.log("Update user profile error:", error)
        return error.response?.data || { success: false, message: "Failed to update user profile" }
    }
}

export const reSetPassword = async(data)=>{
    try {
        const response = await axios.put(`${baseUrl}api/user/update/their/password`, data, {
            headers: {
                Authorization: `${token}`
            }
        })
        return {
        data: response.data,
        message: response?.data?.message,
        status: 200,
    };
    }
    catch (error) {
        return error.response?.data || { success: false, message: "Failed to update password" }
    }
}
