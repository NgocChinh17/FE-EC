import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { ROUTES } from "../../constants/routes";

function AdminLayout() {
	const user = useSelector((state) => state.user);
	const navigate = useNavigate();

	useEffect(() => {
		if (!user.id) {
			navigate(ROUTES.ADMIN.HOME_ADMIN);
		} else if (!user.isAdmin) {
			navigate(ROUTES.PAGES.HOME);
		}
	}, [user, navigate]);
	return (
		<>
			<Outlet />
		</>
	);
}

export default AdminLayout;
