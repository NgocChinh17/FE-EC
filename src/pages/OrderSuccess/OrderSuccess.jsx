import React from "react";
import { Button, Divider, Table } from "antd";
import { Loading } from "../../components/LoadingComponent/Loading";
import { conVerPrice } from "../../utils";
import { useLocation } from "react-router-dom";
import { orderConstant } from "../../constants/orderContant";

const OrderSuccess = () => {
	const location = useLocation();
	const { state } = location || {};

	const orderItems = state?.orders || [];

	const paymentMethod = orderConstant.payment[state?.payment];
	const deliveryMethod = orderConstant.value[state?.value];

	const columns = [
		{
			dataIndex: "image",
			render: (image) => (
				<img src={image} alt="product" style={{ width: 50, height: 50, objectFit: "cover" }} />
			),
		},
		{
			dataIndex: "name",
			// eslint-disable-next-line jsx-a11y/anchor-is-valid
			render: (text, record) => <a style={{ color: "black" }}> {`${text} (${record.type})`}</a>,
		},
		{
			dataIndex: "amount",
			render: (amount) => <p>Số Lượng: {amount} </p>,
		},
		{
			dataIndex: "price",
			render: (price) => <p>Giá Tiền: {conVerPrice(price)} VNĐ </p>,
		},
		{
			dataIndex: "discount",
			render: (discount) => <p>Giảm Giá: {discount || 0} % </p>,
		},
	];

	return (
		<div style={{ marginLeft: 160 }}>
			<Loading isLoading={false}>
				<h3 style={{ marginBottom: 10 }}> Đơn Đặt Hàng Thành Công</h3>
				<div
					style={{
						background: "#F0F0F0",
						width: "96%",
						padding: "5px 0 5px 20px",
						borderRadius: 10,
					}}
				>
					<div style={{ marginBottom: 10 }}> Phương Thức Thanh Toán</div>

					<div
						style={{
							background: "rgb(240, 248, 255)",
							border: "1px solid rbg(194, 255, 255)",
							padding: 10,
							width: "fit-content",
							borderRadius: 6,
						}}
					>
						<span>{deliveryMethod}</span>
						Giao Hàng Tiết Kiệm
					</div>
					<Divider />

					<div
						style={{
							background: "rgb(240, 248, 255)",
							border: "1px solid rbg(194, 255, 255)",
							padding: 10,
							width: "fit-content",
							borderRadius: 6,
						}}
					>
						<div style={{ marginBottom: 10 }}>{paymentMethod}</div>
					</div>

					<div style={{ marginTop: 20 }}>
						<Table
							showHeader={false}
							columns={columns}
							dataSource={orderItems.map((item, index) => ({
								...item,
								key: index,
							}))}
							size="small"
							style={{ width: 1140, display: "inline-block" }}
							pagination={false}
						/>
					</div>
					<Button
						style={{ color: "red", margin: "20px 0 20px 81%", marginLeft: "81%", height: 50 }}
					>
						<span>
							<span>Tổng Tiền: </span>
							{conVerPrice(state?.totalPriceMemo)}VNĐ
						</span>
					</Button>
				</div>
			</Loading>
		</div>
	);
};

export default OrderSuccess;
