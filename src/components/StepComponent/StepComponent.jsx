import { Steps } from "antd";
import React from "react";

const StepComponent = ({ current = 0, items = [] }) => {
	return (
		<div>
			<Steps current={current} items={items} />
		</div>
	);
};

export default StepComponent;
