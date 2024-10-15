import React, { useEffect, useRef, useState } from "react";
import { Button, Form, Input, Select, Space } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { getBase64, renderOptions } from "../../utils";
import { useMutationHooks } from "../../hooks/userMutatitonHook";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";

import { Loading } from "../LoadingComponent/Loading";

import AdminTableUser from "../AdminTableUser/AdminTableUser";

import * as message from "../../components/MessageComponent/Message";
import * as ProductService from "../../services/ProductService";
import * as S from "./style";
import DrawerComponent from "../DrawerComponent/DrawerComponent";
import ModalComponent from "../ModalComponent/ModalComponent";

const AdminProduct = () => {
	const [form] = Form.useForm();
	const user = useSelector((state) => state?.user);
	const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
	const [isOpenDrawer, setIsOpenDrawer] = useState(false);
	const [rowSelected, setRowSelected] = useState();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
	const [typeListSelect, setTypeListSelect] = useState("");

	const searchInput = useRef(null);

	const initial = () => ({
		name: "",
		image: "",
		type: "",
		price: "",
		countInStock: "",
		rating: "",
		description: "",
		typeList: "",
		discount: "",
	});

	const [stateProduct, setStateProduct] = useState(initial());

	const [stateProductDetails, setStateProductDetails] = useState(initial());

	const mutation = useMutationHooks((data) => {
		const { name, image, type, price, countInStock, rating, description, typeList, discount } =
			data;
		const res = ProductService.createProduct({
			name,
			image,
			type,
			price,
			countInStock,
			rating,
			description,
			typeList,
			discount,
		});
		return res;
	});
	const { data, isLoading, isSuccess, isError } = mutation;

	const mutationUpdate = useMutationHooks((data) => {
		const { id, token, ...rests } = data;
		const res = ProductService.updateProduct(id, token, { ...rests });
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
		const res = ProductService.deleteProduct(id, token);
		return res;
	});

	const {
		data: dataDeleted,
		isLoading: isLoadingDeleted,
		isSuccess: isSuccessDeleted,
		isError: isErrorDeleted,
	} = mutationDelete;

	const getAllProducts = async () => {
		const res = await ProductService.getAllProduct();
		return res;
	};

	const mutationDeleteMany = useMutationHooks((data) => {
		const { token, ...ids } = data;
		const res = ProductService.deleteManyProduct(ids, token);
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
	}, [isSuccessDeletedMany, isErrorDeletedMany, dataDeletedMany]);

	const handleDeleteManyProducts = (ids) => {
		mutationDeleteMany.mutate(
			{ ids: ids, token: user?.access_token },
			{
				onSuccess: (res) => {
					refetch();
				},
			}
		);
	};

	const {
		isLoading: isLoadingProducts,
		data: products,
		refetch,
	} = useQuery({
		queryKey: ["products"],
		queryFn: getAllProducts,
	});

	const fetchAllTypeProduct = async () => {
		const res = await ProductService.getAllTypeProduct();
		return res;
	};

	const typeList = useQuery({
		queryKey: ["typeList"],
		queryFn: fetchAllTypeProduct,
	});

	useEffect(() => {
		if (isSuccess && data?.status === "ok") {
			message.success();
			handleCancel();
		} else if (isError) {
			message.error();
		}
	}, [isSuccess, isError, data]);

	useEffect(() => {
		if (isSuccessDeleted && dataDeleted?.status === "ok") {
			message.success();
			handleCancelDelete();
		} else if (isErrorDeleted) {
			message.error();
		}
	}, [isSuccessDeleted, isErrorDeleted, dataDeleted]);

	useEffect(() => {
		if (isSuccessUpdated && dataUpdated?.status === "OK") {
			message.success();
			handleCloseDrawer();
		} else if (isErrorUpdated) {
			message.error();
		}
	}, [isSuccessUpdated, isErrorUpdated, dataUpdated]);

	const handleCloseDrawer = () => {
		setIsOpenDrawer(false);
		setStateProductDetails({
			name: "",
			image: "",
			type: "",
			price: "",
			countInStock: "",
			rating: "",
			description: "",
			typeList: "",
			discount: "",
		});
		form.resetFields();
	};

	const handleCancel = () => {
		setIsModalOpen(false);
		setStateProduct({
			name: "",
			image: "",
			type: "",
			price: "",
			countInStock: "",
			rating: "",
			description: "",
			typeList: "",
			discount: "",
		});
		form.resetFields();
	};

	const handleCancelDelete = () => {
		setIsModalOpenDelete(false);
	};

	const handleDeleteProduct = () => {
		mutationDelete.mutate(
			{ id: rowSelected, token: user?.access_token },
			{
				onSuccess: () => {
					refetch();
				},
			}
		);
	};

	const onFinish = () => {
		mutation.mutate(stateProduct, {
			onSuccess: () => {
				refetch();
			},
		});
	};

	const onUpdateProduct = () => {
		mutationUpdate.mutate(
			{ id: rowSelected, token: user?.access_token, ...stateProductDetails },
			{
				onSuccess: () => {
					refetch();
				},
			}
		);
	};

	const onFinishFailed = (errorInfo) => {
		console.log("Failed:", errorInfo);
	};

	const handleOnchange = (e) => {
		setStateProduct({
			...stateProduct,
			[e.target.name]: e.target.value,
		});
	};

	const handleOnchangeDetails = (e) => {
		setStateProductDetails({
			...stateProductDetails,
			[e.target.name]: e.target.value,
		});
	};

	const handleOnchangeAvatar = async ({ fileList }) => {
		const file = fileList[0];
		if (!file.url && !file.preview) {
			file.preview = await getBase64(file.originFileObj);
		}
		setStateProduct({
			...stateProduct,
			image: file.preview,
		});
	};

	const handleOnchangeAvatarDetails = async ({ fileList }) => {
		const file = fileList[0];
		if (!file.url && !file.preview) {
			file.preview = await getBase64(file.originFileObj);
		}
		setStateProductDetails({
			...stateProductDetails,
			image: file.preview,
		});
	};

	const fetchGetProductDetails = async (rowSelected) => {
		const res = await ProductService.getDetailsProduct(rowSelected);
		if (res?.data) {
			setStateProductDetails({
				name: res?.data?.name,
				image: res?.data?.image,
				type: res?.data?.type,
				price: res?.data?.price,
				countInStock: res?.data?.countInStock,
				rating: res?.data?.rating,
				description: res?.data?.description,
				typeList: res?.data?.typeList,
				discount: res?.data?.discount,
			});
		}

		setIsLoadingUpdate(false);
	};

	useEffect(() => {
		if (!isModalOpen) {
			form.setFieldsValue(stateProductDetails);
		} else {
			form.setFieldsValue(initial());
		}
	}, [form, stateProductDetails, isModalOpen]);

	useEffect(() => {
		if (rowSelected && isOpenDrawer) {
			setIsLoadingUpdate(true);
			fetchGetProductDetails(rowSelected);
		}
	}, [rowSelected, isOpenDrawer]);

	const handleDetailProduct = () => {
		setIsOpenDrawer(true);
	};

	const renderAction = () => {
		return (
			<div>
				<EditOutlined
					style={{
						fontSize: 20,
						cursor: "pointer",
						paddingRight: 10,
						color: "red",
					}}
					onClick={handleDetailProduct}
				/>
				<DeleteOutlined
					style={{ fontSize: 20, cursor: "pointer", color: "orange" }}
					onClick={() => setIsModalOpenDelete(true)}
				/>
			</div>
		);
	};

	const handleSearch = (selectedKeys, confirm, dataIndex) => {
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
			title: "Name",
			dataIndex: "name",
			sorter: (a, b) => a.name.length - b.name.length,
			...getColumnSearchProps("name"),
		},
		{
			title: "Price",
			dataIndex: "price",
			sorter: (a, b) => a.price - b.price,
			filters: [
				{
					text: ">= 1.000.000",
					value: ">=",
				},
				{
					text: "=< 1.000.000",
					value: "<=",
				},
			],
			onFilter: (value, record) => {
				if (value === ">=") {
					return record.price >= 1000000;
				} else if (value === "<=") {
					return record.price <= 1000000;
				}
			},
		},
		{
			title: "Type",
			dataIndex: "type",
		},
		{
			title: "TypeList",
			dataIndex: "typeList",
		},
		{
			title: "CountInStock",
			dataIndex: "countInStock",
		},
		{
			title: "Action",
			dataIndex: "action",
			render: renderAction,
		},
	];

	const dataTable =
		products?.data.length &&
		products?.data?.map((products) => {
			return { ...products, key: products._id };
		});

	const handleChangeSelect = (value) => {
		if (value !== "add_typeList") {
			setStateProduct({
				...stateProduct,
				typeList: value,
			});
		} else {
			setTypeListSelect(value);
		}
	};

	return (
		<div>
			<h3>Thêm Sản Phẩm Mới</h3>
			<div>
				<Button
					style={{
						height: 100,
						width: 100,
						borderRadius: 6,
						borderStyle: "dashed",
					}}
					onClick={() => setIsModalOpen(true)}
				>
					<PlusOutlined style={{ fontSize: 60 }} onClick={() => setIsModalOpen(true)} />
				</Button>
			</div>
			<div style={{ marginTop: 5 }}>
				{
					<AdminTableUser
						handleDeleteMany={handleDeleteManyProducts}
						columns={columns}
						data={dataTable}
						isLoading={isLoadingProducts}
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
			<ModalComponent
				forceRender
				title="Tạo Sản Phẩm"
				open={isModalOpen}
				onCancel={handleCancel}
				footer={null}
			>
				<Loading isLoading={isLoading}>
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
						onFinish={onFinish}
						onFinishFailed={onFinishFailed}
						autoComplete="off"
						form={form}
					>
						<Form.Item
							label="Name"
							name="name"
							rules={[
								{
									required: true,
									message: "Please input your name!",
								},
							]}
						>
							<Input
								value={stateProduct.name}
								onChange={handleOnchange}
								name="name"
								placeholder="Nhập Tên Sản Phẩm"
							/>
						</Form.Item>

						<Form.Item
							label="Price"
							name="price"
							rules={[
								{
									required: true,
									message: "Please input your price!",
								},
							]}
						>
							<Input
								value={stateProduct.price}
								onChange={handleOnchange}
								name="price"
								placeholder="Nhập Giá Sản Phẩm"
							/>
						</Form.Item>

						<Form.Item
							label="Discount"
							name="discount"
							rules={[
								{
									required: true,
									message: "Please input your discount!",
								},
							]}
						>
							<Input
								value={stateProduct.discount}
								onChange={handleOnchange}
								name="discount"
								placeholder="Nhập Giá Được Giảm Của Sản Phẩm"
							/>
						</Form.Item>

						<Form.Item
							label="CountInStock"
							name="countInStock"
							rules={[
								{
									required: true,
									message: "Please input your countInStock!",
								},
							]}
						>
							<Input
								value={stateProduct.countInStock}
								onChange={handleOnchange}
								name="countInStock"
								placeholder="Sản Phẩm Còn Lại Trong Kho"
							/>
						</Form.Item>

						<Form.Item
							label="Type"
							name="type"
							rules={[
								{
									required: true,
									message: "Please input your type!",
								},
							]}
						>
							<Input
								value={stateProduct.type}
								onChange={handleOnchange}
								name="type"
								placeholder="Nhập Dung Lượng sản phẩm"
							/>
						</Form.Item>

						<Form.Item
							label="TypeList"
							name="typeList"
							rules={[
								{
									required: true,
									message: "Please input your typeList!",
								},
							]}
						>
							<Select
								name={typeListSelect === "add_typeList" ? "typeList" : ""}
								style={{ width: "314px" }}
								onChange={handleChangeSelect}
								options={renderOptions(typeList?.data?.data)}
							/>
							{typeListSelect === "add_typeList" && (
								<Input
									value={stateProduct.typeList}
									onChange={handleOnchange}
									name={typeListSelect === "add_typeList" ? "typeList" : ""}
									placeholder="Nhập Dung Lượng typeList"
								/>
							)}
						</Form.Item>

						<Form.Item
							label="Description"
							name="description"
							rules={[
								{
									required: true,
									message: "Please input your description !",
								},
							]}
						>
							<Input
								value={stateProduct.description}
								onChange={handleOnchange}
								name="description"
								placeholder="Nhập ghi chú sản phẩm"
							/>
						</Form.Item>

						<Form.Item
							label="Rating"
							name="rating"
							rules={[
								{
									required: true,
									message: "Please input your rating !",
								},
							]}
						>
							<Input
								value={stateProduct.rating}
								onChange={handleOnchange}
								name="rating"
								placeholder="Đánh giá sao sản phẩm"
							/>
						</Form.Item>

						<Form.Item
							label="Image"
							name="image"
							rules={[
								{
									required: true,
									message: "Please input your image !",
								},
							]}
						>
							<S.WrapperUploadFile onChange={handleOnchangeAvatar} maxCount={1}>
								<Button>Upload</Button>
								<br />
								{stateProduct?.image && (
									<img
										src={stateProduct?.image}
										alt="avatar"
										style={{
											marginTop: 5,
											height: "60px",
											width: "60px",
											borderRadius: "50%",
											objectFit: "cover",
										}}
									/>
								)}
							</S.WrapperUploadFile>
						</Form.Item>

						<Form.Item
							wrapperCol={{
								offset: 20,
								span: 4,
							}}
						>
							<Button type="primary" htmlType="submit">
								Submit
							</Button>
						</Form.Item>
					</Form>
				</Loading>
			</ModalComponent>

			<DrawerComponent
				title="Update Sản Phẩm"
				isOpen={isOpenDrawer}
				width="45%"
				onClose={() => setIsOpenDrawer()}
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
						onFinish={onUpdateProduct}
						onFinishFailed={onFinishFailed}
						autoComplete="off"
						form={form}
					>
						<Form.Item
							label="Name"
							name="name"
							rules={[
								{
									required: true,
									message: "Please input your name!",
								},
							]}
						>
							<Input
								value={stateProductDetails.name}
								onChange={handleOnchangeDetails}
								name="name"
							/>
						</Form.Item>

						<Form.Item
							label="Price"
							name="price"
							rules={[
								{
									required: true,
									message: "Please input your price!",
								},
							]}
						>
							<Input
								value={stateProductDetails.price}
								onChange={handleOnchangeDetails}
								name="price"
							/>
						</Form.Item>

						<Form.Item
							label="Discount"
							name="discount"
							rules={[
								{
									required: true,
									message: "Please input your discount!",
								},
							]}
						>
							<Input
								value={stateProductDetails.discount}
								onChange={handleOnchangeDetails}
								name="discount"
							/>
						</Form.Item>

						<Form.Item
							label="CountInStock"
							name="countInStock"
							rules={[
								{
									required: true,
									message: "Please input your countInStock!",
								},
							]}
						>
							<Input
								value={stateProductDetails.countInStock}
								onChange={handleOnchangeDetails}
								name="countInStock"
							/>
						</Form.Item>

						<Form.Item
							label="Type"
							name="type"
							rules={[
								{
									required: true,
									message: "Please input your type!",
								},
							]}
						>
							<Input
								value={stateProductDetails.type}
								onChange={handleOnchangeDetails}
								name="type"
							/>
						</Form.Item>

						<Form.Item
							label="TypeList"
							name="typeList"
							rules={[
								{
									required: true,
									message: "Please input your typeList!",
								},
							]}
						>
							<Input
								disabled
								value={stateProductDetails.typeList}
								onChange={handleOnchange}
								name="typeList"
								placeholder="Nhập Dung Lượng typeList"
							/>
						</Form.Item>

						<Form.Item
							label="Description"
							name="description"
							rules={[
								{
									required: true,
									message: "Please input your description!",
								},
							]}
						>
							<Input
								value={stateProductDetails.description}
								onChange={handleOnchangeDetails}
								name="description"
							/>
						</Form.Item>

						<Form.Item
							label="Rating"
							name="rating"
							rules={[
								{
									required: true,
									message: "Please input your rating!",
								},
							]}
						>
							<Input
								value={stateProductDetails.rating}
								onChange={handleOnchangeDetails}
								name="rating"
							/>
						</Form.Item>

						<Form.Item
							label="Image"
							name="image"
							rules={[
								{
									required: true,
									message: "Please input your image!",
								},
							]}
						>
							<S.WrapperUploadFile onChange={handleOnchangeAvatarDetails} maxCount={1}>
								<Button>Upload</Button>
								<br />
								{stateProductDetails?.image && (
									<img
										src={stateProductDetails?.image}
										alt="avatar"
										style={{
											marginTop: 5,
											height: "60px",
											width: "60px",
											borderRadius: "50%",
											objectFit: "cover",
										}}
									/>
								)}
							</S.WrapperUploadFile>
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
				onOk={handleDeleteProduct}
			>
				<Loading isLoading={isLoadingDeleted}>
					<div>Bạn có chắc mình muốn xóa sản phẩm này không?</div>
				</Loading>
			</ModalComponent>
		</div>
	);
};

export default AdminProduct;
