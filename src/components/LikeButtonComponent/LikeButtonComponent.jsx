const LikeButtonComponent = (props) => {
	const { dataHref } = props;

	return (
		<div
			class="fb-like"
			data-href={dataHref}
			data-width=""
			data-layout="standard"
			data-action="like"
			data-size="small"
			data-share="true"
			style={{ marginLeft: "10px" }}
		></div>
	);
};

export default LikeButtonComponent;
