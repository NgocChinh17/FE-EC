import React, { useEffect, useMemo, useState } from "react";
import { Button, Table, InputNumber, Modal, Form, Input, message, Divider } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { updateProductAmount, removeOrderProduct } from "../../redux/slicers/orderSlides";
import { conVerPrice } from "../../utils";
import { useMutationHooks } from "../../hooks/userMutatitonHook";
import { Loading } from "../../components/LoadingComponent/Loading";
import { updateUser } from "../../redux/slicers/userSlides";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/routes";

import ModalComponent from "../../components/ModalComponent/ModalComponent";
import StepComponent from "../../components/StepComponent/StepComponent";

import * as UserService from "../../services/UserService";

const OrderPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const order = useSelector((state) => state.order);
  const user = useSelector((state) => state.user);

  const [isModalOpenUpdateInfo, setIsModalOpenUpdateInfo] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const orderItems = order?.orderItems || [];

  const dispatch = useDispatch();

  const [stateUserDetails, setStateUserDetails] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
  });

  useEffect(() => {
    if (isModalOpenUpdateInfo) {
      setStateUserDetails({
        city: user?.city,
        name: user?.name,
        address: user?.address,
        phone: user?.phone,
      });
    }
  }, [isModalOpenUpdateInfo, user]);

  useEffect(() => {
    form.setFieldsValue(stateUserDetails);
  }, [form, stateUserDetails]);

  const mutationUpdate = useMutationHooks((data) => {
    const { id, token, ...rests } = data;
    return UserService.updateUser(id, { ...rests }, token);
  });

  const { isLoading } = mutationUpdate;

  const handleOnchangeDetails = (e) => {
    setStateUserDetails({
      ...stateUserDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleAmountChange = (value, record) => {
    dispatch(updateProductAmount({ idProduct: record.Product, newAmount: value }));
  };

  const handleDeleteProduct = (idProduct) => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn xóa sản phẩm này không?",
      okText: "Có",
      cancelText: "Không",
      onOk: () => {
        dispatch(removeOrderProduct({ idProduct }));
      },
    });
  };

  const columns = [
    {
      title: "Ảnh",
      dataIndex: "image",
      render: (image) => (
        <img
          src={image}
          alt="product"
          style={{ width: 50, height: 50, objectFit: "cover" }}
        />
      ),
    },
    {
      title: `Tất Cả (${orderItems.length} Sản Phẩm)`,
      dataIndex: "name",
      // eslint-disable-next-line jsx-a11y/anchor-is-valid
      render: (text, record) => (
        <a style={{ color: "black" }}>{`${text} (${record.type})`}</a>
      ),
    },
    {
      title: "Đơn Giá",
      dataIndex: "price",
      render: (price) => `${conVerPrice(price)} VNĐ`,
    },
    {
      title: "Số Lượng",
      dataIndex: "amount",
      render: (amount, record) => (
        <InputNumber
          min={1}
          max={record.countInStock}
          defaultValue={amount}
          onChange={(value) => handleAmountChange(value, record)}
        />
      ),
    },
    {
      title: "Thành Tiền",
      dataIndex: "total",
      render: (_, record) => `${conVerPrice(record.price * record.amount)} VNĐ`,
    },
    {
      title: "Xóa Sản Phẩm",
      dataIndex: "delete",
      render: (_, record) => (
        <Button type="link" onClick={() => handleDeleteProduct(record.Product)}>
          Xóa
        </Button>
      ),
    },
  ];

  const priceMemo = useMemo(() => {
    return orderItems.reduce((total, cur) => total + cur.price * cur.amount, 0);
  }, [orderItems]);

  const priceDiscountMemo = useMemo(() => {
    return orderItems.reduce((total, cur) => {
      const totalDiscount = cur.discount || 0;
      return total + totalDiscount * cur.amount;
    }, 0);
  }, [orderItems]);

  const priceDeliveryMemo = useMemo(() => {
    if (priceMemo >= 10000000) {
      return 0;
    } else if (priceMemo >= 1000000) {
      return 30000;
    } else if (orderItems.length === 0) {
      return 0;
    } else {
      return 20000;
    }
  }, [orderItems.length, priceMemo]);

  const totalPriceMemo = useMemo(() => {
    const totalBeforeDiscount = priceMemo + priceDeliveryMemo;
    const discountAmount = (totalBeforeDiscount * priceDiscountMemo) / 100;
    const totalAfterDiscount = totalBeforeDiscount - discountAmount;
    return totalAfterDiscount;
  }, [priceMemo, priceDiscountMemo, priceDeliveryMemo]);

  const handlePayProduct = () => {
    if (!user?.id) {
      navigate(ROUTES.SIGN_IN_PAGE);
    } else if (!orderItems.length) {
      message.error("Vui Lòng Chọn Sản Phẩm");
    } else if (!user?.phone || !user?.address || !user?.name || !user?.city) {
      setIsModalOpenUpdateInfo(true);
    } else {
      navigate(ROUTES.PAGES.CHECKOUT_PAGE);
    }
  };

  const handleCancelUpdateInfo = () => {
    setStateUserDetails({
      name: "",
      phone: "",
      address: "",
      city: "",
    });
    form.resetFields();
    setIsModalOpenUpdateInfo(false);
  };

  const handleUpdateInfoUser = () => {
    const { name, phone, address, city } = stateUserDetails;
    if (name && phone && address && city) {
      mutationUpdate.mutate(
        { id: user?.id, ...stateUserDetails, token: user?.access_token },
        {
          onSuccess: () => {
            dispatch(updateUser({ name, phone, address, city }));
            setIsModalOpenUpdateInfo(false);
          },
        }
      );
    }
  };

  const handleChangeAddress = () => {
    setIsModalOpenUpdateInfo(true);
  };

  const itemStep = [
    {
      title: "20.000 VNĐ",
      description: "Dưới 1.000.000 VNĐ",
    },
    {
      title: "30.000 VNĐ",
      description: "Từ 1.000.000 VNĐ",
      subTitle: "Left 00:00:08",
    },
    {
      title: "0 VNĐ",
      description: "Từ 10.000.000 VNĐ",
    },
  ];

  return (
    <Loading isLoading={isLoading}>
      <div style={{ marginLeft: 160, justifyContent: "space-between" }}>
        <h3 style={{ marginBottom: 10 }}>Giỏ Hàng</h3>
        <div style={{ margin: "5px 55px 20px 0" }}>
          <StepComponent
            items={itemStep}
            current={
              orderItems.length === 0
                ? 0
                : priceDeliveryMemo === 20000
                ? 1
                : priceDeliveryMemo === 30000
                ? 2
                : 3
            }
          />
        </div>
        <Table
          columns={columns}
          dataSource={orderItems.map((item, index) => ({ ...item, key: index }))}
          size="small"
          style={{ width: 830, display: "inline-block" }}
          pagination={false}
        />

        <div
          style={{
            float: "right",
            background: "#fafafa",
            padding: "10px 20px 20px 20px",
            marginRight: 54,
            borderRadius: 5,
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
              onClick={handleChangeAddress}
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
            <span>{conVerPrice(priceDiscountMemo)}%</span>
          </div>
          <div
            style={{ paddingBottom: 5, display: "flex", justifyContent: "space-between" }}
          >
            <span>Phí Vận Chuyển</span>
            <span>{conVerPrice(priceDeliveryMemo)} VNĐ</span>
          </div>
          <Divider />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Tổng Cộng</span>
            <span style={{ color: "red" }}>{conVerPrice(totalPriceMemo)} VNĐ</span>
          </div>
          <Button
            style={{ marginTop: 10, width: "100%" }}
            type="primary"
            onClick={handlePayProduct}
            loading={isLoading}
          >
            Thanh Toán
          </Button>
        </div>

        <ModalComponent
          open={isModalOpenUpdateInfo}
          onCancel={handleCancelUpdateInfo}
          onOk={handleUpdateInfoUser}
          title="Cập Nhật Thông Tin"
          width={700}
          form={form}
        >
          <Form.Item label="Họ Tên" name="name" required>
            <Input
              value={stateUserDetails.name}
              name="name"
              onChange={handleOnchangeDetails}
            />
          </Form.Item>
          <Form.Item label="Số Điện Thoại" name="phone" required>
            <Input
              value={stateUserDetails.phone}
              name="phone"
              onChange={handleOnchangeDetails}
            />
          </Form.Item>
          <Form.Item label="Địa Chỉ" name="address" required>
            <Input
              value={stateUserDetails.address}
              name="address"
              onChange={handleOnchangeDetails}
            />
          </Form.Item>
          <Form.Item label="Thành Phố" name="city" required>
            <Input
              value={stateUserDetails.city}
              name="city"
              onChange={handleOnchangeDetails}
            />
          </Form.Item>
        </ModalComponent>
      </div>
    </Loading>
  );
};

export default OrderPage;
