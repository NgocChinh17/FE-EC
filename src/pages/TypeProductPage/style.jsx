import styled from "styled-components";

export const typeWrapper = styled.div`
	padding-left: 180px;
	padding-right: 150px;
	padding: 0 120px;
`;

export const productWrapper = styled.div`
	margin-top: 15px;
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 10px;
	margin-right: 170px;
	margin-left: 11px;
	justify-content: center;
	& .ant-card-body {
		padding: 10px;
	}
`;

export const contentProduct = styled.div`
	background-color: #fff;
	padding: 10px;
	border-radius: 4px;
	margin-left: 30px;
	height: fit-content;
`;
