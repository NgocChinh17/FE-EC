import React, { useRef, useState } from "react"
import { Button, Input, Space } from "antd"
import { SearchOutlined } from "@ant-design/icons"
import { useSelector } from "react-redux"
import { useQuery } from "react-query"
import AdminTableUser from "../AdminTableUser/AdminTableUser"
import * as OrderService from "../../services/OrderService"
import { conVerPrice } from "../../utils"
import { orderConstant } from "../../constants/orderContant"
import PieCharts from "../PieChartComponent/PieCharts"

const AdminDashboard = () => {
  const user = useSelector((state) => state?.user)
  const searchInput = useRef(null)
  const [rowSelected, setRowSelected] = useState()

  const getAllOrder = async () => {
    if (!user?.access_token) {
      throw new Error("No access token found")
    }
    try {
      const res = await OrderService.getAllOrder(user.access_token)
      return res
    } catch (err) {
      console.error("Error fetching orders:", err)
      throw new Error("Error fetching orders")
    }
  }

  const { isLoading: isLoadingOrders, data: orders } = useQuery({
    queryKey: ["orders"],
    queryFn: getAllOrder,
    onError: (err) => {
      console.error("Error fetching orders:", err)
    },
  })

  const handleSearch = (selectedKeys, confirm) => {
    confirm()
  }

  const handleReset = (clearFilters) => {
    clearFilters()
  }

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm)}
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
      record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100)
      }
    },
  })

  const columns = [
    {
      title: "Email",
      dataIndex: "email",
      ...getColumnSearchProps("email"),
    },
    {
      title: "Name",
      dataIndex: "name",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Type",
      dataIndex: "type",
      ...getColumnSearchProps("type"),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      ...getColumnSearchProps("phone"),
    },
    {
      title: "Address",
      dataIndex: "address",
      ...getColumnSearchProps("address"),
    },
    {
      title: "Payment Method",
      dataIndex: "paymentMethod",
      ...getColumnSearchProps("paymentMethod"),
    },
    {
      title: "Total Price",
      dataIndex: "totalPrice",
      render: (totalPrice) => `${conVerPrice(totalPrice)} VNĐ`,
    },
    {
      title: "Is Paid",
      dataIndex: "isPaid",
      render: (isPaid) => (isPaid ? "Yes" : "No"),
    },
    {
      title: "Is Delivered",
      dataIndex: "isDelivered",
      render: (isDelivered) => (isDelivered ? "Yes" : "No"),
    },
  ]

  const dataTable = orders?.data?.map((order) => {
    const itemType =
      `${order?.orderItems?.[0]?.name} ${order?.orderItems?.[0]?.type}` || "Unknown"
    const nameItem = order?.orderItems?.[0]?.name || "Unknown"
    return {
      key: order._id,
      name: order.shippingAddress.fullName,
      type: itemType,
      phone: order.shippingAddress.phone,
      address: `${order.shippingAddress.address}, ${order.shippingAddress.city}`,
      image: order?.orderItems?.[0]?.image,
      totalPrice: order.totalPrice,
      isPaid: order.isPaid,
      isDelivered: order.isDelivered,
      nameItem: nameItem,
      email: user?.email,
      paymentMethod: orderConstant.payment[order.paymentMethod],
    }
  })

  return (
    <div>
      <h3>Quản Lý Đơn Hàng</h3>
      <div style={{ width: 200, height: 200 }}>
        <PieCharts data={orders?.data} />
      </div>
      <div>
        <AdminTableUser
          columns={columns}
          data={dataTable}
          isLoading={isLoadingOrders}
          onRow={(record) => ({
            onClick: () => {
              setRowSelected(record.key)
            },
          })}
        />
      </div>
    </div>
  )
}

export default AdminDashboard
