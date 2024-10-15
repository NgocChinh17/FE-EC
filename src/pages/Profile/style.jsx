import styled from "styled-components";
import InputForm from "../../components/InputForm/InputForm";
import { Upload } from "antd";

export const bodyProfileWrapper = styled.div`
	margin-left: 124px;
`;
export const titleProfile = styled.div`
	font-size: 16px;
	margin-bottom: 10px;
	font-family: "Times New Roman", Times, serif;
	font-weight: 600;
	display: inline-block;
`;
export const contentProfile = styled.div`
	display: flex;
	flex-direction: column;
	border: 1px solid #ccc;
	width: 790px;
	border-radius: 10px;
	gap: 30px;
	padding: 20px 0;
	float: right;
	margin-right: 193px;
	margin-top: -30px;
`;
export const wrapperInputEmail = styled.div`
	display: flex;
	align-items: center;
	padding: 0 20px;
	gap: 20px;
	width: 100%; /* Đảm bảo wrapper chiếm toàn bộ chiều rộng */
`;

export const labelContent = styled.label`
	font-size: 16px;
	font-weight: 600;
	width: 100px; /* Đặt chiều rộng cố định để căn chỉnh với input */
	font-family: "Times New Roman", Times, serif;
	cursor: pointer;
`;

export const InputStyled = styled(InputForm)`
	flex: 1; /* Chiếm phần còn lại của khoảng trống sau label */
	justify-content: center;
`;

export const WrapperUploadFile = styled(Upload)`
	& .ant-upload.ant-upload-select.ant-upload-select-card {
		width: 60px;
		height: 60px;
		border-radius: 50%;
	}
	& .ant-upload-list {
		display: none;
	}
`;
