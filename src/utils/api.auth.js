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

export const getEditRequest = async()=>{
    try {
        const response = await axios.get(`${baseUrl}api/edit/request/get/all`, {
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
        const response = await axios.post(`${baseUrl}api/edit/request/approve`, {id,status}, {
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