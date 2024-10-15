import { axiosJWT } from "./UserService"

export const createOrderProduct = async (data, access_token) => {
  const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/order/create`, data, {
    headers: {
      token: `Bearer ${access_token}`,
    },
  })
  return res.data
}

export const getHistoryOrderProduct = async (id, access_token) => {
  const res = await axiosJWT.get(
    `${process.env.REACT_APP_API_URL}/order/get-all-order/${id}`,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  )
  return res.data
}

export const getDetailsOrder = async (id, access_token) => {
  const res = await axiosJWT.get(
    `${process.env.REACT_APP_API_URL}/order/get-details-order/${id}`,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  )
  return res.data
}

export const cancelOrder = async (id, access_token, orderItems) => {
  try {
    const res = await axiosJWT.delete(
      `${process.env.REACT_APP_API_URL}/order/cancel-order/${id}`,
      { data: orderItems },
      {
        headers: {
          token: `Bearer ${access_token}`,
        },
      }
    )
    return res.data
  } catch (error) {
    console.error("Error cancelling order:", error.response || error)
    throw error
  }
}

export const getAllOrder = async (access_token) => {
  try {
    const res = await axiosJWT.get(
      `${process.env.REACT_APP_API_URL}/order/get-all-order`,
      {
        headers: {
          token: `Bearer ${access_token}`,
        },
      }
    )
    return res.data
  } catch (error) {
    console.error(
      "Error in getAllOrder function:",
      error.response ? error.response.data : error.message
    )
    throw error
  }
}
