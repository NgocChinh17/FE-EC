import React, { useEffect, useState } from "react";
import { Row, Col, Image, Button, Space, Rate } from "antd";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Loading } from "../LoadingComponent/Loading";

import * as ProductService from "../../services/ProductService";
import * as S from "./style";
import { addOrderProduct } from "../../redux/slicers/orderSlides";
import { conVerPrice, initFacebookSDK } from "../../utils";
import CommentComponent from "../CommentComponent/CommentComponent";

const ProductDetailsComponent = ({ idProduct }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);

  const [numProduct, setNumProduct] = useState(1);

  const onChange = (value) => {
    setNumProduct(Number(value));
  };

  const handleChangeCount = (type) => {
    if (type === "increase") {
      setNumProduct(numProduct + 1);
    } else {
      setNumProduct(numProduct - 1);
    }
  };

  const fetchGetProductDetails = async (context) => {
    const id = context?.queryKey && context?.queryKey[1];
    if (id) {
      const res = await ProductService.getDetailsProduct(id);
      return res.data;
    }
  };

  const { isLoading, data: productsDetails } = useQuery(
    ["product-detail", idProduct],
    fetchGetProductDetails,
    {
      enabled: !!idProduct,
    }
  );

  useEffect(() => {
    initFacebookSDK();
  }, []);

  const handlePayProduct = () => {
    if (!user?.id) {
      navigate("/SignIn", { state: { from: window.location.pathname } });
    } else {
      dispatch(
        addOrderProduct({
          orderItem: {
            name: productsDetails?.name,
            amount: numProduct,
            image: productsDetails?.image,
            type: productsDetails?.type,
            price: productsDetails?.price,
            typeList: productsDetails?.typeList,
            discount: productsDetails?.discount,
            countInStock: productsDetails?.countInStock,
            Product: productsDetails?._id,
          },
        })
      );
    }
  };

  return (
    <Loading isLoading={isLoading}>
      <S.ProductDetailWrapper>
        <Row>
          <Col span={10}>
            <Image
              width={"100%"}
              src={productsDetails?.image}
              alt="prd1"
              preview={false}
            />
          </Col>
          <Col span={14}>
            <S.WrapperStyleNameProduct>
              {productsDetails?.name}
              <span> {productsDetails?.type}</span>
            </S.WrapperStyleNameProduct>
            <S.WrapperStyleStar>
              <Rate
                style={{ fontSize: 15 }}
                allowHalf
                disabled="true"
                defaultValue={productsDetails?.rating}
                value={productsDetails?.rating}
              />
              <span style={{ color: "gray", fontSize: 15, marginLeft: 10 }}>
                | Đã Bán: {productsDetails?.sold || 0}+
              </span>
              <span style={{ color: "gray" }}>
                {" "}
                | Trong Kho còn lại {productsDetails?.countInStock} Sản Phẩm
              </span>
            </S.WrapperStyleStar>
            <S.WrapperPriceProduct>
              <S.WrapperPriceTextProduct>
                {conVerPrice(productsDetails?.price)} VNĐ
                {productsDetails?.discount && (
                  <span style={{ fontSize: 15, color: "red", marginLeft: 10 }}>
                    discount {productsDetails?.discount}%
                  </span>
                )}
              </S.WrapperPriceTextProduct>
              {/* <LikeButtonComponent
								dataHref={
									process.env.REACT_APP_IS_LOCAL
										? "https://developers.facebook.com/docs/plugins/"
										: window.location.href
								}
							/> */}
            </S.WrapperPriceProduct>
            <S.WrapperAddressProduct>
              <span>Giao Đến </span> -
              <span style={{ color: "rgb(11, 116, 229)" }} className="address">
                {user?.address}
              </span>
              -<span className="change-address"> Đổi Địa Chỉ</span>
            </S.WrapperAddressProduct>
            <div style={{ marginLeft: 30, marginTop: 10 }}>
              <div style={{ display: "inline-block" }}>
                Số Lượng :
                <div style={{ display: "inline-block", marginLeft: 20 }}>
                  <S.WrapperQualityProduct>
                    <Button
                      style={{ border: "none", background: "transparent", width: 20 }}
                      onClick={() => handleChangeCount("decrease")}
                      disabled={numProduct === 1}
                    >
                      <MinusOutlined style={{ color: "#000", fontSize: "10px" }} />
                    </Button>
                    <S.styleInputNumber
                      className="custom-input-number"
                      min={1}
                      defaultValue={1}
                      size="small"
                      onChange={onChange}
                      value={numProduct}
                    />
                    <Button
                      style={{ border: "none", background: "transparent", width: 20 }}
                      onClick={() => handleChangeCount("increase")}
                      disabled={numProduct === productsDetails?.countInStock}
                    >
                      <PlusOutlined style={{ color: "#000", fontSize: "10px" }} />
                    </Button>
                  </S.WrapperQualityProduct>
                </div>
              </div>
            </div>
            <div style={{ marginTop: 16, marginLeft: 30 }}>
              <Space>
                <Button type="primary" onClick={() => handlePayProduct()}>
                  Chọn Mua
                </Button>
                <Button type="default">Mua Trả Sau</Button>
              </Space>
            </div>
          </Col>
        </Row>
        <CommentComponent
          dataHref={
            process.env.REACT_APP_IS_LOCAL
              ? "https://developers.facebook.com/docs/plugins/comments#configurator"
              : window.location.href
          }
          width="1399"
        />
      </S.ProductDetailWrapper>
    </Loading>
  );
};

export default ProductDetailsComponent;
