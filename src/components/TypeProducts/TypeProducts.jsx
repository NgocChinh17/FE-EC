import React from "react";
import { useNavigate } from "react-router-dom";

const TypeProducts = ({ name }) => {
	const navigate = useNavigate();

	const handleNavigateTypeList = (typeList) => {
		navigate(`/type/${typeList}`);
	};

	return (
		<div style={{ cursor: "pointer" }} onClick={() => handleNavigateTypeList(name)}>
			{name}
		</div>
	);
};

export default TypeProducts;
