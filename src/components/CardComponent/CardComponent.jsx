import React from "react";
import { Card } from "antd";
import { HeartOutlined, StarFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import * as S from "./style";
import { conVerPrice } from "../../utils";

const CardComponent = (props) => {
	const navigate = useNavigate();
	const { countInStock, description, image, name, price, rating, sold, type, id, discount } = props;

	const handleDetailsProduct = (id) => {
		if (countInStock > 0) {
			navigate(`/product-detail/${id}`);
		}
	};

	const isDisabled = countInStock === 0;

	return (
		<Card
			hoverable
			cover={<img alt="example" src={image} onClick={() => handleDetailsProduct(id)} />}
			style={{
				cursor: isDisabled ? "not-allowed" : "pointer",
				opacity: isDisabled ? 0.5 : 1,
			}}
			onClick={() => handleDetailsProduct(id)}
		>
			{discount > 0 && (
				<div
					style={{
						position: "absolute",
						top: -1,
						left: -1,
						backgroundColor: "red",
						color: "white",
						padding: "2px 5px",
						borderTopLeftRadius: "10px",
						borderTopRightRadius: "10px",
						borderBottomRightRadius: "10px",
						fontSize: 12,
						fontWeight: "bold",
					}}
				>
					- {discount} %
				</div>
			)}
			<span style={{ fontSize: 18, fontWeight: 600, fontFamily: "sans-serif" }}>
				{name}{" "}
				<span style={{ float: "right", fontSize: 12, color: "gray", marginTop: 5 }}>
					{rating} <StarFilled style={{ color: "yellow" }} />
				</span>
			</span>
			<S.styleNameProduct>
				<div style={{ marginTop: 5, fontSize: 12 }}>
					{type} <span style={{ float: "right" }}>Trong Kho: {countInStock} SP</span>
				</div>
			</S.styleNameProduct>
			<S.stylePriceProduct>
				<span>{conVerPrice(price)} VNĐ</span>{" "}
			</S.stylePriceProduct>
			<div></div>
			<S.styleTextNode>{description}</S.styleTextNode>
			<div>
				<HeartOutlined
					style={{
						fontSize: 20,
						right: 0,
						marginTop: 10,
						display: "inline-block",
					}}
				/>
				<span style={{ fontSize: 12, color: "gray", marginLeft: 5 }}>
					Yêu Thích
					<span style={{ float: "right", color: "gray", marginTop: 13 }}>Đã Bán {sold || 0}+</span>
				</span>
			</div>
		</Card>
	);
};

export default CardComponent;
