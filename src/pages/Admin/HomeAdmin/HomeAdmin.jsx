import React, { useState } from "react";
import { UserOutlined, ProductOutlined, BarChartOutlined } from "@ant-design/icons";
import { Menu } from "antd";

import { getItem } from "../../../utils";

import Header from "../../../layouts/AdminLayout/Header";
import AdminUser from "../../../components/AdminUser/AdminUser";
import AdminProduct from "../../../components/AdminProduct/AdminProduct";
import AdminDashboard from "../../../components/AdminDashboard/AdminDashboard";

const HomeAdmin = () => {
	const items = [
		getItem("Dashboard", "dashboard", <BarChartOutlined />),
		getItem("User", "user", <UserOutlined />),
		getItem("Products", "Products", <ProductOutlined />),
	];

	const [keySelected, setKeySelected] = useState("");

	const handleOnClick = ({ key }) => {
		setKeySelected(key);
	};

	const renderPage = (key) => {
		switch (key) {
			case "user":
				return <AdminUser />;
			case "Products":
				return <AdminProduct />;
			case "dashboard":
				return <AdminDashboard />;
			default:
				return <AdminDashboard />;
		}
	};

	return (
		<div>
			<div style={{ marginBottom: 10 }}>
				<Header />
			</div>

			<div style={{ display: "flex" }}>
				<Menu
					mode="inline"
					style={{ width: 170, height: "92vh", boxShadow: "1px 1px 2px #ccc" }}
					items={items}
					onClick={handleOnClick}
				/>

				<div style={{ flex: 1, paddingLeft: 10 }}>{renderPage(keySelected)}</div>
			</div>
		</div>
	);
};

export default HomeAdmin;
