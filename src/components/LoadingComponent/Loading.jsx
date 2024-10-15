import { Spin } from "antd"
import { LoadingOutlined } from "@ant-design/icons"

export const Loading = ({ children, isLoading, deDay = 200 }) => {
  return (
    <Spin delay={deDay} spinning={isLoading} indicator={<LoadingOutlined spin />} size="small">
      {children}
    </Spin>
  )
}
