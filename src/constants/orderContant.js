import { Image } from "antd";
import FAST from "../assets/image/FAST.png";
import Gojek from "../assets/image/gojek.png";

export const orderConstant = {
	value: {
		1: (
			<Image
				style={{ width: 30, height: 30, marginRight: 10, display: "inline-block" }}
				src={FAST}
				alt="FAST"
				preview={false}
			/>
		),
		2: (
			<Image
				style={{ width: 30, height: 40, marginRight: 10, display: "inline-block" }}
				src={Gojek}
				alt="Gojek"
				preview={false}
			/>
		),
	},
	payment: {
		later_money: "Thanh Toán khi nhận tiền mặt",
		paypal: "Thanh Toán Bằng PayPal",
	},
};
