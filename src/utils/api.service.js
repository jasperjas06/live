import axios from "axios"

const base_url = "https://customer-form-8auo.onrender.com/"

// Customer APIS
export const createCustomer = async (data) => {
  try {
    const response = await axios.post(`${base_url}api/customer/create`, data);
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

export const getAllCustomer = async () =>{
    try {
    const response = await axios.get(`${base_url}api/customer/get/all`);
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

export const getACustomer = async (id) =>{
    try {
    const response = await axios.get(`${base_url}api/customer/get/${id}`);
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

export const updateCustomer = async(data)=>{
  try {
    const response = await axios.put(`${base_url}api/customer/update`,data);
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

export const deleteCustomer = async(id)=>{
  try {
    const data = {_id:id}
    const response = await axios.delete(`${base_url}api/customer/delete`,{data:data});
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



// projects APIS

export const createProjects = async (data) => {
  try {
    const response = await axios.post(`${base_url}api/project/create`, data);
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

export const updateProject = async(data)=>{
  try {
    const response = await axios.put(`${base_url}api/project/update`,data);
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

export const getAProject = async (id) =>{
    try {
    const response = await axios.get(`${base_url}api/project/get/${id}`);
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

export const getAllProjects = async () =>{
    try {
    const response = await axios.get(`${base_url}api/project/get/all`);
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

export const deleteProject = async(id)=>{
  try {
    const data = {_id:id}
    const response = await axios.delete(`${base_url}api/project/delete`,{data:data});
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

export const getAllMarkingHead = async () =>{
    try {
    const response = await axios.get(`${base_url}api/market/head/get/all`);
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

export const getAMarketingHead = async (id) =>{
    try {
    const response = await axios.get(`${base_url}api/market/head/get/${id}`);
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

export const updateMarketingHead = async(data)=>{
  try {
    const response = await axios.put(`${base_url}api/market/head/update`,data);
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

export const deleteMarketingHead = async(id)=>{
  try {
    const data = {_id:id}
    const response = await axios.delete(`${base_url}api/market/head/delete`,{data:data});
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
    const response = await axios.post(`${base_url}api/market/head/create`, data);
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
    const response = await axios.post(`${base_url}api/market/detail/create`, data);
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

export const updateMarketer = async(data)=>{
  try {
    const response = await axios.put(`${base_url}api/market/detail/update`,data);
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

export const getAllMarketer = async () =>{
    try {
    const response = await axios.get(`${base_url}api/market/detail/get/all`);
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

export const getAMarketer = async (id) =>{
    try {
    const response = await axios.get(`${base_url}api/market/detail/get/${id}`);
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
    const response = await axios.post(`${base_url}api/percentage/create`, data);
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

export const getAllPercentage = async () =>{
    try {
    const response = await axios.get(`${base_url}api/percentage/get/all`);
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

export const getAPercentage = async (id) =>{
    try {
    const response = await axios.get(`${base_url}api/percentage/get/${id}`);
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

export const deletePercentage = async(id)=>{
  try {
    const data = {_id:id}
    const response = await axios.delete(`${base_url}api/percentage/delete`,{data:data});
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

export const updatePercentage = async(data)=>{
  try {
    const response = await axios.put(`${base_url}api/percentage/update`,data);
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
    const response = await axios.post(`${base_url}api/mod/create`, data);
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

export const getAllMOD = async () =>{
    try {
    const response = await axios.get(`${base_url}api/mod/get/all`);
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

export const getAMOD = async (id) =>{
    try {
    const response = await axios.get(`${base_url}api/mod/get/${id}`);
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

export const deleteMOD = async(id)=>{
  try {
    const data = {_id:id}
    const response = await axios.delete(`${base_url}api/mod/delete`,{data:data});
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

export const updateMOD = async(data)=>{
  try {
    const response = await axios.put(`${base_url}api/mod/update`,data);
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
    const response = await axios.post(`${base_url}api/nvt/create`, data);
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

export const updateNVT = async(data)=>{
  try {
    const response = await axios.put(`${base_url}api/nvt/update`,data);
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

export const getAllNVT = async () =>{
    try {
    const response = await axios.get(`${base_url}api/nvt/get/all`);
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

export const getANVT = async (id) =>{
    try {
    const response = await axios.get(`${base_url}api/nvt/get/${id}`);
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

export const deleteNVT = async(id)=>{
  try {
    const data = {_id:id}
    const response = await axios.delete(`${base_url}api/nvt/delete`,{data:data});
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
    const response = await axios.post(`${base_url}api/lfc/create`, data);
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

export const updateLFC = async(data)=>{
  try {
    const response = await axios.put(`${base_url}api/lfc/update`,data);
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

export const getAllLFC = async () =>{
    try {
    const response = await axios.get(`${base_url}api/lfc/get/all`);
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

export const getALFC = async (id) =>{
    try {
    const response = await axios.get(`${base_url}api/lfc/get/${id}`);
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

export const deleteLFC = async(id)=>{
  try {
    const data = {_id:id}
    const response = await axios.delete(`${base_url}api/lfc/delete`,{data:data});
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

export const getANVTbyCus = async (id) =>{
    try {
    const response = await axios.get(`${base_url}api/nvt/get/all/customer/${id}`);
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


export const CreateRole = async (data) => {
  try {
    const response = await axios.post(
      `${base_url}api/role/create`,
      data,
      {
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OGFiMThjYzNlMmFmN2QwZWY5YTkwZGMiLCJpYXQiOjE3NTYxMzIxNDJ9.CUXaE15h7AZqh_nBo76wKmYC5STcSLtdkXdcBLj6J7E`, // ✅ Correct placement
        },
      }
    );

    return {
      data: response.data,
      message: response?.data?.message,
      status: 200,
    };
  } catch (error) {
    return {
      data: null,
      message:
        error.response?.data?.message ||
        error.message ||
        "An error occurred",
      status: error.response?.status || 500,
    };
  }
};

export const getAllRoles = async () => {
  try {
    const response = await axios.get(`${base_url}api/role/get/all`, {
      headers: {
        Authorization:""
    }})
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

export const getRoleById = async (id) =>{
  try {
    const response = await axios.get(`${base_url}api/role/get/${id}`, {
      headers: {
        Authorization:""
    }})
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

export const updateRole = async(data)=>{
  try {
    const response = await axios.put(`${base_url}api/role/update`,data);
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

export const deleteRole = async(id)=>{
  try {
    const data = {_id:id}
    const response = await axios.delete(`${base_url}api/role/delete`,{data:data});
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
    const response = await axios.post(
      `${base_url}api/user/create`,
      data,
      {
        headers: {
          Authorization: `Bearer <your_token_here>`, // 🔑 add token if required
        },
      }
    );

    return {
      data: response.data,
      message: response?.data?.message,
      status: 200,
    };
  } catch (error) {
    return {
      data: null,
      message:
        error.response?.data?.message ||
        error.message ||
        "An error occurred",
      status: error.response?.status || 500,
    };
  }
};

// ✅ Get All Employees
export const getAllEmployees = async () => {
  try {
    const response = await axios.get(`${base_url}api/user/get/all?role`, {
      headers: {
        Authorization: `Bearer <your_token_here>`,
      },
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

// ✅ Get Employee By ID
export const getEmployeeById = async (id) => {
  try {
    const response = await axios.get(`${base_url}api/user/get/${id}`, {
      headers: {
        Authorization: `Bearer <your_token_here>`,
      },
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

// ✅ Update Employee
export const updateEmployee = async (data) => {
  try {
    const response = await axios.put(`${base_url}api/user/update`, data, {
      headers: {
        Authorization: `Bearer <your_token_here>`,
      },
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

// ✅ Delete Employee
export const deleteEmployee = async (id) => {
  try {
    const data = { _id: id };
    const response = await axios.delete(`${base_url}api/user/delete`, {
      data,
      headers: {
        Authorization: `Bearer <your_token_here>`,
      },
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

export const getAllMenu = async () => {
  try {
    const response = await axios.get(`${base_url}api/menu/get/all`, {
      headers: {
        Authorization: `Bearer <your_token_here>`,
      },
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

export const createMenuMapping = async (data) => {
  try {
    const response = await axios.post(
      `${base_url}api/role/menu/multi/create`,
      data,
      {
        headers: {
          Authorization: `Bearer <your_token_here>`, // 🔑 add token if required
        },
      }
    );

    return {
      data: response.data,
      message: response?.data?.message,
      status: 200,
    };
  } catch (error) {
    return {
      data: null,
      message:
        error.response?.data?.message ||
        error.message ||
        "An error occurred",
      status: error.response?.status || 500,
    };
  }
};

export const getAllRoleMenu = async () => {
  try {
    const response = await axios.get(`${base_url}api/role/menu/get/all`, {
      headers: {
        Authorization: `Bearer <your_token_here>`,
      },
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

export const getRoleMenuById = async (id) => {
  try {
    const response = await axios.get(`${base_url}api/role/menu/get/role/${id}`, {
      headers: {
        Authorization: `Bearer <your_token_here>`,
      },
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

export const updateMenuMapping = async (data) => {
  try {
    const response = await axios.put(
      `${base_url}api/role/menu/multi/update`,
      data,
      {
        headers: {
          Authorization: `Bearer <your_token_here>`, // 🔑 add token if required
        },
      }
    );

    return {
      data: response.data,
      message: response?.data?.message,
      status: 200,
    };
  } catch (error) {
    return {
      data: null,
      message:
        error.response?.data?.message ||
        error.message ||
        "An error occurred",
      status: error.response?.status || 500,
    };
  }
};

export const deleteMenuMapping = async (id) => {
  try {
    const data = { _id: id };
    const response = await axios.delete(`${base_url}api/role/menu/delete`, {
      data,
      headers: {
        Authorization: `Bearer <your_token_here>`,
      },
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