import { Input } from "antd"
import styled from "styled-components"

export const WrapperContainerLeft = styled.div`
  flex: 1;
  padding: 40px 45px 24px;
  display: flex;
  flex-direction: column;
`

export const WrapperContainerRight = styled.div`
  width: 300px;
  background-color: linear-gradient(136deg, rbg(240, 248, 255) -1%, rbg(219, 238, 255) 85%);
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`

export const WrapperTextLight = styled.div`
  color: rgb(13, 92, 128);
  display: inline-block;
  font-size: 13px;
  cursor: pointer;
`

export const WrapperInput = styled.div`
  margin-bottom: 13px;
  margin-top: 10px;
  border-top: none;
  border-left: none;
  border-right: none;
  background-color: rgb(232, 240, 254);
  outline: none;
`
