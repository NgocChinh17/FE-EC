import React from "react";
import { Button, message, Table } from "antd";
import { conVerPrice } from "../../utils";
import { useQuery, useMutation } from "react-query";
import { useSelector } from "react-redux";
import { Loading } from "../../components/LoadingComponent/Loading";
import { useNavigate } from "react-router-dom";

import * as OrderService from "../../services/OrderService";

const HistoryOrder = () => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  const fetchHistoryOrder = async () => {
    const res = await OrderService.getHistoryOrderProduct(user.id, user.access_token);
    return res.data;
  };

  const {
    isLoading,
    data: orders,
    refetch,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchHistoryOrder,
    enabled: !!(user?.id && user?.access_token),
  });

  const flattenedOrderItems = Array.isArray(orders)
    ? orders.reduce((acc, order) => {
        const items = order.orderItems || [];
        return acc.concat(
          items.map((item) => ({
            ...item,
            orderId: order._id,
            shippingAddress: order.shippingAddress,
            shippingPrice: order.shippingPrice,
            totalPrice: order.totalPrice,
            order: order,
          }))
        );
      }, [])
    : [];

  const mutationCancel = useMutation({
    mutationFn: async ({ id, token, orderItems }) => {
      const res = await OrderService.cancelOrder(id, token, orderItems);
      return res.data;
    },
    onSuccess: () => {
      message.success("Hủy Đơn Hàng Thành Công");
      refetch(); // Refetch the orders list to update the UI
    },
    onError: () => {
      message.error("Hủy Đơn Hàng Thất Bại");
    },
  });

  const handleCancelOrder = (order) => {
    mutationCancel.mutate(
      { id: order._id, token: user.access_token, orderItems: order?.orderItems },
      {
        onSuccess: () => {
          refetch();
        },
        onError: (error) => {
          message.error(
            "Hủy Đơn Hàng Thất Bại: " + (error.response?.data?.message || "Có lỗi xảy ra")
          );
        },
      }
    );
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
      title: "Tên Sản Phẩm",
      dataIndex: "name",
      render: (text, record) => (
        <div>
          <div style={{ color: "black" }}>{text}</div>
          <div style={{ color: "gray" }}>{record.type}</div>
        </div>
      ),
    },
    {
      title: "Số Lượng",
      dataIndex: "amount",
    },
    {
      title: "Giá ",
      dataIndex: "price",
      render: (price) => `${conVerPrice(price)} VNĐ`,
    },
    {
      title: "Phí Ship",
      dataIndex: "shippingPrice",
      render: (_, { shippingPrice }) => `${conVerPrice(shippingPrice)} VNĐ`,
    },
    {
      title: "Giảm Giá",
      dataIndex: "discount",
      render: (discount) => `${conVerPrice(discount)}%`,
    },
    {
      title: "Cần Thanh Toán",
      dataIndex: "totalPrice",
      render: (_, record) => {
        const { price, shippingPrice, discount } = record;
        const totalBeforeDiscount = price + shippingPrice;
        const discountAmount = (totalBeforeDiscount * discount) / 100;
        const totalAfterDiscount = totalBeforeDiscount - discountAmount;
        return `${conVerPrice(totalAfterDiscount)} VNĐ`;
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_, record) => (
        <div style={{ alignContent: "center" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button onClick={() => handleDetailsOrder(record.orderId)}>Chi tiết</Button>
            <Button
              style={{ marginLeft: -40, color: "red" }}
              onClick={() => handleCancelOrder(record.order)}
            >
              Hủy
            </Button>
          </div>
        </div>
      ),
    },
  ];

  const handleDetailsOrder = (orderId) => {
    navigate(`/detailsOrderPage/${orderId}`, {
      state: {
        orderId,
        token: user.access_token,
      },
    });
  };

  const dataSource = flattenedOrderItems.map((item) => ({
    key: item._id,
    orderId: item.orderId,
    order: item.order,
    image: item.image,
    name: item.name,
    type: item.type,
    totalOne: item.price,
    price: item.price * item.amount,
    amount: item.amount,
    shippingAddress: item.shippingAddress,
    shippingPrice: item.shippingPrice,
    phone: item.shippingAddress.phone,
    totalPrice: item.totalPrice,
    discount: item.discount,
  }));

  const totalItemsPrices = flattenedOrderItems.reduce((acc, item) => {
    const totalPriceShip = item.price * item.amount + item.shippingPrice;
    const discountPrice = (totalPriceShip * item.discount) / 100;
    const totalPriceHistory = totalPriceShip - discountPrice;
    return acc + totalPriceHistory;
  }, 0);

  return (
    <Loading isLoading={isLoading || mutationCancel.isLoading}>
      <div style={{ marginLeft: 160 }}>
        <h3 style={{ marginBottom: 10 }}>Lịch Sử Mua Hàng</h3>
        <Table
          columns={columns}
          dataSource={dataSource}
          size="small"
          style={{ width: "96%" }}
          pagination={false}
        />
        <Button
          style={{
            height: 50,
            width: 250,
            display: "inline",
            float: "right",
            marginRight: 46,
            marginTop: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              color: "red",
            }}
          >
            <div>Tổng Sản Phẩm {orders?.length} :</div>
            <div style={{ float: "right", color: "black" }}>
              {conVerPrice(totalItemsPrices)} VNĐ
            </div>
          </div>
        </Button>
      </div>
    </Loading>
  );
};

export default HistoryOrder;
