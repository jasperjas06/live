/* eslint-disable consistent-return */
import axios from "axios"

const base_url = import.meta.env.VITE_API_URL

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('liveauthToken') || '';
};

// Helper function to create headers with auth token
const getHeaders = () => ({
  Authorization: `${getAuthToken()}`,
  'Content-Type': 'application/json'
});

// Customer APIS
export const createCustomer = async (data) => {
  try {
    const response = await axios.post(`${base_url}api/customer/create`, data, {
      headers: getHeaders()
    });
    return {
      data: response.data,
      message: response?.data?.message,
      status: 200,
    };
  } catch (error) {
    return {
      data: null,
      message: error.response?.data?.message || error.message || 'An error occurred',
      status: error.response?.status || 500,
    };
  }
};

export const getAllCustomer = async () => {
  try {
    const response = await axios.get(`${base_url}api/customer/get/all`, {
      headers: getHeaders()
    });
    return {
      data: response.data,
      message: response?.data?.message,
      status: 200,
    };
  } catch (error) {
    return {
      data: null,
      message: error.response?.data?.message || error.message || 'An error occurred',
      status: error.response?.status || 500,
    };
  }
}

export const getACustomer = async (id) => {
  try {
    const response = await axios.get(`${base_url}api/customer/get/${id}`, {
      headers: getHeaders()
    });
    return {
      data: response.data,
      message: response?.data?.message,
      status: 200,
    };
  } catch (error) {
    return {
      data: null,
      message: error.response?.data?.message || error.message || 'An error occurred',
      status: error.response?.status || 500,
    };
  }
}

export const updateCustomer = async (data) => {
  try {
    const response = await axios.put(`${base_url}api/customer/update`, data, {
      headers: getHeaders()
    });
    return {
      data: response.data,
      message: response?.data?.message,
      status: 200,
    };
  } catch (error) {
    return {
      data: null,
      message: error.response?.data?.message || error.message || 'An error occurred',
      status: error.response?.status || 500,
    };
  }
}

export const deleteCustomer = async (id) => {
  try {
    const data = { _id: id }
    const response = await axios.delete(`${base_url}api/customer/delete`, {
      data: data,
      headers: getHeaders()
    });
    return {
      data: response.data,
      message: response?.data?.message,
      status: 200,
    };
  } catch (error) {
    return {
      data: null,
      message: error.response?.data?.message || error.message || 'An error occurred',
      status: error.response?.status || 500,
    };
  }
}

// Projects APIS
export const createProjects = async (data) => {
  try {
    const response = await axios.post(`${base_url}api/project/create`, data, {
      headers: getHeaders()
    });
    return {
      data: response.data,
      message: response?.data?.message,
      status: 200,
    };
  } catch (error) {
    return {
      data: null,
      message: error.response?.data?.message || error.message || 'An error occurred',
      status: error.response?.status || 500,
    };
  }
};

export const updateProject = async (data) => {
  try {
    const response = await axios.put(`${base_url}api/project/update`, data, {
      headers: getHeaders()
    });
    return {
      data: response.data,
      message: response?.data?.message,
      status: 200,
    };
  } catch (error) {
    return {
      data: null,
      message: error.response?.data?.message || error.message || 'An error occurred',
      status: error.response?.status || 500,
    };
  }
}

export const getAProject = async (id) => {
  try {
    const response = await axios.get(`${base_url}api/project/get/${id}`, {
      headers: getHeaders()
    });
    return {
      data: response.data,
      message: response?.data?.message,
      status: 200,
    };
  } catch (error) {
    return {
      data: null,
      message: error.response?.data?.message || error.message || 'An error occurred',
      status: error.response?.status || 500,
    };
  }
}

export const getAllProjects = async () => {
  try {
    const response = await axios.get(`${base_url}api/project/get/all`, {
      headers: getHeaders()
    });
    return {
      data: response.data,
      message: response?.data?.message,
      status: 200,
    };
  } catch (error) {
    return {
      data: null,
      message: error.response?.data?.message || error.message || 'An error occurred',
      status: error.response?.status || 500,
    };
  }
}

export const deleteProject = async (id) => {
  try {
    const data = { _id: id }
    const response = await axios.delete(`${base_url}api/project/delete`, {
      data: data,
      headers: getHeaders()
    });
    return {
      data: response.data,
      message: response?.data?.message,
      status: 200,
    };
  } catch (error) {
    return {
      data: null,
      message: error.response?.data?.message || error.message || 'An error occurred',
      status: error.response?.status || 500,
    };
  }
}

// Marketing Head APIS
export const getAllMarkingHead = async () => {
  try {
    const response = await axios.get(`${base_url}api/market/head/get/all`, {
      headers: getHeaders()
    });
    return {
      data: response.data,
      message: response?.data?.message,
      status: 200,
    };
  } catch (error) {
    return {
      data: null,
      message: error.response?.data?.message || error.message || 'An error occurred',
      status: error.response?.status || 500,
    };
  }
}

export const getAMarketingHead = async (id) => {
  try {
    const response = await axios.get(`${base_url}api/market/head/get/${id}`, {
      headers: getHeaders()
    });
    return {
      data: response.data,
      message: response?.data?.message,
      status: 200,
    };
  } catch (error) {
    return {
      data: null,
      message: error.response?.data?.message || error.message || 'An error occurred',
      status: error.response?.status || 500,
    };
  }
}

export const updateMarketingHead = async (data) => {
  try {
    const response = await axios.put(`${base_url}api/market/head/update`, data, {
      headers: getHeaders()
    });
    return {
      data: response.data,
      message: response?.data?.message,
      status: 200,
    };
  } catch (error) {
    return {
      data: null,
      message: error.response?.data?.message || error.message || 'An error occurred',
      status: error.response?.status || 500,
    };
  }
}

export const deleteMarketingHead = async (id) => {
  try {
    const data = { _id: id }
    const response = await axios.delete(`${base_url}api/market/head/delete`, {
      data: data,
      headers: getHeaders()
    });
    return {
      data: response.data,
      message: response?.data?.message,
      status: 200,
    };
  } catch (error) {
    return {
      data: null,
      message: error.response?.data?.message || error.message || 'An error occurred',
      status: error.response?.status || 500,
    };
  }
}

export const createMarkinghead = async (data) => {
  try {
    const response = await axios.post(`${base_url}api/market/head/create`, data, {
      headers: getHeaders()
    });
    return {
      data: response.data,
      message: response?.data?.message,
      status: 200,
    };
  } catch (error) {
    return {
      data: null,
      message: error.response?.data?.message || error.message || 'An error occurred',
      status: error.response?.status || 500,
    };
  }
};

// Marketer APIS
export const createMarketer = async (data) => {
  try {
    const response = await axios.post(`${base_url}api/market/detail/create`, data, {
      headers: getHeaders()
    });
    return {
      data: response.data,
      message: response?.data?.message,
      status: 200,
    };
  } catch (error) {
    return {
      data: null,
      message: error.response?.data?.message || error.message || 'An error occurred',
      status: error.response?.status || 500,
    };
  }
};

export const updateMarketer = async (data) => {
  try {
    const response = await axios.put(`${base_url}api/market/detail/update`, data, {
      headers: getHeaders()
    });
    return {
      data: response.data,
      message: response?.data?.message,
      status: 200,
    };
  } catch (error) {
    return {
      data: null,
      message: error.response?.data?.message || error.message || 'An error occurred',
      status: error.response?.status || 500,
    };
  }
}

export const getAllMarketer = async () => {
  try {
    const response = await axios.get(`${base_url}api/market/detail/get/all`, {
      headers: getHeaders()
    });
    return {
      data: response.data,
      message: response?.data?.message,
      status: 200,
    };
  } catch (error) {
    return {
      data: null,
      message: error.response?.data?.message || error.message || 'An error occurred',
      status: error.response?.status || 500,
    };
  }
}

export const getAMarketer = async (id) => {
  try {
    const response = await axios.get(`${base_url}api/market/detail/get/${id}`, {
      headers: getHeaders()
    });
    return {
      data: response.data,
      message: response?.data?.message,
      status: 200,
    };
  } catch (error) {
    return {
      data: null,
      message: error.response?.data?.message || error.message || 'An error occurred',
      status: error.response?.status || 500,
    };
  }
}

// Percentage APIS
export const createPercentage = async (data) => {
  try {
    const response = await axios.post(`${base_url}api/percentage/create`, data, {
      headers: getHeaders()
    });
    return {
      data: response.data,
      message: response?.data?.message,
      status: 200,
    };
  } catch (error) {
    return {
      data: null,
      message: error.response?.data?.message || error.message || 'An error occurred',
      status: error.response?.status || 500,
    };
  }
};

export const getAllPercentage = async () => {
  try {
    const response = await axios.get(`${base_url}api/percentage/get/all`, {
      headers: getHeaders()
    });
    return {
      data: response.data,
      message: response?.data?.message,
      status: 200,
    };
  } catch (error) {
    return {
      data: null,
      message: error.response?.data?.message || error.message || 'An error occurred',
      status: error.response?.status || 500,
    };
  }
}

export const getAPercentage = async (id) => {
  try {
    const response = await axios.get(`${base_url}api/percentage/get/${id}`, {
      headers: getHeaders()
    });
    return {
      data: response.data,
      message: response?.data?.message,
      status: 200,
    };
  } catch (error) {
    return {
      data: null,
      message: error.response?.data?.message || error.message || 'An error occurred',
      status: error.response?.status || 500,
    };
  }
}

export const deletePercentage = async (id) => {
  try {
    const data = { _id: id }
    const response = await axios.delete(`${base_url}api/percentage/delete`, {
      data: data,
      headers: getHeaders()
    });
    return {
      data: response.data,
      message: response?.data?.message,
      status: 200,
    };
  } catch (error) {
    return {
      data: null,
      message: error.response?.data?.message || error.message || 'An error occurred',
      status: error.response?.status || 500,
    };
  }
}

export const updatePercentage = async (data) => {
  try {
    const response = await axios.put(`${base_url}api/percentage/update`, data, {
      headers: getHeaders()
    });
    return {
      data: response.data,
      message: response?.data?.message,
      status: 200,
    };
  } catch (error) {
    return {
      data: null,
      message: error.response?.data?.message || error.message || 'An error occurred',
      status: error.response?.status || 500,
    };
  }
}

// MOD APIS
export const createMOD = async (data) => {
  try {
    const response = await axios.post(`${base_url}api/mod/create`, data, {
      headers: getHeaders()
    });
    return {
      data: response.data,
      message: response?.data?.message,
      status: 200,
    };
  } catch (error) {
    return {
      data: null,
      message: error.response?.data?.message || error.message || 'An error occurred',
      status: error.response?.status || 500,
    };
  }
};

export const getAllMOD = async () => {
  try {
    const response = await axios.get(`${base_url}api/mod/get/all`, {
      headers: getHeaders()
    });
    return {
      data: response.data,
      message: response?.data?.message,
      status: 200,
    };
  } catch (error) {
    return {
      data: null,
      message: error.response?.data?.message || error.message || 'An error occurred',
      status: error.response?.status || 500,
    };
  }
}

export const getAMOD = async (id) => {
  try {
    const response = await axios.get(`${base_url}api/mod/get/${id}`, {
      headers: getHeaders()
    });
    return {
      data: response.data,
      message: response?.data?.message,
      status: 200,
    };
  } catch (error) {
    return {
      data: null,
      message: error.response?.data?.message || error.message || 'An error occurred',
      status: error.response?.status || 500,
    };
  }
}

export const deleteMOD = async (id) => {
  try {
    const data = { _id: id }
    const response = await axios.delete(`${base_url}api/mod/delete`, {
      data: data,
      headers: getHeaders()
    });
    return {
      data: response.data,
      message: response?.data?.message,
      status: 200,
    };
  } catch (error) {
    return {
      data: null,
      message: error.response?.data?.message || error.message || 'An error occurred',
      status: error.response?.status || 500,
    };
  }
}

export const updateMOD = async (data) => {
  try {
    const response = await axios.put(`${base_url}api/mod/update`, data, {
      headers: getHeaders()
    });
    return {
      data: response.data,
      message: response?.data?.message,
      status: 200,
    };
  } catch (error) {
    return {
      data: null,
      message: error.response?.data?.message || error.message || 'An error occurred',
      status: error.response?.status || 500,
    };
  }
}

// NVT APIS
export const createNVT = async (data) => {
  try {
    const response = await axios.post(`${base_url}api/nvt/create`, data, {
      headers: getHeaders()
    });
    return {
      data: response.data,
      message: response?.data?.message,
      status: 200,
    };
  } catch (error) {
    return {
      data: null,
      message: error.response?.data?.message || error.message || 'An error occurred',
      status: error.response?.status || 500,
    };
  }
};

export const updateNVT = async (data) => {
  try {
    const response = await axios.put(`${base_url}api/nvt/update`, data, {
      headers: getHeaders()
    });
    return {
      data: response.data,
      message: response?.data?.message,
      status: 200,
    };
  } catch (error) {
    return {
      data: null,
      message: error.response?.data?.message || error.message || 'An error occurred',
      status: error.response?.status || 500,
    };
  }
}

export const getAllNVT = async () => {
  try {
    const response = await axios.get(`${base_url}api/nvt/get/all`, {
      headers: getHeaders()
    });
    return {
      data: response.data,
      message: response?.data?.message,
      status: 200,
    };
  } catch (error) {
    return {
      data: null,
      message: error.response?.data?.message || error.message || 'An error occurred',
      status: error.response?.status || 500,
    };
  }
}

export const getANVT = async (id) => {
  try {
    const response = await axios.get(`${base_url}api/nvt/get/${id}`, {
      headers: getHeaders()
    });
    return {
      data: response.data,
      message: response?.data?.message,
      status: 200,
    };
  } catch (error) {
    return {
      data: null,
      message: error.response?.data?.message || error.message || 'An error occurred',
      status: error.response?.status || 500,
    };
  }
}

export const deleteNVT = async (id) => {
  try {
    const data = { _id: id }
    const response = await axios.delete(`${base_url}api/nvt/delete`, {
      data: data,
      headers: getHeaders()
    });
    return {
      data: response.data,
      message: response?.data?.message,
      status: 200,
    };
  } catch (error) {
    return {
      data: null,
      message: error.response?.data?.message || error.message || 'An error occurred',
      status: error.response?.status || 500,
    };
  }
}

// LFC APIS
export const createLFC = async (data) => {
  try {
    const response = await axios.post(`${base_url}api/lfc/create`, data, {
      headers: getHeaders()
    });
    return {
      data: response.data,
      message: response?.data?.message,
      status: 200,
    };
  } catch (error) {
    return {
      data: null,
      message: error.response?.data?.message || error.message || 'An error occurred',
      status: error.response?.status || 500,
    };
  }
};

export const updateLFC = async (data) => {
  try {
    const response = await axios.put(`${base_url}api/lfc/update`, data, {
      headers: getHeaders()
    });
    return {
      data: response.data,
      message: response?.data?.message,
      status: 200,
    };
  } catch (error) {
    return {
      data: null,
      message: error.response?.data?.message || error.message || 'An error occurred',
      status: error.response?.status || 500,
    };
  }
}

export const getAllLFC = async () => {
  try {
    const response = await axios.get(`${base_url}api/lfc/get/all`, {
      headers: getHeaders()
    });
    return {
      data: response.data,
      message: response?.data?.message,
      status: 200,
    };
  } catch (error) {
    return {
      data: null,
      message: error.response?.data?.message || error.message || 'An error occurred',
      status: error.response?.status || 500,
    };
  }
}

export const getALFC = async (id) => {
  try {
    const response = await axios.get(`${base_url}api/lfc/get/${id}`, {
      headers: getHeaders()
    });
    return {
      data: response.data,
      message: response?.data?.message,
      status: 200,
    };
  } catch (error) {
    return {
      data: null,
      message: error.response?.data?.message || error.message || 'An error occurred',
      status: error.response?.status || 500,
    };
  }
}

export const deleteLFC = async (id) => {
  try {
    const data = { _id: id }
    const response = await axios.delete(`${base_url}api/lfc/delete`, {
      data: data,
      headers: getHeaders()
    });
    return {
      data: response.data,
      message: response?.data?.message,
      status: 200,
    };
  } catch (error) {
    return {
      data: null,
      message: error.response?.data?.message || error.message || 'An error occurred',
      status: error.response?.status || 500,
    };
  }
}

// NVT by Customer
export const getANVTbyCus = async (id) => {
  try {
    const response = await axios.get(`${base_url}api/nvt/get/all/customer/${id}`, {
      headers: getHeaders()
    });
    return {
      data: response.data,
      message: response?.data?.message,
      status: 200,
    };
  } catch (error) {
    return {
      data: null,
      message: error.response?.data?.message || error.message || 'An error occurred',
      status: error.response?.status || 500,
    };
  }
}

// Role APIS
export const CreateRole = async (data) => {
  try {
    const response = await axios.post(`${base_url}api/role/create`, data, {
      headers: getHeaders()
    });
    return {
      data: response.data,
      message: response?.data?.message,
      status: 200,
    };
  } catch (error) {
    return {
      data: null,
      message: error.response?.data?.message || error.message || "An error occurred",
      status: error.response?.status || 500,
    };
  }
};

export const getAllRoles = async () => {
  try {
    const response = await axios.get(`${base_url}api/role/get/all`, {
      headers: getHeaders()
    })
    return {
      data: response.data,
      message: response?.data?.message,
      status: 200,
    };
  } catch (error) {
    console.log("Error fetching roles:", error);
    return {
      data: null,
      message: error.response?.data?.message || error.message || "An error occurred",
      status: error.response?.status || 500,
    };
  }
}

export const getRoleById = async (id) => {
  try {
    const response = await axios.get(`${base_url}api/role/get/${id}`, {
      headers: getHeaders()
    })
    return {
      data: response.data,
      message: response?.data?.message,
      status: 200,
    };
  } catch (error) {
    console.log("Error fetching roles:", error);
    return {
      data: null,
      message: error.response?.data?.message || error.message || "An error occurred",
      status: error.response?.status || 500,
    };
  }
}

export const updateRole = async (data) => {
  try {
    const response = await axios.put(`${base_url}api/role/update`, data, {
      headers: getHeaders()
    });
    return {
      data: response.data,
      message: response?.data?.message,
      status: 200,
    };
  } catch (error) {
    return {
      data: null,
      message: error.response?.data?.message || error.message || 'An error occurred',
      status: error.response?.status || 500,
    };
  }
}

export const deleteRole = async (id) => {
  try {
    const data = { _id: id }
    const response = await axios.delete(`${base_url}api/role/delete`, {
      data: data,
      headers: getHeaders()
    });
    return {
      data: response.data,
      message: response?.data?.message,
      status: 200,
    };
  } catch (error) {
    return {
      data: null,
      message: error.response?.data?.message || error.message || 'An error occurred',
      status: error.response?.status || 500,
    };
  }
}

// Employee APIS
export const createEmployee = async (data) => {
  try {
    const response = await axios.post(`${base_url}api/user/create`, data, {
      headers: getHeaders()
    });
    return {
      data: response.data,
      message: response?.data?.message,
      status: 200,
    };
  } catch (error) {
    return {
      data: null,
      message: error.response?.data?.message || error.message || "An error occurred",
      status: error.response?.status || 500,
    };
  }
};

export const getAllEmployees = async () => {
  try {
    const response = await axios.get(`${base_url}api/user/get/all?role`, {
      headers: getHeaders()
    });
    return {
      data: response.data,
      message: response?.data?.message,
      status: 200,
    };
  } catch (error) {
    console.log("Error fetching employees:", error);
    return {
      data: null,
      message: error.response?.data?.message || error.message || "An error occurred",
      status: error.response?.status || 500,
    };
  }
};

export const getEmployeeById = async (id) => {
  try {
    const response = await axios.get(`${base_url}api/user/get/${id}`, {
      headers: getHeaders()
    });
    return {
      data: response.data,
      message: response?.data?.message,
      status: 200,
    };
  } catch (error) {
    console.log("Error fetching employee:", error);
    return {
      data: null,
      message: error.response?.data?.message || error.message || "An error occurred",
      status: error.response?.status || 500,
    };
  }
};

export const updateEmployee = async (data) => {
  try {
    const response = await axios.put(`${base_url}api/user/update`, data, {
      headers: getHeaders()
    });
    return {
      data: response.data,
      message: response?.data?.message,
      status: 200,
    };
  } catch (error) {
    return {
      data: null,
      message: error.response?.data?.message || error.message || "An error occurred",
      status: error.response?.status || 500,
    };
  }
};

export const deleteEmployee = async (id) => {
  try {
    const data = { _id: id };
    const response = await axios.delete(`${base_url}api/user/delete`, {
      data,
      headers: getHeaders()
    });
    return {
      data: response.data,
      message: response?.data?.message,
      status: 200,
    };
  } catch (error) {
    return {
      data: null,
      message: error.response?.data?.message || error.message || "An error occurred",
      status: error.response?.status || 500,
    };
  }
};

// Menu APIS
export const getAllMenu = async () => {
  try {
    const response = await axios.get(`${base_url}api/menu/get/all`, {
      headers: getHeaders()
    });
    return {
      data: response.data,
      message: response?.data?.message,
      status: 200,
    };
  } catch (error) {
    console.log("Error fetching menus:", error);
    return {
      data: null,
      message: error.response?.data?.message || error.message || "An error occurred",
      status: error.response?.status || 500,
    };
  }
};

// Menu Mapping APIS
export const createMenuMapping = async (data) => {
  try {
    const response = await axios.post(`${base_url}api/role/menu/multi/create`, data, {
      headers: getHeaders()
    });
    return {
      data: response.data,
      message: response?.data?.message,
      status: 200,
    };
  } catch (error) {
    return {
      data: null,
      message: error.response?.data?.message || error.message || "An error occurred",
      status: error.response?.status || 500,
    };
  }
};

export const getAllRoleMenu = async () => {
  try {
    const response = await axios.get(`${base_url}api/role/menu/get/all`, {
      headers: getHeaders()
    });
    return {
      data: response.data,
      message: response?.data?.message,
      status: 200,
    };
  } catch (error) {
    console.log("Error fetching role menus:", error);
    return {
      data: null,
      message: error.response?.data?.message || error.message || "An error occurred",
      status: error.response?.status || 500,
    };
  }
};

export const getRoleMenuById = async (id) => {
  try {
    const response = await axios.get(`${base_url}api/role/menu/get/role/${id}`, {
      headers: getHeaders()
    });
    return {
      data: response.data,
      message: response?.data?.message,
      status: 200,
    };
  } catch (error) {
    console.log("Error fetching role menu:", error);
    return {
      data: null,
      message: error.response?.data?.message || error.message || "An error occurred",
      status: error.response?.status || 500,
    };
  }
};

export const updateMenuMapping = async (data) => {
  try {
    const response = await axios.put(`${base_url}api/role/menu/multi/update`, data, {
      headers: getHeaders()
    });
    return {
      data: response.data,
      message: response?.data?.message,
      status: 200,
    };
  } catch (error) {
    return {
      data: null,
      message: error.response?.data?.message || error.message || "An error occurred",
      status: error.response?.status || 500,
    };
  }
};

export const deleteMenuMapping = async (id) => {
  try {
    const data = { _id: id };
    const response = await axios.delete(`${base_url}api/role/menu/delete`, {
      data,
      headers: getHeaders()
    });
    return {
      data: response.data,
      message: response?.data?.message,
      status: 200,
    };
  } catch (error) {
    return {
      data: null,
      message: error.response?.data?.message || error.message || "An error occurred",
      status: error.response?.status || 500,
    };
  }
};

// File Upload API
export const fileUpload = async (data) => {
  try {
    const token = getAuthToken();
    const response = await axios.post(`${base_url}api/common/upload`, data, {
      headers: {
        Authorization: ` ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return {
      data: response.data,
      message: response?.data?.message,
      status: response.status,
    };
  } catch (error) {
    return {
      data: null,
      message: error.response?.data?.message || error.message || "An error occurred",
      status: error.response?.status || 500,
    };
  }
};

// Common APIS
export const commonCreate = async (data) => {
  try {
    const response = await axios.post(`${base_url}api/common/create/all`, data, {
      headers: getHeaders()
    });
    return {
      data: response.data,
      message: response?.data?.message,
      status: 200,
    };
  } catch (error) {
    return {
      data: null,
      message: error.response?.data?.message || error.message || "An error occurred",
      status: error.response?.status || 500,
    };
  }
}

// Billing APIS
export const getAllBilling = async () => {
  try {
    const response = await axios.get(`${base_url}api/common/billing/get/all`, {
      headers: getHeaders()
    });
    return {
      data: response.data,
      message: response?.data?.message,
      status: 200,
    };
  } catch (error) {
    console.log("Error fetching billing:", error);
    return {
      data: null,
      message: error.response?.data?.message || error.message || "An error occurred",
      status: error.response?.status || 500,
    };
  }
}

export const getBillingById = async (id) => {
  try {
    const response = await axios.get(`${base_url}api/common/billing/get/${id}`, {
      headers: getHeaders()
    });
    return {
      data: response.data,
      message: response?.data?.message,
      status: 200,
    };
  } catch (error) {
    console.log("Error fetching billing:", error);
    return {
      data: null,
      message: error.response?.data?.message || error.message || "An error occurred",
      status: error.response?.status || 500,
    };
  }
}

export const createbilling = async (data) => {
  try {
    const response = await axios.post(`${base_url}api/common/create/billing`, data, {
      headers: getHeaders()
    });
    return {
      data: response.data,
      message: response?.data?.message,
      status: 200,
    };
  } catch (error) {
    return {
      data: null,
      message: error.response?.data?.error || error.message || 'An error occurred',
      status: error.response?.status || 500,
    };
  }
};

// General APIS
export const getAllGeneral = async (customer) => {
  try {
    let url = `${base_url}api/common/general/get/all`
    if (customer) {
      url = `${base_url}api/common/general/get/all?customerId=${customer}`
    }
    const response = await axios.get(url, {
      headers: getHeaders()
    });
    return {
      data: response.data,
      message: response?.data?.message,
      status: 200,
    };
  } catch (error) {
    console.log("Error fetching general:", error);
    return {
      data: null,
      message: error.response?.data?.message || error.message || "An error occurred",
      status: error.response?.status || 500,
    };
  }
}

export const getGeneralById = async (id) => {
  try {
    const response = await axios.get(`${base_url}api/common/general/get/${id}`, {
      headers: getHeaders()
    });
    return {
      data: response.data,
      message: response?.data?.message,
      status: 200,
    };
  } catch (error) {
    console.log("Error fetching general:", error);
    return {
      data: null,
      message: error.response?.data?.message || error.message || "An error occurred",
      status: error.response?.status || 500,
    };
  }
}

// EMI APIS
export const getAllEmi = async ({ customerId, paid }) => {
  try {
    let url = `${base_url}api/common/emi/get/all`
    if (customerId) {
      url = `${base_url}api/common/emi/get/all?customerId=${customerId}`
    }
    if (paid) {
      if (url.includes("?")) {
        url = `${url}&paid=${paid}`
      } else {
        url = `${url}?paid=${paid}`
      }
    }
    const response = await axios.get(url, {
      headers: getHeaders()
    });
    return {
      data: response.data,
      message: response?.data?.message,
      status: 200,
    };
  } catch (error) {
    console.log("Error fetching EMI:", error);
    return {
      data: null,
      message: error.response?.data?.message || error.message || "An error occurred",
      status: error.response?.status || 500,
    };
  }
}

// Customer Estimate APIS
export const createCustomerEstimate = async (data) => {
  try {
    const response = await axios.post(`${base_url}api/common/create/all`, data, {
      headers: getHeaders()
    });
    return {
      data: response.data,
      message: response?.data?.message,
      status: 200,
    };
  } catch (error) {
    return {
      data: null,
      message: error.response?.data?.error || error.message || 'An error occurred',
      status: error.response?.status || 500,
    };
  }
};

export const getAllDetailByCustomerOrGeneral = async ({ cusId, genId }) => {
  try {
    let url = `${base_url}api/common/get/all/detail/`
    if (cusId) {
      url = `${base_url}api/common/get/all/detail/?customerId=${cusId}`
    }
    if (genId) {
      if (url.includes("?")) {
        url = `${url}&generalId=${genId}`
      } else {
        url = `${url}?generalId=${genId}`
      }
    }
    const response = await axios.get(url, {
      headers: getHeaders()
    });
    return {
      data: response.data,
      message: response?.data?.message,
      status: 200,
    };
  } catch (error) {
    console.log("Error fetching details:", error);
    return {
      data: null,
      message: error.response?.data?.message || error.message || "An error occurred",
      status: error.response?.status || 500,
    };
  }
}

export const getAllEstimateByCustomerId = async ({ cusId }) => {
  try {
    let url = `${base_url}api/common/get/all/estimate/`
    if (cusId) {
      url = `${base_url}api/common/get/all/estimate/?customerId=${cusId}`
    }
    const response = await axios.get(url, {
      headers: getHeaders()
    });
    return {
      data: response.data,
      message: response?.data?.message,
      status: 200,
    };
  } catch (error) {
    console.log("Error fetching estimates:", error);
    return {
      data: null,
      message: error.response?.data?.message || error.message || "An error occurred",
      status: error.response?.status || 500,
    };
  }
}

export const getOneEstimateByGeneralId = async ({ genId }) => {
  try {
    if (!genId) {
      return;
    }
    let url = `${base_url}api/common/get/all/estimate/${genId}`
    const response = await axios.get(url, {
      headers: getHeaders()
    });
    return {
      data: response.data,
      message: response?.data?.message,
      status: 200,
    };
  } catch (error) {
    console.log("Error fetching estimate:", error);
    return {
      data: null,
      message: error.response?.data?.message || error.message || "An error occurred",
      status: error.response?.status || 500,
    };
  }
}

export const checkEmi = async (data) => {
  try {
    const response = await axios.post(`${base_url}api/common/check/emi`, data, {
      headers: getHeaders()
    });
    return {
      data: response.data,
      message: response?.data?.message,
      status: 200,
    };
  } catch (error) {
    return {
      data: null,
      message: error.response?.data?.error || error.message || 'An error occurred',
      status: error.response?.status || 500,
    };
  }
}
