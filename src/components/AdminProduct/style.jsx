import { Upload } from "antd"
import styled from "styled-components"

export const WrapperHeader = styled.div`
  color: black;
  font-size: 14px;
  font-weight: 600;
`

export const WrapperUploadFile = styled(Upload)`
  & .ant-upload.ant-upload-select.ant-upload-select-card {
    width: 60px;
    height: 60px;
    border-radius: 50%;
  }
  & .ant-upload-list {
    display: none;
  }
  & .ant-upload-list-item {
    display: none;
  }
`
