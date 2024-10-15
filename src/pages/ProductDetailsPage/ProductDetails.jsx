import React from "react";
import { useParams } from "react-router-dom";

import ProductDetailsComponent from "../../components/ProductDetailsComponent/ProductDetailsComponent";

const ProductDetails = () => {
	const { id } = useParams();
	return (
		<div style={{ paddingLeft: 130 }}>
			<ProductDetailsComponent idProduct={id} />
		</div>
	);
};

export default ProductDetails;
