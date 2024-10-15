import styled from "styled-components";

export const typeProduct = styled.div`
	display: flex;
	align-items: center;
	gap: 24px;
	justify-content: flex-start;
	font-size: 15px;
	padding-bottom: 16px;
`;

export const CardHome = styled.div`
	margin-top: 30px;
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
	gap: 10px;
	margin-right: 80px;
	justify-content: center;
	& .ant-card-body {
		padding: 10px;
	}
`;

export const imgHome = styled.div`
	width: 1660px;
	max-width: 1160px;
	height: 380px;
`;
