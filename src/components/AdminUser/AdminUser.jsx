import React, { useEffect, useRef, useState } from "react";
import { Button, Form, Input, Space } from "antd";
import { DeleteOutlined, EditOutlined, SearchOutlined } from "@ant-design/icons";

import { Loading } from "../LoadingComponent/Loading";
import { useQuery } from "react-query";
import { useMutationHooks } from "../../hooks/userMutatitonHook";
import { useSelector } from "react-redux";

import AdminTableUser from "../AdminTableUser/AdminTableUser";
import ModalComponent from "../ModalComponent/ModalComponent";
import DrawerComponent from "../DrawerComponent/DrawerComponent";

import * as UserService from "../../services/UserService";
import * as message from "../../components/MessageComponent/Message";
import * as S from "./style";

const AdminUser = () => {
	const user = useSelector((state) => state?.user);
	const searchInput = useRef(null);

	const [form] = Form.useForm();
	const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
	const [isOpenDrawer, setIsOpenDrawer] = useState(false);
	const [rowSelected, setRowSelected] = useState();
	const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);

	const [stateUserDetails, setStateUserDetails] = useState({
		avatar: "",
		name: "",
		email: "",
		phone: "",
		address: "",
		isAdmin: false,
	});

	const mutationUpdate = useMutationHooks((data) => {
		const { id, token, ...rests } = data;
		const res = UserService.updateUser(id, { ...rests }, token);
		return res;
	});

	const {
		data: dataUpdated,
		isLoading: isLoadingUpdated,
		isSuccess: isSuccessUpdated,
		isError: isErrorUpdated,
	} = mutationUpdate;

	const mutationDelete = useMutationHooks((data) => {
		const { id, token } = data;
		const res = UserService.deleteUser(id, token);
		return res;
	});

	const {
		data: dataDeleted,
		isLoading: isLoadingDeleted,
		isSuccess: isSuccessDeleted,
		isError: isErrorDeleted,
	} = mutationDelete;

	const getAllUser = async () => {
		const res = await UserService.getAllUser(user?.access_token);
		return res;
	};

	const {
		isLoading: isLoadingUsers,
		data: users,
		refetch,
	} = useQuery({
		queryKey: ["user"],
		queryFn: getAllUser,
	});

	const mutationDeleteMany = useMutationHooks((data) => {
		const { token, ...ids } = data;
		const res = UserService.deleteManyUser(ids, token);
		return res;
	});

	const {
		data: dataDeletedMany,
		isLoading: isLoadingDeletedMany,
		isSuccess: isSuccessDeletedMany,
		isError: isErrorDeletedMany,
	} = mutationDeleteMany;

	useEffect(() => {
		if (isSuccessDeletedMany && dataDeletedMany?.status === "ok") {
			message.success();
		} else if (isErrorDeletedMany) {
			message.error();
		}
	}, [isSuccessDeletedMany, isErrorDeletedMany]);

	const handleDeleteManyUser = (ids) => {
		mutationDeleteMany.mutate(
			{ ids: ids, token: user?.access_token },
			{
				onSuccess: (res) => {
					refetch();
				},
			}
		);
	};

	useEffect(() => {
		if (isSuccessDeleted && dataDeleted?.status === "ok") {
			message.success();
			handleCancelDelete();
		} else if (isErrorDeleted) {
			message.error();
		}
	}, [isSuccessDeleted, isErrorDeleted]);

	useEffect(() => {
		if (isSuccessUpdated && dataUpdated?.status === "ok") {
			message.success();
			handleCloseDrawer();
		} else if (isErrorUpdated) {
			message.error();
		}
	}, [isSuccessUpdated, isErrorUpdated]);

	const handleCloseDrawer = () => {
		setIsOpenDrawer(false);
		setStateUserDetails({
			avatar: "",
			name: "",
			email: "",
			phone: "",
			address: "",
			isAdmin: false,
		});
		form.resetFields();
	};

	const handleCancelDelete = () => {
		setIsModalOpenDelete(false);
	};

	const handleDeleteUser = () => {
		mutationDelete.mutate(
			{ id: rowSelected, token: user?.access_token },
			{
				onSuccess: (res) => {
					refetch();
				},
			}
		);
	};

	const onUpdateUser = () => {
		mutationUpdate.mutate(
			{ id: rowSelected, ...stateUserDetails, token: user?.access_token },
			{
				onSuccess: (res) => {
					refetch();
				},
			}
		);
	};

	const handleOnchangeDetails = (e) => {
		setStateUserDetails({
			...stateUserDetails,
			[e.target.name]: e.target.value,
		});
	};

	const fetchGetUserDetails = async (rowSelected) => {
		const res = await UserService.getDetailsUser(rowSelected);
		if (res?.data) {
			setStateUserDetails({
				image: res?.data?.avatar,
				name: res?.data?.name,
				email: res?.data?.email,
				phone: res?.data?.phone,
				address: res?.data?.address,
				isAdmin: res?.data?.isAdmin,
			});
		}
		setIsLoadingUpdate(false);
	};

	useEffect(() => {
		form.setFieldsValue(stateUserDetails);
	}, [form, stateUserDetails]);

	useEffect(() => {
		if (rowSelected && isOpenDrawer) {
			setIsLoadingUpdate(true);
			fetchGetUserDetails(rowSelected);
		}
	}, [rowSelected, isOpenDrawer]);

	const handleDetailProduct = () => {
		setIsOpenDrawer(true);
	};

	const renderAction = () => {
		return (
			<div>
				<EditOutlined
					style={{ fontSize: 20, cursor: "pointer", paddingRight: 10, color: "red" }}
					onClick={handleDetailProduct}
				/>
				<DeleteOutlined
					style={{ fontSize: 20, cursor: "pointer", color: "orange" }}
					onClick={() => setIsModalOpenDelete(true)}
				/>
			</div>
		);
	};

	const handleSearch = (confirm) => {
		confirm();
	};

	const handleReset = (clearFilters) => {
		clearFilters();
	};

	const getColumnSearchProps = (dataIndex) => ({
		filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
			<div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
				<Input
					ref={searchInput}
					placeholder={`Search ${dataIndex}`}
					value={selectedKeys[0]}
					onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
					onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
					style={{ marginBottom: 8, display: "block" }}
				/>
				<Space>
					<Button
						type="primary"
						onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
						icon={<SearchOutlined />}
						size="small"
						style={{ width: 90 }}
					>
						Search
					</Button>
					<Button
						onClick={() => clearFilters && handleReset(clearFilters)}
						size="small"
						style={{ width: 90 }}
					>
						Reset
					</Button>
				</Space>
			</div>
		),
		filterIcon: (filtered) => (
			<SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
		),
		onFilter: (value, record) =>
			record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
		onFilterDropdownOpenChange: (visible) => {
			if (visible) {
				setTimeout(() => searchInput.current?.select(), 100);
			}
		},
	});

	const columns = [
		{
			title: "Avatar",
			dataIndex: "avatar",
			render: (text, record) => (
				<img
					src={record?.avatar}
					alt="avatar"
					style={{
						width: "40px",
						height: "40px",
						borderRadius: "50%",
						objectFit: "cover",
					}}
				/>
			),
		},
		{
			title: "Name",
			dataIndex: "name",
			sorter: (a, b) => a.name.length - b.name.length,
			...getColumnSearchProps("name"),
		},
		{
			title: "Email",
			dataIndex: "email",
			sorter: (a, b) => a.email.length - b.email.length,
			...getColumnSearchProps("email"),
		},
		{
			title: "Phone",
			dataIndex: "phone",
			sorter: (a, b) => a.phone - b.phone,
			...getColumnSearchProps("phone"),
		},
		{
			title: "Address",
			dataIndex: "address",
		},
		{
			title: "IsAdmin",
			dataIndex: "isAdmin",
			filters: [
				{
					text: "Yes",
					value: true,
				},
				{
					text: "No",
					value: false,
				},
			],
		},
		{
			title: "Action",
			dataIndex: "action",
			render: renderAction,
		},
	];

	const dataTable =
		users?.data.length &&
		users?.data?.map((user) => {
			return { ...user, key: user._id, isAdmin: user.isAdmin ? "True" : "False" };
		});

	return (
		<div>
			<h3>Quản Lý Người Dùng</h3>

			<div>
				{
					<AdminTableUser
						handleDeleteMany={handleDeleteManyUser}
						columns={columns}
						data={dataTable}
						isLoading={isLoadingUsers}
						onRow={(record, rowIndex) => {
							return {
								onClick: (event) => {
									setRowSelected(record._id);
								},
							};
						}}
					/>
				}
			</div>

			<DrawerComponent
				title="Update Người Dùng"
				isOpen={isOpenDrawer}
				width="45%"
				onClose={() => setIsOpenDrawer()}
				forceRender
			>
				<Loading isLoading={isLoadingUpdate || isLoadingUpdated}>
					<Form
						name="basic"
						labelCol={{
							span: 8,
						}}
						wrapperCol={{
							span: 16,
						}}
						style={{
							maxWidth: 600,
						}}
						labelAlign="left"
						onFinish={onUpdateUser}
						autoComplete="off"
						form={form}
					>
						<Form.Item label="Name" name="name">
							<Input value={stateUserDetails.name} onChange={handleOnchangeDetails} name="name" />
						</Form.Item>

						<Form.Item label="Email" name="email">
							<Input value={stateUserDetails.email} onChange={handleOnchangeDetails} name="email" />
						</Form.Item>

						<Form.Item label="Phone" name="phone">
							<Input value={stateUserDetails.phone} onChange={handleOnchangeDetails} name="phone" />
						</Form.Item>

						<Form.Item label="Address" name="address">
							<Input
								value={stateUserDetails.address}
								onChange={handleOnchangeDetails}
								name="address"
							/>
						</Form.Item>

						<Form.Item label="IsAdmin" name="isAdmin">
							<Input
								value={stateUserDetails.isAdmin}
								onChange={handleOnchangeDetails}
								name="isAdmin"
							/>
						</Form.Item>

						<Form.Item
							wrapperCol={{
								offset: 20,
								span: 4,
							}}
						>
							<Button type="primary" htmlType="submit">
								Apply
							</Button>
						</Form.Item>
					</Form>
				</Loading>
			</DrawerComponent>

			<ModalComponent
				title="Xóa Sản Phẩm"
				open={isModalOpenDelete}
				onCancel={handleCancelDelete}
				onOk={handleDeleteUser}
				forceRender
			>
				<Loading isLoading={isLoadingDeleted}>
					<div>Bạn có chắc mình muốn xóa tài khoản này không?</div>
				</Loading>
			</ModalComponent>
		</div>
	);
};

export default AdminUser;
