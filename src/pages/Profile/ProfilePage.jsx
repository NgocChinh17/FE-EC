import { useEffect, useState, useCallback } from "react";
import { Button } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { UploadOutlined } from "@ant-design/icons";

import InputForm from "../../components/InputForm/InputForm";

import { useMutationHooks } from "../../hooks/userMutatitonHook";
import { Loading } from "../../components/LoadingComponent/Loading";
import { updateUser } from "../../redux/slicers/userSlides";
import { getBase64 } from "../../utils";

import * as UserService from "../../services/UserService";
import * as message from "../../components/MessageComponent/Message";

import * as S from "./style";

const ProfilePage = () => {
	const user = useSelector((state) => state.user);
	const dispatch = useDispatch();

	const mutation = useMutationHooks((data) => {
		const { id, access_token, ...rests } = data;
		UserService.updateUser(id, rests, access_token);
	});
	// eslint-disable-next-line no-unused-vars
	const { data, isLoading, isSuccess, isError } = mutation;

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [address, setAddress] = useState("");
	const [avatar, setAvatar] = useState("");

	useEffect(() => {
		setName(user?.name);
		setEmail(user?.email);
		setPhone(user?.phone);
		setAddress(user?.address);
		setAvatar(user?.avatar);
	}, [user]);

	// Memoize handleGetDetailsUser with useCallback
	const handleGetDetailsUser = useCallback(
		async (id, token) => {
			const res = await UserService.getDetailsUser(id, token);
			dispatch(updateUser({ ...res?.data, access_token: token }));
		},
		[dispatch]
	);

	useEffect(() => {
		if (isSuccess) {
			message.success();
			handleGetDetailsUser(user?.id, user?.access_token);
		} else if (isError) {
			message.error();
		}
	}, [handleGetDetailsUser, isError, isSuccess, user?.access_token, user?.id]);

	const handleOnchangeName = (value) => {
		setName(value);
	};
	const handleOnchangeEmail = (value) => {
		setEmail(value);
	};
	const handleOnchangePhone = (value) => {
		setPhone(value);
	};
	const handleOnchangeAddress = (value) => {
		setAddress(value);
	};

	const handleOnchangeAvatar = async ({ fileList }) => {
		const file = fileList[0];
		if (!file.url && !file.preview) {
			file.preview = await getBase64(file.originFileObj);
		}
		setAvatar(file.preview);
	};

	const handleUpdate = () => {
		mutation.mutate({
			id: user?.id,
			email,
			name,
			phone,
			address,
			avatar,
			access_token: user?.access_token,
		});
	};

	return (
		<S.bodyProfileWrapper>
			<S.titleProfile>
				<h2>Thông Tin Người Dùng</h2>
			</S.titleProfile>

			<Loading isLoading={isLoading}>
				<S.contentProfile>
					<S.wrapperInputEmail>
						<S.labelContent htmlFor="name">Name</S.labelContent>
						<InputForm
							value={name}
							id="name"
							style={{ width: "500px", justifyContent: "center" }}
							onChange={handleOnchangeName}
						/>
					</S.wrapperInputEmail>

					<S.wrapperInputEmail>
						<S.labelContent htmlFor="email">Email</S.labelContent>
						<InputForm
							value={email}
							id="email"
							style={{ width: "500px", justifyContent: "center" }}
							onChange={handleOnchangeEmail}
						/>
					</S.wrapperInputEmail>

					<S.wrapperInputEmail>
						<S.labelContent htmlFor="phone">Phone</S.labelContent>
						<InputForm
							value={phone}
							id="phone"
							style={{ width: "500px", justifyContent: "center" }}
							onChange={handleOnchangePhone}
						/>
					</S.wrapperInputEmail>

					<S.wrapperInputEmail>
						<S.labelContent htmlFor="address">Address</S.labelContent>
						<InputForm
							value={address}
							id="address"
							style={{ width: "500px", justifyContent: "center" }}
							onChange={handleOnchangeAddress}
						/>
					</S.wrapperInputEmail>

					<S.wrapperInputEmail>
						<S.labelContent htmlFor="avatar">Avatar</S.labelContent>
						<S.WrapperUploadFile onChange={handleOnchangeAvatar} maxCount={1}>
							<Button icon={<UploadOutlined />}>Upload</Button>
						</S.WrapperUploadFile>
						{avatar && (
							<img
								src={avatar}
								alt="avatar"
								style={{ height: "60px", width: "60px", borderRadius: "50%", objectFit: "cover" }}
							/>
						)}
					</S.wrapperInputEmail>

					<Button
						style={{ width: "63%", marginLeft: "18%" }}
						type="primary"
						onClick={() => handleUpdate()}
					>
						Cập Nhật
					</Button>
				</S.contentProfile>
			</Loading>
		</S.bodyProfileWrapper>
	);
};

export default ProfilePage;
