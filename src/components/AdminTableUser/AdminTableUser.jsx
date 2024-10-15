import React, { useMemo, useState } from "react";
import { Button, Table, Pagination } from "antd";
import { Excel } from "antd-table-saveas-excel";
import { Loading } from "../LoadingComponent/Loading";

const AdminTableUser = (props) => {
	const {
		selectionType = "checkbox",
		data: dataSource = [],
		columns = [],
		isLoading = false,
		handleDeleteMany,
	} = props;

	const [rowSelectedKeys, setRowSelectedKeys] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const pageSize = 6;

	const newColumnExport = useMemo(() => {
		const arr = columns?.filter((col) => col.dataIndex !== "action" && col.dataIndex !== "avatar");
		return arr;
	}, [columns]);

	const rowSelection = {
		onChange: (selectedRowKeys, selectedRows) => {
			setRowSelectedKeys(selectedRowKeys);
		},
	};

	const handleDeleteAll = () => {
		handleDeleteMany(rowSelectedKeys);
	};

	const exportExcel = () => {
		const excel = new Excel();
		excel
			.addSheet("test")
			.addColumns(newColumnExport)
			.addDataSource(dataSource, {
				str2Percent: true,
			})
			.saveAs("Excel.xlsx");
	};

	const handlePageChange = (page) => {
		setCurrentPage(page);
	};

	const paginatedData = dataSource.slice((currentPage - 1) * pageSize, currentPage * pageSize);

	return (
		<Loading isLoading={isLoading}>
			{rowSelectedKeys.length > 1 && (
				<div
					style={{
						padding: 10,
						background: "#FAFAD2",
						color: "black",
						fontWeight: "bold",
						cursor: "pointer",
					}}
					onClick={handleDeleteAll}
				>
					Xóa tất cả
				</div>
			)}
			<Button style={{ marginBottom: 10, marginTop: 5 }} onClick={exportExcel}>
				Export Excel
			</Button>
			<Table
				rowSelection={{
					type: selectionType,
					...rowSelection,
				}}
				columns={columns}
				dataSource={paginatedData}
				pagination={false}
				{...props}
			/>
			<div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
				<Pagination
					current={currentPage}
					pageSize={pageSize}
					total={dataSource.length}
					onChange={handlePageChange}
				/>
			</div>
		</Loading>
	);
};

export default AdminTableUser;
