import React from "react"
import { Checkbox, Rate } from "antd"

import * as S from "./style"

const NavbarComponent = () => {
  const renderListContent = (type, options) => {
    switch (type) {
      case "text":
        return options.map((option) => {
          return <S.styleTextValue>{option}</S.styleTextValue>
        })
      case "checkbox":
        return (
          <Checkbox.Group
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              margin: 0,
              gap: 12,
            }}
          >
            {options.map((option) => {
              return <Checkbox value={option.value}>{option.label}</Checkbox>
            })}
          </Checkbox.Group>
        )
      case "star":
        return options.map((option) => {
          return (
            <div style={{ display: "inline-block", fontSize: 12 }}>
              <Rate disabled defaultValue={option} />
              <span>{`Từ ${option} sao`}</span>
            </div>
          )
        })
      case "price":
        return options.map((option) => {
          return (
            <div
              style={{
                borderRadius: 10,
                backgroundColor: "rbg(238,238,238)",
                color: "rbg(56,56,61)",
                width: "fit-content",
                padding: 5,
              }}
            >
              {option}
            </div>
          )
        })

      default:
        return
    }
  }

  return (
    <>
      <S.styleListProduct>
        <p>Danh Mục Sản Phẩm</p>
      </S.styleListProduct>
      <S.styleRenderContent>
        {renderListContent("text", ["dien thoai", "laptop", "am thanh"])}
      </S.styleRenderContent>
      {/* <S.styleRenderContent>
				{renderListContent("checkbox", [
					{ value: "a", label: "A" },
					{ value: "b", label: "B" },
					{ value: "c", label: "C" },
				])}
			</S.styleRenderContent> */}
      {/* <S.styleRenderContent>{renderListContent("star", [3, 4, 5])}</S.styleRenderContent> */}
      {/* <S.styleRenderContent>
				{renderListContent("price", ["Tren 50.000", "Tren 100.000", "Tren 1.000.000"])}
			</S.styleRenderContent> */}
    </>
  )
}

export default NavbarComponent
