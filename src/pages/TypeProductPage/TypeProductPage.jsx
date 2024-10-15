import React, { useEffect, useState, useCallback } from "react";
import { Row, Col, Pagination } from "antd";
import { useParams } from "react-router-dom";

import { Loading } from "../../components/LoadingComponent/Loading";
import { useSelector } from "react-redux";
import { useDebounce } from "../../hooks/useDebounce";

import CardComponent from "../../components/CardComponent/CardComponent";
import NavbarComponent from "../../components/NavbarComponent/NavbarComponent";

import * as ProductService from "../../services/ProductService";
import * as S from "./style";

const TypeProductPage = () => {
	const { typeList } = useParams();
	const searchProduct = useSelector((state) => state?.product?.search);
	const debounce = useDebounce(searchProduct, 1000);

	const [products, setProducts] = useState([]);
	const [prevProducts, setPrevProducts] = useState([]);
	const [loading, setLoading] = useState(false);
	const [paging, setPaging] = useState({
		page: 0,
		limit: 10,
		total: 1,
	});

	// Wrap fetchTypeList in useCallback to memoize the function
	const fetchTypeList = useCallback(async (typeList, page, limit) => {
		setLoading(true);
		const res = await ProductService.getAllTypeListProduct(typeList, page, limit);
		if (res?.status === "ok") {
			setLoading(false);
			if (res?.data?.length) {
				setProducts(res?.data);
				setPrevProducts(res?.data);
			}
			setPaging((prevPaging) => ({ ...prevPaging, total: res?.totalPage }));
		} else {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		if (typeList) {
			fetchTypeList(typeList, paging.page, paging.limit);
		}
	}, [typeList, paging.page, paging.limit, fetchTypeList]);

	const onChangePage = (current, pageSize) => {
		setPaging({ ...paging, page: current - 1, limit: pageSize });
	};

	return (
		<Loading isLoading={loading}>
			<S.typeWrapper>
				<Row style={{ flexWrap: "nowrap", paddingTop: 10 }}>
					<Col span={6}>
						<S.contentProduct>
							<NavbarComponent />
						</S.contentProduct>
					</Col>
					<Col span={23}>
						<S.productWrapper>
							{(products.length ? products : prevProducts)
								?.filter((pro) => {
									if (debounce === "") {
										return pro;
									} else if (pro?.name?.toLowerCase().includes(debounce.toLowerCase())) {
										return pro;
									}
									return null;
								})
								?.map((product) => (
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
								))}
						</S.productWrapper>
						<Pagination
							align="center"
							defaultCurrent={paging.page + 1}
							total={paging.total}
							style={{ marginTop: 16 }}
							onChange={onChangePage}
						/>
					</Col>
				</Row>
			</S.typeWrapper>
		</Loading>
	);
};

export default TypeProductPage;
