import axios from "axios";

import { axiosJWT } from "./UserService";

export const getAllProduct = async (search, limit) => {
  let res;
  try {
    if (search?.length > 0) {
      res = await axios.get(`${process.env.REACT_APP_API_URL}/product/get-all`, {
        params: { filter: "name", search, limit },
      });
    } else {
      res = await axios.get(`${process.env.REACT_APP_API_URL}/product/get-all`, {
        params: { limit },
      });
    }
    return res.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const getAllTypeListProduct = async (typeList, page, limit) => {
  if (typeList) {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/product/get-all?filter=typeList&filter=${typeList}&limit=${limit}&page=${page}`
    );
    return res.data;
  }
};

export const createProduct = async (data) => {
  const res = await axios.post(`${process.env.REACT_APP_API_URL}/product/create`, data);
  return res.data;
};

export const getDetailsProduct = async (id) => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}/product/get-details/${id}`
  );
  return res.data;
};

export const updateProduct = async (id, access_token, data) => {
  const res = await axiosJWT.put(
    `${process.env.REACT_APP_API_URL}/product/update/${id}`,
    data,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const deleteProduct = async (id, access_token) => {
  const res = await axiosJWT.delete(
    `${process.env.REACT_APP_API_URL}/product/delete/${id}`,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const deleteManyProduct = async (data, access_token) => {
  const res = await axiosJWT.post(
    `${process.env.REACT_APP_API_URL}/product/delete-many`,
    data,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const getAllTypeProduct = async () => {
  const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/product/get-all-type`);
  return res.data;
};
