import React from "react";
import { useQuery } from "react-query";
import { useLocation, useParams } from "react-router-dom";
import { Button, Table, Typography } from "antd";
import * as OrderService from "../../services/OrderService";
import { conVerPrice } from "../../utils";
import { Loading } from "../../components/LoadingComponent/Loading";

const { Title, Text } = Typography;

const DetailsOrderPage = () => {
	const { id: orderId } = useParams();
	const { state } = useLocation();

	const fetchHistoryOrder = async () => {
		const res = await OrderService.getDetailsOrder(orderId, state.token);
		return res.data;
	};

	const { isLoading, data: orderDetails } = useQuery({
		queryKey: ["order-details"],
		queryFn: fetchHistoryOrder,
		enabled: !!orderId,
	});

	const { shippingAddress, orderItems, paymentMethod, itemsPrice, shippingPrice, totalPrice } =
		orderDetails || {};

	const columns = [
		{
			title: "Ảnh",
			dataIndex: "image",
			// eslint-disable-next-line jsx-a11y/alt-text
			render: (image) => <img src={image} style={{ width: 50, height: 50, objectFit: "cover" }} />,
		},
		{
			title: "Tên Sản Phẩm",
			dataIndex: "name",
			render: (name, record) => (
				<div>
					<div style={{ color: "black" }}>{name}</div>
					<div style={{ color: "gray" }}>{record.type}</div>
				</div>
			),
		},
		{
			title: "Giá",
			dataIndex: "price",
			render: (price) => `${conVerPrice(price)} VNĐ`,
		},
		{
			title: "Giảm Giá",
			dataIndex: "discount",
			render: (discount) => `${conVerPrice(discount)}%`,
		},
		{
			title: "Số Lượng",
			dataIndex: "amount",
			key: "amount",
		},
		{
			title: "Tạm Tính",
			key: "totalPrice",
			render: () => `${conVerPrice(orderDetails?.totalPrice)} VNĐ`,
		},
	];

	return (
		<Loading isLoading={isLoading}>
			<div
				style={{
					marginLeft: "156px",
					width: "85%",
					border: "1px solid #333",
					padding: "24px",
					borderRadius: "12px",
					background: "#f0f8ff",
					boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
					fontFamily: "Arial, sans-serif",
				}}
			>
				<Table
					style={{ margin: "10px 50px 0 0", width: "100%" }}
					columns={columns}
					dataSource={orderItems}
					rowKey="_id"
					pagination={false}
				/>

				<div
					style={{
						margin: "20px 0 10px 0",
						display: "flex",
						justifyContent: "space-between",
						width: "100%",
					}}
				>
					<Button>
						<Text style={{ color: "red" }} strong>
							Tổng Tiền Hàng:
						</Text>
						{conVerPrice(itemsPrice)} VNĐ
					</Button>
					<Button>
						<Text style={{ color: "red" }} strong>
							Phí Vận Chuyển:
						</Text>
						{conVerPrice(shippingPrice)} VNĐ
					</Button>
					<Button>
						<Text style={{ color: "red" }} strong>
							Tổng Thanh Toán:
						</Text>
						{conVerPrice(totalPrice)} VNĐ
					</Button>
				</div>

				<Title level={3} style={{ marginBottom: "16px", color: "#333" }}>
					Chi tiết Đơn Hàng
				</Title>

				<div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
					<span style={{ fontWeight: "bold" }}>Người nhận:</span>
					<div>{shippingAddress?.fullName}</div>
				</div>

				<div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
					<span style={{ fontWeight: "bold" }}>Địa Chỉ:</span>
					<div>
						{shippingAddress?.address}, {shippingAddress?.city}
					</div>
				</div>

				<div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
					<span style={{ fontWeight: "bold" }}>Số Điện Thoại:</span>
					<div>{shippingAddress?.phone}</div>
				</div>

				<div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
					<span style={{ fontWeight: "bold" }}>Phương Thức Thanh Toán:</span>
					<div>
						{paymentMethod === "later_money" ? "Thanh Toán Khi Nhận Hàng" : "Thanh Toán Online"}
					</div>
					<div>{paymentMethod === "paypal" ? "Đã Thanh Toán" : "Chưa Thanh Toán"}</div>
				</div>
			</div>
		</Loading>
	);
};

export default DetailsOrderPage;
