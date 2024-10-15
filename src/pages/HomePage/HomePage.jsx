import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";

import SliderComponent from "../../components/SliderComponent/SliderComponent";
import TypeProducts from "../../components/TypeProducts/TypeProducts";
import CardComponent from "../../components/CardComponent/CardComponent";

import slide1 from "../../assets/image/slide1.jpg";
import slide2 from "../../assets/image/slide2.jpg";
import slide3 from "../../assets/image/slide3.jpg";

import * as ProductService from "../../services/ProductService";
import * as S from "./style";
import { useSelector } from "react-redux";
import { Loading } from "../../components/LoadingComponent/Loading";
import { useDebounce } from "../../hooks/useDebounce";

const HomePage = () => {
  const searchProduct = useSelector((state) => state?.product?.search);
  const debounce = useDebounce(searchProduct, 1000);

  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [limit, setLimit] = useState(7);
  const [listTypeProduct, setListTypeProduct] = useState([]);
  const [prevProducts, setPrevProducts] = useState([]);

  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct();
    if (res?.status === "ok") {
      setListTypeProduct(res?.data);
    }
  };

  useEffect(() => {
    fetchAllTypeProduct();
  }, []);

  const fetchProductAll = async (context) => {
    const limit = context?.queryKey && context?.queryKey[1];
    const search = context?.queryKey && context?.queryKey[2];
    const res = await ProductService.getAllProduct(search, limit);
    return res;
  };

  const { isLoading, data: products } = useQuery(
    ["products", limit, debounce],
    fetchProductAll,
    {
      retry: 1,
      retryDelay: 1000,
      keepPreviousData: true,
      onSuccess: (data) => {
        if (data?.data?.length) {
          setPrevProducts(data?.data);
        }
      },
    }
  );

  return (
    <Loading isLoading={isLoading || loading}>
      <div style={{ marginLeft: 160 }}>
        <S.typeProduct>
          {listTypeProduct.map((item) => {
            return <TypeProducts name={item} key={item} />;
          })}
        </S.typeProduct>
        <S.imgHome>
          <SliderComponent arrImage={[slide1, slide2, slide3]} />
        </S.imgHome>
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              border: "1px solid #8e8686",
              height: 60,
              width: 270,
              borderTopLeftRadius: 50,
              borderBottomRightRadius: 30,
              marginLeft: "40%",
              marginBottom: 16,
              marginTop: 30,
            }}
          >
            <button
              style={{
                fontWeight: 600,
                marginBottom: 16,
                border: "1px solid #333",
                backgroundColor: "white",
                height: 70,
                width: 250,
                fontSize: 20,
                borderTopLeftRadius: 50,
                borderBottomRightRadius: 50,
              }}
            >
              Điện Thoại Iphone
            </button>
          </div>
        </div>
        <S.CardHome>
          {(products?.data?.length ? products?.data : prevProducts)
            ?.filter((product) => product.typeList === "IPHONE")
            ?.map((product) => {
              return (
                <CardComponent
                  key={product._id}
                  countInStock={product.countInStock}
                  description={product.description}
                  image={product.image}
                  name={product.name}
                  price={product.price}
                  rating={product.rating}
                  type={product.type}
                  discount={product.discount}
                  sold={product.sold}
                  id={product._id}
                />
              );
            })}
        </S.CardHome>

        <div style={{ textAlign: "center" }}>
          <div
            style={{
              border: "1px solid #8e8686",
              height: 60,
              width: 270,
              borderTopLeftRadius: 50,
              borderBottomRightRadius: 30,
              marginLeft: "40%",
              marginBottom: 16,
              marginTop: 30,
            }}
          >
            <button
              style={{
                fontWeight: 600,
                marginBottom: 16,
                border: "1px solid #333",
                backgroundColor: "white",
                height: 70,
                width: 250,
                fontSize: 20,
                borderTopLeftRadius: 50,
                borderBottomRightRadius: 50,
              }}
            >
              Điện Thoại SAMSUNG
            </button>
          </div>
        </div>

        <S.CardHome>
          {(products?.data?.length ? products?.data : prevProducts)
            ?.filter((product) => product.typeList === "SAMSUNG")
            ?.map((product) => {
              return (
                <CardComponent
                  key={product._id}
                  countInStock={product.countInStock}
                  description={product.description}
                  image={product.image}
                  name={product.name}
                  price={product.price}
                  rating={product.rating}
                  type={product.type}
                  discount={product.discount}
                  sold={product.sold}
                  id={product._id}
                />
              );
            })}
        </S.CardHome>
        {/* <div style={{ textAlign: "center" }}>
					{products?.data?.filter((product) => product.typeList === "SAMSUNG")?.length <
						products?.total && (
						<Button
							type="primary"
							style={{ marginTop: 16 }}
							onClick={() => setLimit((prev) => prev + 5)}
						>
							Xem Thêm
						</Button>
					)}
				</div> */}
      </div>
    </Loading>
  );
};

export default HomePage;
