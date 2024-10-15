import React, { useEffect, useMemo, useState } from "react"
import { Button, Form, Input, message, Divider, Radio, Image } from "antd"
import { useSelector, useDispatch } from "react-redux"
import { conVerPrice } from "../../utils"
import ModalComponent from "../../components/ModalComponent/ModalComponent"
import { useMutationHooks } from "../../hooks/userMutatitonHook"
import { Loading } from "../../components/LoadingComponent/Loading"
import { updateUser } from "../../redux/slicers/userSlides"
import { useNavigate } from "react-router-dom"
import { ROUTES } from "../../constants/routes"
import { clearOrder } from "../../redux/slicers/orderSlides"
import { PayPalButton } from "react-paypal-button-v2"

import FAST from "../../assets/image/FAST.png"
import Gojek from "../../assets/image/gojek.png"

import * as UserService from "../../services/UserService"
import * as OrderService from "../../services/OrderService"
import * as PaymentService from "../../services/PaymentService"

const CheckoutPage = () => {
  const [form] = Form.useForm()
  const navigate = useNavigate()

  const order = useSelector((state) => state.order)
  const user = useSelector((state) => state.user)

  const [value, setValue] = useState(1)
  const [payment, setPayment] = useState("later_money")
  const [sdkReady, setSdkReady] = useState(false)

  const handlePaymentChange = (e) => setPayment(e.target.value)
  const handleDeliveryChange = (e) => setValue(e.target.value)

  const [isModalOpenUpdateInfo, setIsModalOpenUpdateInfo] = useState(false)

  const dispatch = useDispatch()

  const [stateUserDetails, setStateUserDetails] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
  })

  useEffect(() => {
    if (isModalOpenUpdateInfo) {
      if (
        stateUserDetails.city !== user?.city ||
        stateUserDetails.name !== user?.name ||
        stateUserDetails.address !== user?.address ||
        stateUserDetails.phone !== user?.phone
      ) {
        setStateUserDetails({
          city: user?.city,
          name: user?.name,
          address: user?.address,
          phone: user?.phone,
        })
      }
    }
  }, [
    isModalOpenUpdateInfo,
    stateUserDetails.address,
    stateUserDetails.city,
    stateUserDetails.name,
    stateUserDetails.phone,
    user,
  ])

  useEffect(() => {
    if (user) {
      setStateUserDetails({
        city: user?.city,
        name: user?.name,
        address: user?.address,
        phone: user?.phone,
      })
      form.setFieldsValue({
        city: user?.city,
        name: user?.name,
        address: user?.address,
        phone: user?.phone,
      })
    }
  }, [user, form])

  const mutationUpdate = useMutationHooks((data) => {
    const { id, token, ...rests } = data
    const res = UserService.updateUser(id, { ...rests }, token)
    return res
  })

  const { isLoading } = mutationUpdate

  const mutationAddOrder = useMutationHooks((data) => {
    const { token, ...rests } = data
    const res = OrderService.createOrderProduct({ ...rests }, token)
    return res
  })

  const { isLoading: isLoadingAddOrder } = mutationAddOrder

  const handleOnchangeDetails = (e) => {
    const { name, value } = e.target
    setStateUserDetails({
      ...stateUserDetails,
      [name]: value,
    })
  }

  const priceMemo = useMemo(() => {
    return order?.orderItems.reduce((total, cur) => total + cur.price * cur.amount, 0)
  }, [order?.orderItems])

  const priceDiscountMemo = useMemo(() => {
    return order?.orderItems.reduce((total, cur) => {
      const totalDiscount = cur.discount || 0
      return total + totalDiscount * cur.amount
    }, 0)
  }, [order?.orderItems])

  const priceDeliveryMemo = useMemo(() => {
    if (priceMemo >= 10000000) {
      return 0
    } else if (priceMemo >= 1000000) {
      return 30000
    } else {
      return 20000
    }
  }, [priceMemo])

  const totalPriceMemo = useMemo(() => {
    const totalBeforeDiscount = priceMemo + priceDeliveryMemo
    const discountAmount = (totalBeforeDiscount * priceDiscountMemo) / 100
    const totalAfterDiscount = totalBeforeDiscount - discountAmount
    return totalAfterDiscount
  }, [priceMemo, priceDiscountMemo, priceDeliveryMemo])

  const handleAddOrder = () => {
    if (
      user?.access_token &&
      order?.orderItems &&
      user?.name &&
      user?.address &&
      user?.phone &&
      user?.city &&
      priceMemo &&
      user?.id
    ) {
      mutationAddOrder.mutate(
        {
          orderItems: order?.orderItems,
          token: user?.access_token,
          fullName: user?.name,
          address: user?.address,
          city: user?.city,
          phone: user?.phone,
          paymentMethod: payment,
          itemsPrice: priceMemo,
          shippingPrice: priceDeliveryMemo,
          totalPrice: totalPriceMemo,
          user: user?.id,
        },
        {
          onSuccess: (res) => {
            const arrayOrdered = order?.orderItems.map((item) => item.Product)
            dispatch(clearOrder({ listChecked: arrayOrdered }))
            message.success("Đặt Hàng Thành Công")
            navigate(ROUTES.PAGES.ORDER_SUCCESS, {
              state: {
                orders: order?.orderItems,
                value,
                payment,
                totalPriceMemo,
              },
            })
          },
          onError: (err) => {
            console.error(err)
            message.error("Đặt Hàng Thất Bại")
          },
        }
      )
    }
  }

  const handleCancelUpdateInfo = () => {
    setStateUserDetails({
      name: "",
      phone: "",
      address: "",
      city: "",
    })
    form.resetFields()
    setIsModalOpenUpdateInfo(false)
  }

  const handleUpdateInfoUser = () => {
    const { name, phone, address, city } = stateUserDetails
    if (name && phone && address && city) {
      mutationUpdate.mutate(
        { id: user?.id, ...stateUserDetails, token: user?.access_token },
        {
          onSuccess: () => {
            dispatch(updateUser({ name, phone, address, city }))
            setIsModalOpenUpdateInfo(false)
          },
        }
      )
    }
  }

  const handleChangeAddress = () => {
    setIsModalOpenUpdateInfo(true)
  }

  const addPaypalScript = async () => {
    try {
      const { data } = await PaymentService.getConfig()
      const script = document.createElement("script")
      script.type = "text/javascript"
      script.src = `https://www.paypal.com/sdk/js?client-id=${data}`
      script.async = true
      script.onload = () => setSdkReady(true)
      document.body.appendChild(script)
    } catch (error) {
      console.error("Failed to load PayPal SDK script", error)
    }
  }

  useEffect(() => {
    if (!window.paypal) {
      addPaypalScript()
    } else {
      setSdkReady(true)
    }
  }, [])

  const onsuccessPaypal = async (details, data) => {
    mutationAddOrder.mutate(
      {
        orderItems: order?.orderItems,
        token: user?.access_token,
        fullName: user?.name,
        address: user?.address,
        city: user?.city,
        phone: user?.phone,
        paymentMethod: payment,
        itemsPrice: priceMemo,
        shippingPrice: priceDeliveryMemo,
        totalPrice: totalPriceMemo,
        user: user?.id,
        isPaid: true,
      },
      {
        onSuccess: (res) => {
          const arrayOrdered = order?.orderItems.map((item) => item.Product)
          dispatch(clearOrder({ listChecked: arrayOrdered }))
          message.success("Đặt Hàng Thành Công")
          navigate(ROUTES.PAGES.ORDER_SUCCESS, {
            state: {
              orders: order?.orderItems,
              value,
              payment,
              totalPriceMemo,
            },
          })
        },
        onError: (err) => {
          console.error(err)
          message.error("Đặt Hàng Thất Bại")
        },
      }
    )
  }

  return (
    <Loading isLoading={isLoadingAddOrder}>
      <div style={{ marginLeft: 160, justifyContent: "space-between" }}>
        <h3 style={{ marginBottom: 10 }}> Thanh Toán</h3>
        <div
          style={{
            display: "inline-block",
            background: "#fafafa",
            width: 800,
            padding: "5px 0 5px 20px",
            borderRadius: 10,
          }}
        >
          <div style={{ marginBottom: 10 }}>Chọn Phương Thức Thanh Toán</div>
          <div
            style={{
              border: "1px solid #1E90FF",
              borderRadius: 10,
              background: "#b7e6f6",
              width: 500,
              padding: 15,
              marginBottom: 20,
            }}
          >
            <Radio.Group onChange={handleDeliveryChange} value={value}>
              <div style={{ marginBottom: 10 }}>
                <Radio value={1}>
                  <span>
                    <Image
                      style={{
                        width: 30,
                        height: 30,
                        marginRight: 10,
                        display: "inline-block",
                      }}
                      src={FAST}
                      alt="FAST"
                      preview={false}
                    />
                  </span>
                  Giao Hàng Tiết Kiệm
                </Radio>
              </div>
              <div>
                <Radio value={2}>
                  <span>
                    <Image
                      style={{
                        width: 30,
                        height: 40,
                        marginRight: 10,
                        display: "inline-block",
                      }}
                      src={Gojek}
                      alt="Gojek"
                      preview={false}
                    />
                  </span>
                  Giao Hàng Tiết Kiệm
                </Radio>
              </div>
            </Radio.Group>
          </div>

          <div style={{ marginBottom: 10 }}>Chọn Phương Thức Thanh Toán</div>
          <div
            style={{
              border: "1px solid #1E90FF",
              borderRadius: 10,
              background: "#b7e6f6",
              width: 500,
              padding: 15,
            }}
          >
            <Radio.Group onChange={handlePaymentChange} value={payment}>
              <div style={{ marginBottom: 10 }}>
                <Radio value="later_money">Thanh Toán khi nhận tiền mặt</Radio>
              </div>
              <div>
                <Radio value="paypal">Thanh Toán Bằng PayPal</Radio>
              </div>
            </Radio.Group>
          </div>
        </div>

        <div
          style={{
            float: "right",
            background: "#fafafa",
            padding: "10px 20px 20px 20px",
            marginRight: 54,
            borderRadius: 10,
            width: 350,
          }}
        >
          <div>
            <div
              style={{
                paddingBottom: 5,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span>Địa Chỉ: </span>
              <span style={{ color: "blue" }}>{user?.address}</span>
            </div>
            <div
              style={{
                paddingBottom: 5,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span>Thành Phố: </span>
              <span style={{ color: "blue" }}>{user?.city}</span>
            </div>
            <span
              style={{
                color: "blue",
                cursor: "pointer",
                marginLeft: 247,
              }}
              onClick={() => handleChangeAddress()}
            >
              Thay Đổi
            </span>
          </div>
          <Divider />
          <div
            style={{ paddingBottom: 5, display: "flex", justifyContent: "space-between" }}
          >
            <span>Tạm Tính</span>
            <span>{conVerPrice(priceMemo)} VNĐ</span>
          </div>
          <div
            style={{ paddingBottom: 5, display: "flex", justifyContent: "space-between" }}
          >
            <span>Giảm Giá</span>
            <span>{priceDiscountMemo}%</span>
          </div>
          <div
            style={{ paddingBottom: 5, display: "flex", justifyContent: "space-between" }}
          >
            <span>Phí Vận Chuyển</span>
            <span>{conVerPrice(priceDeliveryMemo)} VNĐ</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Tổng Cộng</span>
            <span>{conVerPrice(totalPriceMemo)}VNĐ</span>
          </div>
          <div style={{ color: "gray", fontSize: 10, marginLeft: 109, marginTop: 6 }}>
            Đã Bao Gồm Phí VTA (nếu có)
          </div>

          {payment !== "paypal" && (
            <Button
              type="primary"
              style={{ width: "100%", marginBottom: 10 }}
              onClick={handleAddOrder}
            >
              Đặt Hàng
            </Button>
          )}

          {payment === "paypal" && (
            <div>
              {!sdkReady ? (
                <Loading isLoading={isLoading} />
              ) : (
                <PayPalButton
                  amount={Math.round(totalPriceMemo / 23000)}
                  onSuccess={onsuccessPaypal}
                  options={{
                    clientId: process.env.REACT_APP_CLIENT_ID,
                  }}
                />
              )}
            </div>
          )}
        </div>
        <ModalComponent
          title="Xóa Sản Phẩm"
          open={isModalOpenUpdateInfo}
          onCancel={handleCancelUpdateInfo}
          onOk={handleUpdateInfoUser}
          forceRender
        >
          <Loading isLoading={isLoading}>
            <Form
              name="basic"
              labelCol={{
                span: 8,
              }}
              wrapperCol={{
                span: 16,
              }}
              style={{
                maxWidth: 600,
              }}
              labelAlign="left"
              autoComplete="off"
              form={form}
            >
              <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: "Please input your name" }]}
              >
                <Input
                  value={stateUserDetails.name}
                  onChange={handleOnchangeDetails}
                  name="name"
                />
              </Form.Item>

              <Form.Item
                label="Phone"
                name="phone"
                rules={[{ required: true, message: "Please input your phone" }]}
              >
                <Input
                  value={stateUserDetails.phone}
                  onChange={handleOnchangeDetails}
                  name="phone"
                />
              </Form.Item>

              <Form.Item
                label="Address"
                name="address"
                rules={[{ required: true, message: "Please input your address" }]}
              >
                <Input
                  value={stateUserDetails.address}
                  onChange={handleOnchangeDetails}
                  name="address"
                />
              </Form.Item>

              <Form.Item
                label="City"
                name="city"
                rules={[{ required: true, message: "Please input your city" }]}
              >
                <Input
                  value={stateUserDetails.city}
                  onChange={handleOnchangeDetails}
                  name="city"
                />
              </Form.Item>
            </Form>
          </Loading>
        </ModalComponent>
      </div>
    </Loading>
  )
}

export default CheckoutPage
