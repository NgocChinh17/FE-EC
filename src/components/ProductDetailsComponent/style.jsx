import { Row, Col, InputNumber, Button } from "antd";
import styled from "styled-components";

export const ProductDetailWrapper = styled.div`
	margin-top: 16px;
	margin-left: 30px;
`;

export const styleImageDetails = styled(Row)`
	margin-top: 16px;
	justify-content: space-between;
`;

export const styleImageCol = styled(Col)`
	flex-basis: unset;
	display: flex;
`;

export const WrapperStyleNameProduct = styled.div`
	font-size: 30px;
	margin-left: 30px;
`;

export const WrapperStyleStar = styled.div`
	font-size: 15px;
	margin-top: 10px;
	margin-right: 5px;
	margin-left: 30px;
	color: rgb(253, 216, 54);
	display: inline-block;
`;

export const WrapperStyleDaBan = styled.div`
	font-size: 15px;
	color: gray;
	display: inline-block;
`;

export const WrapperPriceProduct = styled.div`
	background-color: rgb(250, 250, 250);
	margin-left: 30px;
	border-radius: 4px;
`;

export const WrapperPriceTextProduct = styled.h1`
	font-size: 30px;
	line-height: 40px;
	margin-right: 8px;
	font-weight: 500;
	padding: 10px;
	margin-top: 10px;
`;

export const WrapperAddressProduct = styled.div`
	margin-left: 30px;
	margin-top: 10px;
	span.address {
		text-decoration: underline;
		font-size: 15px;
		line-height: 24px;
		font-weight: 500;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	span.change-address {
		color: rgb(11, 116, 229);
		font-size: 16px;
		line-height: 24px;
		font-weight: 500;
	}
`;

export const WrapperQualityProduct = styled.div`
	margin-top: 10px;
	display: flex;
	gap: 4px;
	align-items: center;
	width: 120px;
	border: 1px solid #ccc;
	border-radius: 4px;
`;

export const styleInputNumber = styled(InputNumber)`
	padding-left: 13px;
	&.ant-input-number.ant-input-number-sm {
		width: 60px;
		border-top: none;
		border-bottom: none;
	}
	&.custom-input-number .ant-input-number-handler-wrap {
		display: none;
	}
`;
