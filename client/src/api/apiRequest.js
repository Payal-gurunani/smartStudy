import axiosInstance from "./axiosInstance";

export const apiRequest = async ({ method, url, data, params,headers }) => {
  try {
    const config = {
      method,
      url,
      params,
      headers,
    };

    if (data !== undefined) {
      config.data = data;
    }

    const response = await axiosInstance(config);

    return response.data?.data || response.data; 
  } catch (error) {
    throw error.response?.data || error;
  }
};
