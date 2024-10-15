import { useEffect, useState, useCallback } from "react";
import { Button, Image } from "antd";
import { EyeFilled, EyeInvisibleFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import InputForm from "../../components/InputForm/InputForm";

import { useMutationHooks } from "../../hooks/userMutatitonHook";
import { Loading } from "../../components/LoadingComponent/Loading";
import * as message from "../../components/MessageComponent/Message";

import login from "../../assets/image/login.png";

import * as UserService from "../../services/UserService";
import * as S from "./style";

const SingUpPage = () => {
	const navigate = useNavigate();

	const [isShowPassword, setIsShowPassword] = useState(false);
	const [isShowConfirmPassword, setIsShowConfirmPassWord] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const mutation = useMutationHooks((data) => UserService.SignUpUser(data));
	const handleSignIn = useCallback(() => {
		navigate("/signIn");
	}, [navigate]);
	const { data, isLoading, isSuccess, isError } = mutation;

	useEffect(() => {
		if (isSuccess) {
			message.success();
			handleSignIn();
		} else if (isError) {
			message.error();
		}
	}, [isSuccess, isError, handleSignIn]);

	const handleSignUps = () => {
		mutation.mutate({
			email,
			password,
			confirmPassword,
		});
	};

	const handleOnchangeEmail = (value) => {
		setEmail(value);
	};

	const handleOnchangePassword = (value) => {
		setPassword(value);
	};

	const handleOnchangeConfirmPassword = (value) => {
		setConfirmPassword(value);
	};

	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				backgroundColor: "#ccc",
				height: "100vh",
			}}
		>
			<div
				style={{
					width: 800,
					height: 445,
					borderRadius: 6,
					backgroundColor: "#fff",
					display: "flex",
				}}
			>
				<S.WrapperContainerLeft>
					<h1>Xin Chào</h1>
					<p>Đăng Ký Và Tạo Tài Khoản</p>
					<S.WrapperInput>
						<InputForm placeholder="abc@gmail.com" value={email} onChange={handleOnchangeEmail} />
					</S.WrapperInput>
					<div style={{ position: "relative" }}>
						<span
							style={{
								zIndex: 10,
								position: "absolute",
								top: "4px",
								right: "8px",
							}}
							onClick={() => setIsShowPassword(!isShowPassword)}
						>
							{isShowPassword ? <EyeFilled /> : <EyeInvisibleFilled />}
						</span>
						<InputForm
							placeholder="New password"
							type={isShowPassword ? "text" : "password"}
							value={password}
							onChange={handleOnchangePassword}
						/>
					</div>
					<div style={{ position: "relative" }}>
						<span
							style={{
								zIndex: 10,
								position: "absolute",
								top: "16px",
								right: "8px",
							}}
							onClick={() => setIsShowConfirmPassWord(!isShowConfirmPassword)}
						>
							{isShowConfirmPassword ? <EyeFilled /> : <EyeInvisibleFilled />}
						</span>
						<InputForm
							placeholder="confirmPassword"
							style={{ marginTop: 13 }}
							type={isShowConfirmPassword ? "text" : "password"}
							value={confirmPassword}
							onChange={handleOnchangeConfirmPassword}
						/>
					</div>
					{data?.status === "ERR" && <span style={{ color: "red" }}>{data?.message}</span>}
					<Loading isLoading={isLoading}>
						<Button
							type="primary"
							style={{ width: "100%", marginTop: 26, marginBottom: 10 }}
							disabled={!email.length || !password.length || !confirmPassword.length}
							onClick={() => handleSignUps()}
						>
							Đăng Ký
						</Button>
					</Loading>
					<S.WrapperTextLight>
						<p>Quên Mật Khẩu</p>
					</S.WrapperTextLight>
					<p>
						Đã có Tài Khoản ?{" "}
						<S.WrapperTextLight onClick={() => handleSignIn()}>
							<span>Đăng Nhập</span>
						</S.WrapperTextLight>
					</p>
				</S.WrapperContainerLeft>
				<S.WrapperContainerRight>
					<Image src={login} alt="login" preview={false} style={{ height: 203, width: 203 }} />
					<h4>Mua Sắm Tại Đây</h4>
					<p>Ưu Đãi Mỗi Ngày</p>
				</S.WrapperContainerRight>
			</div>
		</div>
	);
};

export default SingUpPage;
